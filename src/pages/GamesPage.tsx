import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Gamepad2,
  Star,
  Clock,
  Target,
  Grid3X3,
  Heart,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { GLIcon, GLLogo } from "../components/utils/shared";

interface Game {
  id: string;
  name: string;
  description: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  category: string;
  icon: React.ReactNode;
  available: boolean;
  route: string;
}

const GamesPage: React.FC = () => {
  const { isDark } = useTheme();

  const games: Game[] = [
    {
      id: "tictactoe",
      name: "Jogo da Velha",
      description:
        "O clássico jogo da velha com IA inteligente. Teste suas estratégias e tente vencer o computador!",
      difficulty: "Fácil",
      category: "Tabuleiro",
      icon: <Gamepad2 className="w-8 h-8" />,
      available: true,
      route: "/games/tictactoe",
    },
    {
      id: "tictactoe",
      name: "Jogo da Velha 2",
      description:
        "A sequencia do clássico jogo da velha, com IA inteligente. Teste suas estratégias e tente vencer o computador!",
      difficulty: "Médio",
      category: "Tabuleiro",
      icon: <Gamepad2 className="w-8 h-8" />,
      available: true,
      route: "/games/tictactoe2",
    },
    {
      id: "connect4",
      name: "Conecta 4",
      description:
        "Conecte 4 peças em linha para vencer. Um jogo de estratégia que testa sua capacidade de planejamento.",
      difficulty: "Médio",
      category: "Tabuleiro",
      icon: <Target className="w-8 h-8" />,
      available: true,
      route: "/games/connect4",
    },
    {
      id: "sudoku",
      name: "Sudoku",
      description:
        "Complete o grid 9x9 com números de 1 a 9, sem repetir em linhas, colunas ou quadrados 3x3.",
      difficulty: "Difícil",
      category: "Lógica",
      icon: <Grid3X3 className="w-8 h-8" />,
      available: true,
      route: "/games/sudoku",
    },
    {
      id: "kemps",
      name: "Kem's",
      description:
        "Jogo de cartas emocionante onde o objetivo é formar 4 cartas do mesmo valor e gritar 'Kem's' antes que alguém grite 'Corta'!",
      difficulty: "Médio",
      category: "Cartas",
      icon: <Heart className="w-8 h-8" />,
      available: true,
      route: "/games/kemps",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-600"
          : "bg-green-100 text-green-800";
      case "Médio":
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-600"
          : "bg-yellow-100 text-yellow-800";
      case "Difícil":
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-600"
          : "bg-red-100 text-red-800";
      default:
        return isDark
          ? "bg-gray-900/50 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800";
    }
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
        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Biblioteca de Jogos
          </h1>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Explore nossa coleção de jogos de raciocínio lógico e tabuleiro.
            Cada jogo foi projetado para desafiar e desenvolver suas habilidades
            estratégicas.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className={`rounded-xl shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
              } ${!game.available ? "opacity-60" : ""}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${
                      isDark ? "bg-blue-900/50" : "bg-blue-100"
                    }`}
                  >
                    {game.icon}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                      game.difficulty
                    )}`}
                  >
                    {game.difficulty}
                  </span>
                </div>

                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {game.name}
                </h3>

                <p
                  className={`mb-4 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {game.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {game.category}
                  </span>

                  {game.available ? (
                    <Link
                      to={game.route}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Jogar
                    </Link>
                  ) : (
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        isDark
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      Em breve
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 bg-white/50 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Próximos Jogos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quebra-Cabeças</h3>
                <p className="text-sm text-gray-600">
                  Desafios de lógica e resolução de problemas
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <GLLogo className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Jogos de Memória
                </h3>
                <p className="text-sm text-gray-600">
                  Teste sua capacidade de memorização
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
