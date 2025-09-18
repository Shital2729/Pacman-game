import type { Position } from './types';
import { GhostType } from './types';
import type { FruitType } from './types';

export const TILE_SIZE = 20; // in pixels

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

export const LEVEL_CONFIG: {
    level: number; 
    speed: number; 
    powerPillDuration: number; 
    fruit: FruitType; 
    fruitScore: number;
    scatterTicks: number; // Duration in game ticks for scatter mode
    chaseTicks: number; // Duration in game ticks for chase mode
}[] = [
  // 1 game tick is approx the 'speed' value in ms.
  // Scatter for ~7s, Chase for ~20s
  { level: 1, speed: 150, powerPillDuration: 40, fruit: 'cherry', fruitScore: 100, scatterTicks: 47, chaseTicks: 133 },
  { level: 2, speed: 140, powerPillDuration: 35, fruit: 'strawberry', fruitScore: 300, scatterTicks: 50, chaseTicks: 143 },
  { level: 3, speed: 130, powerPillDuration: 30, fruit: 'orange', fruitScore: 500, scatterTicks: 54, chaseTicks: 154 },
  { level: 4, speed: 120, powerPillDuration: 25, fruit: 'apple', fruitScore: 700, scatterTicks: 58, chaseTicks: 167 },
  // After level 4, scatter duration gets shorter
  { level: 5, speed: 110, powerPillDuration: 20, fruit: 'melon', fruitScore: 1000, scatterTicks: 45, chaseTicks: 182 },
  { level: 6, speed: 100, powerPillDuration: 15, fruit: 'apple', fruitScore: 700, scatterTicks: 40, chaseTicks: 200 },
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
export const GHOST_EATEN_SCORE = 200;

export const FRUIT_SPAWN_DOT_COUNT = 70;
export const FRUIT_POSITION: Position = { x: 9, y: 12 };
export const FRUIT_DURATION_TICKS = 100;
