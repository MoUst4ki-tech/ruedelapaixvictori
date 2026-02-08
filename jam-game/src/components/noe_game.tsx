import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface MarioGameProps {
    onVictory: () => void;
    onGameOver: () => void;
}

const MarioGame: React.FC<MarioGameProps> = ({ onVictory, onGameOver }) => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (gameInstance.current) return;

        let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        let platforms: Phaser.Physics.Arcade.StaticGroup;
        let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

        // Variables pour le Glitch
        let wallcount = 0;
        const wallaie = 100; // Seuil réduit pour faciliter le test

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameContainer.current || undefined,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 1000, x: 0 },
                    debug: false,
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

        gameInstance.current = new Phaser.Game(config);

        function preload(this: Phaser.Scene) {
            this.load.image('ground', '/ground.png');
            this.load.image('brick', '/brick.png');
            this.load.image('background', '/background.png');
            this.load.spritesheet('player-right', '/mario/walk-right.png', { frameWidth: 219, frameHeight: 362 });
            this.load.spritesheet('player-left', '/mario/walk-left.png', { frameWidth: 221, frameHeight: 355 });
        }

        // --- FONCTION DE FIN SECRÈTE ---
        function triggerSecretEnd(scene: Phaser.Scene) {
            scene.physics.pause();

            // On utilise les dimensions de la caméra, pas du monde
            const screenCenterX = scene.cameras.main.width / 2;
            const screenCenterY = scene.cameras.main.height / 2;

            scene.cameras.main.shake(500, 0.01);

            const logMessages = [
                "> FATAL ERROR: Physics Engine Overflow",
                "> Wall_Collision.js not responding...",
                "> Injecting ADMIN_ACCESS payload...",
                "> [SUCCESS] Simulation Halted."
            ];

            const consoleText = scene.add.text(screenCenterX, screenCenterY, '', {
                fontSize: '16px',
                fontFamily: 'Courier New, monospace',
                color: '#00ff00',
                backgroundColor: '#000000',
                padding: { x: 10, y: 10 }
            }).setOrigin(0.5).setDepth(100).setScrollFactor(0); // Fixé à l'écran

            let currentLine = 0;
            scene.time.addEvent({
                delay: 800,
                repeat: logMessages.length - 1,
                callback: () => {
                    consoleText.setText(consoleText.text + '\n' + logMessages[currentLine]);
                    currentLine++;
                    scene.cameras.main.flash(100, 0, 255, 0, true);
                }
            });

            scene.time.delayedCall(5000, () => {
                consoleText.destroy();

                // Fond noir qui couvre tout l'écran
                const blackBg = scene.add.rectangle(screenCenterX, screenCenterY, 800, 600, 0x000000)
                    .setScrollFactor(0)
                    .setDepth(99)
                    .setAlpha(0);

                scene.tweens.add({
                    targets: blackBg,
                    alpha: 1,
                    duration: 1000,
                    onComplete: () => {
                        const finalTitle = scene.add.text(screenCenterX, screenCenterY - 20, 'VÉRITÉ ATTEINTE', {
                            fontSize: '42px',
                            fontFamily: 'Georgia, serif',
                            color: '#ffffff',
                            fontStyle: 'italic'
                        }).setOrigin(0.5).setAlpha(0).setDepth(101).setScrollFactor(0);

                        const finalSub = scene.add.text(screenCenterX, screenCenterY + 40, "Le code a cédé sous votre volonté.", {
                            fontSize: '18px',
                            color: '#888'
                        }).setOrigin(0.5).setAlpha(0).setDepth(101).setScrollFactor(0);

                        scene.tweens.add({
                            targets: [finalTitle, finalSub],
                            alpha: 1,
                            duration: 3000,
                            ease: 'Power2',
                            onComplete: () => {
                                onVictory();
                            }
                        });
                    }
                });
            });
        }

        function create(this: Phaser.Scene) {
            // 1. Configuration du Monde
            const chunkWidth = 800;
            const totalChunks = 10;
            const levelWidth = chunkWidth * totalChunks;
            this.physics.world.setBounds(0, 0, levelWidth, 600);

            const graphics = this.make.graphics({ x: 0, y: 0 });
            const bg = this.add.image(400, 300, 'background');
            bg.setScrollFactor(0);

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
            // 2. Création des Plateformes
            platforms = this.physics.add.staticGroup();
            const ground = this.add.tileSprite(levelWidth / 2, 584, levelWidth, 100, 'ground');
            this.physics.add.existing(ground, true);
            platforms.add(ground);

            const originalPlatforms = [
                { x: 150, y: 450, width: 250 },
                { x: 600, y: 425, width: 350 },
                { x: 300, y: 280, width: 400 },
                { x: 580, y: 380, width: 50 } // C'est celle-ci la cible du Glitch
            ];

            for (let i = 0; i < totalChunks; i++) {
                const xOffset = i * chunkWidth;
                originalPlatforms.forEach(p => {
                    const plat = this.add.tileSprite(p.x + xOffset, p.y, p.width, 40, 'brick');
                    this.physics.add.existing(plat, true);
                    platforms.add(plat);
                });
            }

            // 3. Animations
            const createAnimFromTexture = (scene: Phaser.Scene, animKey: string, textureKey: string, frameRate: number) => {
                if (!scene.textures.exists(textureKey)) return;
                const texture = scene.textures.get(textureKey);
                const frameNames = texture.getFrameNames();
                if (!frameNames || frameNames.length === 0) return;
                const frames = frameNames.map(name => ({ key: textureKey, frame: name }));
                scene.anims.create({ key: animKey, frames, frameRate, repeat: -1 });
            };

            createAnimFromTexture(this, 'left', 'player-left', 10);
            createAnimFromTexture(this, 'right', 'player-right', 10);

            if (this.textures.exists('player-right')) {
                const names = this.textures.get('player-right').getFrameNames();
                if (names && names.length > 0) {
                    this.anims.create({ key: 'turn', frames: [{ key: 'player-right', frame: names[0] }], frameRate: 20 });
                }
            }

            // 4. CRÉATION DU JOUEUR (Important : Avant le timer !)
            player = this.physics.add.sprite(100, 450, 'player-right') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
            player.setScale(0.15);
            player.refreshBody();
            player.setBounce(0.1);
            player.setCollideWorldBounds(true);

            // 5. LA BOUCLE TEMPORELLE (Le Timer de 15s)
            const spawnX = player.x;
            const spawnY = player.y;

            // On attend la première touche appuyée pour lancer le chrono
            this.input.keyboard?.once('keydown', () => {
                console.log("Timer activé : 15 secondes avant reset.");

                // Petit texte pour prévenir le joueur
                const timerText = this.add.text(10, 10, 'TIME LOOP ACTIVE: 15s', { color: 'red', fontSize: '20px' }).setScrollFactor(0);

                this.time.delayedCall(15000, () => {
                    // RESET DU JOUEUR
                    player.setPosition(spawnX, spawnY);
                    player.setVelocity(0, 0);

                    // Feedback visuel (Flash rouge)
                    this.cameras.main.flash(500, 255, 0, 0);
                    timerText.setText("LOOP RESET");

                    // Optionnel : Relancer le timer pour une boucle infinie
                    // (Ici ça ne le fait qu'une fois, il faudrait mettre ça dans une fonction récursive pour l'infini)
                });
            });

            // 6. COLLISIONS ET GLITCH
            this.physics.add.collider(player, platforms, (obj1, obj2) => {
                const p = obj1 as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
                const platform = obj2 as Phaser.GameObjects.TileSprite;

                // On cible uniquement la petite plateforme de 50px de large
                const isPlatform4 = platform.width === 50;

                // Le glitch s'active si on pousse à GAUCHE contre le mur (flanc droit de la plateforme)
                if (isPlatform4 && cursors.left.isDown && p.body.blocked.left) {
                    wallcount++;

                    // Effet visuel
                    if (wallcount % 5 === 0) p.setTint(0xff0000); // Rouge
                    else p.clearTint(); // Normal

                    // Tremblement léger
                    this.cameras.main.shake(50, 0.002);

                    if (wallcount > wallaie) {
                        triggerSecretEnd(this);
                    }
                } else {
                    // Si on ne force pas, on reset le compteur (ou pas, selon la difficulté voulue)
                    p.clearTint();
                }
            });

            // 7. Caméra et Contrôles
            this.cameras.main.setBounds(0, 0, levelWidth, 600);
            this.cameras.main.startFollow(player, true, 0.1, 0.1);

            if (this.input.keyboard) {
                cursors = this.input.keyboard.createCursorKeys();
            }
        }

        function update(this: Phaser.Scene) {
            if (!cursors || !player) return;

            if (cursors.left.isDown) {
                player.setVelocityX(-260);
                player.setTexture('player-left');
                player.anims.play('left', true);
            }
            else if (cursors.right.isDown) {
                player.setVelocityX(260);
                player.setTexture('player-right');
                player.anims.play('right', true);
            }
            else {
                player.setVelocityX(0);
                player.setTexture('player-right');
                player.anims.play('turn');
            }

            if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-470);
            }
        }

        return () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };
    }, [onVictory, onGameOver]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#333', padding: '10px' }}>
            <h2 style={{ color: 'white', marginBottom: '10px' }}></h2>
            <div ref={gameContainer} style={{ border: '4px solid #555', borderRadius: '8px', overflow: 'hidden' }} />
            <p style={{ color: '#aaa', marginTop: '10px' }}>
            </p>
        </div>
    );
};

export default MarioGame;