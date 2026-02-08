import React, { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 20;

interface SnakeGameProps {
  onVictory: () => void;
  onGameOver: () => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onVictory, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [deadPixels, setDeadPixels] = useState<{ x: number, y: number, id: number, type?: 'wall' }[]>([]);
  const [isLagging, setIsLagging] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [networkStats, setNetworkStats] = useState({ ping: 12, loss: 0 });
  const [score, setScore] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const currentDirRef = useRef(direction);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      const currentDir = currentDirRef.current;

      const forbiddenKeys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'F5', 'F11', 'F12', 'Tab', 'Escape', 'Enter',
        'Meta', 'Alt', 'Control', 'Shift'
      ];

      if (!forbiddenKeys.includes(e.key) && !isLagging && !cooldown) {
        e.preventDefault();
        setIsLagging(true);

        setNetworkStats({ ping: 250, loss: 70 });
        setTimeout(() => setNetworkStats({ ping: 12, loss: 0 }), 1000);

        setTimeout(() => {
          setSnake(prev => {
            const currentDir = currentDirRef.current;
            return prev.map(segment => ({
              x: segment.x + (currentDir.x * 5),
              y: segment.y + (currentDir.y * 5)
            }));
          });
          setIsLagging(false);

          setCooldown(true);
          setTimeout(() => setCooldown(false), 200);
        }, 500);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y === 0) {
            setDirection({ x: 0, y: -1 });
            currentDirRef.current = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
          if (currentDir.y === 0) {
            setDirection({ x: 0, y: 1 });
            currentDirRef.current = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
          if (currentDir.x === 0) {
            setDirection({ x: -1, y: 0 });
            currentDirRef.current = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
          if (currentDir.x === 0) {
            setDirection({ x: 1, y: 0 });
            currentDirRef.current = { x: 1, y: 0 };
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSpeed]);

  useEffect(() => {
    if (isGameOver || isLagging || isWon) return;

    const moveSnake = () => {
      const currentDir = currentDirRef.current;
      const newHead = {
        x: snake[0].x + currentDir.x,
        y: snake[0].y + currentDir.y,
      };

      if (newHead.x < 0 || newHead.x >= CANVAS_WIDTH / GRID_SIZE ||
        newHead.y < 0 || newHead.y >= CANVAS_HEIGHT / GRID_SIZE) {
        setIsGameOver(true);
        onGameOver();
        return;
      }

      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        onGameOver();
        return;
      }

      if (deadPixels.some(pixel => pixel.x === newHead.x && pixel.y === newHead.y)) {
        setIsGameOver(true);
        onGameOver();
        return;
      }

      const newSnake = [newHead, ...snake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 1;
          if (newScore >= 10) {
            setIsWon(true);
            onVictory();
          }
          return newScore;
        });
        setFood({
          x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
          y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)),
        });
      } else {
        const tail = newSnake.pop();

        if (tail && Math.random() < 0.2) {
          const id = Date.now() + Math.random();
          setDeadPixels(prev => [...prev, { x: tail.x, y: tail.y, id }]);
          setTimeout(() => {
            setDeadPixels(prev => prev.filter(p => p.id !== id));
          }, 10000);
        }
      }

      setSnake(newSnake);

      if (Math.random() < 0.015) {
        const attackDistance = 8;
        const wallLength = 10;
        const targetX = newHead.x + (currentDir.x * attackDistance);
        const targetY = newHead.y + (currentDir.y * attackDistance);

        const newObstacles: { x: number, y: number, id: number, type?: 'wall' }[] = [];
        const timestamp = Date.now();

        for (let i = -wallLength / 2; i < wallLength / 2; i++) {
          let obsX = targetX;
          let obsY = targetY;

          if (currentDir.x !== 0) {
            obsY += i;
          } else {
            obsX += i;
          }

          newObstacles.push({ x: obsX, y: obsY, id: timestamp + i, type: 'wall' });
        }

        setDeadPixels(prev => [...prev, ...newObstacles]);
      }
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [direction, food, isGameOver, speed, isLagging, isWon, snake, deadPixels, onVictory, onGameOver]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#11ff00ff';
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    ctx.fillStyle = '#ff0000ff';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

    deadPixels.forEach((pixel) => {
      let color;
      if (pixel.type === 'wall') {
        color = '#ffffff';
      } else {
        const glitchColors = ['#f700ffff', '#11ff00ff', '#ffffff', '#363b35ff'];
        color = glitchColors[Math.floor(Math.random() * glitchColors.length)];
      }
      ctx.fillStyle = color;
      ctx.fillRect(
        pixel.x * GRID_SIZE,
        pixel.y * GRID_SIZE,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });
  }, [snake, food, deadPixels]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="block"
      />

      <div className="absolute top-4 right-4 font-mono font-bold text-lg z-[60] pointer-events-none transition-colors duration-100"
        style={{ color: networkStats.loss > 0 ? '#ff0000' : '#00ff00' }}>
        PING: {networkStats.ping}ms | LOSS: {networkStats.loss}%
      </div>

      <div className="absolute top-4 left-4 font-mono font-bold text-lg text-green-500 z-[60] pointer-events-none">
        SCORE: {score}/10
      </div>

      <div className="absolute bottom-2 w-full text-center font-mono text-sm text-white/50 z-[60] pointer-events-none">
        INDICE : POUR GAGNER, UTILISEZ VOTRE CLAVIER
      </div>

      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-10">
          <h2 className="text-2xl font-bold text-red-500">GAME OVER</h2>
          <div className="mt-4 text-center">
            <p>Returning to start...</p>
          </div>
        </div>
      )}

      {isWon && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/90 text-white z-10 border-4 border-green-500">
          <h2 className="text-4xl font-bold text-green-400 mb-4 animate-pulse">gg</h2>
          <div className="text-6xl mb-8">🍾</div>
          <div className="mt-4 text-center">
            <p>Transferring to next level...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;