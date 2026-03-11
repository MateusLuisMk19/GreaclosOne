import React, { useState } from "react";
import {
  X,
  Circle,
  RotateCcw,
  Brain,
  Trophy,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { GLIcon } from "../utils/shared";

type Cell = "X" | "O" | null;
type Board = Cell[];
type GameStatus = "playing" | "won" | "draw";
type Difficulty = "easy" | "medium" | "hard";

interface TicTacToeProps {
  onGameEnd?: (winner: "X" | "O" | null, moves: number) => void;
}

const TicTacToe2: React.FC<TicTacToeProps> = ({ onGameEnd }) => {
  const { isDark } = useTheme();

  // Estado principal do jogo
  const [mainBoard, setMainBoard] = useState<Board>(Array(9).fill(null));
  const [subBoards, setSubBoards] = useState<Board[]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isThinking, setIsThinking] = useState(false);

  // Estado de navegação
  const [, setIsXpanded] = useState(false);
  const [expandedArea, setExpandedArea] = useState<number | null>(null);
  const [, setActiveSubBoard] = useState<number | null>(null);
  const [nextSubBoard, setNextSubBoard] = useState<number | null>(null);

  // Verificar vitória em um tabuleiro
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

  // Verificar empate em um tabuleiro
  const checkDraw = (board: Board): boolean => {
    return board.every((cell) => cell !== null);
  };

  // Verificar se um sub-tabuleiro está completo
  const isSubBoardComplete = (boardIndex: number): boolean => {
    const board = subBoards[boardIndex];
    return checkWinner(board) !== null || checkDraw(board);
  };

  // Jogada do computador em um sub-tabuleiro
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
        return Math.random() < 0.5
          ? findBestMove(board)
          : availableMoves[Math.floor(Math.random() * availableMoves.length)];
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

  // Expandir área (navegar para um sub-tabuleiro)
  const expandArea = (areaIndex: number) => {
    if (gameStatus !== "playing") return;

    // Se não há próximo tabuleiro definido, permitir escolher qualquer um
    if (nextSubBoard === null || isSubBoardComplete(nextSubBoard)) {
      setExpandedArea(areaIndex);
      setActiveSubBoard(areaIndex);
      setIsXpanded(true);
      return;
    }

    // Se há um próximo tabuleiro definido, só permitir jogar nele
    if (areaIndex === nextSubBoard) {
      setExpandedArea(areaIndex);
      setActiveSubBoard(areaIndex);
      setIsXpanded(true);
    }
  };

  // Fazer jogada em um sub-tabuleiro
  const makeMove = (subBoardIndex: number, cellIndex: number) => {
    if (
      gameStatus !== "playing" ||
      currentPlayer !== "X" ||
      subBoards[subBoardIndex][cellIndex] !== null ||
      (nextSubBoard !== null && subBoardIndex !== nextSubBoard) ||
      isSubBoardComplete(subBoardIndex)
    ) {
      return;
    }

    // Fazer jogada do jogador
    const newSubBoards = [...subBoards];
    newSubBoards[subBoardIndex][cellIndex] = "X";
    setSubBoards(newSubBoards);
    setMoves((prev) => prev + 1);

    // Verificar vitória no sub-tabuleiro
    const subWinner = checkWinner(newSubBoards[subBoardIndex]);
    if (subWinner) {
      // Atualizar tabuleiro principal
      const newMainBoard = [...mainBoard];
      newMainBoard[subBoardIndex] = subWinner;
      setMainBoard(newMainBoard);

      // Verificar vitória no tabuleiro principal
      const mainWinner = checkWinner(newMainBoard);
      if (mainWinner) {
        setWinner(mainWinner);
        setGameStatus("won");
        onGameEnd?.(mainWinner, moves + 1);
        setExpandedArea(null);
        return;
      }

      // Verificar empate no tabuleiro principal
      if (checkDraw(newMainBoard)) {
        setGameStatus("draw");
        onGameEnd?.(null, moves + 1);
        setExpandedArea(null);
        return;
      }
    }

    // Verificar empate no sub-tabuleiro
    if (checkDraw(newSubBoards[subBoardIndex])) {
      const newMainBoard = [...mainBoard];
      newMainBoard[subBoardIndex] = "draw" as any; // Marcar como empate
      setMainBoard(newMainBoard);
    }

    setExpandedArea(null);

    // Definir próximo tabuleiro (baseado na célula jogada)
    const nextBoard = cellIndex;
    setNextSubBoard(isSubBoardComplete(nextBoard) ? null : nextBoard);

    // Alternar para computador
    setCurrentPlayer("O");
    setIsThinking(true);

    // Chamar função da jogada do computador
    setTimeout(() => {
      makeComputerMove(nextBoard);
    }, 500);
  };

  // Função separada para jogada do computador
  const makeComputerMove = (targetSubBoard: number) => {
    // Se o tabuleiro alvo está completo, escolher um aleatório
    const availableBoards = [];
    if (isSubBoardComplete(targetSubBoard)) {
      // Encontrar todos os tabuleiros disponíveis
      for (let i = 0; i < 9; i++) {
        if (!isSubBoardComplete(i)) {
          availableBoards.push(i);
        }
      }
    } else {
      availableBoards.push(targetSubBoard);
    }

    if (availableBoards.length === 0) {
      // Se não há tabuleiros disponíveis, verificar se o jogo terminou
      const mainWinner = checkWinner(mainBoard);
      if (mainWinner) {
        setWinner(mainWinner);
        setGameStatus("won");
        onGameEnd?.(mainWinner, moves + 1);
      } else if (checkDraw(mainBoard)) {
        setGameStatus("draw");
        onGameEnd?.(null, moves + 1);
      }
      setCurrentPlayer("X");
      setIsThinking(false);
      return;
    }

    // Escolher tabuleiro para jogar
    const selectedBoard =
      availableBoards[Math.floor(Math.random() * availableBoards.length)];

    // Fazer jogada do computador no tabuleiro selecionado
    const computerIndex = computerMove(subBoards[selectedBoard], difficulty);

    if (computerIndex !== -1) {
      const updatedSubBoards = [...subBoards];
      updatedSubBoards[selectedBoard][computerIndex] = "O";
      setSubBoards(updatedSubBoards);
      setMoves((prev) => prev + 1);

      // Verificar vitória do computador no sub-tabuleiro
      const computerSubWinner = checkWinner(updatedSubBoards[selectedBoard]);
      if (computerSubWinner) {
        const newMainBoard = [...mainBoard];
        newMainBoard[selectedBoard] = computerSubWinner;
        setMainBoard(newMainBoard);

        // Verificar vitória no tabuleiro principal
        const mainWinner = checkWinner(newMainBoard);
        if (mainWinner) {
          setWinner(mainWinner);
          setGameStatus("won");
          onGameEnd?.(mainWinner, moves + 2);
          setCurrentPlayer("X");
          setIsThinking(false);
          return;
        }

        // Verificar empate no tabuleiro principal
        if (checkDraw(newMainBoard)) {
          setGameStatus("draw");
          onGameEnd?.(null, moves + 2);
          setCurrentPlayer("X");
          setIsThinking(false);
          return;
        }
      }

      // Verificar empate no sub-tabuleiro
      if (checkDraw(updatedSubBoards[selectedBoard])) {
        const newMainBoard = [...mainBoard];
        newMainBoard[selectedBoard] = "draw" as any;
        setMainBoard(newMainBoard);
      }

      // Definir próximo tabuleiro para o jogador
      const nextBoardForPlayer = computerIndex;
      setNextSubBoard(
        isSubBoardComplete(nextBoardForPlayer) ? null : nextBoardForPlayer
      );
    }

    setCurrentPlayer("X");
    setIsThinking(false);
  };

  // Reiniciar jogo
  const resetGame = () => {
    setMainBoard(Array(9).fill(null));
    setSubBoards(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
    );
    setGameStatus("playing");
    setWinner(null);
    setCurrentPlayer("X");
    setMoves(0);
    setIsThinking(false);
    setExpandedArea(null);
    setActiveSubBoard(null);
    setNextSubBoard(null);
  };

  // Voltar ao tabuleiro principal
  const backToMainBoard = () => {
    setExpandedArea(null);
    setActiveSubBoard(null);
    setIsXpanded(false);
  };

  // Renderizar célula do sub-tabuleiro
  const renderSubCell = (subBoardIndex: number, cellIndex: number) => {
    const value = subBoards[subBoardIndex][cellIndex];
    const isWinningCell = checkWinner(subBoards[subBoardIndex]) === value;
    const isActive = nextSubBoard === null || subBoardIndex === nextSubBoard;
    const isComplete = isSubBoardComplete(subBoardIndex);

    return (
      <button
        key={cellIndex}
        onClick={() => makeMove(subBoardIndex, cellIndex)}
        disabled={
          value !== null ||
          gameStatus !== "playing" ||
          currentPlayer !== "X" ||
          !isActive ||
          isComplete
        }
        className={`w-14 h-14 lg:w-16 lg:h-16 border border-slate-500 rounded text-xs lg:text-sm font-bold transition-all duration-200 ${
          isDark
            ? "border-gray-600 hover:border-gray-500"
            : "border-gray-300 hover:border-gray-400"
        } ${
          value === "X"
            ? "text-blue-600 bg-blue-50 border-blue-300"
            : value === "O"
            ? "text-red-600 bg-red-50 border-red-300"
            : "bg-slate-500/20"
        } ${
          !value &&
          isActive &&
          !isComplete &&
          gameStatus === "playing" &&
          currentPlayer === "X"
            ? isDark
              ? "hover:bg-gray-700 cursor-pointer"
              : "hover:bg-gray-50 cursor-pointer"
            : "cursor-default"
        } ${
          isWinningCell
            ? "bg-yellow-100 border-yellow-400 shadow-lg scale-105"
            : ""
        } ${!isActive && !isComplete ? "opacity-50" : ""}`}
      >
        {value === "X" && <X className="w-4 h-4 lg:w-6 lg:h-6 mx-auto" />}
        {value === "O" && <Circle className="w-4 h-4 lg:w-6 lg:h-6 mx-auto" />}
      </button>
    );
  };

  // Renderizar célula do tabuleiro principal
  const renderMainCell = (index: number) => {
    const value = mainBoard[index];
    const isWinningCell = winner && checkWinner(mainBoard) === value;
    const isComplete = isSubBoardComplete(index);
    const isNextBoard = nextSubBoard === index;
    const isActive = nextSubBoard === null || isNextBoard;

    return (
      <button
        key={index}
        onClick={() => expandArea(index)}
        disabled={gameStatus !== "playing" || !isActive}
        className={`w-20 h-20 lg:w-24 lg:h-24 border-2 flex items-center justify-center rounded-lg transition-all duration-200 ${
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
          isActive && gameStatus === "playing"
            ? isDark
              ? "hover:bg-gray-700 cursor-pointer"
              : "hover:bg-gray-50 cursor-pointer"
            : "cursor-default"
        } ${
          isWinningCell
            ? "bg-yellow-100 border-yellow-400 shadow-lg scale-105"
            : ""
        } ${isNextBoard ? "ring-2 ring-green-400 ring-opacity-50" : ""} ${
          !isActive && !isComplete ? "opacity-50" : ""
        }`}
      >
        {value === "X" && <X className="w-8 h-8 lg:w-10 lg:h-10 mx-auto" />}
        {value === "O" && (
          <Circle className="w-8 h-8 lg:w-10 lg:h-10 mx-auto" />
        )}
        {value === null && !isComplete && (
          <div className="grid grid-cols-3 gap-0.5 lg:gap-1 p-1">
            {Array(9)
              .fill(null)
              .map((_, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`w-4 h-4 lg:w-5.5 lg:h-5.5 rounded flex items-center justify-center ${
                    subBoards[index][cellIndex] === "X"
                      ? "bg-blue-400"
                      : subBoards[index][cellIndex] === "O"
                      ? "bg-red-400"
                      : "bg-gray-300/20"
                  }`}
                >
                  {subBoards[index][cellIndex] === "X" && (
                    <X className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  )}
                  {subBoards[index][cellIndex] === "O" && (
                    <Circle className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  )}
                </div>
              ))}
          </div>
        )}
      </button>
    );
  };

  return (
    <div
      className={`max-w-4xl mx-auto rounded-xl shadow-lg p-4 lg:p-6 transition-colors duration-200 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
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
                  {nextSubBoard !== null
                    ? `Sua vez - Tabuleiro ${nextSubBoard + 1}`
                    : "Escolha um tabuleiro"}
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

      <div className="relative flex items-center justify-center">
        {/* Tabuleiro Expandido */}
        {expandedArea !== null && (
          <div className="absolute z-20 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 shadow-lg">
            <X
              className="w-4 h-4 lg:w-5 lg:h-5 cursor-pointer absolute top-1 right-1"
              onClick={() => backToMainBoard()}
            />
            <div className="grid grid-cols-3 gap-2 lg:gap-3">
              {Array(9)
                .fill(null)
                .map((_, index) => renderSubCell(expandedArea, index))}
            </div>
          </div>
        )}
        {/* Tabuleiro Principal */}
        <div className="mb-4 lg:mb-6 flex justify-center z-10">
          <div className="grid grid-cols-3 gap-2 lg:gap-3">
            {Array(9)
              .fill(null)
              .map((_, index) => renderMainCell(index))}
          </div>
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

export default TicTacToe2;
