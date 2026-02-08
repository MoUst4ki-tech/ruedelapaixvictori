'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import GlitchOverlay from '@/components/GlitchOverlay';

const Pong = dynamic(() => import('@/components/AdamGame'), { ssr: false });
const SnakeGame = dynamic(() => import('@/components/SnakeGame'), { ssr: false });
const PacMan = dynamic(() => import('@/components/PacMan'), { ssr: false });
const NoeGame = dynamic(() => import('@/components/noe_game'), { ssr: false });
const Quiz = dynamic(() => import('@/components/quiz'), { ssr: false });
const VictoryScreen = dynamic(() => import('@/components/VictoryScreen'), { ssr: false });

export default function Home() {
  const [gameIndex, setGameIndex] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  // UseState to force component remount
  const [resetKey, setResetKey] = useState(0);

  const handleVictory = () => {
    setIsVictory(true);
    setShowGlitch(true);
  };

  const handleGlitchComplete = () => {
    setShowGlitch(false);
    // gameIndex: 0=Pong, 1=Snake, 2=Noe, 3=Quiz, 4=PacMan, 5=Victory
    if (isVictory) {
      if (gameIndex === 4) {
        setGameIndex(5);
      } else if (gameIndex < 5) {
        setGameIndex((prev) => prev + 1);
      }
    } else {
      setGameIndex(0);
    }
    setResetKey(prev => prev + 1);
  };

  const handleGameOver = () => {
    setIsVictory(false);
    setShowGlitch(true);
  };

  const renderGame = () => {
    const commonProps = {
      onVictory: handleVictory,
      onGameOver: handleGameOver,
    };

    const key = `game-${gameIndex}-${resetKey}`;

    switch (gameIndex) {
      case 0:
        return <div className="border-4 border-blue-500 p-2 rounded-lg bg-black"><Pong key={key} onVictory={handleGameOver} onGameOver={handleVictory} /></div>;
      case 1:
        return <div className="border-4 border-green-500 p-2 rounded-lg bg-black"><SnakeGame key={key} {...commonProps} /></div>;
      case 2:
        return <div className="border-4 border-yellow-500 p-2 rounded-lg bg-black"><NoeGame key={key} {...commonProps} /></div>;
      case 3:
        return <div className="border-4 border-red-500 p-2 rounded-lg bg-black"><Quiz key={key} {...commonProps} /></div>;
      case 4:
        return <div className="border-4 border-purple-500 p-2 rounded-lg bg-black"><PacMan key={key} {...commonProps} /></div>;
      case 5:
        return <VictoryScreen />;
      default:
        return <Pong key={key} {...commonProps} />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black relative overflow-hidden">
      <GlitchOverlay active={showGlitch} onComplete={handleGlitchComplete} />

      <h1 className="text-4xl font-bold mb-8 text-white z-10">
        {gameIndex === 0 && "INITIATION: PONG"}
        {gameIndex === 1 && "SNAKE PROTOCOL"}
        {gameIndex === 2 && "PAC-SYSTEM"}
        {gameIndex === 3 && "GLITCHED REALITY"}
        {gameIndex === 4 && "FINAL TRUTH"}
        {gameIndex === 5 && "SYSTEM OVERRIDDEN"}
      </h1>

      <div className="flex flex-col gap-8 z-10 w-full max-w-[850px] items-center">
        {renderGame()}
      </div>

      <div className="absolute bottom-4 left-4 text-gray-500 text-sm">
        Level: {gameIndex + 1}/5
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setGameIndex(4)}
          className="bg-black text-black text-xs px-2 py-1 rounded hover:bg-gray-700 hover:text-white transition-colors"
        >
          Skip to PacMan
        </button>
        <button
          onClick={() => setGameIndex(5)}
          className="bg-black text-black text-xs px-2 py-1 rounded hover:bg-gray-700 hover:text-white transition-colors"
        >
          Skip to Win
        </button>
      </div>
    </main >
  );
}
