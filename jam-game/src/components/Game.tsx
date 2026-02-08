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

    function create(this: Phaser.Scene) {
        this.add.rectangle(400, 300, 800, 600, 0x87CEEB);

        platforms = this.physics.add.staticGroup();

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') cursors.left.isDown = true;
            if (e.key === 'ArrowRight') cursors.right.isDown = true;
            if (e.key === 'ArrowUp') cursors.up.isDown = true;
            if (e.key === 'ArrowDown') cursors.down.isDown = true;
        });
    
        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') cursors.left.isDown = false;
            if (e.key === 'ArrowRight') cursors.right.isDown = false;
            if (e.key === 'ArrowUp') cursors.up.isDown = false;
            if (e.key === 'ArrowDown') cursors.down.isDown = false;
        });
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player = this.physics.add.sprite(100, 450, 'mario_stand');
        player.setCollideWorldBounds(true);

        player.setScale(0.15);

        this.physics.add.collider(player, platforms);

        if (this.input.keyboard) {
            cursors = this.input.keyboard.createCursorKeys();
        }
    }

    function update(this: Phaser.Scene, time: number, delta: number) {
        if (!cursors || !player) return;

        const onGround = player.body?.touching.down || player.body?.blocked.down;

        if (cursors.left.isDown) {
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
        else if (cursors.right.isDown) {
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
            player.setVelocityY(-430); // Jump strength
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
