
import React from 'react';
import { TILE_SIZE } from '../constants';
import type { GhostState } from '../types';
import { GhostType } from '../types';
import { Direction } from '../types';

interface GhostProps {
  ghost: GhostState;
}

const GHOST_COLORS: { [key in GhostType]: string } = {
  [GhostType.Blinky]: 'bg-red-500',
  [GhostType.Pinky]: 'bg-pink-500',
  [GhostType.Inky]: 'bg-cyan-500',
  [GhostType.Clyde]: 'bg-orange-500',
};

const Ghost: React.FC<GhostProps> = ({ ghost }) => {
  const { position, type, isScared, isEaten, direction } = ghost;
  
  const baseColor = isScared ? 'bg-blue-700' : GHOST_COLORS[type];
  const bodyColor = isEaten ? 'bg-transparent' : baseColor;
  
  let eyeOffsetX = 0;
  let eyeOffsetY = 0;

  switch (direction) {
    case Direction.Up: eyeOffsetY = -2; break;
    case Direction.Down: eyeOffsetY = 2; break;
    case Direction.Left: eyeOffsetX = -2; break;
    case Direction.Right: eyeOffsetX = 2; break;
  }

  return (
    <div
      className="relative"
      style={{
        position: 'absolute',
        left: position.x * TILE_SIZE,
        top: position.y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        transition: 'left 150ms linear, top 150ms linear',
      }}
    >
      <div className={`w-full h-full rounded-t-full ${bodyColor} ${isScared && !isEaten ? 'animate-pulse' : ''}`}>
        {/* Eyes */}
        {!isEaten && (
            <div className="absolute w-full h-1/2 top-1/4 flex justify-center items-center">
                <div className="w-1/3 h-1/2 bg-white rounded-full relative mr-1">
                    <div className="w-1/2 h-1/2 bg-black rounded-full absolute top-1/4" style={{left: `calc(50% - 2px + ${eyeOffsetX}px)`, top: `calc(50% - 2px + ${eyeOffsetY}px)`}}></div>
                </div>
                <div className="w-1/3 h-1/2 bg-white rounded-full relative ml-1">
                    <div className="w-1/2 h-1/2 bg-black rounded-full absolute top-1/4" style={{left: `calc(50% - 2px + ${eyeOffsetX}px)`, top: `calc(50% - 2px + ${eyeOffsetY}px)`}}></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Ghost;
