import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  BarChart3,
  Target,
  Clock,
  Brain,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Sudoku from "../components/games/Sudoku";

import { GLIcon } from "../components/utils/shared";
import CardGameExample from "../components/games/CardGameExample";



const GameExamplePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 lg:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
          <Link
            to="/games"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Voltar aos Jogos</span>
          </Link>
        </div>

        <CardGameExample />
      </div>
    </div>
  );
};

export default GameExamplePage;
