import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Palette,
  Repeat,
  SkipForward,
  Layers,
  PlusSquare,
  Settings,
  AlertTriangle,
} from "lucide-react";

// =============================================================================
// I. TYPE DEFINITIONS
// =============================================================================

type CardColor = "RED" | "YELLOW" | "GREEN" | "BLUE" | "WILD";
type CardValue =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "SKIP"
  | "REVERSE"
  | "DRAW_TWO"
  | "WILD"
  | "WILD_DRAW_FOUR";

interface Card {
  id: string;
  color: CardColor;
  value: CardValue;
}

interface Player {
  id: string;
  name: string;
  cardCount: number;
  unoAnnounced: boolean; // NOVO: Rastreia se o jogador anunciou UNO
}

type GameStatus = "WAITING" | "IN_PROGRESS" | "FINISHED" | "WAITING_FOR_COLOR" | "JUST_DREW_CARD"; // NOVO: JUST_DREW_CARD
type GameDirection = "CLOCKWISE" | "COUNTER_CLOCKWISE";

interface PublicGameState {
  gameStatus: GameStatus;
  players: Record<string, Player>;
  playerOrder: string[];
  currentPlayerId: string;
  gameDirection: GameDirection;
  discardPile: Card[];
  activeColor: Exclude<CardColor, "WILD">;
  winnerId: string | null;
  drawPileCardCount: number;
  actionMessage: string | null;
}

interface PrivateGameState {
  drawPile: Card[];
  playerHands: Record<string, Card[]>;
}

interface GameState {
  publicState: PublicGameState;
  privateState: PrivateGameState;
}

interface GameConfig {
  numOpponents: number; // 1 to 7
  aiDelayMs: number;
}

// =============================================================================
// II. GAME LOGIC IMPLEMENTATION
// =============================================================================

const COLORS: Exclude<CardColor, "WILD">[] = ["RED", "YELLOW", "GREEN", "BLUE"];
const ACTION_VALUES: CardValue[] = ["SKIP", "REVERSE", "DRAW_TWO"];
const HUMAN_PLAYER_ID = "player-1";
const CARD_PENALTY = 2; // Penalidade padrão por não anunciar UNO

function createDeck(): Card[] {
  const deck: Card[] = [];
  let idCounter = 0;

  COLORS.forEach((color) => {
    deck.push({ id: `card-${idCounter++}`, color, value: "0" as CardValue });
    for (let i = 1; i <= 9; i++) {
      deck.push({
        id: `card-${idCounter++}`,
        color,
        value: String(i) as CardValue,
      });
      deck.push({
        id: `card-${idCounter++}`,
        color,
        value: String(i) as CardValue,
      });
    }
    ACTION_VALUES.forEach((value) => {
      deck.push({ id: `card-${idCounter++}`, color, value });
      deck.push({ id: `card-${idCounter++}`, color, value });
    });
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ id: `card-${idCounter++}`, color: "WILD", value: "WILD" });
    deck.push({
      id: `card-${idCounter++}`,
      color: "WILD",
      value: "WILD_DRAW_FOUR",
    });
  }
  return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getNextPlayerId(gameState: GameState): string {
  const { currentPlayerId, playerOrder, gameDirection } = gameState.publicState;
  const currentIndex = playerOrder.indexOf(currentPlayerId);
  const increment = gameDirection === "CLOCKWISE" ? 1 : -1;
  let nextIndex =
    (currentIndex + increment + playerOrder.length) % playerOrder.length;
  return playerOrder[nextIndex];
}

function dealCards(gameState: GameState, numCards: number): GameState {
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  for (let i = 0; i < numCards; i++) {
    for (const playerId of newState.publicState.playerOrder) {
      if (newState.privateState.drawPile.length > 0) {
        const card = newState.privateState.drawPile.pop()!;
        newState.privateState.playerHands[playerId].push(card);
      }
    }
  }
  for (const playerId in newState.publicState.players) {
    newState.publicState.players[playerId].cardCount =
      newState.privateState.playerHands[playerId].length;
  }
  newState.publicState.drawPileCardCount =
    newState.privateState.drawPile.length;
  return newState;
}

function drawCardsFromPile(gameState: GameState, playerId: string, count: number): GameState {
    let newState = JSON.parse(JSON.stringify(gameState)) as GameState;
    let cardsToDraw = count;
    let drawnCards: Card[] = [];

    // Tenta reembaralhar o descarte (exceto a carta do topo) se o baralho de compra estiver vazio
    if (newState.privateState.drawPile.length === 0) {
        const newDrawPile = newState.publicState.discardPile.slice(0, -1);
        newState.privateState.drawPile = shuffleDeck(newDrawPile);
        newState.publicState.discardPile = [newState.publicState.discardPile.slice(-1)[0]];
        if (newDrawPile.length > 0) {
            newState.publicState.actionMessage = `Baralho reembaralhado!`;
        }
    }

    while(cardsToDraw > 0 && newState.privateState.drawPile.length > 0) {
        drawnCards.push(newState.privateState.drawPile.pop()!);
        cardsToDraw--;
    }

    newState.privateState.playerHands[playerId].push(...drawnCards);
    newState.publicState.players[playerId].cardCount += drawnCards.length;
    newState.publicState.drawPileCardCount = newState.privateState.drawPile.length;

    return newState;
}

function handleSpecialCard(
  gameState: GameState,
  playedCard: Card,
  isFirstCard: boolean = false
): GameState {
  let newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  const { players, playerOrder } = newState.publicState;
  const nextPlayerId = getNextPlayerId(newState);

  switch (playedCard.value) {
    case "SKIP":
      newState.publicState.currentPlayerId = getNextPlayerId(newState);
      newState.publicState.actionMessage = `${players[nextPlayerId].name} foi pulado!`;
      break;

    case "REVERSE":
      newState.publicState.gameDirection =
        newState.publicState.gameDirection === "CLOCKWISE"
          ? "COUNTER_CLOCKWISE"
          : "CLOCKWISE";
      // Em jogos de 2 jogadores, inverte e pula o outro jogador
      if (playerOrder.length === 2) {
        newState.publicState.currentPlayerId = getNextPlayerId(newState);
      }
      newState.publicState.actionMessage = `Direção do jogo invertida!`;
      break;

    case "DRAW_TWO": {
      const victimPlayerId = isFirstCard
        ? newState.publicState.currentPlayerId
        : nextPlayerId;
      
      newState = drawCardsFromPile(newState, victimPlayerId, 2);

      newState.publicState.currentPlayerId = isFirstCard
        ? newState.publicState.currentPlayerId
        : getNextPlayerId(newState);
      newState.publicState.actionMessage = `${players[victimPlayerId].name} compra 2 e é pulado!`;
      break;
    }
    case "WILD_DRAW_FOUR": {
      const victimPlayerId = isFirstCard
        ? newState.publicState.currentPlayerId
        : nextPlayerId;

      newState = drawCardsFromPile(newState, victimPlayerId, 4);

      newState.publicState.currentPlayerId = isFirstCard
        ? newState.publicState.currentPlayerId
        : getNextPlayerId(newState);
      newState.publicState.actionMessage = `${players[victimPlayerId].name} compra 4 e é pulado!`;
      break;
    }
    default:
        // Se for uma carta normal ou WILD normal, apenas avança o turno
        // O avanço do turno já é feito em playCard/drawCard, então nada aqui.
        break;
  }
  
  return newState;
}

function applyUnoPenalty(gameState: GameState, playerId: string): GameState {
    let newState = JSON.parse(JSON.stringify(gameState)) as GameState;
    const player = newState.publicState.players[playerId];

    if (player.cardCount === 1 && !player.unoAnnounced) {
        newState = drawCardsFromPile(newState, playerId, CARD_PENALTY);
        newState.publicState.actionMessage = `${player.name} não anunciou UNO! Penalidade: +${CARD_PENALTY} cartas.`;
        // O jogador deve ter a flag unoAnnounced redefinida, pois já não tem 1 carta.
        player.unoAnnounced = false;
    } else if (player.cardCount > 1) {
        // Se o jogador não tem mais 1 carta, reseta a flag
        player.unoAnnounced = false;
    }

    return newState;
}

function checkForWinner(gameState: GameState): GameState {
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  for (const playerId in newState.publicState.players) {
    if (newState.publicState.players[playerId].cardCount === 0) {
      newState.publicState.winnerId = playerId;
      newState.publicState.gameStatus = "FINISHED";
      newState.publicState.actionMessage = `${newState.publicState.players[playerId].name} venceu!`;
      return newState;
    }
  }
  return newState;
}

function createInitialGameState(playerIds: string[]): GameState {
  const fullDeck = createDeck();
  let drawPile = shuffleDeck(fullDeck);

  const players: Record<string, Player> = {};
  const playerHands: Record<string, Card[]> = {};
  playerIds.forEach((id, index) => {
    players[id] = {
      id,
      name: id === HUMAN_PLAYER_ID ? "Você" : `IA ${index}`,
      cardCount: 0,
      unoAnnounced: false, // Inicializa como false
    };
    playerHands[id] = [];
  });

  let gameState: GameState = {
    publicState: {
      gameStatus: "IN_PROGRESS",
      players,
      playerOrder: playerIds,
      currentPlayerId: playerIds[0],
      gameDirection: "CLOCKWISE",
      discardPile: [],
      activeColor: "RED",
      winnerId: null,
      drawPileCardCount: 0,
      actionMessage: null,
    },
    privateState: {
      drawPile,
      playerHands,
    },
  };

  gameState = dealCards(gameState, 7);

  let firstCard: Card;
  do {
    if (gameState.privateState.drawPile.length < 2) {
      gameState.privateState.drawPile.push(...shuffleDeck(createDeck()));
    }
    firstCard = gameState.privateState.drawPile.pop()!;
    gameState.publicState.discardPile.push(firstCard);
  } while (firstCard.color === "WILD");

  gameState.publicState.activeColor = firstCard.color as Exclude<
    CardColor,
    "WILD"
  >;
  gameState.publicState.drawPileCardCount =
    gameState.privateState.drawPile.length;
  gameState.publicState.actionMessage = `${players[playerIds[0]].name} começa!`;

  gameState = handleSpecialCard(gameState, firstCard, true);

  return gameState;
}

function validateMove(gameState: GameState, card: Card): boolean {
  const topCard =
    gameState.publicState.discardPile[
      gameState.publicState.discardPile.length - 1
    ];
  const { activeColor } = gameState.publicState;

  if (card.color === "WILD") return true;
  if (card.color === activeColor) return true;
  if (card.value === topCard.value && topCard.color !== "WILD") return true;

  if (card.value === "WILD_DRAW_FOUR") {
    const currentPlayerId = gameState.publicState.currentPlayerId;
    const playerHand = gameState.privateState.playerHands[currentPlayerId];
    const hasMatchingColorCard = playerHand.some(
      (c) => c.color === activeColor
    );
    // Para o jogador humano, isso é apenas uma regra de validação.
    // O jogo real permite que se jogue +4 mesmo tendo uma cor, mas o oponente pode desafiar.
    // Aqui, vamos manter a regra mais rigorosa para simplificar: só joga se não puder jogar outra carta.
    return !hasMatchingColorCard; 
  }
  return false;
}

function drawCard(gameState: GameState, playerId: string): GameState {
  let newState = JSON.parse(JSON.stringify(gameState)) as GameState;

  // Aplica a lógica de compra (incluindo reembaralhamento)
  newState = drawCardsFromPile(newState, playerId, 1);
  const drawnCard = newState.privateState.playerHands[playerId].slice(-1)[0];
  
  if (!drawnCard) {
    newState.publicState.actionMessage = `Sem cartas para comprar!`;
    newState.publicState.currentPlayerId = getNextPlayerId(newState);
    return newState;
  }
  
  newState.publicState.actionMessage = `${newState.publicState.players[playerId].name} comprou uma carta.`;

  // Se for o turno do humano, muda o status para permitir jogar a carta
  if (playerId === HUMAN_PLAYER_ID) {
    const canPlayDrawnCard = validateMove(newState, drawnCard);
    
    if (canPlayDrawnCard) {
        newState.publicState.gameStatus = 'JUST_DREW_CARD';
        newState.publicState.actionMessage += ` A carta comprada é jogável.`;
    } else {
        // Se não for jogável, passa o turno
        newState.publicState.currentPlayerId = getNextPlayerId(newState);
    }
  } else {
    // Se for IA e a carta não for jogável, ou se for jogável e ela for um WILD/Draw, 
    // a IA vai gerenciar seu turno no runAiTurn. Para simplificar aqui, passamos o turno.
    // Em um jogo mais complexo, a IA teria a chance de jogar a carta.
    // Aqui, a IA apenas compra e passa o turno.
    newState.publicState.currentPlayerId = getNextPlayerId(newState);
  }

  return newState;
}

function playCard(
  gameState: GameState,
  playerId: string,
  cardId: string,
  chosenColor?: Exclude<CardColor, "WILD">
): GameState {
  let newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  const player = newState.publicState.players[playerId];
  const hand = newState.privateState.playerHands[playerId];
  const cardIndex = hand.findIndex((c) => c.id === cardId);

  if (cardIndex === -1) return gameState;
  const card = hand[cardIndex];

  // Regra 1: Não permite jogar se o status for WAITING_FOR_COLOR
  if (newState.publicState.gameStatus === 'WAITING_FOR_COLOR') return gameState;

  // Regra 2: Se comprou e pode jogar, deve ser a carta recém-comprada
  if (newState.publicState.gameStatus === 'JUST_DREW_CARD') {
    const lastDrawnCard = hand.slice(-1)[0];
    if (cardId !== lastDrawnCard.id) {
        newState.publicState.actionMessage = `Você deve jogar a carta recém-comprada ou passar o turno!`;
        return newState;
    }
  }

  // Regra 3: Validação básica do movimento
  if (!validateMove(newState, card)) {
    newState.publicState.actionMessage = `Movimento inválido por ${player.name}!`;
    return newState;
  }

  // Joga a carta
  hand.splice(cardIndex, 1);
  newState.publicState.discardPile.push(card);
  player.cardCount--;
  player.unoAnnounced = false; // Se jogar, reseta o UNO, a menos que anuncie novamente ou fique com 0 cartas

  // Verifica UNO *ANTES* de aplicar a penalidade de não anunciar
  if (player.cardCount === 1 && !player.unoAnnounced) {
    // Aplica a penalidade por não ter anunciado UNO ANTES de jogar a penúltima carta
    newState = drawCardsFromPile(newState, playerId, CARD_PENALTY);
    newState.publicState.actionMessage = `${player.name} jogou uma carta, mas não anunciou UNO! Penalidade: +${CARD_PENALTY} cartas.`;
    player.unoAnnounced = false; // Resetada novamente
  }
  
  if (card.color === "WILD") {
    if (!chosenColor) {
      newState.publicState.actionMessage = `Carta WILD jogada por ${player.name}. Escolha de cor pendente.`;
      newState.publicState.gameStatus = "WAITING_FOR_COLOR";
      return newState;
    }
    newState.publicState.activeColor = chosenColor;
    newState.publicState.actionMessage = `${player.name} jogou um ${card.value} e escolheu ${chosenColor}.`;
  } else {
    newState.publicState.activeColor = card.color;
    newState.publicState.actionMessage = `${player.name} jogou um ${card.color} ${card.value}.`;
  }
  
  // Transição de Status
  newState.publicState.gameStatus = 'IN_PROGRESS';

  // Avança o turno (temporariamente, será reajustado por handleSpecialCard)
  newState.publicState.currentPlayerId = getNextPlayerId(newState);
  
  // Aplica efeitos de cartas especiais (SKIP, REVERSE, DRAW)
  newState = handleSpecialCard(newState, card);
  
  // Checa por vencedor (se a contagem de cartas for 0)
  newState = checkForWinner(newState);

  // Garante que a IA limpe o unoAnnounced se ainda tiver mais de 1 carta
  if (playerId !== HUMAN_PLAYER_ID && player.cardCount > 1) {
    player.unoAnnounced = false;
  }

  return newState;
}

// =============================================================================
// III. CONFIGURAÇÃO E ESTILOS (Mantido)
// =============================================================================

// ... (DEFAULT_CONFIG, COLOR_MAP, CARD_COLOR_MAP, cardBaseStyle, getCardIcon, getCardHTML, CardBack, GameSettings)

const DEFAULT_CONFIG: GameConfig = {
  numOpponents: 3,
  aiDelayMs: 1000,
};

const COLOR_MAP: Record<Exclude<CardColor, "WILD">, string> = {
  RED: "bg-red-500",
  GREEN: "bg-green-500",
  BLUE: "bg-blue-500",
  YELLOW: "bg-yellow-400",
};

const CARD_COLOR_MAP: Record<Exclude<CardColor, "WILD">, string> = {
  RED: "#ef4444",
  GREEN: "#22c55e",
  BLUE: "#3b82f6",
  YELLOW: "#eab308",
};

const cardBaseStyle: React.CSSProperties = {
  width: "100px",
  height: "160px",
  borderRadius: "12px",
  border: "2px solid rgba(255, 255, 255, 0.2)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "8px",
  fontWeight: 900,
  fontSize: "2.5rem",
  color: "white",
  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
  position: "relative",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
  transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out",
  cursor: "pointer",
  transform: "translateY(0) scale(1)",
};

function getCardIcon(value: CardValue) {
  switch (value) {
    case "SKIP":
      return <SkipForward size={30} />;
    case "REVERSE":
      return <Repeat size={30} />;
    case "DRAW_TWO":
      return "+2";
    case "WILD":
      return <Palette size={30} />;
    case "WILD_DRAW_FOUR":
      return "+4";
    default:
      return value;
  }
}

function getCardHTML(
  card: Card,
  isPlayable: boolean,
  onClick: () => void,
  isDrawnCard: boolean = false
): JSX.Element {
  const valueIcon = getCardIcon(card.value);
  const playableClass = isPlayable
    ? "cursor-pointer hover:transform hover:translate-y-[-10px] hover:scale-[1.05] hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
    : " cursor-not-allowed opacity-70";
  const drawnClass = isDrawnCard ? "border-4 border-yellow-400" : "";
  
  const cardColorStyle: React.CSSProperties =
    card.color === "WILD"
      ? {
          background:
            "linear-gradient(135deg, #ef4444 25%, #3b82f6 25%, #3b82f6 50%, #22c55e 50%, #22c55e 75%, #eab308 75%)",
        }
      : {
          backgroundColor:
            CARD_COLOR_MAP[card.color as Exclude<CardColor, "WILD">],
        };

  const style = { ...cardBaseStyle, ...cardColorStyle };

  return (
    <div
      id={`card-${card.id}`}
      className={`card ${playableClass} ${drawnClass}`}
      style={style}
      onClick={isPlayable ? onClick : undefined}
      data-color={card.color}
    >
      <span className="text-xl leading-none" style={{ fontSize: "1.2rem" }}>
        {valueIcon}
      </span>
      <span
        className="text-8xl leading-none self-center"
        style={{ fontSize: "3rem" }}
      >
        {valueIcon}
      </span>
      <span
        className="text-xl leading-none"
        style={{ fontSize: "1.2rem", transform: "rotate(180deg)" }}
      >
        {valueIcon}
      </span>
    </div>
  );
}

function CardBack({ count }: { count: number | null }) {
  const cardBackStyle: React.CSSProperties = {
    width: "100px",
    height: "160px",
    borderRadius: "12px",
    background: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "3rem",
    border: "4px solid white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
    backgroundImage: `linear-gradient(135deg, #e53935 25%, transparent 25%),
                          linear-gradient(225deg, #e53935 25%, transparent 25%),
                          linear-gradient(45deg, #e53935 25%, transparent 25%),
                          linear-gradient(315deg, #e53935 25%, #1a1a1a 25%)`,
    backgroundPosition: "40px 0, 40px 0, 0 0, 0 0",
    backgroundSize: "80px 80px",
    backgroundRepeat: "repeat",
    position: "relative",
  };

  const unoLabelStyle: React.CSSProperties = {
    color: "white",
    backgroundColor: "#e53935",
    padding: "5px 15px",
    borderRadius: "999px",
    transform: "rotate(-30deg)",
    border: "4px solid white",
    content: '""',
  };

  return (
    <div id="draw-pile" className="relative" style={cardBackStyle}>
      <div style={unoLabelStyle}>UNO</div>
      {count !== null && (
        <span
          id="draw-pile-count"
          className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
        >
          {count}
        </span>
      )}
    </div>
  );
}

function GameSettings({
  config,
  setConfig,
  initializeGame,
}: {
  config: GameConfig;
  setConfig: React.Dispatch<React.SetStateAction<GameConfig>>;
  initializeGame: () => void;
}) {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <Settings className="mr-3" /> Configurações do Jogo
      </h2>

      <div className="w-full max-w-sm space-y-6 mb-8">
        <div>
          <label
            htmlFor="num-opponents"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            Número de Oponentes (1-7)
          </label>
          <input
            id="num-opponents"
            type="number"
            min="1"
            max="7"
            value={config.numOpponents}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                numOpponents: Math.max(1, Math.min(7, Number(e.target.value))),
              }))
            }
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label
            htmlFor="ai-delay"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            Atraso da IA (ms)
          </label>
          <input
            id="ai-delay"
            type="range"
            min="250"
            max="2000"
            step="250"
            value={config.aiDelayMs}
            onChange={(e) =>
              setConfig((c) => ({ ...c, aiDelayMs: Number(e.target.value) }))
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
          />
          <div className="text-center text-sm text-gray-400 mt-1">
            {config.aiDelayMs} ms
          </div>
        </div>
      </div>

      <button
        onClick={initializeGame}
        className="w-full max-w-sm bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-3 px-4 rounded-lg text-xl"
      >
        Iniciar Jogo
      </button>
    </div>
  );
}

// =============================================================================
// V. MAIN COMPONENT
// =============================================================================

export function UnoGame() {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [wildCardId, setWildCardId] = useState<string | null>(null);

  const isGameInitialized = gameState !== null;
  const isHumanTurn =
    isGameInitialized &&
    gameState.publicState.currentPlayerId === HUMAN_PLAYER_ID;
  const humanHand = isGameInitialized
    ? gameState.privateState.playerHands[HUMAN_PLAYER_ID] || []
    : [];
  const topDiscardCard = isGameInitialized
    ? gameState.publicState.discardPile.slice(-1)[0]
    : null;
  const discardPileForDisplay = isGameInitialized
    ? gameState.publicState.discardPile.slice(-5, -1)
    : []; 
  const isGameInProgress =
    isGameInitialized && 
    (gameState.publicState.gameStatus === "IN_PROGRESS" ||
     gameState.publicState.gameStatus === "JUST_DREW_CARD" ||
     gameState.publicState.gameStatus === "WAITING_FOR_COLOR");

  const initializeGame = useCallback(() => {
    const playerIds = [HUMAN_PLAYER_ID];
    for (let i = 2; i <= config.numOpponents + 1; i++) {
      playerIds.push(`player-${i}`);
    }

    const initialState = createInitialGameState(playerIds);
    setGameState(initialState);
    if (initialState.publicState.currentPlayerId !== HUMAN_PLAYER_ID) {
      setTimeout(() => runAiTurn(initialState), config.aiDelayMs);
    }
  }, [config.numOpponents, config.aiDelayMs]);

  const getRandomRotation = useCallback(() => {
    return Math.floor(Math.random() * -4) * (Math.random() * 25);
  }, []);

  const runAiTurn = useCallback(
    (currentState: GameState) => {
      let state = currentState;
      if (
        state.publicState.gameStatus !== "IN_PROGRESS" ||
        state.publicState.currentPlayerId === HUMAN_PLAYER_ID
      ) {
        return;
      }

      const aiPlayerId = state.publicState.currentPlayerId;
      const aiHand = state.privateState.playerHands[aiPlayerId];
      const aiPlayer = state.publicState.players[aiPlayerId];

      // 1. A IA anuncia UNO se tiver 2 cartas (e ainda não o fez)
      if (aiPlayer.cardCount === 2 && !aiPlayer.unoAnnounced) {
        aiPlayer.unoAnnounced = true;
        state.publicState.actionMessage = `${aiPlayer.name} anuncia UNO!`;
        setGameState({...state});
      }

      // 2. Tenta encontrar a melhor carta para jogar
      let cardToPlay = aiHand.find(
        (card) => validateMove(state, card) && card.value !== "WILD_DRAW_FOUR"
      );
      if (!cardToPlay) {
        cardToPlay = aiHand.find((card) => validateMove(state, card));
      }

      let newState;
      if (cardToPlay) {
        let chosenColor: Exclude<CardColor, "WILD"> | undefined = undefined;
        if (cardToPlay.color === "WILD") {
          const colorCounts: Record<Exclude<CardColor, "WILD">, number> = {
            RED: 0,
            GREEN: 0,
            BLUE: 0,
            YELLOW: 0,
          };
          aiHand.forEach((c) => {
            if (c.color !== "WILD") colorCounts[c.color]++;
          });
          chosenColor = Object.keys(colorCounts).reduce((a, b) =>
            colorCounts[a as Exclude<CardColor, "WILD">] >
            colorCounts[b as Exclude<CardColor, "WILD">]
              ? a
              : b
          ) as Exclude<CardColor, "WILD">;
        }
        newState = playCard(state, aiPlayerId, cardToPlay.id, chosenColor);
      } else {
        // A IA compra uma carta
        newState = drawCard(state, aiPlayerId);

        // Se a IA comprou e a carta for jogável, a IA a joga imediatamente
        if (newState.publicState.gameStatus === 'JUST_DREW_CARD') {
            const drawnCard = newState.privateState.playerHands[aiPlayerId].slice(-1)[0];
            
            let chosenColor: Exclude<CardColor, "WILD"> | undefined = undefined;
            if (drawnCard.color === "WILD") {
                const colorCounts: Record<Exclude<CardColor, "WILD">, number> = { RED: 0, GREEN: 0, BLUE: 0, YELLOW: 0 };
                newState.privateState.playerHands[aiPlayerId].forEach((c) => {
                    if (c.color !== 'WILD') colorCounts[c.color]++;
                });
                chosenColor = Object.keys(colorCounts).reduce((a, b) =>
                    colorCounts[a as Exclude<CardColor, "WILD">] > colorCounts[b as Exclude<CardColor, "WILD">] ? a : b) as Exclude<CardColor, "WILD">;
            }

            newState = playCard(newState, aiPlayerId, drawnCard.id, chosenColor);
        }
      }

      // 3. Verifica a penalidade UNO para o jogador atual (se não tiver vencido)
      if (newState.publicState.gameStatus !== 'FINISHED') {
        newState = applyUnoPenalty(newState, aiPlayerId);
      }

      setGameState(newState);

      if (
        newState.publicState.currentPlayerId !== HUMAN_PLAYER_ID &&
        newState.publicState.gameStatus !== 'WAITING_FOR_COLOR' &&
        newState.publicState.gameStatus === "IN_PROGRESS"
      ) {
        setTimeout(() => runAiTurn(newState), config.aiDelayMs);
      }
    },
    [config.aiDelayMs]
  );

  const handlePlayCard = useCallback(
    (card: Card, chosenColor?: Exclude<CardColor, "WILD">) => {
      if (
        !gameState ||
        gameState.publicState.currentPlayerId !== HUMAN_PLAYER_ID ||
        !isGameInProgress
      )
        return;

      if (card.color === "WILD" && !chosenColor) {
        setWildCardId(card.id);
        setShowColorPicker(true);
      } else {
        let newState = playCard(
          gameState,
          HUMAN_PLAYER_ID,
          card.id,
          chosenColor
        );

        // Aplica a penalidade UNO para o jogador atual (se não tiver vencido)
        if (newState.publicState.gameStatus !== 'FINISHED') {
            newState = applyUnoPenalty(newState, HUMAN_PLAYER_ID);
        }

        setGameState(newState);
        setShowColorPicker(false);
        setWildCardId(null);

        // Se o turno passou para a IA
        if (
          newState.publicState.currentPlayerId !== HUMAN_PLAYER_ID &&
          newState.publicState.gameStatus === "IN_PROGRESS"
        ) {
          setTimeout(() => runAiTurn(newState), config.aiDelayMs);
        }
      }
    },
    [gameState, isGameInProgress, runAiTurn, config.aiDelayMs]
  );

  const handleDrawCard = useCallback(() => {
    if (
      !gameState ||
      gameState.publicState.currentPlayerId !== HUMAN_PLAYER_ID ||
      !isGameInProgress ||
      gameState.publicState.gameStatus === 'JUST_DREW_CARD'
    )
      return;

    const newState = drawCard(gameState, HUMAN_PLAYER_ID);
    setGameState(newState);

    // Se a carta não for jogável, o turno passa e a IA deve jogar.
    if (
      newState.publicState.currentPlayerId !== HUMAN_PLAYER_ID &&
      newState.publicState.gameStatus === "IN_PROGRESS"
    ) {
      setTimeout(() => runAiTurn(newState), config.aiDelayMs);
    }
    // Se for JUST_DREW_CARD, o turno fica com o jogador humano para jogar ou passar.
  }, [gameState, isGameInProgress, runAiTurn, config.aiDelayMs]);

  const handlePassTurn = useCallback(() => {
    if (!gameState || gameState.publicState.gameStatus !== 'JUST_DREW_CARD' || gameState.publicState.currentPlayerId !== HUMAN_PLAYER_ID) return;

    let newState = JSON.parse(JSON.stringify(gameState)) as GameState;
    
    // Passa o turno
    newState.publicState.currentPlayerId = getNextPlayerId(newState);
    newState.publicState.gameStatus = 'IN_PROGRESS';
    newState.publicState.actionMessage = `${newState.publicState.players[HUMAN_PLAYER_ID].name} passou a vez.`;

    setGameState(newState);

    if (
      newState.publicState.currentPlayerId !== HUMAN_PLAYER_ID &&
      newState.publicState.gameStatus === "IN_PROGRESS"
    ) {
      setTimeout(() => runAiTurn(newState), config.aiDelayMs);
    }
  }, [gameState, runAiTurn, config.aiDelayMs]);

  const handleAnnounceUno = useCallback(() => {
    if (!gameState || !isHumanTurn || humanHand.length !== 2) return;

    setGameState(prev => {
        if (!prev) return null;
        let newState = JSON.parse(JSON.stringify(prev)) as GameState;
        const player = newState.publicState.players[HUMAN_PLAYER_ID];
        
        if (player.cardCount === 2 && !player.unoAnnounced) {
            player.unoAnnounced = true;
            newState.publicState.actionMessage = `${player.name} ANUNCIOU UNO!`;
        }
        return newState;
    });
  }, [gameState, isHumanTurn, humanHand.length]);

  const getGameStatusText = useMemo(() => {
    if (!gameState) return "Aguardando Configurações...";
    if (gameState.publicState.gameStatus === "FINISHED") {
      return `${
        gameState.publicState.players[gameState.publicState.winnerId!].name
      } Venceu!`;
    }
    switch(gameState.publicState.gameStatus) {
        case 'WAITING_FOR_COLOR': return "ESCOLHA UMA COR";
        case 'JUST_DREW_CARD': return "JOGUE OU PASSE A CARTA";
        default: return "EM JOGO";
    }
  }, [gameState]);

  const humanPlayer = isGameInitialized ? gameState.publicState.players[HUMAN_PLAYER_ID] : null;
  const isUnoWarning = humanPlayer && humanPlayer.cardCount === 2 && !humanPlayer.unoAnnounced;
  const canPlayDrawnCard = isGameInitialized && gameState.publicState.gameStatus === 'JUST_DREW_CARD';
  const drawnCard = canPlayDrawnCard ? humanHand.slice(-1)[0] : null;
  const playableDrawnCardId = drawnCard && validateMove(gameState!, drawnCard) ? drawnCard.id : null;


  if (!isGameInitialized) {
    return (
      <div className="bg-gray-900 text-white font-sans flex items-center justify-center min-h-screen p-4">
        <GameSettings
          config={config}
          setConfig={setConfig}
          initializeGame={initializeGame}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white font-sans flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-700">
        <header className="flex justify-between items-center pb-4 border-b border-gray-700 mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500">
            UNO Game
          </h1>
          <div
            id="game-status-display"
            className={`text-lg font-semibold px-4 py-2 rounded-lg ${
              gameState.publicState.gameStatus === "FINISHED"
                ? "bg-yellow-500 text-black"
                : gameState.publicState.gameStatus === "WAITING_FOR_COLOR"
                ? "bg-red-600 text-white"
                : "bg-gray-700"
            }`}
          >
            {getGameStatusText}
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2 space-y-8">
            {/* Opponents (IA) */}
            <div
              id="opponents-area"
              className="flex justify-around items-center bg-gray-900/70 p-4 rounded-xl min-h-[160px]"
            >
              {gameState.publicState.playerOrder
                .filter((pid) => pid !== HUMAN_PLAYER_ID)
                .map((pid) => {
                  const opponent = gameState.publicState.players[pid];
                  const isOpponentTurn =
                    gameState.publicState.currentPlayerId === pid;
                  const highlightClass = isOpponentTurn
                    ? "shadow-[0_0_20px_5px_#facc15] border-yellow-400"
                    : "border-transparent";
                  const unoClass = opponent.cardCount <= 1 && opponent.unoAnnounced ? "animate-pulse bg-red-800 border-red-500" : "";
                  
                  return (
                    <div
                      key={pid}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 ${highlightClass} ${unoClass} transition-shadow`}
                    >
                      <span className="font-bold text-lg mb-2">
                        {opponent.name}
                      </span>
                      {opponent.cardCount <= 1 && opponent.unoAnnounced && (
                        <span className="text-red-400 font-extrabold text-lg absolute -top-2">UNO!</span>
                      )}
                      <div className="flex items-center">
                        <span className="font-bold text-2xl mr-2">
                          {opponent.cardCount}
                        </span>
                        <Layers />
                      </div>
                      {/* Representação visual das cartas do oponente */}
                      <div className="flex mt-2 w-full justify-center">
                        <div className="relative w-24 h-12">
                          {[...Array(Math.min(5, opponent.cardCount))].map(
                            (_, i) => (
                              <div
                                key={i}
                                className="absolute w-12 h-16 rounded-md bg-gray-600 border-2 border-white opacity-90"
                                style={{
                                  zIndex: i,
                                  transform: `rotate(${
                                    i * 2 - 5
                                  }deg) translateX(${i * 5}px)`,
                                }}
                              ></div>
                            )
                          )}
                          {opponent.cardCount > 5 && (
                            <span className="absolute bottom-0 right-0 text-xs bg-gray-900 rounded-full px-2 py-0.5 border border-white">
                              +{opponent.cardCount - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Center Area: Piles & Info */}
            <div className="flex items-center justify-evenly gap-8 min-h-[250px]">
              {/* Draw Pile (Comprar) */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleDrawCard}
                  className={
                    isHumanTurn && isGameInProgress && !canPlayDrawnCard
                      ? "hover:scale-105 transition-transform"
                      : "cursor-default opacity-70"
                  }
                  disabled={!isHumanTurn || !isGameInProgress || canPlayDrawnCard}
                >
                  <CardBack count={gameState.publicState.drawPileCardCount} />
                </button>
                <span className="mt-2 text-sm text-gray-400">Comprar</span>
              </div>

              {/* Discard Pile (Descarte) */}
              <div className="flex flex-col items-center">
                <div
                  id="discard-pile"
                  className="w-[180px] h-[180px] flex items-center justify-center relative"
                >
                  {/* Cartas do Monte de Descarte */}
                  {discardPileForDisplay.map((card, index) => (
                    <div
                      className="absolute z-10 opacity-30"
                      style={{ transform: `rotate(${index * 5}deg)` }}
                      key={index}
                    >
                      {getCardHTML(card!, false, () => {})}
                    </div>
                  ))}

                  {/* Carta do Topo (sempre na frente) */}
                  {topDiscardCard && (
                    <div
                      className="absolute z-20"
                      style={{ transform: `rotate(${getRandomRotation()}deg)` }}
                    >
                      {getCardHTML(topDiscardCard, false, () => {})}
                    </div>
                  )}
                </div>
                <div
                  className={`mt-2 text-md font-bold text-black p-1 rounded ${
                    COLOR_MAP[gameState.publicState.activeColor] ||
                    "bg-gray-400"
                  }`}
                >
                  Cor Ativa: {gameState.publicState.activeColor}
                </div>
              </div>
            </div>

            {/* Current Player (Você) */}
            <div
              id="current-player-area"
              className={`bg-gray-900/70 p-4 rounded-xl ${
                isHumanTurn && isGameInProgress
                  ? "shadow-[0_0_20px_5px_#facc15] border-yellow-400 border-2"
                  : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 id="current-player-name" className="text-xl font-bold">
                  {humanPlayer?.name || "Você"}
                </h2>
                <div id="player-actions" className="flex items-center gap-2">
                  {/* Botão UNO */}
                  {humanPlayer && humanPlayer.cardCount <= 2 && humanPlayer.cardCount > 0 && !humanPlayer.unoAnnounced && isGameInProgress && (
                    <button
                      onClick={handleAnnounceUno}
                      className={`flex items-center bg-red-600 hover:bg-red-700 transition-colors text-white font-bold py-2 px-4 rounded-lg animate-pulse`}
                    >
                      <AlertTriangle className="mr-2" size={20} /> ANUNCIAR UNO!
                    </button>
                  )}
                  {/* Botão Passar (só aparece se acabou de comprar uma carta) */}
                  {canPlayDrawnCard && isHumanTurn && (
                    <button
                      onClick={handlePassTurn}
                      className="flex items-center bg-gray-600 hover:bg-gray-700 transition-colors text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Passar a Vez
                    </button>
                  )}
                </div>
              </div>
              <div
                id="current-player-hand"
                className="flex gap-2 justify-center flex-wrap min-h-[176px]"
              >
                {humanHand.map((card) => {
                  const isDrawn = canPlayDrawnCard && drawnCard && card.id === drawnCard.id;
                  const isPlayable =
                    isHumanTurn &&
                    validateMove(gameState, card) &&
                    isGameInProgress &&
                    gameState.publicState.gameStatus !== "WAITING_FOR_COLOR" &&
                    // Se acabou de comprar, SÓ a carta comprada é jogável
                    (!canPlayDrawnCard || (canPlayDrawnCard && isDrawn));

                  return getCardHTML(card, isPlayable ?? false, () =>
                    handlePlayCard(card), 
                  );
                })}
              </div>
            </div>
          </div>

          {/* Game Info & Controls */}
          <aside className="bg-gray-900/70 p-6 rounded-xl flex flex-col">
            <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">
              Informações do Jogo
            </h3>
            <div className="space-y-3 text-sm flex-grow">
              <div className="flex justify-between">
                <span className="text-gray-400">Turno Atual:</span>
                <span id="info-current-player" className="font-bold">
                  {gameState.publicState.players[
                    gameState.publicState.currentPlayerId
                  ]?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Direção:</span>
                <span id="info-direction" className="flex items-center">
                  {gameState.publicState.gameDirection === "CLOCKWISE"
                    ? "Horário (->)"
                    : "Anti-horário (<-)"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-700">
                <span className="text-gray-400">Oponentes:</span>
                <span className="font-bold">{config.numOpponents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delay IA:</span>
                <span className="font-bold">{config.aiDelayMs} ms</span>
              </div>
            </div>
            
            {/* Action Log (Adicionado para rastrear as ações) */}
            <div className="mt-6">
                <h4 className="font-semibold text-gray-300 mb-2">Última Ação:</h4>
                <div id="action-log" className="text-sm bg-gray-700 p-3 rounded h-20 overflow-y-auto">
                    {gameState.publicState.actionMessage || 'Aguardando o começo do jogo...'}
                </div>
            </div>

            <button
              id="restart-game-btn"
              onClick={() => setGameState(null)} // Volta para a tela de configurações
              className="mt-6 w-full bg-red-600 hover:bg-red-700 transition-colors text-white font-bold py-3 px-4 rounded-lg"
            >
              Voltar para Configurações
            </button>
          </aside>
        </main>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && gameState && (
        <div
          id="color-picker-modal"
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-6">
              Escolha uma cor para continuar
            </h3>
            <div id="color-choices" className="flex gap-4">
              {COLORS.map((color) => (
                <button
                  key={color}
                  data-color={color}
                  onClick={() => {
                    const card = humanHand.find((c) => c.id === wildCardId);
                    if (card) handlePlayCard(card, color);
                  }}
                  className={`color-choice h-20 w-20 rounded-full ${COLOR_MAP[color]} transform hover:scale-110 transition-transform border-4 border-white`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}