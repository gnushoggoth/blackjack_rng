import React, { useState, useEffect } from 'react';

// Types for our game entities
type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  rank: Rank;
}

interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  deck: Card[];
  gameStatus: 'betting' | 'playing' | 'dealerTurn' | 'complete';
  message: string;
}

// Configuration for multiple decks
const DECK_COUNT = 2;
const INITIAL_DECK_SIZE = 52 * DECK_COUNT;

// Helper functions for game logic
const createDeck = (): Card[] => {
  const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  // Create multiple decks
  for (let d = 0; d < DECK_COUNT; d++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
  }
  return shuffleDeck(deck);
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

const calculateHandValue = (hand: Card[]): number => {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.rank === 'A') {
      aces += 1;
      value += 11;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      value += 10;
    } else {
      value += parseInt(card.rank);
    }
  }

  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};

const BlackjackGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    dealerHand: [],
    deck: createDeck(),
    gameStatus: 'betting',
    message: 'Place your bet to start',
  });

  const dealInitialCards = () => {
    if (gameState.deck.length < 4) {
      setGameState(prev => ({
        ...prev,
        deck: shuffleDeck(createDeck()),
        message: 'Reshuffling decks...',
      }));
      return;
    }

    const newDeck = [...gameState.deck];
    const playerHand = [newDeck.pop()!, newDeck.pop()!];
    const dealerHand = [newDeck.pop()!, newDeck.pop()!];

    setGameState(prev => ({
      ...prev,
      playerHand,
      dealerHand,
      deck: newDeck,
      gameStatus: 'playing',
      message: '',
    }));
  };

  const hit = () => {
    if (gameState.deck.length === 0) {
      setGameState(prev => ({
        ...prev,
        deck: shuffleDeck(createDeck()),
        message: 'Reshuffling decks...',
      }));
      return;
    }

    const newDeck = [...gameState.deck];
    const newCard = newDeck.pop()!;
    const newHand = [...gameState.playerHand, newCard];
    const newValue = calculateHandValue(newHand);

    if (newValue > 21) {
      setGameState(prev => ({
        ...prev,
        playerHand: newHand,
        deck: newDeck,
        gameStatus: 'complete',
        message: 'Bust! Dealer wins!',
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        playerHand: newHand,
        deck: newDeck,
      }));
    }
  };

  const stand = () => {
    let currentDealerHand = [...gameState.dealerHand];
    let currentDeck = [...gameState.deck];
    
    // Dealer must hit on 16 and stand on 17
    while (calculateHandValue(currentDealerHand) < 17) {
      if (currentDeck.length === 0) {
        currentDeck = shuffleDeck(createDeck());
      }
      currentDealerHand.push(currentDeck.pop()!);
    }

    const dealerValue = calculateHandValue(currentDealerHand);
    const playerValue = calculateHandValue(gameState.playerHand);
    
    let message = '';
    if (dealerValue > 21) {
      message = 'Dealer busts! Player wins!';
    } else if (dealerValue > playerValue) {
      message = 'Dealer wins!';
    } else if (dealerValue < playerValue) {
      message = 'Player wins!';
    } else {
      message = 'Push!';
    }

    setGameState(prev => ({
      ...prev,
      dealerHand: currentDealerHand,
      deck: currentDeck,
      gameStatus: 'complete',
      message,
    }));
  };

  const startNewGame = () => {
    if (gameState.deck.length < 4) {
      setGameState({
        playerHand: [],
        dealerHand: [],
        deck: shuffleDeck(createDeck()),
        gameStatus: 'betting',
        message: 'Place your bet to start',
      });
    } else {
      setGameState(prev => ({
        ...prev,
        playerHand: [],
        dealerHand: [],
        gameStatus: 'betting',
        message: 'Place your bet to start',
      }));
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Blackjack</h2>
        <p>Cards remaining in deck: {gameState.deck.length} of {INITIAL_DECK_SIZE}</p>
        <p>{gameState.message}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Dealer's Hand ({calculateHandValue(gameState.dealerHand)})</h3>
        <div className="flex gap-2">
          {gameState.dealerHand.map((card, index) => (
            <div key={index} className="border p-2">
              {card.rank} of {card.suit}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Player's Hand ({calculateHandValue(gameState.playerHand)})</h3>
        <div className="flex gap-2">
          {gameState.playerHand.map((card, index) => (
            <div key={index} className="border p-2">
              {card.rank} of {card.suit}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {gameState.gameStatus === 'betting' && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={dealInitialCards}
          >
            Deal Cards
          </button>
        )}
        
        {gameState.gameStatus === 'playing' && (
          <>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={hit}
            >
              Hit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={stand}
            >
              Stand
            </button>
          </>
        )}
        
        {gameState.gameStatus === 'complete' && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={startNewGame}
          >
            New Game
          </button>
        )}
      </div>
    </div>
  );
};

export default BlackjackGame;