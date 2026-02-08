'use client';

import dynamic from 'next/dynamic';

const Game = dynamic(() => import('@/components/Game'), { ssr: false });
const Pong = dynamic(() => import('@/components/AdamGame'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <h1 className="text-4xl font-bold mb-8 text-white">Next.js + Phaser Game</h1>
      <div className="border-4 border-white rounded-lg overflow-hidden">
        <Game />
      </div>
      <div className="border-4 border-white rounded-lg overflow-hidden">
        <Pong />
      </div>
    </main>
  );
}
