import React, { useState, useEffect } from "react";
import { PlayingCard, generateDeck, shuffleDeck, type Card } from "./shared";
import { RotateCcw, AlertTriangle, Trophy, Clock } from "lucide-react";

interface KempsGameState {
  playerHand: Card[];
  aiHand: Card[];
  tableCards: Card[];
  deck: Card[];
  gameStatus: "playing" | "won" | "cut" | "waiting";
  currentTurn: "player" | "ai";
  score: number;
  aiScore: number;
  targetScore: number;
  countdown: number;
  lastAction: string;
  selectedTableCards: Card[];
  selectedHandCards: Card[];
  aiThinking: boolean;
}

const KempsGame: React.FC = () => {
  const [gameState, setGameState] = useState<KempsGameState>({
    playerHand: [],
    aiHand: [],
    tableCards: [],
    deck: [],
    gameStatus: "waiting",
    currentTurn: "player",
    score: 0,
    aiScore: 0,
    targetScore: 3,
    countdown: 0,
    lastAction: "",
    selectedTableCards: [],
    selectedHandCards: [],
    aiThinking: false,
  });

  const [gameMode, setGameMode] = useState<"3points" | "5points">("3points");
  const [aiDifficulty, setAiDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  // Inicializar jogo
  const initializeGame = () => {
    const deck = shuffleDeck(generateDeck({ excludeJokers: true }));
    const playerHand = deck.splice(0, 4);
    const aiHand = deck.splice(0, 4);
    const tableCards = deck.splice(0, 4);

    setGameState((prev) => ({
      ...prev,
      playerHand,
      aiHand,
      tableCards,
      deck,
      gameStatus: "playing",
      currentTurn: "player",
      score: 0,
      aiScore: 0,
      countdown: 0,
      lastAction: "Jogo iniciado! Sua vez!",
      selectedTableCards: [],
      selectedHandCards: [],
      aiThinking: false,
    }));
  };

  // Verificar se a IA tem 4 cartas iguais
  const checkAIKemps = (): boolean => {
    const values = gameState.aiHand.map((card) => card.rank);
    return values.every((value) => value === values[0]);
  };

  // IA faz sua jogada
  const aiPlay = () => {
    if (gameState.currentTurn !== "ai" || gameState.gameStatus !== "playing")
      return;

    setGameState((prev) => ({ ...prev, aiThinking: true }));

    setTimeout(() => {
      // Verificar se a IA pode gritar Kem's
      if (checkAIKemps()) {
        setGameState((prev) => ({
          ...prev,
          gameStatus: "won",
          aiScore: prev.aiScore + 1,
          lastAction: "A IA gritou KEM'S! Ponto para ela!",
          aiThinking: false,
        }));
        return;
      }

      // IA faz troca estratégica
      const aiMove = calculateAIMove();
      if (aiMove) {
        executeAIMove(aiMove);
      } else {
        // IA passa a vez
        setGameState((prev) => ({
          ...prev,
          currentTurn: "player",
          lastAction: "IA passou a vez. Sua vez!",
          aiThinking: false,
        }));
      }
    }, 1000 + Math.random() * 2000); // Delay variável para parecer mais humano
  };

  // Calcular melhor jogada da IA
  const calculateAIMove = () => {
    const { aiHand, tableCards, aiDifficulty } = gameState;

    // Estratégia baseada na dificuldade
    switch (aiDifficulty) {
      case "easy":
        return calculateEasyMove(aiHand, tableCards);
      case "medium":
        return calculateMediumMove(aiHand, tableCards);
      case "hard":
        return calculateHardMove(aiHand, tableCards);
      default:
        return calculateMediumMove(aiHand, tableCards);
    }
  };

  // Movimento fácil (aleatório)
  const calculateEasyMove = (aiHand: Card[], tableCards: Card[]) => {
    if (Math.random() < 0.3) return null; // 30% chance de passar

    const numCards = Math.floor(Math.random() * 3) + 1; // 1-3 cartas
    const handCards = aiHand.slice(0, numCards);
    const selectedTableCards = tableCards.slice(0, numCards);

    return { handCards, tableCards: selectedTableCards };
  };

  // Movimento médio (estratégico básico)
  const calculateMediumMove = (aiHand: Card[], tableCards: Card[]) => {
    // Tentar formar pares ou trincas
    const handGroups = groupCardsByRank(aiHand);
    const tableGroups = groupCardsByRank(tableCards);

    // Procurar por cartas que formem grupos
    for (const [rank, handCount] of Object.entries(handGroups)) {
      if (handCount >= 2) {
        const tableCount = tableGroups[rank] || 0;
        if (tableCount > 0) {
          const numToTake = Math.min(tableCount, 4 - handCount);
          const handCards = aiHand
            .filter((card) => card.rank === rank)
            .slice(0, numToTake);
          const tableCards = tableCards
            .filter((card) => card.rank === rank)
            .slice(0, numToTake);

          return { handCards, tableCards };
        }
      }
    }

    // Se não encontrar estratégia, fazer movimento aleatório
    return calculateEasyMove(aiHand, tableCards);
  };

  // Movimento difícil (estratégico avançado)
  const calculateHardMove = (aiHand: Card[], tableCards: Card[]) => {
    // Estratégia similar ao médio, mas mais inteligente
    const move = calculateMediumMove(aiHand, tableCards);

    // Adicionar lógica adicional para dificuldade hard
    if (move && Math.random() < 0.8) {
      // 80% chance de fazer movimento inteligente
      return move;
    }

    return null; // Passar a vez se não encontrar boa jogada
  };

  // Agrupar cartas por valor
  const groupCardsByRank = (cards: Card[]) => {
    const groups: { [key: string]: number } = {};
    cards.forEach((card) => {
      groups[card.rank] = (groups[card.rank] || 0) + 1;
    });
    return groups;
  };

  // Executar movimento da IA
  const executeAIMove = (move: { handCards: Card[]; tableCards: Card[] }) => {
    const { handCards, tableCards: aiTableCards } = move;

    const newAIHand = [...gameState.aiHand];
    const newTableCards = [...gameState.tableCards];

    // Remover cartas selecionadas da mão da IA
    handCards.forEach((card) => {
      const index = newAIHand.findIndex((c) => c.id === card.id);
      if (index !== -1) newAIHand.splice(index, 1);
    });

    // Adicionar cartas da mesa à mão da IA
    newAIHand.push(...aiTableCards);

    // Remover cartas da mesa
    aiTableCards.forEach((card) => {
      const index = newTableCards.findIndex((c) => c.id === card.id);
      if (index !== -1) newTableCards.splice(index, 1);
    });

    // Adicionar cartas descartadas à mesa
    newTableCards.push(...handCards);

    // Iniciar contagem regressiva
    const newCountdown = aiTableCards.length === 1 ? 5 : 8;

    setGameState((prev) => ({
      ...prev,
      aiHand: newAIHand,
      tableCards: newTableCards,
      currentTurn: "player",
      countdown: newCountdown,
      lastAction: `IA trocou ${aiTableCards.length} carta(s). Contagem: ${newCountdown}. Sua vez!`,
      aiThinking: false,
    }));
  };

  // Verificar se o jogador tem 4 cartas iguais
  const checkForKemps = (): boolean => {
    const values = gameState.playerHand.map((card) => card.rank);
    return values.every((value) => value === values[0]);
  };

  // Gritar Kem's
  const shoutKemps = () => {
    if (gameState.currentTurn !== "player") {
      setGameState((prev) => ({
        ...prev,
        lastAction: "Não é sua vez!",
      }));
      return;
    }

    if (checkForKemps()) {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "won",
        score: prev.score + 1,
        lastAction: "KEM'S! Ponto para você!",
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "cut",
        lastAction: "Você não tem 4 cartas iguais! Ponto para o oponente!",
      }));
    }
  };

  // Gritar Corta
  const shoutCorta = () => {
    if (gameState.currentTurn !== "player") {
      setGameState((prev) => ({
        ...prev,
        lastAction: "Não é sua vez!",
      }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      gameStatus: "cut",
      lastAction: "CORTA! Você acusou a IA!",
    }));
  };

  // Selecionar carta da mesa
  const selectTableCard = (card: Card) => {
    if (gameState.currentTurn !== "player") {
      setGameState((prev) => ({
        ...prev,
        lastAction: "Não é sua vez!",
      }));
      return;
    }

    // Adicionar carta à mão automaticamente
    const newPlayerHand = [...gameState.playerHand, card];
    const newTableCards = gameState.tableCards.filter((c) => c.id !== card.id);

    // Iniciar contagem regressiva para descarte
    const newCountdown = 8; // 8 segundos para descartar

    setGameState((prev) => ({
      ...prev,
      playerHand: newPlayerHand,
      tableCards: newTableCards,
      countdown: newCountdown,
      lastAction: `Você pegou ${card.displayName}. Agora descarte ${newCountdown} carta(s) em ${newCountdown} segundos!`,
      selectedTableCards: [],
      selectedHandCards: [],
    }));
  };

  // Descartar carta da mão (chamado automaticamente quando clica em carta da mão)
  const discardCard = (card: Card) => {
    if (gameState.countdown <= 0) return;

    const newPlayerHand = gameState.playerHand.filter((c) => c.id !== card.id);
    const newTableCards = [...gameState.tableCards, card];
    const newCountdown = gameState.countdown + 5; // Adicionar 5 segundos extras

    setGameState((prev) => ({
      ...prev,
      playerHand: newPlayerHand,
      tableCards: newTableCards,
      countdown: newCountdown,
      lastAction: `Você descartou ${card.displayName}. +5 segundos! Restam ${newCountdown} segundos para descartar mais cartas.`,
    }));

    // Se descartou todas as cartas necessárias, passar para IA
    if (newPlayerHand.length === 4) {
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          currentTurn: "ai",
          countdown: 0,
          lastAction: "Vez da IA!",
        }));

        // IA joga após o jogador
        setTimeout(() => {
          aiPlay();
        }, 500);
      }, 1000);
    }
  };

  // Selecionar carta da mão (agora para descartar)
  const selectHandCard = (card: Card) => {
    // Permitir descarte mesmo após tempo esgotar se ainda tiver mais de 4 cartas
    if (gameState.countdown <= 0 && gameState.playerHand.length <= 4) return;

    // Descartar a carta automaticamente
    discardCard(card);
  };

  // Contagem regressiva
  useEffect(() => {
    if (gameState.countdown > 0 && gameState.gameStatus === "playing") {
      const timer = setTimeout(() => {
        setGameState((prev) => {
          if (prev.countdown === 1) {
            // Se for contagem de descarte e jogador tem mais de 4 cartas
            if (prev.playerHand.length > 4) {
              // Jogador não descartou todas as cartas - NÃO avançar turno
              return {
                ...prev,
                countdown: 0,
                lastAction:
                  "⏰ TEMPO ESGOTADO! Você ainda tem mais de 4 cartas. Clique nas cartas da sua mão para descartá-las!",
              };
            } else {
              // Jogador descartou todas as cartas, passar para IA
              return {
                ...prev,
                countdown: 0,
                currentTurn: "ai",
                lastAction: "Vez da IA!",
              };
            }
          }

          return {
            ...prev,
            countdown: prev.countdown - 1,
          };
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.countdown, gameState.gameStatus]);

  // Próximo jogo
  const nextGame = () => {
    const playerWon = gameState.score >= (gameMode === "3points" ? 3 : 5);
    const aiWon = gameState.aiScore >= (gameMode === "3points" ? 3 : 5);

    if (playerWon || aiWon) {
      // Jogo finalizado
      const winner = playerWon ? "Você" : "A IA";
      setGameState((prev) => ({
        ...prev,
        gameStatus: "waiting",
        score: 0,
        aiScore: 0,
        lastAction: `Jogo finalizado! ${winner} venceu! Clique em "Novo Jogo" para recomeçar.`,
      }));
    } else {
      // Próximo round
      initializeGame();
    }
  };

  // Novo jogo
  const newGame = () => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: "waiting",
      score: 0,
      aiScore: 0,
      lastAction: "",
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Configurações do Jogo */}
      {gameState.gameStatus === "waiting" && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Configurar Jogo
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Modo de Jogo */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Modo de Jogo
              </h3>
              <div className="flex justify-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="3points"
                    checked={gameMode === "3points"}
                    onChange={(e) =>
                      setGameMode(e.target.value as "3points" | "5points")
                    }
                    className="text-blue-600"
                  />
                  <span>Até 3 pontos</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="5points"
                    checked={gameMode === "5points"}
                    onChange={(e) =>
                      setGameMode(e.target.value as "3points" | "5points")
                    }
                    className="text-blue-600"
                  />
                  <span>Até 5 pontos</span>
                </label>
              </div>
            </div>

            {/* Dificuldade da IA */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Dificuldade da IA
              </h3>
              <div className="flex justify-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="easy"
                    checked={aiDifficulty === "easy"}
                    onChange={(e) =>
                      setAiDifficulty(
                        e.target.value as "easy" | "medium" | "hard"
                      )
                    }
                    className="text-blue-600"
                  />
                  <span>Fácil</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="medium"
                    checked={aiDifficulty === "medium"}
                    onChange={(e) =>
                      setAiDifficulty(
                        e.target.value as "easy" | "medium" | "hard"
                      )
                    }
                    className="text-blue-600"
                  />
                  <span>Médio</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="hard"
                    checked={aiDifficulty === "hard"}
                    onChange={(e) =>
                      setAiDifficulty(
                        e.target.value as "easy" | "medium" | "hard"
                      )
                    }
                    className="text-blue-600"
                  />
                  <span>Difícil</span>
                </label>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={initializeGame}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Iniciar Jogo
            </button>
          </div>
        </div>
      )}

      {/* Status do Jogo */}
      {gameState.gameStatus !== "waiting" && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">Você</div>
                <div className="text-2xl font-bold text-gray-900">
                  {gameState.score} / {gameMode === "3points" ? 3 : 5}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">IA</div>
                <div className="text-2xl font-bold text-gray-900">
                  {gameState.aiScore} / {gameMode === "3points" ? 3 : 5}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {gameState.currentTurn === "ai" && (
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Vez da IA</span>
                </div>
              )}
              {gameState.countdown > 0 && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-bold">
                    {gameState.countdown}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-gray-600 mb-4">
            {gameState.lastAction}
          </div>

          {/* Botões de Ação */}
          {gameState.gameStatus === "playing" && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={shoutKemps}
                disabled={gameState.currentTurn !== "player"}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold"
              >
                KEM'S!
              </button>

              <button
                onClick={shoutCorta}
                disabled={gameState.currentTurn !== "player"}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold"
              >
                CORTA!
              </button>
            </div>
          )}

          {/* Resultado */}
          {gameState.gameStatus === "won" && (
            <div className="text-center text-green-600 mb-4">
              <Trophy className="w-12 h-12 mx-auto mb-2" />
              <div className="text-2xl font-bold">VITÓRIA!</div>
              <div className="text-lg">Você completou 4 cartas iguais!</div>
            </div>
          )}

          {gameState.gameStatus === "cut" && (
            <div className="text-center text-red-600 mb-4">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
              <div className="text-2xl font-bold">CORTA!</div>
              <div className="text-lg">Jogo interrompido!</div>
            </div>
          )}

          {/* Botões de Controle */}
          {(gameState.gameStatus === "won" ||
            gameState.gameStatus === "cut") && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={nextGame}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {gameState.score >= (gameMode === "3points" ? 3 : 5)
                  ? "Novo Jogo"
                  : "Próximo Round"}
              </button>

              <button
                onClick={newGame}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Menu Principal
              </button>
            </div>
          )}
        </div>
      )}

      {/* Área do Jogo */}
      {gameState.gameStatus === "playing" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mão do Jogador */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Sua Mão ({gameState.playerHand.length} cartas)
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {gameState.playerHand.map((card) => (
                <div
                  key={card.id}
                  onClick={() => selectHandCard(card)}
                  className={`cursor-pointer transition-all duration-200 ${
                    gameState.selectedHandCards.some((c) => c.id === card.id)
                      ? "ring-4 ring-blue-500 scale-110"
                      : "hover:scale-105"
                  }`}
                >
                  <PlayingCard
                    card={card}
                    size="lg"
                    isSelected={gameState.selectedHandCards.some(
                      (c) => c.id === card.id
                    )}
                  />
                </div>
              ))}
            </div>

            {gameState.countdown > 0 && gameState.playerHand.length > 4 && (
              <div className="mt-4 text-center text-sm text-orange-600 font-medium">
                ⏰ Descartar {gameState.playerHand.length - 4} carta(s) em{" "}
                {gameState.countdown} segundos!
              </div>
            )}

            {gameState.currentTurn === "player" &&
              gameState.countdown === 0 &&
              gameState.playerHand.length > 4 && (
                <div className="mt-4 text-center text-sm text-red-600 font-medium">
                  ⚠️ TEMPO ESGOTADO! Você ainda tem{" "}
                  {gameState.playerHand.length - 4} carta(s) para descartar!
                </div>
              )}

            {gameState.currentTurn === "player" &&
              gameState.countdown === 0 &&
              gameState.playerHand.length === 4 && (
                <div className="mt-4 text-center text-sm text-blue-600 font-medium">
                  🎯 Clique em uma carta da mesa para pegá-la
                </div>
              )}
          </div>

          {/* Cartas da Mesa */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Mesa ({gameState.tableCards.length} cartas)
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {gameState.tableCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => selectTableCard(card)}
                  className={`cursor-pointer transition-all duration-200 ${
                    gameState.selectedTableCards.some((c) => c.id === card.id)
                      ? "ring-4 ring-green-500 scale-110"
                      : "hover:scale-105"
                  }`}
                >
                  <PlayingCard
                    card={card}
                    size="lg"
                    isSelected={gameState.selectedTableCards.some(
                      (c) => c.id === card.id
                    )}
                  />
                </div>
              ))}
            </div>

            {gameState.selectedTableCards.length > 0 && (
              <div className="mt-4 text-center text-sm text-gray-600">
                {gameState.selectedTableCards.length} carta(s) selecionada(s)
              </div>
            )}
          </div>

          {/* Mão da IA */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center justify-center space-x-2">
              <span>IA ({gameState.aiHand.length} cartas)</span>
              {gameState.aiThinking && (
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {gameState.aiHand.map((card) => (
                <div key={card.id}>
                  <PlayingCard card={card} size="lg" isFaceDown={true} />
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              {gameState.currentTurn === "ai" ? "Vez da IA" : "Sua vez"}
            </div>
          </div>
        </div>
      )}

      {/* Regras do Jogo */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Como Jogar Kem's
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 Objetivo</h4>
            <p>
              Formar 4 cartas do mesmo valor e gritar "Kem's" antes que a IA
              grite "Corta"!
            </p>

            <h4 className="font-semibold text-gray-800 mb-2 mt-4">
              🔄 Como Jogar
            </h4>
            <p>
              <strong>1.</strong> Clique em uma carta da mesa para pegá-la
              automaticamente
              <br />
              <strong>2.</strong> Você tem 8 segundos para descartar o mesmo
              número de cartas
              <br />
              <strong>3.</strong> Clique nas cartas da sua mão para descartá-las
              <br />
              <strong>4.</strong> <strong>+5 segundos</strong> cada vez que
              descartar uma carta
              <br />
              <strong>5.</strong> <strong>Não pode avançar turno</strong> até
              descartar todas as cartas
            </p>

            <h4 className="font-semibold text-gray-800 mb-2 mt-4">⚠️ Regras</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Não é permitido pegar 3 cartas iguais</li>
              <li>Após cada troca, inicia contagem regressiva</li>
              <li>
                Quando a contagem chega a 0, as cartas da mesa são trocadas
              </li>
              <li>Jogadores alternam turnos (Você → IA → Você...)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎮 Ações</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Trocar Cartas:</strong> Troca cartas selecionadas
              </li>
              <li>
                <strong>KEM'S:</strong> Grita quando tem 4 cartas iguais
              </li>
              <li>
                <strong>CORTA:</strong> Acusa a IA
              </li>
            </ul>

            <h4 className="font-semibold text-gray-800 mb-2 mt-4">
              🏆 Pontuação
            </h4>
            <p>
              Jogo até {gameMode === "3points" ? 3 : 5} pontos. Quem fizer
              primeiro vence!
            </p>

            <h4 className="font-semibold text-gray-800 mb-2 mt-4">🤖 IA</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Fácil:</strong> Movimentos aleatórios
              </li>
              <li>
                <strong>Médio:</strong> Estratégia básica
              </li>
              <li>
                <strong>Difícil:</strong> Estratégia avançada
              </li>
            </ul>

            <h4 className="font-semibold text-gray-800 mb-2 mt-4">
              ⏱️ Contagem
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>1 carta: 5 segundos</li>
              <li>2+ cartas: 8 segundos</li>
              <li>
                <strong>+5 segundos</strong> cada vez que descartar uma carta
              </li>
              <li>
                <strong>Turno bloqueado</strong> até descartar todas as cartas
              </li>
              <li>Se ninguém pegar cartas: Mesa é trocada automaticamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KempsGame;
