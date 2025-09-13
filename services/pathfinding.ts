
import type { Position, Maze, TilePath } from '../types';
import { Direction } from '../types';

export const findPath = (start: Position, end: Position, maze: Maze, allowGhostHouse: boolean, currentDir?: Direction): Position[] | null => {
  const queue: TilePath[] = [{ position: start, parent: null }];
  const visited = new Set<string>([`${start.x},${start.y}`]);
  
  const oppositeDir = {
    [Direction.Up]: Direction.Down,
    [Direction.Down]: Direction.Up,
    [Direction.Left]: Direction.Right,
    [Direction.Right]: Direction.Left,
    [Direction.None]: Direction.None
  };

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const currentPos = currentPath.position;

    if (currentPos.x === end.x && currentPos.y === end.y) {
      const path: Position[] = [];
      let curr: TilePath | null = currentPath;
      while (curr) {
        path.unshift(curr.position);
        curr = curr.parent;
      }
      return path;
    }

    const neighbors = getNeighbors(currentPos, maze, allowGhostHouse);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (!visited.has(neighborKey)) {
        
        // Prevent ghosts from immediately reversing direction unless they have to
        if(currentDir !== undefined){
            const neighborDir = getDirection(currentPos, neighbor);
            if(neighborDir === oppositeDir[currentDir] && neighbors.length > 1) {
                continue;
            }
        }

        visited.add(neighborKey);
        queue.push({ position: neighbor, parent: currentPath });
      }
    }
  }

  return null; // No path found
};

const getNeighbors = (pos: Position, maze: Maze, allowGhostHouse: boolean): Position[] => {
  const neighbors: Position[] = [];
  const { x, y } = pos;

  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 },  // Right
  ];

  for (const dir of directions) {
    const newX = x + dir.x;
    const newY = y + dir.y;
    
    // Handle tunnel
    if (newY === 10 && (newX < 0 || newX >= maze[0].length)) {
        neighbors.push({ x: newX < 0 ? maze[0].length - 1 : 0, y: newY });
        continue;
    }

    if (
      newY >= 0 && newY < maze.length &&
      newX >= 0 && newX < maze[0].length
    ) {
      const tile = maze[newY][newX];
      const isWall = tile === 1;
      const isGhostHouseDoor = tile === 4;
      
      if (!isWall && (!isGhostHouseDoor || allowGhostHouse)) {
          neighbors.push({ x: newX, y: newY });
      }
    }
  }

  return neighbors;
};

const getDirection = (from: Position, to: Position): Direction => {
    if (to.y < from.y) return Direction.Up;
    if (to.y > from.y) return Direction.Down;
    if (to.x < from.x) return Direction.Left;
    if (to.x > from.x) return Direction.Right;
    return Direction.None;
};
