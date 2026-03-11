import React from "react";
import { Link } from "react-router-dom";
import { Brain, Home, Gamepad2 } from "lucide-react";
import { GLIcon } from "../components/utils/shared";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <GLIcon className="w-16 h-16 text-red-600" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Voltar ao Início</span>
          </Link>

          <Link
            to="/games"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Ver Jogos</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
