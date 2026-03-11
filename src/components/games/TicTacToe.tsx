import React, { useState } from "react";
import { X, Circle, RotateCcw, Brain, Trophy } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { GLIcon } from "../utils/shared";

type Cell = "X" | "O" | null;
type Board = Cell[];
type GameStatus = "playing" | "won" | "draw";
type Difficulty = "easy" | "medium" | "hard";

interface TicTacToeProps {
  onGameEnd?: (winner: "X" | "O" | null, moves: number) => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ onGameEnd }) => {
  const { isDark } = useTheme();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isThinking, setIsThinking] = useState(false);

  // Verificar vitória
  const checkWinner = (board: Board): "X" | "O" | null => {
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

  // Verificar empate
  const checkDraw = (board: Board): boolean => {
    return board.every((cell) => cell !== null);
  };

  // Jogada do computador
  const computerMove = (board: Board, difficulty: Difficulty): number => {
    const availableMoves = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);

    if (availableMoves.length === 0) return -1;

    switch (difficulty) {
      case "easy":
        return availableMoves[
          Math.floor(Math.random() * availableMoves.length)
        ];

      case "medium":
        if (Math.random() < 0.5) {
          return findBestMove(board);
        } else {
          return availableMoves[
            Math.floor(Math.random() * availableMoves.length)
          ];
        }

      case "hard":
        return findBestMove(board);

      default:
        return availableMoves[
          Math.floor(Math.random() * availableMoves.length)
        ];
    }
  };

  // Encontrar melhor jogada usando minimax
  const findBestMove = (board: Board): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const score = minimax(board, 0, false);
        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  // Algoritmo minimax
  const minimax = (
    board: Board,
    depth: number,
    isMaximizing: boolean
  ): number => {
    const winner = checkWinner(board);

    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (checkDraw(board)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O";
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "X";
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Fazer jogada
  const makeMove = (index: number) => {
    if (board[index] || gameStatus !== "playing" || currentPlayer !== "X")
      return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setMoves((prev) => prev + 1);

    // Verificar vitória
    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameStatus("won");
      onGameEnd?.(winner, moves + 1);
      return;
    }

    // Verificar empate
    if (checkDraw(newBoard)) {
      setGameStatus("draw");
      onGameEnd?.(null, moves + 1);
      return;
    }

    // Alternar para computador
    setCurrentPlayer("O");
    setIsThinking(true);

    // Jogada do computador com delay
    setTimeout(() => {
      const computerIndex = computerMove(newBoard, difficulty);
      if (computerIndex !== -1) {
        const updatedBoard = [...newBoard];
        updatedBoard[computerIndex] = "O";
        setBoard(updatedBoard);
        setMoves((prev) => prev + 1);

        // Verificar vitória do computador
        const computerWinner = checkWinner(updatedBoard);
        if (computerWinner) {
          setWinner(computerWinner);
          setGameStatus("won");
          onGameEnd?.(computerWinner, moves + 2);
          return;
        }

        // Verificar empate
        if (checkDraw(updatedBoard)) {
          setGameStatus("draw");
          onGameEnd?.(null, moves + 2);
          return;
        }

        // Voltar para jogador
        setCurrentPlayer("X");
      }
      setIsThinking(false);
    }, 500);
  };

  // Reiniciar jogo
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameStatus("playing");
    setWinner(null);
    setCurrentPlayer("X");
    setMoves(0);
    setIsThinking(false);
  };

  // Renderizar célula do tabuleiro
  const renderCell = (index: number) => {
    const value = board[index];
    const isWinningCell = winner && checkWinner(board) === value;

    return (
      <button
        key={index}
        onClick={() => makeMove(index)}
        disabled={
          value !== null || gameStatus !== "playing" || currentPlayer !== "X"
        }
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
          !value && gameStatus === "playing" && currentPlayer === "X"
            ? isDark
              ? "hover:bg-gray-700 cursor-pointer"
              : "hover:bg-gray-50 cursor-pointer"
            : "cursor-default"
        } ${
          isWinningCell
            ? "bg-yellow-100 border-yellow-400 shadow-lg scale-105"
            : ""
        }`}
      >
        {value === "X" && <X className="w-8 h-8 lg:w-10 lg:h-10 mx-auto" />}
        {value === "O" && (
          <Circle className="w-8 h-8 lg:w-10 lg:h-10 mx-auto" />
        )}
      </button>
    );
  };

  return (
    <div
      className={`max-w-md mx-auto rounded-xl shadow-lg p-4 lg:p-6 transition-colors duration-200 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      {/* <div className="text-center mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-2">Jogo da Velha</h2>
        <p className={`text-sm lg:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Jogue contra o computador
        </p>
      </div> */}

      {/* Dificuldade */}
      <div className="mb-4 lg:mb-6">
        <label
          className={`block text-xs lg:text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Dificuldade:
        </label>
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "easy" | "medium" | "hard")
          }
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base transition-colors duration-200 ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
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
                <span className="text-sm lg:text-lg font-semibold">
                  Sua vez
                </span>
              </>
            ) : (
              <>
                {isThinking ? (
                  <>
                    <GLIcon className="w-4 h-4 lg:w-5 lg:h-5 text-red-600 animate-pulse" />
                    <span className="text-sm lg:text-lg font-semibold">
                      Computador pensando...
                    </span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                    <span className="text-sm lg:text-lg font-semibold">
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
      <div className="mb-4 lg:mb-6 flex justify-center">
        <div className="grid grid-cols-3 gap-1 lg:gap-2">
          {board.map((_, index) => renderCell(index))}
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

export default TicTacToe;
