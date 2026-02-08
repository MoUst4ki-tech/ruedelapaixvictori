'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import GlitchOverlay from '@/components/GlitchOverlay';

const SnakeGame = dynamic(() => import('@/components/SnakeGame'), { ssr: false });
const PacMan = dynamic(() => import('@/components/PacMan'), { ssr: false });
const NoeGame = dynamic(() => import('@/components/noe_game'), { ssr: false });
const Quiz = dynamic(() => import('@/components/quiz'), { ssr: false });

export default function Home() {
  const [gameIndex, setGameIndex] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  // UseState to force component remount
  const [resetKey, setResetKey] = useState(0);

  const handleVictory = () => {
    setShowGlitch(true);
  };

  const handleGlitchComplete = () => {
    setShowGlitch(false);
    // gameIndex: 0=Snake, 1=PacMan, 2=Noe, 3=Quiz
    setGameIndex((prev) => (prev + 1) % 4);
    setResetKey(prev => prev + 1);
  };

  const handleGameOver = () => {
    setShowGlitch(true);
    setTimeout(() => {
      setGameIndex(0);
      setResetKey(prev => prev + 1);
      setShowGlitch(false);
    }, 1000);
  };

  const renderGame = () => {
    const commonProps = {
      onVictory: handleVictory,
      onGameOver: handleGameOver,
      key: `game-${gameIndex}-${resetKey}`
    };

    switch (gameIndex) {
      case 0:
        return <div className="border-4 border-green-500 p-2 rounded-lg bg-black"><SnakeGame {...commonProps} /></div>;
      case 1:
        return <div className="border-4 border-yellow-500 p-2 rounded-lg bg-black"><PacMan {...commonProps} /></div>;
      case 2:
        return <div className="border-4 border-red-500 p-2 rounded-lg bg-black"><NoeGame {...commonProps} /></div>;
      case 3:
        return <div className="border-4 border-purple-500 p-2 rounded-lg bg-black"><Quiz {...commonProps} /></div>;
      default:
        return <SnakeGame {...commonProps} />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black relative overflow-hidden">
      <GlitchOverlay active={showGlitch} onComplete={handleGlitchComplete} />

      <h1 className="text-4xl font-bold mb-8 text-white z-10">
        {gameIndex === 0 && "SNAKE PROTOCOL"}
        {gameIndex === 1 && "PAC-SYSTEM"}
        {gameIndex === 2 && "GLITCHED REALITY"}
        {gameIndex === 3 && "FINAL TRUTH"}
      </h1>

      <div className="flex flex-col gap-8 z-10 w-full max-w-[850px] items-center">
        {renderGame()}
      </div>

      <div className="absolute bottom-4 left-4 text-gray-500 text-sm">
        Level: {gameIndex + 1}/4
      </div>
    </main>
  );
}