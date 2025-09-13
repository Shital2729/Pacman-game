
import React from 'react';
import type { PacmanState } from '../types';

interface ScoreboardProps {
  score: number;
  highScore: number;
  lives: number;
  level: number;
}

const PacmanIcon: React.FC = () => (
    <div className="w-6 h-6 bg-yellow-400 rounded-full" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%, 50% 50%) rotate(180deg)' }} />
);

const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore, lives, level }) => {
  return (
    <div className="w-full max-w-xl flex justify-between items-center p-2 mb-2 text-lg">
      <div className="flex items-center space-x-2">
        <span className="text-gray-400">Score:</span>
        <span className="text-white font-bold">{score}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-400">High Score:</span>
        <span className="text-yellow-400 font-bold">{highScore}</span>
      </div>
       <div className="flex items-center space-x-2">
        <span className="text-gray-400">Level:</span>
        <span className="text-white font-bold">{level}</span>
      </div>
      <div className="flex items-center space-x-2">
        {Array.from({ length: lives }).map((_, i) => (
          <PacmanIcon key={i} />
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;
