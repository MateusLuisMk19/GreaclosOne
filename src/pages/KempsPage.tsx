import React from "react";
import KempsGame from "../components/games/KempsGame";

const KempsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kem's</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Um jogo de cartas emocionante onde o objetivo é formar 4 cartas do
            mesmo valor e gritar "Kem's" antes que alguém grite "Corta"!
          </p>
        </div>

        <KempsGame />
      </div>
    </div>
  );
};

export default KempsPage;
