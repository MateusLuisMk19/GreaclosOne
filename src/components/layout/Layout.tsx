import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  Gamepad2,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";
import { GLIcon, GLLogo } from "../utils/shared";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`transition-colors duration-200 ${
          isDark
            ? "bg-gray-800 shadow-gray-900/20 border-gray-700"
            : "bg-white shadow-sm border-gray-200"
        } shadow-sm border-b`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              <GLLogo width={30} height={30} />
              <span className="text-lg lg:text-2xl font-semibold">
                Greaclos
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive("/")
                    ? isDark
                      ? "bg-blue-900 text-blue-100"
                      : "bg-blue-100 text-blue-700"
                    : isDark
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Início
              </Link>
              <Link
                to="/games"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive("/games")
                    ? isDark
                      ? "bg-blue-900 text-blue-100"
                      : "bg-blue-100 text-blue-700"
                    : isDark
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Jogos
              </Link>
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  isDark
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                aria-label="Alternar tema"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {user ? (
                <>
                  <Link
                    className={`text-sm transition-colors duration-200 hover:cursor-pointer flex items-center space-x-1 ${
                      isDark
                        ? "text-gray-300 hover:text-blue-500"
                        : "text-gray-700 hover:text-gray-500"
                    }`}
                    to="/profile"
                  >
                    <span>
                      {userProfile?.username || user.email?.split("@")[0]}
                    </span>
                    {userProfile?.isAnonymous && (
                      <span className="text-xs bg-gray-500 text-white px-1.5 py-0.5 rounded-full">
                        Anônimo
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors duration-200 rounded-md ${
                      isDark
                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className={`text-sm transition-colors duration-200 ${
                      isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/signup"
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isDark ? "shadow-lg shadow-blue-600/25" : ""
                    }`}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-md transition-colors duration-200 ${
                isDark
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div
              className={`md:hidden border-t transition-colors duration-200 py-4 ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/")
                      ? isDark
                        ? "bg-blue-900 text-blue-100"
                        : "bg-blue-100 text-blue-700"
                      : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Início
                </Link>
                <Link
                  to="/games"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/games")
                      ? isDark
                        ? "bg-blue-900 text-blue-100"
                        : "bg-blue-100 text-blue-700"
                      : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Jogos
                </Link>

                {/* Theme Toggle Mobile */}
                <button
                  onClick={toggleTheme}
                  className={`px-3 py-2 text-sm transition-colors duration-200 rounded-md flex items-center space-x-2 ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span>Alternar Tema</span>
                </button>

                {user ? (
                  <>
                    <div
                      className={`px-3 py-2 text-sm border-t transition-colors duration-200 pt-2 ${
                        isDark
                          ? "text-gray-300 border-gray-700"
                          : "text-gray-700 border-gray-200"
                      }`}
                    >
                      Olá, {userProfile?.username || user.email?.split("@")[0]}
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors duration-200 rounded-md ${
                        isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-3 py-2 text-sm transition-colors duration-200 rounded-md ${
                        isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-3 py-2 text-sm transition-colors duration-200 rounded-md ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      Cadastrar
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className={`transition-colors duration-200 mt-16 ${
          isDark ? "bg-gray-800 text-white" : "bg-gray-800 text-white"
        } py-6 lg:py-8`}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div>
              <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 flex items-center">
                <GLIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Greaclos
              </h3>
              <p className="text-xs lg:text-sm text-gray-300">
                Desenvolva seu raciocínio lógico com nossa coleção de jogos
                inteligentes.
              </p>
            </div>

            <div>
              <h4 className="text-sm lg:text-md font-semibold mb-3 lg:mb-4">
                Jogos
              </h4>
              <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-300">
                <li>• Jogo da Velha</li>
                <li>• Conecta 4</li>
                <li>• Sudoku</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm lg:text-md font-semibold mb-3 lg:mb-4">
                Recursos
              </h4>
              <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-300">
                <li>• Single Player</li>
                <li>• Múltiplas Dificuldades</li>
                <li>• Estatísticas</li>
                <li>• Progresso</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 lg:mt-8 pt-6 lg:pt-8 text-center text-xs lg:text-sm text-gray-400">
            <p>&copy; 2025 Greaclos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
