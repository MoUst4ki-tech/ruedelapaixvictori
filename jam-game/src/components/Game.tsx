'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

const Game = () => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    const GLITCH_INTERVAL = 3000; // ms between glitches
    const GLITCH_DURATION = 3000; // ms glitch lasts

    useEffect(() => {
        if (typeof window !== 'undefined' && gameContainer.current && !gameRef.current) {
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                parent: gameContainer.current,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 600, x: 0 },
                        debug: false
                    }
                },
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
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('mario_stand', '/mario/standing_up.png');
        this.load.image('mario_walk', '/mario/walk.png');
        this.load.image('mario_jump', '/mario/jump.png');
    }

    let player: Phaser.Physics.Arcade.Sprite;
    let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    let platforms: Phaser.Physics.Arcade.StaticGroup;
    let statusText: Phaser.GameObjects.Text;

    let glitchTimer = 0;
    let glitchActive = false;
    let currentGlitch = 'NONE';
    let nextGlitchTime = 3000;

    function create(this: Phaser.Scene) {
        this.add.rectangle(400, 300, 800, 600, 0x87CEEB);

        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player = this.physics.add.sprite(100, 450, 'mario_stand');
        player.setCollideWorldBounds(true);
        player.setScale(0.15);

        this.physics.add.collider(player, platforms);

        statusText = this.add.text(16, 16, 'SYSTEM STABLE', {
            fontSize: '32px',
            color: '#00ff00',
            fontFamily: 'monospace'
        });

        if (this.input.keyboard) {
            cursors = this.input.keyboard.createCursorKeys();
        }
    }

    function update(this: Phaser.Scene, time: number, delta: number) {
        if (!cursors || !player) return;

        glitchTimer += delta;

        if (!glitchActive && glitchTimer > nextGlitchTime) {
            glitchActive = true;
            glitchTimer = 0;

            const glitches = ['GRAVITY', 'INPUT', 'LAG'];
            currentGlitch = glitches[Phaser.Math.Between(0, glitches.length - 1)];

            statusText.setText(`WARNING: ${currentGlitch} DETECTED!!`);
            statusText.setColor('#ff0000');
            this.cameras.main.shake(100, 0.01);
            if (currentGlitch === 'GRAVITY') {
                this.physics.world.gravity.y = -600;
                player.setTint(0xff00ff);
            } else if (currentGlitch === 'INPUT') {
                player.setTint(0xffff00);
            } else if (currentGlitch === 'LAG') {
                player.setTint(0x00ffff);
            }

        } else if (glitchActive && glitchTimer > GLITCH_DURATION) {
            glitchActive = false;
            glitchTimer = 0;
            currentGlitch = 'NONE';
            nextGlitchTime = Phaser.Math.Between(2000, 5000);

            this.physics.world.gravity.y = 600;
            player.clearTint();
            statusText.setText('SYSTEM STABLE');
            statusText.setColor('#00ff00');
        }

        if (glitchActive && currentGlitch === 'LAG') {
            if (Math.random() > 0.8) {
                player.x += Phaser.Math.Between(-10, 10);
                player.y += Phaser.Math.Between(-5, 5);
            }
        }

        const onGround = player.body?.touching.down || player.body?.blocked.down || player.body?.blocked.up;

        let leftInput = cursors.left.isDown;
        let rightInput = cursors.right.isDown;

        if (glitchActive && currentGlitch === 'INPUT') {
            const temp = leftInput;
            leftInput = rightInput;
            rightInput = temp;
        }

        if (leftInput) {
            player.setVelocityX(-260);
            player.setFlipX(true);

            if (onGround) {
                if (player.texture.key !== 'mario_walk') {
                    player.setTexture('mario_walk');
                }
            } else {
                if (player.texture.key !== 'mario_jump') {
                    player.setTexture('mario_jump');
                }
            }
        }
        else if (rightInput) {
            player.setVelocityX(260);
            player.setFlipX(false);

            if (onGround) {
                if (player.texture.key !== 'mario_walk') {
                    player.setTexture('mario_walk');
                }
            } else {
                if (player.texture.key !== 'mario_jump') {
                    player.setTexture('mario_jump');
                }
            }
        }
        else {
            player.setVelocityX(0);

            if (onGround) {
                if (player.texture.key !== 'mario_stand') {
                    player.setTexture('mario_stand');
                }
            } else {
                if (player.texture.key !== 'mario_jump') {
                    player.setTexture('mario_jump');
                }
            }
        }

        if (cursors.up.isDown && onGround) {
            const jumpVelocity = (currentGlitch === 'GRAVITY') ? 430 : -430;
            player.setVelocityY(jumpVelocity);

            if (player.texture.key !== 'mario_jump') {
                player.setTexture('mario_jump');
            }
        }
    }

    return (
        <div ref={gameContainer} id="game-container" />
    );
};

export default Game;
