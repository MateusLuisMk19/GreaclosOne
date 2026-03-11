import React from "react";
import { User } from "lucide-react";
import { useAnonymousLogin } from "../../hooks/useAnonymousLogin";

const AnonymousLoginButton: React.FC = () => {
  const { handleAnonymousLogin, isLoading } = useAnonymousLogin();

  return (
    <button
      type="button"
      onClick={handleAnonymousLogin}
      disabled={isLoading}
      className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base"
    >
      <User className="w-4 h-4" />
      <span>{isLoading ? "Entrando..." : "Jogar como Visitante"}</span>
    </button>
  );
};

export default AnonymousLoginButton;
