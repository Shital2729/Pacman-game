
import React from 'react';
import { TILE_SIZE } from '../constants';
import type { PacmanState } from '../types';

interface PacmanProps {
  pacman: PacmanState;
}

const Pacman: React.FC<PacmanProps> = ({ pacman }) => {
  const { position, isAnimating, rotation } = pacman;
  const mouthAngle = isAnimating ? '20' : '0';

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x * TILE_SIZE,
        top: position.y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        transition: 'left 150ms linear, top 150ms linear',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path 
            d={`M 50,50 L 50,0 A 50,50 0 0 1 50,100 A 50,50 0 0 1 50,0 Z M 50,50 L ${50 + 50 * Math.cos(parseInt(mouthAngle) * Math.PI / 180)},${50 - 50 * Math.sin(parseInt(mouthAngle) * Math.PI / 180)} A 50,50 0 0 1 ${50 + 50 * Math.cos(-parseInt(mouthAngle) * Math.PI / 180)},${50 - 50 * Math.sin(-parseInt(mouthAngle) * Math.PI / 180)} Z`}
            fill="#000"
        />
        <circle cx="50" cy="50" r="50" fill="yellow" filter="url(#glow)" />
      </svg>
    </div>
  );
};

export default Pacman;
