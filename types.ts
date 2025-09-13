
export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
  None,
}

export enum GhostType {
  Blinky, // Red: Chaser
  Pinky,  // Pink: Ambusher
  Inky,   // Cyan: Random/Patrol
  Clyde,  // Orange: Scared
}

export interface PacmanState {
  position: Position;
  direction: Direction;
  nextDirection: Direction;
  isAnimating: boolean;
  rotation: number;
}

export interface GhostState {
  id: number;
  type: GhostType;
  position: Position;
  direction: Direction;
  isScared: boolean;
  isEaten: boolean;
  scatterTarget: Position;
}

export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameover' | 'won';

export type Maze = number[][];

export interface TilePath {
    position: Position;
    parent: TilePath | null;
}
