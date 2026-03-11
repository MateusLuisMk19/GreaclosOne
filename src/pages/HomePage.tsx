import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Target,
  Grid3X3,
  Gamepad2,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { GLIcon, GLLogo } from "../components/utils/shared";

const HomePage: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Hero Section */}
      <section className="py-12 lg:py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div>
                <GLLogo className="w-14 h-14 lg:w-20 lg:h-20" />
              </div>
            </div>

            <h1
              className={`text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Desenvolva seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Raciocínio Lógico
              </span>
            </h1>

            <p
              className={`text-lg lg:text-xl mb-8 lg:mb-10 max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Jogos inteligentes para exercitar sua mente e melhorar suas
              habilidades de resolução de problemas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/games"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-lg text-lg lg:text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Começar a Jogar
              </Link>
              {!user && (
                <Link
                  to="/signup"
                  className={`px-6 py-3 lg:px-8 lg:py-4 rounded-lg text-lg lg:text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg border-2 ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-blue-400 border-blue-400"
                      : "bg-white hover:bg-gray-50 text-blue-600 border-blue-600"
                  }`}
                >
                  Criar Conta
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`py-12 lg:py-20 px-4 ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2
              className={`text-2xl lg:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Por que escolher nossos jogos?
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Desenvolvidos para desafiar e estimular diferentes aspectos do seu
              raciocínio lógico.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div
              className={`text-center p-6 lg:p-8 rounded-xl border ${
                isDark
                  ? "bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700"
                  : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
              }`}
            >
              <div className=" rounded-full w-fit mx-auto mb-4">
                <GLIcon className="w-6 h-6 lg:w-14 lg:h-14 text-white" />
              </div>
              <h3
                className={`text-lg lg:text-xl font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Raciocínio Lógico
              </h3>
              <p
                className={`text-sm lg:text-base ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Desenvolva habilidades de pensamento crítico e resolução de
                problemas.
              </p>
            </div>

            <div
              className={`text-center p-6 lg:p-8 rounded-xl border ${
                isDark
                  ? "bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700"
                  : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              }`}
            >
              <div className="bg-green-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Trophy className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3
                className={`text-lg lg:text-xl font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Progresso
              </h3>
              <p
                className={`text-sm lg:text-base ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Acompanhe seu desenvolvimento com estatísticas detalhadas.
              </p>
            </div>

            <div
              className={`text-center p-6 lg:p-8 rounded-xl border ${
                isDark
                  ? "bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700"
                  : "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
              }`}
            >
              <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3
                className={`text-lg lg:text-xl font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Múltiplas Dificuldades
              </h3>
              <p
                className={`text-sm lg:text-base ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Do iniciante ao expert, sempre há um novo desafio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-12 lg:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2
              className={`text-2xl lg:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Nossos Jogos
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Uma coleção crescente de jogos de raciocínio lógico e estratégia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* TicTacToe */}
            <div
              className={`p-6 lg:p-8 rounded-lg border ${
                isDark
                  ? "bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700"
                  : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
              }`}
            >
              <h3
                className={`text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 ${
                  isDark ? "text-blue-300" : "text-blue-900"
                }`}
              >
                Jogo da Velha
              </h3>
              <p
                className={`mb-4 lg:mb-6 ${
                  isDark ? "text-blue-200" : "text-blue-700"
                }`}
              >
                O clássico jogo da velha com IA inteligente. Estratégia e tática
                em um tabuleiro 3x3!
              </p>
              <Link
                to="/games/tictactoe"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200 inline-block"
              >
                Jogar Agora
              </Link>
            </div>

            {/* Connect4 */}
            <div
              className={`p-6 lg:p-8 rounded-lg border ${
                isDark
                  ? "bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700"
                  : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              }`}
            >
              <h3
                className={`text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 ${
                  isDark ? "text-green-300" : "text-green-900"
                }`}
              >
                Conecta 4
              </h3>
              <p
                className={`mb-4 lg:mb-6 ${
                  isDark ? "text-green-200" : "text-green-700"
                }`}
              >
                Conecte 4 peças em linha para vencer. Estratégia e planejamento!
              </p>
              <Link
                to="/games/connect4"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200 inline-block"
              >
                Jogar Agora
              </Link>
            </div>

            {/* Sudoku */}
            <div
              className={`p-6 lg:p-8 rounded-lg border ${
                isDark
                  ? "bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700"
                  : "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
              }`}
            >
              <h3
                className={`text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 ${
                  isDark ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Sudoku
              </h3>
              <p
                className={`mb-4 lg:mb-6 ${
                  isDark ? "text-purple-200" : "text-purple-700"
                }`}
              >
                Complete o grid 9x9 com números de 1 a 9. Lógica pura!
              </p>
              <Link
                to="/games/sudoku"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200 inline-block"
              >
                Jogar Agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
            Pronto para desafiar sua mente?
          </h2>
          <p className="text-lg lg:text-xl text-blue-100 mb-8 lg:mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de jogadores que já estão desenvolvendo suas
            habilidades lógicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white hover:bg-gray-100 text-blue-600 px-6 py-3 lg:px-8 lg:py-4 rounded-lg text-lg lg:text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Começar Agora
            </Link>
            <Link
              to="/games"
              className="bg-transparent hover:bg-white hover:text-blue-600 text-white border-2 border-white px-6 py-3 lg:px-8 lg:py-4 rounded-lg text-lg lg:text-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Ver Jogos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
