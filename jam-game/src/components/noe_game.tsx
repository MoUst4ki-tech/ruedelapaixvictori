import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const MarioGame: React.FC = () => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (gameInstance.current) return;

        let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        let platforms: Phaser.Physics.Arcade.StaticGroup;
        let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
        let loopTimer: Phaser.Time.TimerEvent;
        let wallcount = 0;
        const wallaie = 100;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameContainer.current || undefined,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 1000, x: 0 }, 
                    debug: false
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

        function triggerSecretEnd(scene: Phaser.Scene) {

            if (loopTimer) {
                loopTimer.remove();
                console.log("Boucle temporelle détruite.");
            }

            scene.physics.pause();
            
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
            }).setOrigin(0.5).setDepth(100).setScrollFactor(0); 

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
                            ease: 'Power2'
                        });
                    }
                });
            });
        }

        function create(this: Phaser.Scene) {
            const chunkWidth = 800; 
            const totalChunks = 10; 
            const levelWidth = chunkWidth * totalChunks;
            this.physics.world.setBounds(0, 0, levelWidth, 600);

            const bg = this.add.image(400, 300, 'background');
            bg.setScrollFactor(0);

            platforms = this.physics.add.staticGroup();
            const ground = this.add.tileSprite(levelWidth / 2, 584, levelWidth, 100, 'ground');
            this.physics.add.existing(ground, true);
            platforms.add(ground);

            const originalPlatforms = [
                { x: 150, y: 450, width: 250 },
                { x: 600, y: 425, width: 350 },
                { x: 300, y: 280, width: 400 },
                { x: 580, y: 380, width: 50 } 
            ];

            for (let i = 0; i < totalChunks; i++) {
                const xOffset = i * chunkWidth;
                originalPlatforms.forEach(p => {
                    const plat = this.add.tileSprite(p.x + xOffset, p.y, p.width, 40, 'brick');
                    this.physics.add.existing(plat, true);
                    platforms.add(plat);
                });
            }


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


            player = this.physics.add.sprite(100, 450, 'player-right') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
            player.setScale(0.15); 
            player.refreshBody(); 
            player.setBounce(0.1);
            player.setCollideWorldBounds(true);

            const spawnX = player.x;
            const spawnY = player.y;
            
            const timerText = this.add.text(10, 10, 'WAITING FOR INPUT...', { 
                color: '#ffffff', 
                fontSize: '20px', 
                backgroundColor: '#000000' 
            }).setScrollFactor(0).setDepth(1000);


            this.input.keyboard?.once('keydown', () => {
                timerText.setText('TIME LOOP ACTIVE: 15s');
                timerText.setColor('#ff0000');

                loopTimer = this.time.addEvent({
                    delay: 15000, 
                    loop: true,  
                    callback: () => {

                        player.setPosition(spawnX, spawnY);
                        player.setVelocity(0, 0);
                        player.clearTint(); 
                        wallcount = 0; 

                
                        this.cameras.main.flash(500, 255, 0, 0);
                        this.cameras.main.shake(200, 0.01);
                        
                        console.log("Boucle reset !");
                    }
                });
            });

    
            this.physics.add.collider(player, platforms, (obj1, obj2) => {
                const p = obj1 as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
                const platform = obj2 as Phaser.GameObjects.TileSprite;
                
                const isPlatform4 = platform.width === 50; 

                if (isPlatform4 && cursors.left.isDown && p.body.blocked.left) {
                    wallcount++;
                    
                    if (wallcount % 5 === 0) p.setTint(0xff0000); 
                    else p.clearTint(); 

                    this.cameras.main.shake(50, 0.002);

                    if (wallcount > wallaie) {
                        triggerSecretEnd(this);
                    }
                } else {
                    p.clearTint();
                }
            });

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
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#333', padding: '20px', minHeight: '100vh' }}>
            <h2 style={{ color: 'white', marginBottom: '10px' }}>Mario: The Glitch Loop</h2>
            <div ref={gameContainer} style={{ border: '4px solid #555', borderRadius: '8px', overflow: 'hidden' }} />
            <p style={{ color: '#aaa', marginTop: '10px' }}>
                Trouvez la faille avant que la boucle temporelle (15s) ne vous ramène au début.
            </p>
        </div>
    );
};

export default MarioGame;