'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

const speed = 150;
const MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 2, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1],
    [2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2],
    [1, 1, 1, 1, 0, 1, 2, 1, 1, 2, 1, 1, 2, 1, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 2, 2, 1, 2, 2, 2, 1, 2, 2, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1],
    [2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2],
    [1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const TILE_SIZE = 40;
let total_points = 0;
let total_coins = 0;
MAP.forEach((row, y) => {
    row.forEach((tile, x) => {
        if (tile === 0) {
            total_points++;
        }
        if (tile === 1) {
            total_coins++;
        }
    });
});

interface PacManProps {
    onVictory: () => void;
    onGameOver: () => void;
}

const My_PacMan: React.FC<PacManProps> = ({ onVictory, onGameOver }) => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && gameContainer.current && !gameRef.current) {
            let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
            let walls: Phaser.Physics.Arcade.StaticGroup;
            let points: Phaser.Physics.Arcade.StaticGroup;
            let spe_points: Phaser.Physics.Arcade.StaticGroup;
            let cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
            let ennemis: Phaser.Physics.Arcade.Group;
            let coins = 0;
            let isSuperMode = false;
            let isEnding = false;
            let wall_coins = 0;

            const preload = function (this: Phaser.Scene) {
                // On crée des textures simples dynamiquement pour éviter de chercher des fichiers images
                const graphics = this.make.graphics({ x: 0, y: 0 });

                // Mur (Carré bleu)
                graphics.fillStyle(0x0000ff, 1);
                graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
                graphics.generateTexture('wall', TILE_SIZE, TILE_SIZE);

                // Pacman (Cercle jaune)
                graphics.clear();
                graphics.fillStyle(0xffff00, 1);
                graphics.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 3);
                graphics.generateTexture('pacman', TILE_SIZE, TILE_SIZE);

                graphics.clear();
                graphics.fillStyle(0xffff00, 1);
                graphics.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 6);
                graphics.generateTexture('point', TILE_SIZE, TILE_SIZE);

                graphics.clear();
                graphics.fillStyle(0xffff00, 1);
                graphics.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 4);
                graphics.generateTexture('spe_point', TILE_SIZE, TILE_SIZE);

                // Fantom
                graphics.clear();
                graphics.fillStyle(0xFF00FF, 1);
                graphics.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 3);
                graphics.generateTexture('fantom', TILE_SIZE, TILE_SIZE);
            };

            const changeDirection = (ennemi: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, speed: number) => {
                const directions = [
                    { x: speed, y: 0 },
                    { x: -speed, y: 0 },
                    { x: 0, y: speed },
                    { x: 0, y: -speed },
                    { x: -speed, y: -speed },
                    { x: speed, y: -speed },
                    { x: speed, y: speed },
                    { x: -speed, y: speed }
                ];
                const choice = directions[Math.floor(Math.random() * directions.length)];
                ennemi.setVelocity(choice.x, choice.y);
            };

            const create = function (this: Phaser.Scene) {
                walls = this.physics.add.staticGroup();
                points = this.physics.add.staticGroup();
                spe_points = this.physics.add.staticGroup();
                coins = 0;
                wall_coins = 0;

                let winText = this.add.text(380, 380, 'C\'est ok', {
                    fontSize: '64px',
                    color: '#ffff00',
                    backgroundColor: '#000000',
                    padding: { x: 20, y: 10 }
                });
                winText.setOrigin(0.5);
                winText.setVisible(false);
                winText.setDepth(100);

                MAP.forEach((row, y) => {
                    row.forEach((tile, x) => {
                        if (tile === 1) {
                            walls.create(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 'wall');
                        }
                        if (tile === 0) {
                            points.create(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 'point');
                        }
                        if (tile === 3) {
                            spe_points.create(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 'spe_point');
                        }
                    });
                });

                player = this.physics.add.sprite(60, 60, 'pacman');
                ennemis = this.physics.add.group();

                const spawnPoints = [
                    { x: 380, y: 380 },
                    { x: 380, y: 300 },
                    { x: 380, y: 300 }
                ];

                spawnPoints.forEach(pos => {
                    const e = ennemis.create(pos.x, pos.y, 'fantom');
                    e.setBodySize(30, 30);
                    e.setOffset(5, 5);
                    e.setCollideWorldBounds(true);
                    e.visible = false;
                });

                player.setBodySize(30, 30);
                player.setOffset(5, 5);

                const wallCollider = this.physics.add.collider(player, walls, (playerRef, wallRef: any) => {
                    if (isEnding) {
                        wallRef.disableBody(true, true);
                        isSuperMode = true;
                        wall_coins++;
                        ennemis.getChildren().forEach((e: any) => {
                            e.visible = true;
                            e.setTint(0x0000ff);
                        });
                        if (wall_coins === total_coins) {
                            winText.setVisible(true);
                            onVictory();
                        }
                    }
                }, undefined, this);

                this.physics.add.collider(ennemis, walls);

                this.physics.add.overlap(player, ennemis, (playerRef, ennemiTouché: any) => {
                    if (isSuperMode) {
                        ennemiTouché.disableBody(true, true);
                        this.time.delayedCall(5000, () => {
                            ennemiTouché.enableBody(true, 380, 380, true, true);
                            ennemiTouché.setVelocityX(-speed);
                            if (!isSuperMode) {
                                ennemiTouché.visible = false;
                                ennemiTouché.clearTint();
                            }
                        });
                    } else {
                        onGameOver();
                    }
                }, undefined, this);

                this.physics.add.overlap(player, points, (playerRef, pointTouché: any) => {
                    pointTouché.disableBody(true, true);
                    coins++;
                    if (coins === total_points) {
                        isSuperMode = true;
                        isEnding = true
                        this.physics.world.removeCollider(wallCollider);
                    }
                }, undefined, this);

                this.physics.add.overlap(player, spe_points, (playerRef, pointTouché: any) => {
                    pointTouché.disableBody(true, true);
                    isSuperMode = true;

                    ennemis.getChildren().forEach((e: any) => {
                        e.visible = true;
                        e.setTint(0x0000ff);
                    });

                    this.time.delayedCall(10000, () => {
                        isSuperMode = false;
                        ennemis.getChildren().forEach((e: any) => {
                            e.visible = false;
                            e.clearTint();
                        });
                    });
                }, undefined, this);

                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        ennemis.getChildren().forEach((enfant) => {
                            changeDirection(enfant as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, speed);
                        });
                    },
                    callbackScope: this,
                    loop: true
                });
                ennemis.setVelocityY(-speed);
                if (this.input.keyboard) {
                    cursors = this.input.keyboard.createCursorKeys();
                }
            };

            const update = function (this: Phaser.Scene) {
                if (!cursors || !player?.body) return;

                player.setVelocity(0);

                if (cursors.left.isDown) player.setVelocityX(-speed);
                else if (cursors.right.isDown) player.setVelocityX(speed);

                if (cursors.up.isDown) player.setVelocityY(-speed);
                else if (cursors.down.isDown) player.setVelocityY(speed);

                if (player.x < 0) player.x = 760;
                else if (player.x > 760) player.x = 0;
                if (player.y < 0) player.y = 760;
                else if (player.y > 760) player.y = 0;

                ennemis.getChildren().forEach((e: any) => {
                    if (e.x < 0) e.x = 760;
                    else if (e.x > 760) e.x = 0;
                    if (e.y < 0) e.y = 760;
                    else if (e.y > 760) e.y = 0;
                });
            };

            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: 760,
                height: 760,
                parent: gameContainer.current,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { x: 0, y: 0 },
                        checkCollision: { up: true, down: true, left: true, right: true }
                    }
                },
                input: {
                    keyboard: {
                        capture: []
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
    }, [onVictory, onGameOver]);

    return (
        <div ref={gameContainer} id="game-container" className="flex justify-center mt-4" />
    );
};

export default My_PacMan;