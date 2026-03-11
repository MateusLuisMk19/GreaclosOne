import React, { useState, useEffect } from "react";
import { RotateCcw, Trophy, Check, X, Brain, Timer } from "lucide-react";
import { GLIcon } from "../utils/shared";

type Cell = number | null;
type Board = Cell[][];
type GameStatus = "playing" | "won" | "paused";
type Difficulty = "easy" | "medium" | "hard";

interface SudokuProps {
  onGameEnd?: (winner: boolean, time: number, hints: number) => void;
}

const Sudoku: React.FC<SudokuProps> = ({ onGameEnd }) => {
  const [board, setBoard] = useState<Board>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );
  const [solution, setSolution] = useState<Board>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );
  const [originalBoard, setOriginalBoard] = useState<Board>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [timer, setTimer] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    generateNewGame();
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && gameStatus === "playing") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameStatus]);

  // Gerar um novo jogo
  const generateNewGame = () => {
    const newSolution = generateSolution();
    const newBoard = createPuzzle(newSolution, difficulty);

    setSolution(newSolution);
    setBoard(newBoard.map((row) => [...row]));
    setOriginalBoard(newBoard.map((row) => [...row]));
    setSelectedCell(null);
    setTimer(0);
    setHintsUsed(0);
    setGameStatus("playing");
    setIsTimerRunning(true);
  };

  // Gerar uma solução válida do Sudoku
  const generateSolution = (): Board => {
    const board: Board = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));

    // Preencher primeira linha com números 1-9 em ordem aleatória
    const firstRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * firstRow.length);
      board[0][i] = firstRow[randomIndex];
      firstRow.splice(randomIndex, 1);
    }

    // Resolver o resto
    solveSudoku(board);

    return board;
  };

  // Resolver Sudoku usando backtracking
  const solveSudoku = (board: Board): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Verificar se um número é válido em uma posição
  const isValid = (
    board: Board,
    row: number,
    col: number,
    num: number
  ): boolean => {
    // Verificar linha
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Verificar coluna
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Verificar caixa 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }

    return true;
  };

  // Criar puzzle removendo números baseado na dificuldade
  const createPuzzle = (solution: Board, difficulty: Difficulty): Board => {
    const puzzle = solution.map((row) => [...row]);
    const cellsToRemove = {
      easy: 30,
      medium: 45,
      hard: 55,
    };

    const totalCells = 81;
    const cellsToKeep = totalCells - cellsToRemove[difficulty];
    let cellsKept = 0;

    while (cellsKept < cellsToKeep) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        cellsKept++;
      }
    }

    return puzzle;
  };

  // Selecionar uma célula
  const selectCell = (row: number, col: number) => {
    if (originalBoard[row][col] === null) {
      setSelectedCell({ row, col });
    }
  };

  // Inserir um número
  const insertNumber = (num: number) => {
    if (
      !selectedCell ||
      originalBoard[selectedCell.row][selectedCell.col] !== null
    ) {
      return;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[selectedCell.row][selectedCell.col] = num;
    setBoard(newBoard);

    // Verificar se o jogo foi completado
    if (isBoardComplete(newBoard)) {
      setGameStatus("won");
      setIsTimerRunning(false);
      onGameEnd?.(true, timer, hintsUsed);
    }
  };

  // Verificar se o tabuleiro está completo
  const isBoardComplete = (board: Board): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) return false;
      }
    }
    return true;
  };

  // Usar dica
  const useHint = () => {
    if (
      !selectedCell ||
      originalBoard[selectedCell.row][selectedCell.col] !== null
    ) {
      return;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[selectedCell.row][selectedCell.col] =
      solution[selectedCell.row][selectedCell.col];
    setBoard(newBoard);
    setHintsUsed((prev) => prev + 1);

    // Verificar se o jogo foi completado
    if (isBoardComplete(newBoard)) {
      setGameStatus("won");
      setIsTimerRunning(false);
      onGameEnd?.(true, timer, hintsUsed + 1);
    }
  };

  // Pausar/retomar jogo
  const togglePause = () => {
    if (gameStatus === "playing") {
      setGameStatus("paused");
      setIsTimerRunning(false);
    } else {
      setGameStatus("playing");
      setIsTimerRunning(true);
    }
  };

  // Formatar tempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Renderizar célula
  const renderCell = (row: number, col: number) => {
    const value = board[row][col];
    const isOriginal = originalBoard[row][col] !== null;
    const isSelected =
      selectedCell && selectedCell.row === row && selectedCell.col === col;
    const isCorrect = value !== null && value === solution[row][col];

    return (
      <div
        className={`w-9 h-9 lg:w-[3.1rem] lg:h-[3.1rem] flex items-center justify-center ${
          row === 0 || row === 1 || row === 2
            ? (col >= 0 && col <= 2) || (col >= 6 && col <= 8)
              ? "bg-slate-500"
              : "bg-slate-100"
            : ""
        } ${row === 6 || row === 7 || row === 8
          ? (col >= 0 && col <= 2) || (col >= 6 && col <= 8)
            ? "bg-slate-500"
            : "bg-slate-100"
          : ""} 
          ${row === 3 || row === 4 || row === 5
            ? (col >= 0 && col <= 2) || (col >= 6 && col <= 8)
              ? "bg-slate-100"
              : "bg-slate-500"
            : ""}`}
      >
        <button
          key={`${row}-${col}`}
          onClick={() => selectCell(row, col)}
          className={`
          w-8 h-8 lg:w-[3rem] lg:h-[3rem] border border-gray-300 text-sm lg:text-lg font-semibold transition-all duration-200
          ${isOriginal ? "bg-gray-100 text-gray-900" : "bg-white/75 text-blue-600"}
          ${
            isSelected ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300" : ""
          }
          ${
            !isOriginal && value !== null && !isCorrect
              ? "bg-red-100 text-red-600"
              : ""
          }
          ${
            !isOriginal && value !== null && isCorrect
              ? "bg-green-50 text-green-600"
              : ""
          }
          ${!isOriginal ? "hover:bg-gray-50 cursor-pointer" : "cursor-default"}
        `}
        >
          {value}
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
          Sudoku
        </h2>
        <p className="text-sm lg:text-base text-gray-600">
          Complete o grid 9x9 com números de 1 a 9
        </p>
      </div>

      {/* Controles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-3 lg:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">
              Dificuldade:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="px-2 lg:px-3 py-1 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs lg:text-sm"
              disabled={timer > 0}
            >
              <option value="easy">Fácil</option>
              <option value="medium">Médio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <span className="text-sm lg:text-lg font-mono">
              {formatTime(timer)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 lg:gap-3">
          <button
            onClick={togglePause}
            className="px-3 lg:px-4 py-1 lg:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-xs lg:text-sm"
          >
            {gameStatus === "paused" ? "Retomar" : "Pausar"}
          </button>

          <button
            onClick={useHint}
            disabled={
              !selectedCell ||
              originalBoard[selectedCell.row][selectedCell.col] !== null
            }
            className="px-3 lg:px-4 py-1 lg:py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm"
          >
            <GLIcon className="w-3 h-3 lg:w-4 lg:h-4" />
            <span>Dica ({3 - hintsUsed})</span>
          </button>

          <button
            onClick={generateNewGame}
            className="px-3 lg:px-4 py-1 lg:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm"
          >
            <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4" />
            <span>Novo Jogo</span>
          </button>
        </div>
      </div>

      {/* Status do Jogo */}
      {gameStatus === "won" && (
        <div className="mb-4 lg:mb-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Trophy className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-base lg:text-lg font-semibold">
              Parabéns! Você completou o Sudoku!
            </span>
          </div>
          <p className="text-sm lg:text-base text-gray-600 mt-2">
            Tempo: {formatTime(timer)} | Dicas usadas: {hintsUsed}
          </p>
        </div>
      )}

      {/* Tabuleiro */}
      <div className="mb-4 lg:mb-6 flex justify-center">
        <div className="grid grid-cols-9 gap-0.5 lg:gap-1 border-2 lg:border-4 border-gray-800 p-1 lg:p-2">
          {board.map((row, rowIndex) =>
            row.map((_, colIndex) => renderCell(rowIndex, colIndex))
          )}
        </div>
      </div>

      {/* Números para inserir */}
      <div className="flex justify-center space-x-1 lg:space-x-2 mb-4 lg:mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => insertNumber(num)}
            disabled={!selectedCell || gameStatus !== "playing"}
            className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-sm lg:text-lg rounded-lg transition-colors duration-200"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="text-center text-xs lg:text-sm text-gray-600">
        Dicas usadas: {hintsUsed}/3 | Tempo: {formatTime(timer)}
      </div>
    </div>
  );
};

export default Sudoku;
