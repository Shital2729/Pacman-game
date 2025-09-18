import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Scoreboard from './components/Scoreboard';
import { useGameEngine } from './hooks/useGameEngine';
import type { GameStatus } from './types';

const App: React.FC = () => {
  const {
    gameStatus,
    score,
    lives,
    level,
    highScore,
    pacman,
    ghosts,
    dots,
    powerPills,
    fruit,
    startGame,
    isPaused,
    togglePause,
  } = useGameEngine();

  const getMessage = () => {
    switch (gameStatus) {
      case 'ready':
        return 'GET READY!';
      case 'gameover':
        return 'GAME OVER';
      case 'won':
        return 'YOU WON!';
      default:
        return '';
    }
  };

  const showOverlay = gameStatus === 'ready' || gameStatus === 'gameover' || gameStatus === 'won';

  return (
    <div style={{ fontFamily: "'Press Start 2P', cursive" }} className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl text-yellow-400 mb-2 tracking-wider">React Pac-Man</h1>
      <Scoreboard score={score} lives={lives} highScore={highScore} level={level} />
      <div className="relative w-fit border-4 border-blue-600 shadow-lg shadow-blue-400/50">
        <GameBoard pacman={pacman} ghosts={ghosts} dots={dots} powerPills={powerPills} fruit={fruit} />
        {showOverlay && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <h2 className="text-5xl text-yellow-400 animate-pulse">{getMessage()}</h2>
            {(gameStatus === 'ready' || gameStatus === 'gameover' || gameStatus === 'won') && (
              <button
                onClick={startGame}
                className="mt-8 px-6 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300 transition-colors text-2xl"
              >
                {gameStatus === 'ready' ? 'Start Game' : 'Play Again'}
              </button>
            )}
          </div>
        )}
        {gameStatus === 'playing' && isPaused && (
           <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
             <h2 className="text-5xl text-blue-400">PAUSED</h2>
           </div>
        )}
      </div>
      <div className="mt-4 text-center text-gray-400 text-sm">
        <p>Use Arrow Keys to Move. Press 'P' to Pause.</p>
        <p>Eat all dots to win. Avoid the ghosts!</p>
        {(gameStatus === 'playing' || isPaused) && (
            <button
              onClick={startGame}
              className="mt-4 px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition-colors text-base"
            >
              Restart Game
            </button>
        )}
      </div>
    </div>
  );
};

export default App;
