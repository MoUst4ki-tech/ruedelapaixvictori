'use client';

import dynamic from 'next/dynamic';

const Game = dynamic(() => import('@/components/Game'), { ssr: false });
const My_PacMan = dynamic(() => import('@/components/PacMan'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <h1 className="text-4xl font-bold mb-8 text-white">Next.js + Phaser Game</h1>
      <div className="border-4 border-white rounded-lg overflow-hidden">
        <Game />
      </div>
      <div className="mt-10">
        <h2 className="text-white text-xl mb-4">Version Alternative :</h2>
        <My_PacMan />
      </div>
    </main>
  );
}
