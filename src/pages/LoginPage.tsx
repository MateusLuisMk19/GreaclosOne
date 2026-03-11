import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { GLIcon } from "../components/utils/shared";
import AnonymousLoginButton from "../components/auth/AnonymousLoginButton";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signIn(email, password);
      navigate("/games");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setError("Usuário não encontrado");
      } else if (error.code === "auth/wrong-password") {
        setError("Senha incorreta");
      } else if (error.code === "auth/invalid-email") {
        setError("Email inválido");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-0.5 rounded-full">
              <GLIcon className="w-14 h-14 text-white" />
            </div>
          </div>
          <h2
            className={`mt-6 text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Entrar na sua conta
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Ou{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              crie uma nova conta
            </Link>
          </p>
        </div>

        <form
          className={`mt-8 space-y-6 p-5 rounded-lg ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-gray-50"
          }`}
          onSubmit={handleSubmit}
        >
          {error && (
            <div
              className={`px-4 py-3 rounded-lg ${
                isDark
                  ? "bg-red-900/50 border border-red-700 text-red-300"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className={`h-5 w-5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                      : "border-gray-300 placeholder-gray-500 text-gray-900"
                  }`}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none relative block w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                      : "border-gray-300 placeholder-gray-500 text-gray-900"
                  }`}
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff
                      className={`h-5 w-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  ) : (
                    <Eye
                      className={`h-5 w-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${
                  isDark
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                ou
              </span>
            </div>
          </div>

          <AnonymousLoginButton />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
