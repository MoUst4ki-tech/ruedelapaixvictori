import React, { useRef, useEffect, useState } from 'react';

const Pong = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [gameOver, setGameOver] = useState<string | null>(null);
    const gameOverRef = useRef<string | null>(null);
  const gameState = useRef({
    ball: { x: 300, y: 200, dx: 4, dy: 4, radius: 8 },
    p1: { y: 150, height: 80, width: 10 },
    p2: { y: 150, height: 80, width: 10 },
    keys: {} as Record<string, boolean>
  });

  const resetBall = (ball: any, direction: number) => {
  ball.x = 300;
  ball.y = 200;
  ball.dx = 4 * direction;
  ball.dy = (Math.random() - 0.5) * 6;
    };
  const triggerGameOver = (message: string) => {
  setGameOver(message);
  gameOverRef.current = message;
};
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const handleKeyDown = (e: KeyboardEvent) => (gameState.current.keys[e.code] = true);
    const handleKeyUp = (e: KeyboardEvent) => (gameState.current.keys[e.code] = false);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

const loop = () => {
  const { ball, p1, p2, keys } = gameState.current;

  if (gameOverRef.current) return;
  if (keys['ArrowUp'] && p1.y > 0) p1.y -= 5;
  if (keys['ArrowDown'] && p1.y < canvas.height - p1.height) p1.y += 5;

  if (ball.y > p2.y + p2.height / 2) p2.y += 3.5;
  else p2.y -= 3.5;

  const paddleCenter = p1.y + p1.height / 2;
  const distY = paddleCenter - ball.y;
  const attractionForce = 0.02; 
  if (ball.dx < 0) {
      ball.dy += distY * attractionForce;
  }
  const maxSpeedY = 7;
  if (Math.abs(ball.dy) > maxSpeedY) {
      ball.dy = maxSpeedY * (ball.dy > 0 ? 1 : -1);
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y <= 0 || ball.y >= canvas.height) {
      ball.dy *= -1;
  }

if (ball.x <= 15) { 
    const isTouchingPaddle = ball.y > p1.y && ball.y < p1.y + p1.height;

    if (isTouchingPaddle) {
      setScore(s => {
        const newScore = { ...s, p2: s.p2 + 1 };
        if (newScore.p2 >= 3) triggerGameOver('PERDU...');
        return newScore;
      });
      resetBall(ball, 1); 
    } else {
      ball.dx *= -1.05;
      ball.x = 16; 
    }
  }

  if (ball.x >= canvas.width - 15) {
    const isTouchingIA = ball.y > p2.y && ball.y < p2.y + p2.height;
    if (isTouchingIA) {
      ball.dx *= -1.05;
      ball.x = canvas.width - 16;
    } else {
        setScore(s => {
            const newScore = { ...s, p1: s.p1 + 1 };
            if (newScore.p1 >= 7) triggerGameOver('GAGNÉ !'); 
            return newScore;
        });
        resetBall(ball, -1);
        }
    }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, 1, canvas.height);
  ctx.fillStyle = '#ff4444'; 
  ctx.fillRect(5, p1.y, p1.width, p1.height);
  ctx.fillStyle = 'white';
  ctx.fillRect(canvas.width - 15, p2.y, p2.width, p2.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  animationId = requestAnimationFrame(loop);
};

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  return (
    <div style={{ color: 'white', textAlign: 'center', fontFamily: 'sans-serif', marginTop: '50px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{score.p1} - {score.p2}</h1>
      
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <canvas 
          ref={canvasRef} 
          width="600" 
          height="400" 
          style={{ 
            background: 'black', 
            border: '4px solid #444',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' 
          }} 
        />
        
        {gameOver && (
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '600px',
            height: '400px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}>
            <h2 style={{ 
              fontSize: '50px', 
              margin: '0 0 20px 0',
              color: gameOver === 'GAGNÉ !' ? '#44ff44' : '#ff4444',
              textShadow: '0 0 10px rgba(255,255,255,0.2)'
            }}>
              {gameOver}
            </h2>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '12px 25px', 
                cursor: 'pointer', 
                fontSize: '18px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              REJOUER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pong;
