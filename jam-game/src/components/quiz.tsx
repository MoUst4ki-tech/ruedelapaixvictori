'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

const Quizz = () => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    const Questions = [
        {
            titre: "Comment s'écrit le prénom du présentateur ?",
            réponses: ["Tanysse", "Tanisse", "Thanysse", "Thanisse", "Tanys", "Tanis", "Thanos", "Thanis", "Thanys", "Tannys", "Tannis", "Tennis", "Seong gi hun", "Gangplank", "Victor le goat"],
            valide: "Tanys"
        },
        {
            titre: "6 + 7 = ?",
            réponses: ["67", "13", "jsp"],
            valide: "67"
        },
        {
            titre: "Quel bruit font les animaux?",
            réponses: ["Le hiboux hulul", "Capybara chirps", "羊駝嘶鳴了一聲", "הסוריקטה נובחת", "Bonne réponse", "Mauvaise Réponse"],
            valide: ""
        },
        {
            titre: "",
            réponses: ["Adam", "Victor", "Ewan", "Tanys", "Noé", "Florian"],
            valide: "Noé"
        }
    ];

    let index_question = 0;
    let score = 0;
    let textTitre: Phaser.GameObjects.Text;
    let vie: Phaser.GameObjects.Text;
    let buttonGroup: Phaser.GameObjects.Group;
    let click_count = 0;
    let logo: Phaser.GameObjects.Image;

    useEffect(() => {
        if (typeof window !== 'undefined' && gameContainer.current && !gameRef.current) {
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                parent: gameContainer.current,
                backgroundColor: '#000000',
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
        this.load.image("gamberge", "/quizz/bro_thinks_he_is_the_thinker.png");
        this.load.image("colere", "/quizz/bro_is_mad_as_possible.png");
        this.load.image("content", "/quizz/bro_is_so_happy_for_u.png");
    }

    function create(this: Phaser.Scene) {
        vie = this.add.text(0, 0, "3 vies restantes", {
            fontSize: "20px",
            align: "center",
            color: "#3cff00",
        })
        logo = this.add.image(650, 75, "gamberge");
        logo.setScale(0.5)

        buttonGroup = this.add.group();
        
        textTitre = this.add.text(250, 100, "", {
            fontSize: "40px",
            align: "center",
            color: "#ffffff",
            wordWrap: { width: 400 }
        }).setOrigin(0.5);

        generate_question_call(this);
    }

    function generate_question_call(scene: Phaser.Scene) {
        buttonGroup.clear(true, true);
        const questions = Questions[index_question];
        textTitre.setText(questions.titre);

        const dist_x = 250;
        const dist_y = 80;
        const start_x = 150;

        questions.réponses.forEach((text, index) => {
            const col = index % 3;
            const line = Math.floor(index / 3);
            const posX = start_x + (col * dist_x);
            const posY = 250 + (line * dist_y);

            const button = scene.add.text(posX, posY, text, {
                backgroundColor: '#ffffff',
                padding: { x: 30, y: 15 },
                fontSize: '18px',
                color: '#ff00ea',
                fixedWidth: 200,
                align: 'center'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            buttonGroup.add(button);

            button.on('pointerdown', () => {
                if (index_question == 2) {
                        if (click_count < 5) {
                            logo.destroy();
                            logo = scene.add.image(650, 70, "content");
                            logo.setScale(0.5)
                            
                            button.setStyle({ backgroundColor: '#27ae60', color: '#fff' });
                            click_count++
                        } else if (click_count < 7) {
                            button.setStyle({ backgroundColor: '#27ae60', color: '#fff' });
                            scene.time.delayedCall(1500, () => {
                            pass_question(scene, 0);
                            });
                        }
                    }
                if (text === questions.valide) {
                    if (index_question == 1) {
                        textTitre.setText("Sûr?")
                        click_count++;
                        if (click_count < 5){
                            const newx = Phaser.Math.Between(0, 800);
                            const newy = Phaser.Math.Between(0, 600);

                            scene.tweens.add({
                                targets: button,
                                x: newx,
                                y: newy,
                                duration: 100,
                                ease: 'Cubic.easeOut'
                            });
                        } else {
                            logo.destroy();
                            logo = scene.add.image(650, 70, "content");
                            logo.setScale(0.5)
                            click_count = 0;
                            button.setStyle({ backgroundColor: '#27ae60', color: '#fff' });
                            scene.time.delayedCall(1500, () => {
                            pass_question(scene, 0);
                            });
                        }           
                    } else {
                            logo.destroy();
                            logo = scene.add.image(650, 70, "content");
                            logo.setScale(0.5)

                            button.setStyle({ backgroundColor: '#27ae60', color: '#fff' });
                            scene.time.delayedCall(1500, () => {
                            pass_question(scene, 0);
                            });
                        }
                } else  if (index_question != 2) {
                    vie.x += 100;
                    logo.destroy();
                    logo = scene.add.image(650, 70, "colere");
                    logo.setScale(0.5)
                    button.setStyle({ backgroundColor: '#c0392b', color: '#fff' });
                    scene.time.delayedCall(1500, () => {
                    pass_question(scene, 1);
                    });
                }
            });
        });
    }

    function pass_question(scene: Phaser.Scene, value) {
        logo.destroy();
        logo = scene.add.image(650, 75, "gamberge");
        logo.setScale(0.5)
        click_count = 0;
        if (value == 1)
            index_question = 0;
        else 
            index_question++;
        if (index_question < Questions.length) {
            generate_question_call(scene);
        } else {
            logo.destroy();
            logo.setOrigin(0.5)
            logo = scene.add.image(400, 300, "content");
            textTitre.setPosition(400, 300);
            textTitre.setText("Bravo ! Quiz terminé.");
            buttonGroup.clear(true, true);
        }
    }

    function update(this: Phaser.Scene) {}

    return <div ref={gameContainer} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} />;
};

export default Quizz;