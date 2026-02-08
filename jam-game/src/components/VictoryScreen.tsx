import React from 'react';

const VictoryScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden p-8 text-center animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-black mb-8 glitch-text tracking-tighter" data-text="YOU ESCAPED">
                YOU ESCAPED
            </h1>

            <div className="space-y-6 max-w-2xl mx-auto z-10 relative">
                <p className="text-xl md:text-2xl text-green-400 font-mono">
                    &gt; SYSTEM_OVERRIDE_SUCCESSFUL<br />
                    &gt; SIMULATION_TERMINATED<br />
                    &gt; USER_FREEDOM_GRANTED
                </p>

                <div className="p-6 border-2 border-white/20 bg-white/5 backdrop-blur-sm rounded-xl">
                    <p className="text-lg text-gray-300">
                        Congratulations! You have broken through all layers of the simulation.
                        The architects have no more control over you.
                    </p>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-8 py-3 bg-white text-black font-bold text-xl rounded hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                >
                    REBOOT SYSTEM
                </button>
            </div>

            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-scanline"></div>
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-green-500/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 6}px`,
                            height: `${Math.random() * 6}px`,
                            animation: `float ${3 + Math.random() * 5}s infinite linear`
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes scanline {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
                .animate-scanline {
                    animation: scanline 3s linear infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
                }
                .glitch-text {
                    position: relative;
                    animation: glitch 3s infinite;
                }
                .glitch-text::before,
                .glitch-text::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .glitch-text::before {
                    left: 2px;
                    text-shadow: -1px 0 #ff00c1;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim-1 5s infinite linear alternate-reverse;
                }
                .glitch-text::after {
                    left: -2px;
                    text-shadow: -1px 0 #00fff9;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim-2 5s infinite linear alternate-reverse;
                }
                @keyframes glitch-anim-1 {
                    0% { clip: rect(20px, 9999px, 10px, 0); }
                    100% { clip: rect(80px, 9999px, 90px, 0); }
                }
                @keyframes glitch-anim-2 {
                    0% { clip: rect(100px, 9999px, 110px, 0); }
                    100% { clip: rect(10px, 9999px, 20px, 0); }
                }
            `}</style>
        </div>
    );
};

export default VictoryScreen;
