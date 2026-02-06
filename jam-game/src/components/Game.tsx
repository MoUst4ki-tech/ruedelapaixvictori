'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

const Game = () => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && gameContainer.current && !gameRef.current) {
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                parent: gameContainer.current,
                scene: {
                    preload: preload,
                    create: create,
                    update: update
                }
            };

            gameRef.current = new Phaser.Game(config);
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    function preload(this: Phaser.Scene) {
        // Load assets here
    }

    function create(this: Phaser.Scene) {
        const button = this.add.text(400, 300, 'Catch Me!', {
            fontSize: '32px',
            color: '#fff',
            backgroundColor: '#ff0000',
            padding: { x: 10, y: 5 }
        })
            .setOrigin(0.5)
            .setInteractive();

        button.on('pointerdown', () => {
            button.setText('Ouch!');
            button.setBackgroundColor('#00ff00');
            moveButton(button, this);
        });
        moveButton(button, this);
    }

    function moveButton(button: Phaser.GameObjects.Text, scene: Phaser.Scene) {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);

        scene.tweens.add({
            targets: button,
            x: x,
            y: y,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                if (Math.random() > 0.5) {
                    moveButton(button, scene);
                } else {
                    scene.time.delayedCall(500, () => {
                        button.setText('Catch Me!');
                        button.setBackgroundColor('#ff0000');
                        moveButton(button, scene);
                    });
                }
            }
        });
    }

    function update(this: Phaser.Scene) {
        // Game loop logic
    }

    return (
        <div ref={gameContainer} id="game-container" />
    );
};

export default Game;
