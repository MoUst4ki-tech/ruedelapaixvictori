'use client';

import dynamic from 'next/dynamic';

const NoeGame = dynamic(() => import('@/components/noe_game'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <h1 className="text-4xl font-bold mb-8 text-white">Next.js + Phaser Game</h1>
      <div className="flex flex-col gap-8"> 
        <div className="border-4 border-white rounded-lg overflow-hidden">
        </div>
        <div className="border-4 border-red-500 rounded-lg overflow-hidden">
          <NoeGame />
        </div>

      </div>
    </main>
  );
}