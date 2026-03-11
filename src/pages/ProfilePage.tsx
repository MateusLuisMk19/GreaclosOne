import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Mail,
  Calendar,
  Trophy,
  BarChart3,
  Gamepad2,
  User,
  Target,
  Grid3X3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { GLIcon } from "../components/utils/shared";

const ProfilePage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { isDark } = useTheme();

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 to-gray-800"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        }`}
      >
        <div className="text-center">
          <h1
            className={`text-2xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Usuário não autenticado
          </h1>
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            Faça login para acessar seu perfil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 transition-colors duration-200 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className={`text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Meu Perfil
            </h1>
            <p
              className={`text-xl ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Gerencie suas informações e acompanhe seu progresso
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Informações do Usuário */}
            <div className="lg:col-span-1">
              <div
                className={`rounded-xl shadow-lg p-6 ${
                  isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <div className="text-center mb-6">
                  <div className="bg-blue-600 p-0.5 w-fit rounded-full mx-auto mb-4">
                    <GLIcon className="w-16 h-16 text-white" />
                  </div>
                  <h2
                    className={`text-xl font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {userProfile?.username || user.email?.split("@")[0]}
                  </h2>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    {user.email}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      Usuário: {userProfile?.username || "Não definido"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      {user.email}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      Idade:{" "}
                      {userProfile?.age
                        ? `${userProfile.age} anos`
                        : "Não definida"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      Membro desde{" "}
                      {user.metadata.creationTime
                        ? new Date(
                            user.metadata.creationTime
                          ).toLocaleDateString("pt-BR")
                        : "Data não disponível"}
                    </span>
                  </div>
                </div>

                {/* Seção para usuários anônimos */}
                {userProfile?.isAnonymous && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Conta Anônima
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Você está jogando como visitante. Para salvar seu
                      progresso e acessar recursos adicionais, considere criar
                      uma conta permanente.
                    </p>
                    <div className="mt-3 flex space-x-2">
                      <Link
                        to="/signup"
                        className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200"
                      >
                        Criar Conta
                      </Link>
                      <Link
                        to="/login"
                        className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200"
                      >
                        Fazer Login
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas Gerais */}
            <div className="lg:col-span-2">
              <div
                className={`rounded-xl shadow-lg p-6 mb-6 ${
                  isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-4 flex items-center ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Estatísticas Gerais
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div
                    className={`p-4 rounded-lg ${
                      isDark
                        ? "bg-blue-900/50 border border-blue-700"
                        : "bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isDark ? "text-blue-300" : "text-blue-600"
                          }`}
                        >
                          Total de Jogos
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            isDark ? "text-blue-200" : "text-blue-900"
                          }`}
                        >
                          0
                        </p>
                      </div>
                      <Gamepad2
                        className={`w-8 h-8 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDark
                        ? "bg-green-900/50 border border-green-700"
                        : "bg-green-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isDark ? "text-green-300" : "text-green-600"
                          }`}
                        >
                          Vitórias
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            isDark ? "text-green-200" : "text-green-900"
                          }`}
                        >
                          0
                        </p>
                      </div>
                      <Trophy
                        className={`w-8 h-8 ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Jogos Favoritos */}
              <div
                className={`rounded-xl shadow-lg p-6 ${
                  isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Jogos Disponíveis
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Gamepad2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Jogo da Velha
                        </h4>
                        <p className="text-sm text-gray-600">Disponível</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Conecta 4</h4>
                        <p className="text-sm text-gray-600">Disponível</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Grid3X3 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Sudoku</h4>
                        <p className="text-sm text-gray-600">Disponível</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 opacity-50">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <GLIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-500">
                          Quebra-Cabeças
                        </h4>
                        <p className="text-sm text-gray-400">Em breve</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
