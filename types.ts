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

export enum GhostMode {
  Chase,
  Scatter,
  Frightened,
  Eaten,
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
  mode: GhostMode;
  scatterTarget: Position;
}

export type FruitType = 'cherry' | 'strawberry' | 'orange' | 'apple' | 'melon';

export interface FruitState {
  type: FruitType;
  position: Position;
  visible: boolean;
  timer: number;
  score: number;
}

export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameover' | 'won';

export type Maze = number[][];

export interface TilePath {
    position: Position;
    parent: TilePath | null;
}
