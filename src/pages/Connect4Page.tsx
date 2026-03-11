import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, BarChart3, Target, ChevronDown, ChevronUp } from 'lucide-react';
import Connect4 from '../components/games/Connect4';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  bestScore: number;
  averageMoves: number;
  lastPlayed: string;
}

const Connect4Page: React.FC = () => {
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDrawn: 0,
    bestScore: 0,
    averageMoves: 0,
    lastPlayed: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!auth.currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.connect4Stats) {
          setStats(userData.connect4Stats);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStats = async (winner: 'X' | 'O' | null, moves: number) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      let newStats = { ...stats };
      newStats.gamesPlayed += 1;
      newStats.lastPlayed = new Date().toISOString();
      
      if (winner === 'X') {
        newStats.gamesWon += 1;
        if (moves < newStats.bestScore || newStats.bestScore === 0) {
          newStats.bestScore = moves;
        }
      } else if (winner === 'O') {
        newStats.gamesLost += 1;
      } else {
        newStats.gamesDrawn += 1;
      }
      
      // Calcular média de jogadas
      const totalMoves = (newStats.averageMoves * (newStats.gamesPlayed - 1)) + moves;
      newStats.averageMoves = Math.round(totalMoves / newStats.gamesPlayed);
      
      setStats(newStats);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          connect4Stats: newStats
        });
      } else {
        await setDoc(userRef, {
          connect4Stats: newStats
        });
      }
    } catch (error) {
      console.error('Erro ao salvar estatísticas:', error);
    }
  };

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">Conecta 4</h1>
        </div>

        {/* Layout responsivo: Jogo primeiro em mobile, sidebar em desktop */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Jogo - Sempre em destaque */}
          <div className="lg:col-span-2 order-1">
            <Connect4 onGameEnd={saveStats} />
          </div>

          {/* Estatísticas e Dicas - Abaixo do jogo em mobile, sidebar em desktop */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6 order-2 lg:order-2">
            <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Estatísticas
              </h2>
              
              {isLoading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-3 lg:space-y-4">
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="text-center p-2 lg:p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl lg:text-2xl font-bold text-blue-600">{stats.gamesPlayed}</div>
                      <div className="text-xs lg:text-sm text-gray-600">Jogos</div>
                    </div>
                    <div className="text-center p-2 lg:p-3 bg-green-50 rounded-lg">
                      <div className="text-xl lg:text-2xl font-bold text-green-600">{stats.gamesWon}</div>
                      <div className="text-xs lg:text-sm text-gray-600">Vitórias</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="text-center p-2 lg:p-3 bg-red-50 rounded-lg">
                      <div className="text-xl lg:text-2xl font-bold text-red-600">{stats.gamesLost}</div>
                      <div className="text-xs lg:text-sm text-gray-600">Derrotas</div>
                    </div>
                    <div className="text-center p-2 lg:p-3 bg-yellow-50 rounded-lg">
                      <div className="text-xl lg:text-2xl font-bold text-yellow-600">{stats.gamesDrawn}</div>
                      <div className="text-xs lg:text-sm text-gray-600">Empates</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 lg:pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs lg:text-sm text-gray-600">Taxa de Vitória</span>
                      <span className="text-xs lg:text-sm font-semibold text-gray-900">{winRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${winRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {stats.bestScore > 0 && (
                    <div className="text-center p-2 lg:p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm lg:text-lg font-semibold text-purple-600">
                        Melhor: {stats.bestScore} jogadas
                      </div>
                    </div>
                  )}
                  
                  {stats.averageMoves > 0 && (
                    <div className="text-center p-2 lg:p-3 bg-indigo-50 rounded-lg">
                      <div className="text-sm lg:text-lg font-semibold text-indigo-600">
                        Média: {stats.averageMoves} jogadas
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dicas - Botão expansível */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-full p-4 lg:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Dicas
                </h3>
                {showTips ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {showTips && (
                <div className="px-4 lg:px-6 pb-4 lg:pb-6 border-t border-gray-100">
                  <ul className="text-xs lg:text-sm text-gray-600 space-y-2">
                    <li>• Bloqueie as jogadas do computador</li>
                    <li>• Use o centro para ter mais opções</li>
                    <li>• Crie múltiplas ameaças</li>
                    <li>• Observe os padrões do computador</li>
                    <li>• Comece com dificuldade fácil</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect4Page; 