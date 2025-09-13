
import React from 'react';
import { MAZE_LAYOUT, TILE_SIZE, BOARD_WIDTH_PX, BOARD_HEIGHT_PX } from '../constants';
import type { PacmanState, GhostState, Position } from '../types';
import Pacman from './Pacman';
import Ghost from './Ghost';

interface GameBoardProps {
  pacman: PacmanState;
  ghosts: GhostState[];
  dots: Position[];
  powerPills: Position[];
}

// Pre-render the maze to avoid recalculating on every render
const MazeGrid: React.FC = React.memo(() => {
    return (
        <>
            {MAZE_LAYOUT.map((row, y) =>
                row.map((tile, x) => {
                    if (tile === 1) { // Wall
                        return (
                            <div
                                key={`${x}-${y}`}
                                className="bg-blue-800"
                                style={{
                                    position: 'absolute',
                                    left: x * TILE_SIZE,
                                    top: y * TILE_SIZE,
                                    width: TILE_SIZE,
                                    height: TILE_SIZE,
                                }}
                            />
                        );
                    }
                    return null;
                })
            )}
        </>
    );
});

const GameBoard: React.FC<GameBoardProps> = ({ pacman, ghosts, dots, powerPills }) => {
  return (
    <div
      className="bg-black relative"
      style={{
        width: BOARD_WIDTH_PX,
        height: BOARD_HEIGHT_PX,
      }}
    >
        <MazeGrid />
        
        {dots.map((dot, i) => (
            <div
                key={`dot-${i}`}
                className="bg-yellow-200 rounded-full"
                style={{
                    position: 'absolute',
                    width: TILE_SIZE / 5,
                    height: TILE_SIZE / 5,
                    left: dot.x * TILE_SIZE + (TILE_SIZE / 2.5),
                    top: dot.y * TILE_SIZE + (TILE_SIZE / 2.5),
                }}
            />
        ))}

        {powerPills.map((pill, i) => (
             <div
                key={`pill-${i}`}
                className="bg-yellow-400 rounded-full animate-pulse"
                style={{
                    position: 'absolute',
                    width: TILE_SIZE / 2,
                    height: TILE_SIZE / 2,
                    left: pill.x * TILE_SIZE + (TILE_SIZE / 4),
                    top: pill.y * TILE_SIZE + (TILE_SIZE / 4),
                }}
            />
        ))}

        <Pacman pacman={pacman} />
        
        {ghosts.map(ghost => (
            <Ghost key={ghost.id} ghost={ghost} />
        ))}
    </div>
  );
};

export default GameBoard;
