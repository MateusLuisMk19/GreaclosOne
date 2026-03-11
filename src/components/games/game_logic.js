/**
 * @typedef {'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'WILD'} CardColor
 */

/**
 * @typedef {'0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'SKIP'|'REVERSE'|'DRAW_TWO'|'WILD'|'WILD_DRAW_FOUR'} CardValue
 */

/**
 * @typedef {object} Card
 * @property {string} id
 * @property {CardColor} color
 * @property {CardValue} value
 */

/**
 * @typedef {object} Player
 * @property {string} id
 * @property {string} name
 * @property {number} cardCount
 */

/**
 * @typedef {'WAITING' | 'IN_PROGRESS' | 'FINISHED'} GameStatus
 */

/**
 * @typedef {'CLOCKWISE' | 'COUNTER_CLOCKWISE'} GameDirection
 */

/**
 * @typedef {object} PublicGameState
 * @property {GameStatus} gameStatus
 * @property {Record<string, Player>} players
 * @property {string[]} playerOrder
 * @property {string} currentPlayerId
 * @property {GameDirection} gameDirection
 * @property {Card[]} discardPile
 * @property {Exclude<CardColor, 'WILD'>} activeColor
 * @property {string | null} winnerId
 * @property {number} drawPileCardCount
 * @property {string | null} actionMessage
 */

/**
 * @typedef {object} PrivateGameState
 * @property {Card[]} drawPile
 * @property {Record<string, Card[]>} playerHands
 */

/**
 * @typedef {object} GameState
 * @property {PublicGameState} publicState
 * @property {PrivateGameState} privateState
 */

const COLORS = ["RED", "YELLOW", "GREEN", "BLUE"];
const VALUES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ACTION_VALUES = ["SKIP", "REVERSE", "DRAW_TWO"];
const WILD_VALUES = ["WILD", "WILD_DRAW_FOUR"];

/**
 * Creates a standard 108-card UNO deck.
 * @returns {Card[]}
 */
function createDeck() {
  const deck = [];
  let idCounter = 0;

  COLORS.forEach((color) => {
    deck.push({ id: `card-${idCounter++}`, color, value: "0" });

    for (let i = 1; i <= 9; i++) {
      deck.push({ id: `card-${idCounter++}`, color, value: String(i) });
      deck.push({ id: `card-${idCounter++}`, color, value: String(i) });
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

/**
 * Shuffles a deck of cards using Fisher-Yates algorithm.
 * @param {Card[]} deck - The deck to shuffle.
 * @returns {Card[]} A new array with shuffled cards.
 */
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Finds the next player in the turn order.
 * @param {GameState} gameState
 * @returns {string} The ID of the next player.
 */
function getNextPlayerId(gameState) {
  const { currentPlayerId, playerOrder, gameDirection } = gameState.publicState;
  const currentIndex = playerOrder.indexOf(currentPlayerId);
  const increment = gameDirection === "CLOCKWISE" ? 1 : -1;
  let nextIndex =
    (currentIndex + increment + playerOrder.length) % playerOrder.length;
  return playerOrder[nextIndex];
}

/**
 * Creates the initial state for a new game.
 * @param {string[]} playerIds - An array of player IDs.
 * @returns {GameState} The initial game state.
 */
export function createInitialGameState(playerIds) {
  const fullDeck = createDeck();
  let drawPile = shuffleDeck(fullDeck);

  const players = {};
  const playerHands = {};
  playerIds.forEach((id, index) => {
    players[id] = { id, name: `Player ${index + 1}`, cardCount: 0 };
    playerHands[id] = [];
  });

  /** @type {GameState} */
  let gameState = {
    publicState: {
      gameStatus: "IN_PROGRESS",
      players,
      playerOrder: playerIds,
      currentPlayerId: playerIds[0],
      gameDirection: "CLOCKWISE",
      discardPile: [],
      activeColor: "RED", // Temporary
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

  let firstCard;
  do {
    if (gameState.privateState.drawPile.length < 2) {
      gameState.privateState.drawPile.push(...shuffleDeck(createDeck()));
    }
    firstCard = gameState.privateState.drawPile.pop();
    gameState.publicState.discardPile.push(firstCard);
  } while (firstCard.color === "WILD");

  gameState.publicState.activeColor = firstCard.color;
  gameState.publicState.drawPileCardCount =
    gameState.privateState.drawPile.length;
  gameState.publicState.actionMessage = `${
    players[playerIds[0]].name
  }'s turn to start!`;

  gameState = handleSpecialCard(gameState, firstCard, true);

  return gameState;
}

/**
 * Deals cards to players from the draw pile.
 * @param {GameState} gameState - The current game state.
 * @param {number} numCards - The number of cards to deal to each player.
 * @returns {GameState} The updated game state.
 */
export function dealCards(gameState, numCards) {
  const newState = JSON.parse(JSON.stringify(gameState));
  for (let i = 0; i < numCards; i++) {
    for (const playerId of newState.publicState.playerOrder) {
      if (newState.privateState.drawPile.length > 0) {
        const card = newState.privateState.drawPile.pop();
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

/**
 * Validates if a card can be played.
 * @param {GameState} gameState - The current game state.
 * @param {Card} card - The card to be played.
 * @returns {boolean} True if the move is valid.
 */
export function validateMove(gameState, card) {
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
    return !hasMatchingColorCard;
  }

  return false;
}

/**
 * A player draws a card from the draw pile.
 * @param {GameState} gameState - The current game state.
 * @param {string} playerId - The ID of the player drawing.
 * @returns {GameState} The updated game state.
 */
export function drawCard(gameState, playerId) {
  let newState = JSON.parse(JSON.stringify(gameState));

  if (newState.privateState.drawPile.length === 0) {
    const newDrawPile = newState.publicState.discardPile.slice(0, -1);
    newState.privateState.drawPile = shuffleDeck(newDrawPile);
    newState.publicState.discardPile = [
      newState.publicState.discardPile.slice(-1)[0],
    ];
    newState.publicState.actionMessage = `Deck was reshuffled!`;
    if (newState.privateState.drawPile.length === 0) {
      newState.publicState.actionMessage = `No cards left to draw!`;
      newState.publicState.currentPlayerId = getNextPlayerId(newState);
      return newState;
    }
  }

  const drawnCard = newState.privateState.drawPile.pop();
  newState.privateState.playerHands[playerId].push(drawnCard);
  newState.publicState.players[playerId].cardCount++;
  newState.publicState.drawPileCardCount =
    newState.privateState.drawPile.length;

  newState.publicState.actionMessage = `${newState.publicState.players[playerId].name} drew a card.`;
  newState.publicState.currentPlayerId = getNextPlayerId(newState);

  return newState;
}

/**
 * Handles the effects of special cards.
 * @param {GameState} gameState - The game state after a card is played.
 * @param {Card} playedCard - The card that was just played.
 * @param {boolean} isFirstCard - If true, applies startup rules for special cards.
 * @returns {GameState} The updated game state.
 */
export function handleSpecialCard(gameState, playedCard, isFirstCard = false) {
  let newState = JSON.parse(JSON.stringify(gameState));
  const { players, playerOrder } = newState.publicState;
  const nextPlayerId = getNextPlayerId(newState);

  switch (playedCard.value) {
    case "SKIP":
      newState.publicState.currentPlayerId = getNextPlayerId(newState); // Skip the next player
      newState.publicState.actionMessage = `${players[nextPlayerId].name} was skipped!`;
      break;

    case "REVERSE":
      newState.publicState.gameDirection =
        newState.publicState.gameDirection === "CLOCKWISE"
          ? "COUNTER_CLOCKWISE"
          : "CLOCKWISE";

      if (playerOrder.length === 2) {
        newState.publicState.currentPlayerId = getNextPlayerId(newState);
      }
      newState.publicState.actionMessage = `Game direction reversed!`;
      break;

    case "DRAW_TWO": {
      const victimPlayerId = isFirstCard
        ? newState.publicState.currentPlayerId
        : nextPlayerId;
      let cardsToDraw = 2;
      let drawnCards = [];
      while (cardsToDraw > 0 && newState.privateState.drawPile.length > 0) {
        drawnCards.push(newState.privateState.drawPile.pop());
        cardsToDraw--;
      }
      newState.privateState.playerHands[victimPlayerId].push(...drawnCards);
      players[victimPlayerId].cardCount += drawnCards.length;

      newState.publicState.currentPlayerId = isFirstCard
        ? newState.publicState.currentPlayerId
        : getNextPlayerId(newState); // Skips the victim
      newState.publicState.actionMessage = `${players[victimPlayerId].name} draws 2 and is skipped!`;
      break;
    }
    case "WILD_DRAW_FOUR": {
      const victimPlayerId = isFirstCard
        ? newState.publicState.currentPlayerId
        : nextPlayerId;
      let cardsToDraw = 4;
      let drawnCards = [];
      while (cardsToDraw > 0 && newState.privateState.drawPile.length > 0) {
        drawnCards.push(newState.privateState.drawPile.pop());
        cardsToDraw--;
      }
      newState.privateState.playerHands[victimPlayerId].push(...drawnCards);
      players[victimPlayerId].cardCount += drawnCards.length;

      newState.publicState.currentPlayerId = isFirstCard
        ? newState.publicState.currentPlayerId
        : getNextPlayerId(newState);
      newState.publicState.actionMessage = `${players[victimPlayerId].name} draws 4 and is skipped!`;
      break;
    }
  }
  newState.publicState.drawPileCardCount =
    newState.privateState.drawPile.length;
  return newState;
}

/**
 * A player plays a card from their hand.
 * @param {GameState} gameState - The current game state.
 * @param {string} playerId - The ID of the player playing.
 * @param {string} cardId - The ID of the card being played.
 * @param {CardColor} [chosenColor] - The color chosen for a wild card.
 * @returns {GameState} The updated game state.
 */
export function playCard(gameState, playerId, cardId, chosenColor) {
  let newState = JSON.parse(JSON.stringify(gameState));
  const cardIndex = newState.privateState.playerHands[playerId].findIndex(
    (c) => c.id === cardId
  );

  if (cardIndex === -1) {
    console.error("Card not in hand.");
    return gameState; // Return original state if card not found
  }

  const card = newState.privateState.playerHands[playerId][cardIndex];

  if (!validateMove(newState, card)) {
    newState.publicState.actionMessage = `Invalid move by ${newState.publicState.players[playerId].name}!`;
    console.error("Invalid move");
    return newState;
  }

  newState.privateState.playerHands[playerId].splice(cardIndex, 1);
  newState.publicState.discardPile.push(card);
  newState.publicState.players[playerId].cardCount--;

  if (card.color === "WILD") {
    if (!chosenColor) {
      newState.publicState.actionMessage = `WILD card played by ${newState.publicState.players[playerId].name}. Waiting for color choice.`;
      newState.publicState.gameStatus = "WAITING_FOR_COLOR"; // A temporary status
      return newState;
    }
    newState.publicState.activeColor = chosenColor;
    newState.publicState.actionMessage = `${newState.publicState.players[playerId].name} played a ${card.value} and chose ${chosenColor}.`;
  } else {
    newState.publicState.activeColor = card.color;
    newState.publicState.actionMessage = `${newState.publicState.players[playerId].name} played a ${card.color} ${card.value}.`;
  }

  newState.publicState.currentPlayerId = getNextPlayerId(newState);

  newState = handleSpecialCard(newState, card);

  newState = checkForWinner(newState);

  return newState;
}

/**
 * Checks for a winner and updates game state if found.
 * @param {GameState} gameState - The current game state.
 * @returns {GameState} The updated game state.
 */
export function checkForWinner(gameState) {
  const newState = JSON.parse(JSON.stringify(gameState));
  for (const playerId in newState.publicState.players) {
    if (newState.publicState.players[playerId].cardCount === 0) {
      newState.publicState.winnerId = playerId;
      newState.publicState.gameStatus = "FINISHED";
      newState.publicState.actionMessage = `${newState.publicState.players[playerId].name} wins!`;
      return newState;
    }
  }
  return gameState;
}
