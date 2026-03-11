import React from "react";
import { Heart, Diamond, Club, Spade } from "lucide-react";

// Tipos para as cartas
export interface Card {
  id: string;
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  rank: string;
  value: number;
  displayName: string;
}

// Tipos para as opções do baralho
export interface DeckOptions {
  excludeEights?: boolean; // Sem 8s (Burros)
  excludeNines?: boolean; // Sem 9s (Burros)
  excludeTens?: boolean; // Sem 10s (Burros)
  excludeJokers?: boolean; // Sem Jokers
  customExclusions?: string[]; // Exclusões customizadas
}

// Interface para o componente de carta
export interface CardProps {
  card: Card;
  isFaceDown?: boolean;
  isSelected?: boolean;
  isPlayable?: boolean;
  onClick?: (card: Card) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Interface para o componente de baralho
export interface DeckProps {
  options?: DeckOptions;
  onCardClick?: (card: Card) => void;
  className?: string;
  showAllCards?: boolean;
  selectedCards?: Card[];
  playableCards?: Card[];
}

// Componente de carta individual
export const PlayingCard: React.FC<CardProps> = ({
  card,
  isFaceDown = false,
  isSelected = false,
  isPlayable = true,
  onClick,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-12 h-16 text-xs",
    md: "w-16 h-20 text-sm",
    lg: "w-20 h-28 text-base",
  };

  const getSuitIcon = (suit: string) => {
    switch (suit) {
      case "hearts":
        return <Heart className="w-4 h-4 text-red-600" />;
      case "diamonds":
        return <Diamond className="w-4 h-4 text-red-600" />;
      case "clubs":
        return <Club className="w-4 h-4 text-gray-800" />;
      case "spades":
        return <Spade className="w-4 h-4 text-gray-800" />;
      default:
        return null;
    }
  };

  const getSuitColor = (suit: string) => {
    return suit === "hearts" || suit === "diamonds"
      ? "text-red-600"
      : "text-gray-800";
  };

  const handleClick = () => {
    if (onClick && isPlayable) {
      onClick(card);
    }
  };

  if (isFaceDown) {
    return (
      <div
        className={`
          ${sizeClasses[size]} 
          bg-gradient-to-br from-blue-600 to-blue-800 
          border-2 border-blue-400 rounded-lg shadow-lg
          flex items-center justify-center cursor-pointer
          hover:scale-105 transition-transform duration-200
          ${className}
        `}
        onClick={handleClick}
      >
        <div className="text-white font-bold text-center">
          <div className="text-xs mb-1">GREACLOS</div>
          <div className="text-xs">CARDS</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        bg-white border-2 border-gray-300 rounded-lg shadow-lg
        flex flex-col justify-between p-1 cursor-pointer
        hover:scale-105 transition-all duration-200
        ${isSelected ? "ring-4 ring-blue-500 shadow-xl" : ""}
        ${!isPlayable ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Canto superior esquerdo */}
      <div className="flex flex-col items-start">
        <span className={`font-bold ${getSuitColor(card.suit)}`}>
          {card.rank}
        </span>
        {getSuitIcon(card.suit)}
      </div>

      {/* Canto inferior direito (rotacionado) */}
      <div className="flex flex-col items-end rotate-180">
        <span className={`font-bold ${getSuitColor(card.suit)}`}>
          {card.rank}
        </span>
        {getSuitIcon(card.suit)}
      </div>

      {/* Centro da carta */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`text-2xl ${getSuitColor(card.suit)}`}>
          {getSuitIcon(card.suit)}
        </div>
      </div>
    </div>
  );
};

// Função para gerar o baralho completo
export const generateDeck = (options: DeckOptions = {}): Card[] => {
  const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
  const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const deck: Card[] = [];

  suits.forEach((suit) => {
    ranks.forEach((rank, index) => {
      // Verificar exclusões
      if (options.excludeEights && rank === "8") return;
      if (options.excludeNines && rank === "9") return;
      if (options.excludeTens && rank === "10") return;
      if (options.customExclusions && options.customExclusions.includes(rank))
        return;

      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: index + 1,
        displayName: `${rank} of ${suit}`,
      });
    });
  });

  // Adicionar Jokers se não estiverem excluídos
  if (!options.excludeJokers) {
    deck.push(
      {
        id: "joker-black",
        suit: "clubs",
        rank: "JOKER",
        value: 14,
        displayName: "Black Joker",
      },
      {
        id: "joker-red",
        suit: "hearts",
        rank: "JOKER",
        value: 15,
        displayName: "Red Joker",
      }
    );
  }

  return deck;
};

// Função para embaralhar o baralho
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Função para distribuir cartas
export const dealCards = (
  deck: Card[],
  numPlayers: number,
  cardsPerPlayer: number
): Card[][] => {
  const hands: Card[][] = Array(numPlayers)
    .fill(null)
    .map(() => []);
  const shuffledDeck = shuffleDeck(deck);

  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      if (shuffledDeck.length > 0) {
        hands[j].push(shuffledDeck.pop()!);
      }
    }
  }

  return hands;
};

// Componente principal do baralho
export const Deck: React.FC<DeckProps> = ({
  options = {},
  onCardClick,
  className = "",
  showAllCards = false,
  selectedCards = [],
  playableCards = [],
}) => {
  const deck = generateDeck(options);
  const shuffledDeck = shuffleDeck(deck);

  const handleCardClick = (card: Card) => {
    if (onCardClick) {
      onCardClick(card);
    }
  };

  const isCardSelected = (card: Card) => {
    return selectedCards.some((selected) => selected.id === card.id);
  };

  const isCardPlayable = (card: Card) => {
    return (
      playableCards.length === 0 ||
      playableCards.some((playable) => playable.id === card.id)
    );
  };

  if (showAllCards) {
    return (
      <div className={`grid grid-cols-13 gap-2 p-4 ${className}`}>
        {shuffledDeck.map((card) => (
          <PlayingCard
            key={card.id}
            card={card}
            isSelected={isCardSelected(card)}
            isPlayable={isCardPlayable(card)}
            onClick={handleCardClick}
            size="sm"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 p-4 ${className}`}>
      {shuffledDeck.map((card) => (
        <PlayingCard
          key={card.id}
          card={card}
          isSelected={isCardSelected(card)}
          isPlayable={isCardPlayable(card)}
          onClick={handleCardClick}
          size="md"
        />
      ))}
    </div>
  );
};

// Componente de mão de cartas
export const Hand: React.FC<{
  cards: Card[];
  onCardClick?: (card: Card) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}> = ({ cards, onCardClick, className = "", size = "md" }) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      {cards.map((card) => (
        <PlayingCard
          key={card.id}
          card={card}
          onClick={onCardClick}
          size={size}
        />
      ))}
    </div>
  );
};

// Componente de pilha de cartas
export const CardPile: React.FC<{
  cards: Card[];
  isFaceDown?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}> = ({ cards, isFaceDown = false, className = "", size = "md" }) => {
  if (cards.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {cards.map((card, index) => (
        <div
          key={`${card.id}-${index}`}
          className="absolute"
          style={{
            transform: `translateY(${index * 2}px)`,
            zIndex: index,
          }}
        >
          <PlayingCard card={card} isFaceDown={isFaceDown} size={size} />
        </div>
      ))}
    </div>
  );
};

// Exportar todos os componentes e funções
export default {
  PlayingCard,
  Deck,
  Hand,
  CardPile,
  generateDeck,
  shuffleDeck,
  dealCards,
};
