import React, { useState } from "react";
import {
  PlayingCard,
  Deck,
  Hand,
  CardPile,
  generateDeck,
  shuffleDeck,
  dealCards,
  type Card,
  type DeckOptions,
} from "./shared";

const CardGameExample: React.FC = () => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [deckOptions, setDeckOptions] = useState<DeckOptions>({
    excludeEights: false,
    excludeNines: false,
    excludeTens: false,
    excludeJokers: false,
  });

  const handleCardClick = (card: Card) => {
    setSelectedCards((prev) => {
      const isSelected = prev.some((c) => c.id === card.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== card.id);
      } else {
        return [...prev, card];
      }
    });
  };

  const handleDealCards = () => {
    const deck = generateDeck(deckOptions);
    const hands = dealCards(deck, 1, 7); // 1 jogador, 7 cartas
    setPlayerHand(hands[0]);
  };

  const handleShuffle = () => {
    setPlayerHand([]);
    setSelectedCards([]);
  };

  const toggleOption = (option: keyof DeckOptions) => {
    setDeckOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Exemplo de Jogo de Cartas
      </h1>

      {/* Opções do Baralho */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Configurações do Baralho
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={deckOptions.excludeEights}
              onChange={() => toggleOption("excludeEights")}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">Sem 8s (Burros)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={deckOptions.excludeNines}
              onChange={() => toggleOption("excludeNines")}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">Sem 9s (Burros)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={deckOptions.excludeTens}
              onChange={() => toggleOption("excludeTens")}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">Sem 10s (Burros)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={deckOptions.excludeJokers}
              onChange={() => toggleOption("excludeJokers")}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">Sem Jokers</span>
          </label>
        </div>
      </div>

      {/* Controles */}
      <div className="mb-8 flex justify-center space-x-4">
        <button
          onClick={handleDealCards}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Distribuir Cartas
        </button>
        <button
          onClick={handleShuffle}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Embaralhar
        </button>
      </div>

      {/* Mão do Jogador */}
      {playerHand.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Sua Mão ({playerHand.length} cartas)
          </h2>
          <Hand
            cards={playerHand}
            onCardClick={handleCardClick}
            size="lg"
            className="justify-center"
          />
        </div>
      )}

      {/* Cartas Selecionadas */}
      {selectedCards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Cartas Selecionadas ({selectedCards.length})
          </h2>
          <Hand cards={selectedCards} size="md" className="justify-center" />
        </div>
      )}

      {/* Baralho Completo */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Baralho Completo ({generateDeck(deckOptions).length} cartas)
        </h2>
        <Deck
          options={deckOptions}
          onCardClick={handleCardClick}
          showAllCards={true}
          selectedCards={selectedCards}
          className="max-h-96 overflow-y-auto"
        />
      </div>

      {/* Pilha de Cartas (Exemplo) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Pilha de Cartas (Exemplo)
        </h2>
        <div className="flex justify-center">
          <CardPile
            cards={playerHand.slice(0, 5)}
            isFaceDown={true}
            size="md"
          />
        </div>
      </div>

      {/* Informações */}
      <div className="text-center text-gray-600">
        <p className="mb-2">
          <strong>Total de cartas no baralho:</strong>{" "}
          {generateDeck(deckOptions).length}
        </p>
        <p className="mb-2">
          <strong>Cartas selecionadas:</strong> {selectedCards.length}
        </p>
        <p>
          <strong>Cartas na mão:</strong> {playerHand.length}
        </p>
      </div>
    </div>
  );
};

export default CardGameExample;
