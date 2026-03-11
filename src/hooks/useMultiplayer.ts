import { useState, useEffect, useCallback, useRef } from 'react';
import { ref, set, get, onValue, off, push, remove } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export interface GameRoom {
  id: string;
  hostId: string;
  hostUsername: string;
  guestId?: string;
  guestUsername?: string;
  roomName?: string;
  board: (string | '')[];
  currentPlayer: 'X' | 'O';
  gameStatus: 'waiting' | 'playing' | 'won' | 'draw';
  winner?: string | null;
  lastMove?: number;
  createdAt: number;
  resetRequestedBy?: string;
  resetConfirmedBy?: string[];
}

export interface Player {
  id: string;
  username: string;
  symbol: 'X' | 'O';
  isCurrentTurn: boolean;
}

export const useMultiplayer = () => {
  const { user, userProfile } = useAuth();
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usar refs para evitar loops infinitos
  const currentRoomRef = useRef<GameRoom | null>(null);
  const playersRef = useRef<Player[]>([]);

  // Função utilitária para limpar objetos (remover undefined)
  const cleanObjectForFirebase = useCallback((obj: any) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined)
    );
  }, []);

  // Atualizar refs quando o estado muda
  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  // Criar uma nova sala
  const createRoom = useCallback(async (roomName?: string): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado');

    setIsLoading(true);
    setError(null);

    try {
      const roomRef = push(ref(database, 'tttRooms'));
      const roomId = roomRef.key!;
      const hostUsername = userProfile?.username || user.email?.split('@')[0] || 'Jogador 1';

      const newRoom: GameRoom = {
        id: roomId,
        hostId: user.uid,
        hostUsername: hostUsername,
        roomName: roomName || undefined,
        board: Array(9).fill(''),
        currentPlayer: 'X',
        gameStatus: 'waiting',
        createdAt: Date.now()
      };

      await set(ref(database, `tttRooms/${roomId}`), newRoom);
      
      // Configurar jogador local
      const localPlayer: Player = {
        id: user.uid,
        username: hostUsername,
        symbol: 'X',
        isCurrentTurn: true
      };

      setPlayers([localPlayer]);
      setCurrentRoom(newRoom);

      return roomId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar sala';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, userProfile]);

  // Entrar em uma sala existente
  const joinRoom = useCallback(async (roomId: string): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');

    setIsLoading(true);
    setError(null);

    try {
      const roomRef = ref(database, `tttRooms/${roomId}`);
      const roomSnapshot = await get(roomRef);

      if (!roomSnapshot.exists()) {
        throw new Error('Sala não encontrada');
      }

      const room: GameRoom = roomSnapshot.val();

      if (room.guestId) {
        throw new Error('Sala cheia');
      }

      if (room.hostId === user.uid) {
        throw new Error('Você não pode entrar na sua própria sala');
      }

      const guestUsername = userProfile?.username || user.email?.split('@')[0] || 'Jogador 2';

      // Atualizar sala com o convidado
      await set(ref(database, `tttRooms/${roomId}`), {
        ...room,
        guestId: user.uid,
        guestUsername: guestUsername,
        gameStatus: 'playing'
      });

      // Configurar jogadores
      const hostPlayer: Player = {
        id: room.hostId,
        username: room.hostUsername,
        symbol: 'X',
        isCurrentTurn: true
      };

      const guestPlayer: Player = {
        id: user.uid,
        username: guestUsername,
        symbol: 'O',
        isCurrentTurn: false
      };

      setPlayers([hostPlayer, guestPlayer]);
      setCurrentRoom({ ...room, guestId: user.uid, guestUsername, gameStatus: 'playing' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao entrar na sala';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, userProfile]);

  // Fazer uma jogada
  const makeMove = useCallback(async (index: number): Promise<void> => {
    const room = currentRoomRef.current;
    if (!room || !user) return;

    const player = playersRef.current.find(p => p.id === user.uid);
    if (!player) return;

    // Verificar se é o turno do jogador
    const isPlayerTurn = room.currentPlayer === player.symbol;
    if (!isPlayerTurn) return;

    if (room.board[index] !== '') return;

    try {
      const newBoard = [...room.board];
      newBoard[index] = player.symbol;

      // Verificar vitória
      const winner = checkWinner(newBoard);
      const isDraw = !winner && newBoard.every(cell => cell !== '');

      const updatedRoom: GameRoom = {
        ...room,
        board: newBoard,
        currentPlayer: room.currentPlayer === 'X' ? 'O' : 'X',
        lastMove: index,
        gameStatus: winner ? 'won' : isDraw ? 'draw' : 'playing',
        winner: winner || null
      };

      await set(ref(database, `tttRooms/${room.id}`), updatedRoom);
      setCurrentRoom(updatedRoom);

      // Atualizar turno dos jogadores
      setPlayers(prev => prev.map(p => ({
        ...p,
        isCurrentTurn: p.symbol === updatedRoom.currentPlayer
      })));
    } catch (err) {
      setError('Erro ao fazer jogada');
    }
  }, [user]);

  // Verificar vitória
  const checkWinner = (board: (string | '')[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas horizontais
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Linhas verticais
      [0, 4, 8], [2, 4, 6] // Diagonais
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  // Reiniciar jogo
  const resetGame = useCallback(async (): Promise<void> => {
    const room = currentRoomRef.current;
    if (!room || !user) {
      console.error('Reset falhou: room ou user não encontrado', { room: !!room, user: !!user });
      return;
    }

    try {
      console.log('Iniciando reset do jogo...', { roomId: room.id, userId: user.uid });
      
      // Determinar quem deve começar o próximo jogo
      let nextPlayer: 'X' | 'O' = 'X';
      
      if (room.gameStatus === 'won' && room.winner) {
        // Se houve vitória, o perdedor começa
        nextPlayer = room.winner === 'X' ? 'O' : 'X';
      } else if (room.gameStatus === 'draw' || room.gameStatus === 'playing') {
        // Se foi empate ou jogo em andamento, o último jogador começa
        nextPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
      }
      
      const updatedRoom: GameRoom = {
        ...room,
        board: Array(9).fill(''),
        currentPlayer: nextPlayer,
        gameStatus: 'playing',
        winner: null,
        lastMove: undefined,
        resetRequestedBy: user.uid,
        resetConfirmedBy: [user.uid]
      };

      // Remover propriedades undefined para compatibilidade com Firebase
      const cleanRoom = cleanObjectForFirebase(updatedRoom);

      // Verificar se o usuário tem permissão para modificar esta sala
      if (room.hostId !== user.uid && room.guestId !== user.uid) {
        throw new Error('Usuário não tem permissão para modificar esta sala');
      }
              
      // Atualizar Firebase primeiro
      const roomRef = ref(database, `tttRooms/${room.id}`);
      await set(roomRef, cleanRoom);
      
      console.log('Firebase atualizado com sucesso');
      
      // Atualizar estado local
      setCurrentRoom(updatedRoom);

      // Resetar turno dos jogadores baseado no próximo jogador
      setPlayers(prev => prev.map(p => ({
        ...p,
        isCurrentTurn: p.symbol === nextPlayer
      })));
      
      console.log('Reset do jogo concluído - próximo jogador:', nextPlayer);
    } catch (err) {
      console.error('Erro ao reiniciar jogo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao reiniciar jogo: ${errorMessage}`);
    }
  }, [user, cleanObjectForFirebase]);

  // Confirmar reset do jogo
  const confirmReset = useCallback(async (): Promise<void> => {
    const room = currentRoomRef.current;
    if (!room || !user) return;

    try {
      const currentConfirmed = room.resetConfirmedBy || [];
      const newConfirmed = [...currentConfirmed, user.uid];
      
      const updatedRoom: GameRoom = {
        ...room,
        resetConfirmedBy: newConfirmed
      };

      updatedRoom.resetRequestedBy = ""

      // Remover propriedades undefined
      const cleanRoom = cleanObjectForFirebase(updatedRoom);

      await set(ref(database, `tttRooms/${room.id}`), cleanRoom);
      setCurrentRoom(updatedRoom);
    } catch (err) {
      setError('Erro ao confirmar reset');
    }
  }, [user, cleanObjectForFirebase]);

  // Rejeitar reset do jogo
  const rejectReset = useCallback(async (): Promise<void> => {
    const room = currentRoomRef.current;
    if (!room || !user) return;

    try {
      const updatedRoom: GameRoom = {
        ...room,
        resetRequestedBy: undefined,
        resetConfirmedBy: []
      };

      // Remover propriedades undefined
      const cleanRoom = cleanObjectForFirebase(updatedRoom);

      await set(ref(database, `tttRooms/${room.id}`), cleanRoom);
      setCurrentRoom(updatedRoom);
    } catch (err) {
      setError('Erro ao rejeitar reset');
    }
  }, [user, cleanObjectForFirebase]);

  // Sair da sala
  const leaveRoom = useCallback(async (): Promise<void> => {
    const room = currentRoomRef.current;
    if (!room || !user) return;

    try {
      if (room.hostId === user.uid) {
        // Host saindo - deletar sala
        await remove(ref(database, `tttRooms/${room.id}`));
      } else if (room.guestId === user.uid) {
        // Convidado saindo - remover guestId
        await set(ref(database, `tttRooms/${room.id}/guestId`), null);
        await set(ref(database, `tttRooms/${room.id}/guestUsername`), null);
        await set(ref(database, `tttRooms/${room.id}/gameStatus`), 'waiting');
      }

      setCurrentRoom(null);
      setPlayers([]);
    } catch (err) {
      setError('Erro ao sair da sala');
    }
  }, [user]);

  // Listar salas disponíveis
  const listRooms = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const roomsRef = ref(database, 'tttRooms');
      const snapshot = await get(roomsRef);

      if (snapshot.exists()) {
        const roomsData: GameRoom[] = [];
        snapshot.forEach((childSnapshot) => {
          const room = childSnapshot.val();
          // Incluir salas disponíveis (waiting) e salas do usuário (host ou guest)
          if ((room.gameStatus === 'waiting' && room.hostId !== user?.uid) || 
              room.hostId === user?.uid || 
              room.guestId === user?.uid) {
            roomsData.push(room);
          }
        });
        setRooms(roomsData);
      } else {
        setRooms([]);
      }
    } catch (err) {
      setError('Erro ao listar salas');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Reconectar a uma sala existente
  const reconnectToRoom = useCallback(async (roomId: string): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');

    setIsLoading(true);
    setError(null);

    try {
      const roomRef = ref(database, `tttRooms/${roomId}`);
      const roomSnapshot = await get(roomRef);

      if (!roomSnapshot.exists()) {
        throw new Error('Sala não encontrada');
      }

      const room: GameRoom = roomSnapshot.val();

      // Verificar se o usuário é host ou guest desta sala
      if (room.hostId !== user.uid && room.guestId !== user.uid) {
        throw new Error('Você não faz parte desta sala');
      }

      // Configurar jogadores baseado no papel do usuário
      if (room.hostId === user.uid) {
        // Usuário é o host
        const hostPlayer: Player = {
          id: room.hostId,
          username: room.hostUsername,
          symbol: 'X',
          isCurrentTurn: room.currentPlayer === 'X'
        };

        if (room.guestId) {
          // Sala tem guest
          const guestPlayer: Player = {
            id: room.guestId,
            username: room.guestUsername || 'Jogador 2',
            symbol: 'O',
            isCurrentTurn: room.currentPlayer === 'O'
          };
          setPlayers([hostPlayer, guestPlayer]);
        } else {
          // Sala sem guest ainda
          setPlayers([hostPlayer]);
        }
      } else {
        // Usuário é o guest
        const hostPlayer: Player = {
          id: room.hostId,
          username: room.hostUsername,
          symbol: 'X',
          isCurrentTurn: room.currentPlayer === 'X'
        };

        const guestPlayer: Player = {
          id: room.guestId!,
          username: room.guestUsername || 'Jogador 2',
          symbol: 'O',
          isCurrentTurn: room.currentPlayer === 'O'
        };

        setPlayers([hostPlayer, guestPlayer]);
      }

      setCurrentRoom(room);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reconectar à sala';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Escutar mudanças na sala atual
  useEffect(() => {
    if (!currentRoom) return;

    const roomRef = ref(database, `tttRooms/${currentRoom.id}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const updatedRoom: GameRoom = snapshot.val();
        console.log('Listener recebeu atualização:', updatedRoom);
        
        setCurrentRoom(updatedRoom);

        // Processar reset automático se ambos confirmaram
        if (updatedRoom.resetRequestedBy && updatedRoom.resetConfirmedBy) {
          const confirmedCount = updatedRoom.resetConfirmedBy.length;
          const totalPlayers = updatedRoom.guestId ? 2 : 1;
          
          console.log(`Reset confirmado: ${confirmedCount}/${totalPlayers} jogadores`);
          
          if (confirmedCount === totalPlayers) {
            // Ambos confirmaram, executar reset
            
            // Determinar quem deve começar o próximo jogo
            let nextPlayer: 'X' | 'O' = 'X';
            
            if (updatedRoom.gameStatus === 'won' && updatedRoom.winner) {
              // Se houve vitória, o perdedor começa
              nextPlayer = updatedRoom.winner === 'X' ? 'O' : 'X';
            } else if (updatedRoom.gameStatus === 'draw' || updatedRoom.gameStatus === 'playing') {
              // Se foi empate ou jogo em andamento, o último jogador começa
              nextPlayer = updatedRoom.currentPlayer === 'X' ? 'O' : 'X';
            }
            
            const resetRoom: GameRoom = {
              ...updatedRoom,
              board: Array(9).fill(''),
              currentPlayer: nextPlayer,
              gameStatus: 'playing',
              winner: null,
              lastMove: undefined,
              resetRequestedBy: undefined,
              resetConfirmedBy: []
            };
            
            // Remover propriedades undefined
            const cleanResetRoom = cleanObjectForFirebase(resetRoom);
            
            console.log('Executando reset automático... - próximo jogador:', nextPlayer);
            set(ref(database, `tttRooms/${updatedRoom.id}`), cleanResetRoom);
            setCurrentRoom(resetRoom);
            
            // Resetar turno dos jogadores baseado no próximo jogador
            setPlayers(prev => prev.map(p => ({
              ...p,
              isCurrentTurn: p.symbol === nextPlayer
            })));
          }
        }

        // Atualizar jogadores se necessário
        if (updatedRoom.guestId && playersRef.current.length === 1) {
          const hostPlayer = playersRef.current[0];
          const guestPlayer: Player = {
            id: updatedRoom.guestId,
            username: updatedRoom.guestUsername || 'Jogador 2',
            symbol: 'O',
            isCurrentTurn: false
          };
          setPlayers([hostPlayer, guestPlayer]);
        } else if (playersRef.current.length === 2) {
          // Atualizar turno dos jogadores baseado no currentPlayer da sala
          setPlayers(prev => prev.map(p => ({
            ...p,
            isCurrentTurn: p.symbol === updatedRoom.currentPlayer
          })));
        }
      }
    });

    return () => off(roomRef, 'value', unsubscribe);
  }, [currentRoom?.id, cleanObjectForFirebase]); // Apenas dependência do ID da sala

  // Limpar salas antigas (mais de 24 horas)
  const cleanupOldRooms = useCallback(async (): Promise<void> => {
    try {
      const roomsRef = ref(database, 'tttRooms');
      const snapshot = await get(roomsRef);

      if (snapshot.exists()) {
        const now = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

        const deletePromises: Promise<void>[] = [];

        snapshot.forEach((childSnapshot) => {
          const room = childSnapshot.val();
          const roomAge = now - room.createdAt;

          if (roomAge > oneDayInMs) {
            deletePromises.push(remove(ref(database, `tttRooms/${room.id}`)));
          }
        });

        if (deletePromises.length > 0) {
          await Promise.all(deletePromises);
          console.log(`Limpeza automática: ${deletePromises.length} salas antigas removidas`);
        }
      }
    } catch (err) {
      console.error('Erro na limpeza automática:', err);
    }
  }, []);

  // Executar limpeza automática quando o hook é inicializado
  useEffect(() => {
    cleanupOldRooms();
    
    // Executar limpeza a cada hora
    const interval = setInterval(cleanupOldRooms, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [cleanupOldRooms]);

  // Testar conectividade com Firebase
  const testFirebaseConnection = useCallback(async (): Promise<void> => {
    try {
      console.log('Testando conectividade com Firebase...');
      const testRef = ref(database, 'test');
      await set(testRef, { timestamp: Date.now() });
      console.log('Conectividade com Firebase OK');
      await remove(testRef);
    } catch (err) {
      console.error('Erro na conectividade com Firebase:', err);
    }
  }, []);

  // Executar teste de conectividade quando o hook é inicializado
  useEffect(() => {
    testFirebaseConnection();
  }, [testFirebaseConnection]);

  return {
    rooms,
    currentRoom,
    players,
    isLoading,
    error,
    createRoom,
    joinRoom,
    makeMove,
    resetGame,
    confirmReset,
    rejectReset,
    leaveRoom,
    listRooms,
    reconnectToRoom,
    clearError: () => setError(null)
  };
};
