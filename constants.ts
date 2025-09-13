
import type { Position } from './types';
import { GhostType } from './types';

export const TILE_SIZE = 20; // in pixels
export const GAME_SPEED = 150; // ms per game tick

// 1 = wall, 0 = path, 2 = dot, 3 = power pill, 4 = ghost house door, 5 = ghost house
export const MAZE_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 5, 5, 5, 4, 5, 5, 5, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 5, 1, 1, 4, 1, 1, 5, 1, 2, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 0, 5, 1, 0, 0, 0, 1, 5, 0, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 1, 5, 1, 1, 1, 1, 1, 5, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 5, 5, 5, 5, 5, 5, 5, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const MAZE_HEIGHT = MAZE_LAYOUT.length;
export const MAZE_WIDTH = MAZE_LAYOUT[0].length;
export const BOARD_WIDTH_PX = MAZE_WIDTH * TILE_SIZE;
export const BOARD_HEIGHT_PX = MAZE_HEIGHT * TILE_SIZE;

export const PACMAN_START_POS: Position = { x: 9, y: 16 };
export const GHOST_START_POS: { [key in GhostType]: Position } = {
  [GhostType.Blinky]: { x: 9, y: 8 },
  [GhostType.Pinky]: { x: 8, y: 10 },
  [GhostType.Inky]: { x: 9, y: 10 },
  [GhostType.Clyde]: { x: 10, y: 10 },
};

export const GHOST_SCATTER_TARGETS: { [key in GhostType]: Position } = {
    [GhostType.Blinky]: { x: MAZE_WIDTH - 2, y: 1 },
    [GhostType.Pinky]: { x: 1, y: 1 },
    [GhostType.Inky]: { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 },
    [GhostType.Clyde]: { x: 1, y: MAZE_HEIGHT - 2 },
};

export const INITIAL_LIVES = 3;
export const POWER_PILL_DURATION = 50; // in game ticks
export const GHOST_EATEN_SCORE = 200;
