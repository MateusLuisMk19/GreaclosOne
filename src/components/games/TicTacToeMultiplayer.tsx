import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Circle,
  RotateCcw,
  Users,
  Copy,
  Check,
  Gamepad2,
  Plus,
  Search,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useMultiplayer } from "../../hooks/useMultiplayer";

interface TicTacToeMultiplayerProps {
  onGameEnd?: (winner: string | null) => void;
}

const TicTacToeMultiplayer: React.FC<TicTacToeMultiplayerProps> = ({
  onGameEnd,
}) => {
  const { user, userProfile } = useAuth();
  const { isDark } = useTheme();
  const {
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
    clearError,
  } = useMultiplayer();

  const [showRoomList, setShowRoomList] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [roomName, setRoomName] = useState("");

  // Usar useCallback para evitar recriações desnecessárias
  const handleCurrentRoomChange = useCallback(() => {
    if (currentRoom) {
      setShowRoomList(false);
    }
  }, [currentRoom]);

  const handleErrorChange = useCallback(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    handleCurrentRoomChange();
  }, [handleCurrentRoomChange]);

  useEffect(() => {
    handleErrorChange();
  }, [handleErrorChange]);

  // Copiar código da sala
  const copyRoomCode = async () => {
    if (!currentRoom) return;

    try {
      await navigator.clipboard.writeText(currentRoom.id);
      // Feedback visual pode ser adicionado aqui
    } catch (error) {
      console.error("Erro ao copiar código da sala:", error);
    }
  };

  // Criar sala com nome
  const handleCreateRoom = async () => {
    try {
      await createRoom(roomName || undefined);
      setRoomName(""); // Limpar campo após criar
    } catch (error) {
      console.error("Erro ao criar sala:", error);
    }
  };

  // Função para reset do jogo
  const handleResetGame = async () => {
    console.log("Botão Novo Jogo clicado");
    try {
      await resetGame();
      console.log("Função resetGame executada com sucesso");
    } catch (error) {
      console.error("Erro ao executar resetGame:", error);
    }
  };

  // Verificar vitória
  const checkWinner = (board: (string | "")[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Linhas horizontais
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Linhas verticais
      [0, 4, 8],
      [2, 4, 6], // Diagonais
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  // Renderizar célula do tabuleiro
  const renderCell = (index: number) => {
    if (!currentRoom) return null;

    const value = currentRoom.board[index];
    const isWinningCell =
      currentRoom.winner && checkWinner(currentRoom.board) === value;
    const isLastMove = currentRoom.lastMove === index;
    const currentPlayer = players.find((p) => p.id === user?.uid);
    const canPlay =
      currentRoom.gameStatus === "playing" &&
      currentPlayer &&
      currentPlayer.symbol === currentRoom.currentPlayer;

    return (
      <button
        key={index}
        onClick={() => makeMove(index)}
        disabled={value !== "" || !canPlay}
        className={`w-16 h-16 lg:w-20 lg:h-20 border-2 rounded-lg text-2xl lg:text-3xl font-bold transition-all duration-200 ${
          isDark
            ? "border-gray-600 hover:border-gray-500"
            : "border-gray-300 hover:border-gray-400"
        } ${
          value === "X"
            ? "text-blue-600 bg-blue-50 border-blue-300"
            : value === "O"
            ? "text-red-600 bg-red-50 border-red-300"
            : ""
        } ${
          !value && canPlay
            ? isDark
              ? "hover:bg-gray-700 cursor-pointer"
              : "hover:bg-gray-50 cursor-pointer"
            : "cursor-default"
        } ${
          isWinningCell
            ? "bg-yellow-100 border-yellow-400 shadow-lg scale-105"
            : ""
        } ${isLastMove ? "ring-4 ring-green-400" : ""}`}
      >
        {value === "X" && <X className="w-8 h-8 lg:w-10 lg:h-10 mx-auto" />}
        {value === "O" && (
          <Circle className="w-8 h-8 lg:w-10 lg:h-10 mx-auto" />
        )}
      </button>
    );
  };

  // Separar salas disponíveis das salas do usuário
  const availableRooms = rooms.filter(
    (room) => room.gameStatus === "waiting" && room.hostId !== user?.uid
  );

  const userRooms = rooms.filter(
    (room) => room.hostId === user?.uid || room.guestId === user?.uid
  );

  // Tela de lobby
  if (!currentRoom) {
    return (
      <div
        className={`max-w-4xl mx-auto rounded-xl shadow-lg p-4 lg:p-6 transition-colors duration-200 ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="text-center mb-6">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">
            TicTacToe Multiplayer
          </h2>
          <p
            className={`text-sm lg:text-base ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Jogue contra outros jogadores online
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Criar Sala */}
          <div
            className={`p-6 rounded-lg border-2 border-dashed ${
              isDark
                ? "border-gray-600 bg-gray-700/50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div className="text-center">
              <Plus className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Criar Nova Sala</h3>
              <p
                className={`text-sm mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Crie uma sala e convide amigos para jogar
              </p>
              <div className="mb-4">
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Nome da sala (opcional)"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  maxLength={30}
                />
              </div>
              <button
                onClick={handleCreateRoom}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Criar Sala</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Entrar em Sala */}
          <div
            className={`p-6 rounded-lg border-2 border-dashed ${
              isDark
                ? "border-gray-600 bg-gray-700/50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div className="text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Entrar em Sala</h3>
              <p
                className={`text-sm mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Digite o código da sala para entrar
              </p>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="Código da sala"
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <button
                  onClick={() => joinRoom(joinRoomId)}
                  disabled={!joinRoomId || isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Entrar
                </button>
              </div>
              <button
                onClick={() => {
                  setShowRoomList(!showRoomList);
                  if (!showRoomList) listRooms();
                }}
                className="text-blue-600 hover:text-blue-500 text-sm underline"
              >
                Ver salas disponíveis
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Salas */}
        {showRoomList && (
          <div className="mt-6">
            {/* Salas do Usuário */}
            {userRooms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>Suas Salas</span>
                </h3>
                <div className="grid gap-3">
                  {userRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`p-4 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {room.roomName
                              ? `${room.roomName} (${room.id})`
                              : `Sala: ${room.id}`}
                          </p>
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {room.hostId === user?.uid
                              ? "Você é o host"
                              : "Você é o convidado"}
                            {room.gameStatus === "waiting" &&
                              " - Aguardando jogador"}
                            {room.gameStatus === "playing" &&
                              " - Jogo em andamento"}
                            {room.gameStatus === "won" && " - Jogo finalizado"}
                            {room.gameStatus === "draw" && " - Empate"}
                          </p>
                        </div>
                        <button
                          onClick={() => reconnectToRoom(room.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Reconectar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Salas Disponíveis */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">
                Salas Disponíveis
              </h3>
              {availableRooms.length === 0 ? (
                <p
                  className={`text-center ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Nenhuma sala disponível no momento
                </p>
              ) : (
                <div className="grid gap-3">
                  {availableRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`p-4 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {room.roomName
                              ? `${room.roomName} (${room.id})`
                              : `Sala: ${room.id}`}
                          </p>
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Host: {room.hostUsername} • Criada há{" "}
                            {Math.floor((Date.now() - room.createdAt) / 60000)}{" "}
                            min
                          </p>
                        </div>
                        <button
                          onClick={() => joinRoom(room.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Entrar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Tela do jogo
  return (
    <div
      className={`max-w-4xl mx-auto rounded-xl shadow-lg p-4 lg:p-6 transition-colors duration-200 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="text-center mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-2">
          TicTacToe Multiplayer
        </h2>
        <p
          className={`text-sm lg:text-base ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Jogue contra outros jogadores online
        </p>
      </div>

      {/* Informações da Sala */}
      {currentRoom.gameStatus === "waiting" && (
        <div
          className={`mb-4 lg:mb-6 p-4 rounded-lg ${
            isDark ? "bg-gray-700" : "bg-blue-50"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Código da Sala:</span>
              <span className="font-mono text-lg font-bold text-blue-600">
                {currentRoom.id}
              </span>
              {currentRoom.roomName && (
                <span className="text-sm text-gray-500">
                  • {currentRoom.roomName}
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={copyRoomCode}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </button>

              <button
                onClick={leaveRoom}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-blue-700"
              }`}
            >
              Compartilhe este código com seu amigo para começar a jogar
            </p>
          </div>
        </div>
      )}

      {/* Status do Jogo */}
      <div className="mb-4 lg:mb-6 text-center">
        {currentRoom.gameStatus === "waiting" && (
          <div
            className={`flex items-center justify-center space-x-2 ${
              isDark ? "text-yellow-400" : "text-yellow-600"
            }`}
          >
            <Users className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-base lg:text-lg font-semibold">
              Aguardando jogador...
            </span>
          </div>
        )}

        {currentRoom.gameStatus === "playing" && (
          <div className="flex items-center justify-center space-x-2">
            {currentRoom.currentPlayer === "X" ? (
              <>
                <X className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                <span className="text-sm lg:text-lg font-semibold">
                  Vez de {currentRoom.hostUsername}
                </span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                <span className="text-sm lg:text-lg font-semibold">
                  Vez de {currentRoom.guestUsername}
                </span>
              </>
            )}
          </div>
        )}

        {currentRoom.gameStatus === "won" && (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Gamepad2 className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-base lg:text-lg font-semibold">
              {currentRoom.winner === "X"
                ? `${currentRoom.hostUsername} venceu!`
                : `${currentRoom.guestUsername} venceu!`}
            </span>
          </div>
        )}

        {currentRoom.gameStatus === "draw" && (
          <div className="text-base lg:text-lg font-semibold text-gray-600">
            Empate!
          </div>
        )}
      </div>

      {/* Confirmação de Novo Jogo */}
      {currentRoom.resetRequestedBy &&
        currentRoom.resetRequestedBy !== user?.uid && (
          <div
            className={`mb-4 lg:mb-6 p-4 rounded-lg ${
              isDark
                ? "bg-yellow-900/50 border border-yellow-600"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <div className="text-center">
              <p
                className={`text-sm lg:text-base font-medium mb-3 ${
                  isDark ? "text-yellow-200" : "text-yellow-800"
                }`}
              >
                {currentRoom.hostId === currentRoom.resetRequestedBy
                  ? currentRoom.hostUsername
                  : currentRoom.guestUsername}{" "}
                quer jogar novamente!
              </p>

              {/* Informação sobre quem vai começar */}
              {currentRoom.gameStatus === "won" && currentRoom.winner && (
                <p
                  className={`text-xs mb-3 ${
                    isDark ? "text-yellow-300" : "text-yellow-700"
                  }`}
                >
                  💡 O perdedor (
                  {currentRoom.winner === "X"
                    ? currentRoom.guestUsername
                    : currentRoom.hostUsername}
                  ) começará o próximo jogo
                </p>
              )}

              {currentRoom.gameStatus === "draw" && (
                <p
                  className={`text-xs mb-3 ${
                    isDark ? "text-yellow-300" : "text-yellow-700"
                  }`}
                >
                  💡 O último jogador (
                  {currentRoom.currentPlayer === "X"
                    ? currentRoom.hostUsername
                    : currentRoom.guestUsername}
                  ) começará o próximo jogo
                </p>
              )}

              <div className="flex justify-center space-x-3">
                <button
                  onClick={confirmReset}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  Aceitar
                </button>
                <button
                  onClick={rejectReset}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  Recusar
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Status de Confirmação */}
      {currentRoom.resetRequestedBy &&
        currentRoom.resetRequestedBy === user?.uid && (
          <div
            className={`mb-4 lg:mb-6 p-3 rounded-lg ${
              isDark
                ? "bg-blue-900/50 border border-blue-600"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="text-center">
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-blue-200" : "text-blue-800"
                }`}
              >
                Aguardando confirmação do outro jogador...
              </p>
              {currentRoom.resetConfirmedBy &&
                currentRoom.resetConfirmedBy.length > 0 && (
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    {currentRoom.resetConfirmedBy.length} de{" "}
                    {currentRoom.guestId ? 2 : 1} confirmaram
                  </p>
                )}
            </div>
          </div>
        )}

      {/* Tabuleiro */}
      <div className="mb-4 lg:mb-6 flex justify-center">
        <div className="grid grid-cols-3 gap-1 lg:gap-2">
          {currentRoom.board.map((_, index) => renderCell(index))}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mb-4 lg:mb-6 text-center text-xs lg:text-sm text-gray-600">
        Jogadores: {players.length}/2
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Botão Reiniciar */}
        {currentRoom.gameStatus !== "waiting" &&
          !currentRoom.resetRequestedBy && (
            <button
              onClick={handleResetGame}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Novo Jogo</span>
            </button>
          )}

        {/* Botão Sair */}
        <button
          onClick={leaveRoom}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sair da Sala</span>
        </button>
      </div>
    </div>
  );
};

export default TicTacToeMultiplayer;
