import { useState, useEffect, useCallback, useRef } from 'react';
import { MAZE_LAYOUT, PACMAN_START_POS, GHOST_START_POS, INITIAL_LIVES, GHOST_EATEN_SCORE, GHOST_SCATTER_TARGETS, MAZE_WIDTH, MAZE_HEIGHT, LEVEL_CONFIG, FRUIT_SPAWN_DOT_COUNT, FRUIT_POSITION, FRUIT_DURATION_TICKS } from '../constants';
import type { PacmanState, GhostState, Position, GameStatus, FruitState, FruitType } from '../types';
import { Direction, GhostType, GhostMode } from '../types';
import { findPath } from '../services/pathfinding';

const getInitialDots = () => {
    const dots: Position[] = [];
    MAZE_LAYOUT.forEach((row, y) => {
        row.forEach((tile, x) => {
            if (tile === 2) dots.push({ x, y });
        });
    });
    return dots;
};

const getInitialPowerPills = () => {
    const pills: Position[] = [];
    MAZE_LAYOUT.forEach((row, y) => {
        row.forEach((tile, x) => {
            if (tile === 3) pills.push({ x, y });
        });
    });
    return pills;
};

export const useGameEngine = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('pacmanHighScore') || '0'));
  
  const [pacman, setPacman] = useState<PacmanState>({
    position: PACMAN_START_POS,
    direction: Direction.None,
    nextDirection: Direction.None,
    isAnimating: false,
    rotation: 0
  });

  const [ghosts, setGhosts] = useState<GhostState[]>([]);
  const [dots, setDots] = useState<Position[]>([]);
  const [powerPills, setPowerPills] = useState<Position[]>([]);
  const [scaredTimer, setScaredTimer] = useState(0);
  const [ghostsEaten, setGhostsEaten] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fruit, setFruit] = useState<FruitState | null>(null);

  const gameLoopRef = useRef<number | null>(null);
  const animationFrameRef = useRef(0);
  const initialDotCount = useRef(0);
  
  // Ghost mode timers
  const [globalGhostMode, setGlobalGhostMode] = useState<GhostMode.Scatter | GhostMode.Chase>(GhostMode.Scatter);
  const [modeTimer, setModeTimer] = useState(0);

  const isWall = (pos: Position) => {
    const tile = MAZE_LAYOUT[pos.y]?.[pos.x];
    return tile === 1 || tile === 4;
  };
  
  const currentLevelConfig = LEVEL_CONFIG[level - 1] || LEVEL_CONFIG[LEVEL_CONFIG.length - 1];

  const resetPositions = useCallback(() => {
    setPacman(p => ({ ...p, position: PACMAN_START_POS, direction: Direction.None, nextDirection: Direction.None }));
    setGhosts(Object.values(GhostType).filter(v => typeof v === 'number').map((type, i) => ({
      id: i,
      type: type as GhostType,
      position: GHOST_START_POS[type as GhostType],
      direction: Direction.Up,
      mode: GhostMode.Scatter,
      scatterTarget: GHOST_SCATTER_TARGETS[type as GhostType],
    })));
  }, []);


  const startGame = useCallback(() => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setLevel(1);
    const initialDots = getInitialDots();
    setDots(initialDots);
    setPowerPills(getInitialPowerPills());
    resetPositions();
    setGameStatus('playing');
    setIsPaused(false);
    setFruit(null);
    initialDotCount.current = initialDots.length;

    // Reset ghost mode timers
    const firstLevelConfig = LEVEL_CONFIG[0];
    setGlobalGhostMode(GhostMode.Scatter);
    setModeTimer(firstLevelConfig.scatterTicks);
  }, [resetPositions]);


  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let newDirection = pacman.nextDirection;
    switch (e.key) {
      case 'ArrowUp': newDirection = Direction.Up; break;
      case 'ArrowDown': newDirection = Direction.Down; break;
      case 'ArrowLeft': newDirection = Direction.Left; break;
      case 'ArrowRight': newDirection = Direction.Right; break;
      case 'p':
      case 'P':
        if(gameStatus === 'playing') togglePause();
        return;
      default: return;
    }
    setPacman(p => ({ ...p, nextDirection: newDirection }));
  }, [pacman.nextDirection, gameStatus]);
  
  const togglePause = () => setIsPaused(p => !p);

  const movePacman = useCallback(() => {
    setPacman(p => {
        let currentPos = p.position;
        let currentDir = p.direction;
        let nextDir = p.nextDirection;
        let rotation = p.rotation;

        const getNextPosition = (pos: Position, dir: Direction): Position => {
            switch (dir) {
                case Direction.Up: return { x: pos.x, y: pos.y - 1 };
                case Direction.Down: return { x: pos.x, y: pos.y + 1 };
                case Direction.Left: return { x: pos.x - 1, y: pos.y };
                case Direction.Right: return { x: pos.x + 1, y: pos.y };
                default: return pos;
            }
        };

        // Handle tunnel
        if (currentPos.y === 10 && currentPos.x <= 0 && currentDir === Direction.Left) {
             return { ...p, position: { x: MAZE_WIDTH - 1, y: currentPos.y }};
        }
        if (currentPos.y === 10 && currentPos.x >= MAZE_WIDTH - 1 && currentDir === Direction.Right) {
             return { ...p, position: { x: 0, y: currentPos.y }};
        }

        let nextPosForNextDir = getNextPosition(currentPos, nextDir);
        if (!isWall(nextPosForNextDir)) {
            currentDir = nextDir;
        }

        let nextPos = getNextPosition(currentPos, currentDir);
        if (isWall(nextPos)) {
            return { ...p, direction: Direction.None };
        }
        
        switch (currentDir) {
          case Direction.Up: rotation = 270; break;
          case Direction.Down: rotation = 90; break;
          case Direction.Left: rotation = 180; break;
          case Direction.Right: rotation = 0; break;
        }

        return { ...p, position: nextPos, direction: currentDir, rotation };
    });
}, []);

    const getPacmanFuturePosition = useCallback((tiles: number): Position => {
        let {x, y} = pacman.position;
        switch(pacman.direction) {
            case Direction.Up: y -= tiles; break;
            case Direction.Down: y += tiles; break;
            case Direction.Left: x -= tiles; break;
            case Direction.Right: x += tiles; break;
        }
        return {x: Math.max(0, Math.min(MAZE_WIDTH - 1, x)), y: Math.max(0, Math.min(MAZE_HEIGHT - 1, y))}
    }, [pacman.position, pacman.direction]);

    const moveGhosts = useCallback(() => {
        setGhosts(prevGhosts => {
            const blinky = prevGhosts.find(g => g.type === GhostType.Blinky);
            const blinkyPos = blinky ? blinky.position : {x: -1, y: -1}; // Fallback if blinky is not found

            return prevGhosts.map(ghost => {
                let target: Position;
                let path: Position[] | null = null;
                
                switch(ghost.mode) {
                    case GhostMode.Eaten:
                        const homePos = GHOST_START_POS[ghost.type];
                        if (ghost.position.x === homePos.x && ghost.position.y === homePos.y) {
                            return { ...ghost, mode: globalGhostMode }; // Respawned
                        }
                        path = findPath(ghost.position, homePos, MAZE_LAYOUT, true);
                        break;
                    
                    case GhostMode.Frightened:
                        const possibleMoves = getValidMoves(ghost.position, ghost.direction);
                        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                        if (randomMove) {
                           return { ...ghost, position: randomMove.pos, direction: randomMove.dir };
                        }
                        return ghost; // Should not happen in a valid maze
                    
                    case GhostMode.Scatter:
                        target = ghost.scatterTarget;
                        path = findPath(ghost.position, target, MAZE_LAYOUT, false, ghost.direction);
                        break;
                    
                    case GhostMode.Chase:
                         switch (ghost.type) {
                            case GhostType.Blinky: // Red: Chases Pacman
                                target = pacman.position;
                                break;
                            case GhostType.Pinky: // Pink: Tries to get in front of Pacman
                                target = getPacmanFuturePosition(4);
                                break;
                            case GhostType.Inky: // Cyan: Complicated patrol
                                const pacmanFuture2 = getPacmanFuturePosition(2);
                                if (blinkyPos.x !== -1) {
                                   const vectorX = pacmanFuture2.x - blinkyPos.x;
                                   const vectorY = pacmanFuture2.y - blinkyPos.y;
                                   target = { x: pacmanFuture2.x + vectorX, y: pacmanFuture2.y + vectorY };
                                } else {
                                    target = pacman.position; // Fallback if blinky isn't available
                                }
                                target.x = Math.max(0, Math.min(MAZE_WIDTH - 1, target.x));
                                target.y = Math.max(0, Math.min(MAZE_HEIGHT - 1, target.y));
                                break;
                            case GhostType.Clyde: // Orange: Chases if far, runs if close
                                 const distance = Math.hypot(ghost.position.x - pacman.position.x, ghost.position.y - pacman.position.y);
                                 target = distance > 8 ? pacman.position : ghost.scatterTarget;
                                 break;
                            default:
                                target = pacman.position; // Fallback
                                break;
                         }
                         path = findPath(ghost.position, target, MAZE_LAYOUT, false, ghost.direction);
                         break;
                }

                if (path && path.length > 1) {
                    const nextPos = path[1];
                    const newDirection = getDirection(ghost.position, nextPos);
                    return { ...ghost, position: nextPos, direction: newDirection };
                }

                return ghost;
            });
        });
    }, [pacman.position, getPacmanFuturePosition, globalGhostMode]);

    const getDirection = (from: Position, to: Position) => {
        if (to.y < from.y) return Direction.Up;
        if (to.y > from.y) return Direction.Down;
        if (to.x < from.x) return Direction.Left;
        if (to.x > from.x) return Direction.Right;
        return Direction.None;
    };
    
    const getValidMoves = (pos: Position, currentDir: Direction) => {
        const moves: {pos: Position, dir: Direction}[] = [];
        const oppositeDir = {
            [Direction.Up]: Direction.Down,
            [Direction.Down]: Direction.Up,
            [Direction.Left]: Direction.Right,
            [Direction.Right]: Direction.Left,
            [Direction.None]: Direction.None
        };

        const potentialDirs = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
        potentialDirs.forEach(dir => {
            if (dir === oppositeDir[currentDir] && potentialDirs.length > 1) return;

            let nextPos: Position = pos;
            switch(dir) {
                case Direction.Up: nextPos = {x: pos.x, y: pos.y - 1}; break;
                case Direction.Down: nextPos = {x: pos.x, y: pos.y + 1}; break;
                case Direction.Left: nextPos = {x: pos.x - 1, y: pos.y}; break;
                case Direction.Right: nextPos = {x: pos.x + 1, y: pos.y}; break;
            }

            if (!isWall(nextPos)) {
                moves.push({pos: nextPos, dir});
            }
        });

        if (moves.length === 0) {
           const backDir = oppositeDir[currentDir];
           let backPos = pos;
           switch(backDir) {
                case Direction.Up: backPos = {x: pos.x, y: pos.y - 1}; break;
                case Direction.Down: backPos = {x: pos.x, y: pos.y + 1}; break;
                case Direction.Left: backPos = {x: pos.x - 1, y: pos.y}; break;
                case Direction.Right: backPos = {x: pos.x + 1, y: pos.y}; break;
            }
            if(!isWall(backPos)) moves.push({pos: backPos, dir: backDir});
        }
        
        return moves;
    };

    const checkCollisions = useCallback(() => {
        // Dots
        const dotIndex = dots.findIndex(d => d.x === pacman.position.x && d.y === pacman.position.y);
        if (dotIndex !== -1) {
            const newDots = dots.filter((_, i) => i !== dotIndex);
            setDots(newDots);
            setScore(s => s + 10);

            const dotsEaten = initialDotCount.current - newDots.length;
            if (dotsEaten === FRUIT_SPAWN_DOT_COUNT && !fruit) {
                setFruit({
                    type: currentLevelConfig.fruit as FruitType,
                    position: FRUIT_POSITION,
                    visible: true,
                    timer: FRUIT_DURATION_TICKS,
                    score: currentLevelConfig.fruitScore
                });
            }
        }

        // Power pills
        const pillIndex = powerPills.findIndex(p => p.x === pacman.position.x && p.y === pacman.position.y);
        if (pillIndex !== -1) {
            setPowerPills(p => p.filter((_, i) => i !== pillIndex));
            setScore(s => s + 50);
            setScaredTimer(currentLevelConfig.powerPillDuration);
            setGhostsEaten(0);
            setGhosts(g => g.map(ghost => (ghost.mode !== GhostMode.Eaten ? {...ghost, mode: GhostMode.Frightened} : ghost)));
        }

        // Ghosts
        ghosts.forEach(ghost => {
            if (ghost.position.x === pacman.position.x && ghost.position.y === pacman.position.y) {
                if (ghost.mode === GhostMode.Frightened) {
                    setGhosts(gs => gs.map(g => g.id === ghost.id ? { ...g, mode: GhostMode.Eaten } : g));
                    const points = GHOST_EATEN_SCORE * Math.pow(2, ghostsEaten);
                    setScore(s => s + points);
                    setGhostsEaten(ge => ge + 1);
                } else if(ghost.mode === GhostMode.Chase || ghost.mode === GhostMode.Scatter) {
                    setLives(l => l - 1);
                    if (lives - 1 <= 0) {
                        setGameStatus('gameover');
                    } else {
                        resetPositions();
                    }
                }
            }
        });

        // Fruit
        if (fruit && fruit.visible && pacman.position.x === fruit.position.x && pacman.position.y === fruit.position.y) {
            setScore(s => s + fruit.score);
            setFruit(f => f ? { ...f, visible: false } : null);
        }

    }, [dots, powerPills, pacman.position, ghosts, lives, resetPositions, ghostsEaten, fruit, currentLevelConfig]);

    const gameTick = useCallback(() => {
        movePacman();
        moveGhosts();
        checkCollisions();
        
        // Handle Frightened Timer
        if (scaredTimer > 0) {
            const newTimer = scaredTimer - 1;
            setScaredTimer(newTimer);
            if (newTimer === 0) {
                setGhosts(g => g.map(ghost => ghost.mode === GhostMode.Frightened ? { ...ghost, mode: globalGhostMode } : ghost));
            }
        } else {
            // Handle Chase/Scatter Timer
            setModeTimer(t => {
                const newTime = t - 1;
                if (newTime <= 0) {
                    const newMode = globalGhostMode === GhostMode.Scatter ? GhostMode.Chase : GhostMode.Scatter;
                    setGlobalGhostMode(newMode);
                    setGhosts(g => g.map(ghost => (ghost.mode === GhostMode.Chase || ghost.mode === GhostMode.Scatter) ? { ...ghost, mode: newMode } : ghost));
                    return newMode === GhostMode.Chase ? currentLevelConfig.chaseTicks : currentLevelConfig.scatterTicks;
                }
                return newTime;
            });
        }
        
        if (fruit && fruit.visible) {
            setFruit(f => {
                if (!f) return null;
                const newTimer = f.timer - 1;
                if (newTimer <= 0) {
                    return { ...f, visible: false };
                }
                return { ...f, timer: newTimer };
            });
        }
    }, [movePacman, moveGhosts, checkCollisions, scaredTimer, fruit, globalGhostMode, currentLevelConfig]);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('pacmanHighScore', score.toString());
        }
    }, [score, highScore]);
    
    useEffect(() => {
      if (dots.length === 0 && powerPills.length === 0 && gameStatus === 'playing') {
        const nextLevel = level + 1;
        if (nextLevel > LEVEL_CONFIG.length) {
            setGameStatus('won');
            return;
        }
        setLevel(nextLevel);
        const newDots = getInitialDots();
        setDots(newDots);
        setPowerPills(getInitialPowerPills());
        resetPositions();
        setFruit(null);
        initialDotCount.current = newDots.length;
      }
    }, [dots, powerPills, gameStatus, resetPositions, level]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    useEffect(() => {
        if (gameStatus === 'playing' && !isPaused) {
            gameLoopRef.current = setInterval(gameTick, currentLevelConfig.speed);
            animationFrameRef.current = requestAnimationFrame(animateMouth);
        } else {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            cancelAnimationFrame(animationFrameRef.current);
        }

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [gameStatus, isPaused, gameTick, currentLevelConfig.speed]);
    
    const animateMouth = () => {
        setPacman(p => ({ ...p, isAnimating: !p.isAnimating }));
        animationFrameRef.current = requestAnimationFrame(animateMouth);
    };

    return { gameStatus, score, lives, level, highScore, pacman, ghosts, dots, powerPills, fruit, startGame, isPaused, togglePause };
};
