import React, { useState } from "react";
import {
  Brain,
  Target,
  Grid3X3,
  Gamepad2,
  Trophy,
  Users,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import TicTacToe2 from "../components/games/TicTacToe2";
import TicTacToe2Multiplayer from "../components/games/TicTacToe2Multiplayer";
import { GLIcon, GModeSwitcherMobile } from "../components/utils/shared";
import { GameMode } from "../components/utils/types";

const TicTacToe2Page: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [showTips, setShowTips] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("single");

  const handleGameEnd = (winner: "X" | "O" | null, moves: number) => {
    // Aqui você pode adicionar lógica para salvar estatísticas
    console.log(`Jogo terminou! Vencedor: ${winner}, Moves: ${moves}`);
  };

  return (
    <div
      className={`min-h-screen py-8 transition-colors duration-200 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex sm:flex-row items-center justify-between mb-6 lg:mb-8 gap-4">
          <h1
            className={`text-2xl sm:text-3xl font-bold text-center sm:text-left ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Jogo da Velha 2
          </h1>

          <GModeSwitcherMobile setGameMode={setGameMode} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            {gameMode === "single" ? (
              <TicTacToe2 onGameEnd={handleGameEnd} />
            ) : (
              <TicTacToe2Multiplayer onGameEnd={() => {}} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-2 space-y-6">
            {/* Tips Section */}
            <div
              className={`rounded-xl shadow-lg p-6 ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold flex items-center ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <GLIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Dicas
                </h3>
                <button
                  onClick={() => setShowTips(!showTips)}
                  className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Zap
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showTips ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              <div className={`lg:block ${showTips ? "block" : "hidden"}`}>
                <ul
                  className={`space-y-3 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Ganhe nos sub-tabuleiros para conquistar o tabuleiro
                      principal
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      A célula onde você joga determina o próximo tabuleiro
                      disponível
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Se um tabuleiro está completo, você pode escolher qualquer
                      um
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Pense estrategicamente: controle o fluxo do jogo!
                    </span>
                  </li>
                  {gameMode === "multiplayer" && (
                    <>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          No multiplayer, observe a estratégia do oponente
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Use o código da sala para convidar amigos</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Rules Section */}
            <div
              className={`rounded-xl shadow-lg p-6 ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold flex items-center ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Regras
                </h3>
                <button
                  onClick={() => setShowRules(!showRules)}
                  className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Zap
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showRules ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              <div className={`lg:block ${showRules ? "block" : "hidden"}`}>
                <div
                  className={`space-y-4 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div>
                    <h4
                      className={`font-semibold mb-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Objetivo:
                    </h4>
                    <p>
                      Ganhar 3 sub-tabuleiros em linha no tabuleiro principal.
                    </p>
                  </div>

                  <div>
                    <h4
                      className={`font-semibold mb-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Como Jogar:
                    </h4>
                    <ul className="space-y-2">
                      <li>• Clique num tabuleiro para expandir</li>
                      <li>• Faça sua jogada no sub-tabuleiro</li>
                      <li>• A célula jogada determina o próximo tabuleiro</li>
                      <li>
                        • Ganhe o sub-tabuleiro para conquistar a célula
                        principal
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4
                      className={`font-semibold mb-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Vitória:
                    </h4>
                    <p>
                      Alinhe 3 células conquistadas no tabuleiro principal
                      (horizontal, vertical ou diagonal).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section - Apenas para modo single player */}
            {user && gameMode === "single" && (
              <div
                className={`rounded-xl shadow-lg p-6 ${
                  isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 flex items-center ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                  Estatísticas
                </h3>
                <div
                  className={`space-y-3 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>Jogos Jogados:</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vitórias:</span>
                    <span className="font-semibold text-green-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Derrotas:</span>
                    <span className="font-semibold text-red-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Vitória:</span>
                    <span className="font-semibold">0%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe2Page;
