import React, { useState, useEffect } from "react";
import { RotateCcw, Trophy, Circle, X, Brain } from "lucide-react";
import { GLIcon } from "../utils/shared";

type Player = "X" | "O";
type Board = (Player | null)[][];
type GameStatus = "playing" | "won" | "draw";

interface Connect4Props {
  onGameEnd?: (winner: Player | null, moves: number) => void;
}

const Connect4: React.FC<Connect4Props> = ({ onGameEnd }) => {
  const [board, setBoard] = useState<Board>(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [winner, setWinner] = useState<Player | null>(null);
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [isThinking, setIsThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(
    null
  );

  const ROWS = 6;
  const COLS = 7;

  // Verificar se há um vencedor
  const checkWinner = (
    board: Board,
    row: number,
    col: number,
    player: Player
  ): boolean => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal direita
      [1, -1], // diagonal esquerda
    ];

    for (const [dr, dc] of directions) {
      let count = 1;

      // Contar na direção positiva
      for (let i = 1; i < 4; i++) {
        const newRow = row + i * dr;
        const newCol = col + i * dc;
        if (
          newRow < 0 ||
          newRow >= ROWS ||
          newCol < 0 ||
          newCol >= COLS ||
          board[newRow][newCol] !== player
        ) {
          break;
        }
        count++;
      }

      // Contar na direção negativa
      for (let i = 1; i < 4; i++) {
        const newRow = row - i * dr;
        const newCol = col - i * dc;
        if (
          newRow < 0 ||
          newRow >= ROWS ||
          newCol < 0 ||
          newCol >= COLS ||
          board[newRow][newCol] !== player
        ) {
          break;
        }
        count++;
      }

      if (count >= 4) return true;
    }

    return false;
  };

  // Verificar se o jogo empatou
  const checkDraw = (board: Board): boolean => {
    return board[0].every((cell) => cell !== null);
  };

  // Encontrar a próxima linha disponível em uma coluna
  const getNextRow = (board: Board, col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1;
  };

  // IA para jogar como 'O'
  const computerMove = (board: Board, difficulty: string): number => {
    const availableMoves = [];
    for (let col = 0; col < COLS; col++) {
      if (getNextRow(board, col) !== -1) {
        availableMoves.push(col);
      }
    }

    if (availableMoves.length === 0) return -1;

    switch (difficulty) {
      case "easy":
        // Movimento aleatório
        return availableMoves[
          Math.floor(Math.random() * availableMoves.length)
        ];

      case "medium":
        // 50% chance de jogar perfeitamente, 50% de jogar aleatoriamente
        if (Math.random() < 0.5) {
          return findBestMove(board);
        } else {
          return availableMoves[
            Math.floor(Math.random() * availableMoves.length)
          ];
        }

      case "hard":
        // Sempre joga perfeitamente
        return findBestMove(board);

      default:
        return availableMoves[
          Math.floor(Math.random() * availableMoves.length)
        ];
    }
  };

  // Algoritmo minimax para encontrar a melhor jogada
  const findBestMove = (board: Board): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let col = 0; col < COLS; col++) {
      const row = getNextRow(board, col);
      if (row !== -1) {
        board[row][col] = "O";
        const score = minimax(board, 4, false, -Infinity, Infinity);
        board[row][col] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = col;
        }
      }
    }

    return bestMove;
  };

  // Algoritmo minimax com alpha-beta pruning
  const minimax = (
    board: Board,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number
  ): number => {
    // Verificar vitória imediata
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (board[row][col] !== null) {
          if (checkWinner(board, row, col, board[row][col]!)) {
            return board[row][col] === "O" ? 1000 : -1000;
          }
        }
      }
    }

    if (checkDraw(board) || depth === 0) {
      return evaluateBoard(board);
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let col = 0; col < COLS; col++) {
        const row = getNextRow(board, col);
        if (row !== -1) {
          board[row][col] = "O";
          const score = minimax(board, depth - 1, false, alpha, beta);
          board[row][col] = null;
          bestScore = Math.max(score, bestScore);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let col = 0; col < COLS; col++) {
        const row = getNextRow(board, col);
        if (row !== -1) {
          board[row][col] = "X";
          const score = minimax(board, depth - 1, true, alpha, beta);
          board[row][col] = null;
          bestScore = Math.min(score, bestScore);
          beta = Math.min(beta, score);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    }
  };

  // Avaliar o estado do tabuleiro
  const evaluateBoard = (board: Board): number => {
    let score = 0;

    // Avaliar cada posição
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (board[row][col] !== null) {
          const player = board[row][col]!;
          const multiplier = player === "O" ? 1 : -1;

          // Pontuação baseada na posição
          if (row === ROWS - 1) score += 1 * multiplier; // Base
          if (col === 3) score += 2 * multiplier; // Centro

          // Pontuação por conectividade
          const connections = countConnections(board, row, col, player);
          score += connections * 5 * multiplier;
        }
      }
    }

    return score;
  };

  // Contar conexões para uma posição
  const countConnections = (
    board: Board,
    row: number,
    col: number,
    player: Player
  ): number => {
    let count = 0;
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dr, dc] of directions) {
      let consecutive = 1;

      // Contar na direção positiva
      for (let i = 1; i < 3; i++) {
        const newRow = row + i * dr;
        const newCol = col + i * dc;
        if (
          newRow >= 0 &&
          newRow < ROWS &&
          newCol >= 0 &&
          newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          consecutive++;
        } else {
          break;
        }
      }

      // Contar na direção negativa
      for (let i = 1; i < 3; i++) {
        const newRow = row - i * dr;
        const newCol = col - i * dc;
        if (
          newRow >= 0 &&
          newRow < ROWS &&
          newCol >= 0 &&
          newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          consecutive++;
        } else {
          break;
        }
      }

      if (consecutive >= 2) count += consecutive;
    }

    return count;
  };

  // Fazer uma jogada
  const makeMove = (col: number) => {
    if (gameStatus !== "playing" || currentPlayer !== "X") {
      return;
    }

    const row = getNextRow(board, col);
    if (row === -1) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setMoves((prev) => prev + 1);
    setLastMove({ row, col });

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      setGameStatus("won");
      onGameEnd?.(currentPlayer, moves + 1);
      return;
    }

    if (checkDraw(newBoard)) {
      setGameStatus("draw");
      onGameEnd?.(null, moves + 1);
      return;
    }

    setCurrentPlayer("O");
  };

  // Jogada do computador
  useEffect(() => {
    if (currentPlayer === "O" && gameStatus === "playing") {
      setIsThinking(true);
      const timer = setTimeout(() => {
        const computerCol = computerMove(board, difficulty);
        if (computerCol !== -1) {
          const row = getNextRow(board, computerCol);
          if (row !== -1) {
            const newBoard = board.map((row) => [...row]);
            newBoard[row][computerCol] = "O";
            setBoard(newBoard);
            setMoves((prev) => prev + 1);
            setLastMove({ row, col: computerCol });

            if (checkWinner(newBoard, row, computerCol, "O")) {
              setWinner("O");
              setGameStatus("won");
              onGameEnd?.("O", moves + 1);
              return;
            }

            if (checkDraw(newBoard)) {
              setGameStatus("draw");
              onGameEnd?.(null, moves + 1);
              return;
            }

            setCurrentPlayer("X");
          }
        }
        setIsThinking(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, gameStatus, difficulty, moves, onGameEnd]);

  // Reiniciar jogo
  const resetGame = () => {
    setBoard(
      Array(6)
        .fill(null)
        .map(() => Array(7).fill(null))
    );
    setCurrentPlayer("X");
    setGameStatus("playing");
    setWinner(null);
    setMoves(0);
    setIsThinking(false);
    setLastMove(null);
  };

  // Renderizar célula do tabuleiro
  const renderCell = (row: number, col: number) => {
    const value = board[row][col];
    const isLastMove = lastMove && lastMove.row === row && lastMove.col === col;

    return (
      <button
        key={`${row}-${col}`}
        onClick={() => makeMove(col)}
        disabled={
          value !== null ||
          gameStatus !== "playing" ||
          currentPlayer !== "X" ||
          getNextRow(board, col) === -1
        }
        className={`
          w-10 h-10 lg:w-16 lg:h-16 border-2 border-gray-300 rounded-full text-lg lg:text-3xl font-bold transition-all duration-200
          ${value === "X" ? "text-blue-600 bg-blue-50 border-blue-300" : ""}
          ${value === "O" ? "text-red-600 bg-red-50 border-red-300" : ""}
          ${
            !value &&
            getNextRow(board, col) === row &&
            gameStatus === "playing" &&
            currentPlayer === "X"
              ? "hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
              : "cursor-default"
          }
          ${isLastMove ? "ring-4 ring-yellow-400 shadow-lg scale-110" : ""}
        `}
      >
        {value === "X" && <X className="w-6 h-6 lg:w-8 lg:h-8 mx-auto" />}
        {value === "O" && <Circle className="w-6 h-6 lg:w-8 lg:h-8 mx-auto" />}
      </button>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
          Conecta 4
        </h2>
        <p className="text-sm lg:text-base text-gray-600">
          Conecte 4 peças em linha para vencer
        </p>
      </div>

      {/* Dificuldade */}
      <div className="mb-4 lg:mb-6">
        <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
          Dificuldade:
        </label>
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "easy" | "medium" | "hard")
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          disabled={moves > 0}
        >
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>
      </div>

      {/* Status do Jogo */}
      <div className="mb-4 lg:mb-6 text-center">
        {gameStatus === "playing" && (
          <div className="flex items-center justify-center space-x-2">
            {currentPlayer === "X" ? (
              <>
                <X className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                <span className="text-sm lg:text-lg font-semibold text-gray-900">
                  Sua vez
                </span>
              </>
            ) : (
              <>
                {isThinking ? (
                  <>
                    <GLIcon
                      className={
                        "w-4 h-4 lg:w-5 lg:h-5 text-red-600 animate-pulse"
                      }
                    />
                    <span className="text-sm lg:text-lg font-semibold text-gray-900">
                      Computador pensando...
                    </span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                    <span className="text-sm lg:text-lg font-semibold text-gray-900">
                      Vez do computador
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {gameStatus === "won" && (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Trophy className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-base lg:text-lg font-semibold">
              {winner === "X" ? "Você venceu!" : "Computador venceu!"}
            </span>
          </div>
        )}

        {gameStatus === "draw" && (
          <div className="text-base lg:text-lg font-semibold text-gray-600">
            Empate!
          </div>
        )}
      </div>

      {/* Tabuleiro */}
      <div className="mb-4 lg:mb-6">
        <div className="grid grid-cols-7 gap-1 lg:gap-2 bg-blue-600 p-2 lg:p-4 rounded-lg">
          {board.map((row, rowIndex) =>
            row.map((_, colIndex) => renderCell(rowIndex, colIndex))
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mb-4 lg:mb-6 text-center text-xs lg:text-sm text-gray-600">
        Jogadas: {moves}
      </div>

      {/* Botão Reiniciar */}
      <button
        onClick={resetGame}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Novo Jogo</span>
      </button>
    </div>
  );
};

export default Connect4;
