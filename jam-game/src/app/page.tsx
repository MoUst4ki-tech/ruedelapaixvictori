'use client';

import dynamic from 'next/dynamic';

const Game = dynamic(() => import('@/components/Game'), { ssr: false });
const Pong = dynamic(() => import('@/components/AdamGame'), { ssr: false });
const My_PacMan = dynamic(() => import('@/components/PacMan'), { ssr: false });
const NoeGame = dynamic(() => import('@/components/noe_game'), { ssr: false });
const SnakeGame = dynamic(() => import('@/components/SnakeGame'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 bg-black text-white">
      <h1 className="text-4xl font-bold mb-12">Multi-Game Arcade</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">

        {/* Noe Game */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-mono text-red-500">Noe Game</h2>
          <div className="border-4 border-red-500 rounded-lg overflow-hidden">
            <NoeGame />
          </div>
        </div>

        {/* Pong / Adam Game */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-mono text-blue-500">Pong Arcade</h2>
          <div className="border-4 border-blue-500 rounded-lg overflow-hidden">
            <Pong />
          </div>
        </div>

        {/* Pacman */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-mono text-yellow-500">Pac-Man Clone</h2>
          <div className="border-4 border-yellow-500 rounded-lg overflow-hidden">
            <My_PacMan />
          </div>
        </div>

        {/* Ton Snake Game */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-mono text-green-500">Snake.exe</h2>
          <div className="border-4 border-green-500 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.5)]">
            <SnakeGame />
          </div>
        </div>

      </div>

      <div className="mt-20 opacity-50">
        <h2 className="text-xl mb-4 text-center">Base Engine Test</h2>
        <div className="border-2 border-zinc-700 rounded-lg overflow-hidden">
          <Game />
        </div>
      </div>
    </main>
  );
}