import React, { useEffect, useState } from 'react';

const GlitchOverlay = ({ active, onComplete }: { active: boolean, onComplete?: () => void }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (active) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                if (onComplete) onComplete();
            }, 1000); // Glitch duratio
            return () => clearTimeout(timer);
        }
    }, [active, onComplete]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden bg-black/50 mix-blend-hard-light flex items-center justify-center">
            <div className="absolute inset-0 bg-red-500 Mix-blend-screen opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 bg-blue-500 mix-blend-screen opacity-20 animate-bounce"></div>
            <div className="relative w-full h-full">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white/80"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300}px`,
                            height: `${Math.random() * 50}px`,
                            opacity: Math.random(),
                            transform: `skew(${Math.random() * 20}deg)`,
                            animation: `glitch-anim ${0.1 + Math.random() * 0.2}s infinite linear alternate-reverse`
                        }}
                    />
                ))}
            </div>
            <style jsx>{`
        @keyframes glitch-anim {
          0% { clip-path: inset(${Math.random() * 100}% 0 0 0); transform: translate(-20px, 10px); }
          20% { clip-path: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0); transform: translate(20px, -10px); }
          40% { clip-path: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0); transform: translate(-20px, 10px); }
          60% { clip-path: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0); transform: translate(20px, -10px); }
          80% { clip-path: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0); transform: translate(-20px, 10px); }
          100% { clip-path: inset(${Math.random() * 100}% 0 0 0); transform: translate(20px, -10px); }
        }
      `}</style>
        </div>
    );
};

export default GlitchOverlay;
