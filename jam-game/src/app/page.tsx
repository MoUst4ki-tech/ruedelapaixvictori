'use client';

import dynamic from 'next/dynamic';

const Game = dynamic(() => import('@/components/Game'), { ssr: false });
const Quiz = dynamic(() => import('@/components/quiz'), { ssr: false });
const Pong = dynamic(() => import('@/components/AdamGame'), { ssr: false });
const My_PacMan = dynamic(() => import('@/components/PacMan'), { ssr: false });
const NoeGame = dynamic(() => import('@/components/noe_game'), { ssr: false });
const SnakeGame = dynamic(() => import('@/components/SnakeGame'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 bg-black text-white gap-20">
      <h1 className="text-4xl font-bold font-mono border-b-2 border-white pb-4">
        MULTI-ARCADE BROWSER
      </h1>

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold text-red-500 uppercase tracking-widest">Noe Game</h2>
        <div className="border-4 border-red-500 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <NoeGame />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold text-yellow-400 uppercase tracking-widest">Pac-Man</h2>
        <div className="border-4 border-yellow-400 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(250,204,21,0.3)]">
          <My_PacMan />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold text-blue-500 uppercase tracking-widest">Pong Arcade</h2>
        <div className="border-4 border-blue-500 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <Pong />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold text-green-400 uppercase tracking-widest">Snake Game</h2>
        <div className="border-4 border-green-500 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <SnakeGame />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 opacity-40">
        <h2 className="text-xl font-semibold">Base Engine</h2>
        <div className="border-2 border-zinc-700 rounded-lg overflow-hidden">
          <Quiz />
        </div>
      </div>

    </main>
  );
}
