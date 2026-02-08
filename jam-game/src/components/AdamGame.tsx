import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

interface PongProps {
  onVictory: () => void;
  onGameOver: () => void;
}

const Pong: React.FC<PongProps> = ({ onVictory, onGameOver }) => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && gameContainer.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 400,
        parent: gameContainer.current,
        physics: {
          default: 'arcade',
          arcade: {
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
  }, [onVictory, onGameOver]);

  let player: Phaser.Physics.Arcade.Sprite;
  let pc: Phaser.Physics.Arcade.Sprite;
  let ball: Phaser.Physics.Arcade.Sprite;
  let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  let scorePlayer = 0;
  let scorePc = 0;
  let scoreTextPlayer: Phaser.GameObjects.Text;
  let scoreTextPc: Phaser.GameObjects.Text;
  let infoText: Phaser.GameObjects.Text;

  let velocityX = Phaser.Math.Between(-200, 200);
  if (Math.abs(velocityX) < 100) velocityX = 200 * (Math.random() > 0.5 ? 1 : -1);
  let velocityY = 200;

  function preload(this: Phaser.Scene) {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 10, 400);
    graphics.generateTexture('separator', 4, 400);

    graphics.clear();
    graphics.fillStyle(0x0000ff, 1);
    graphics.fillRect(0, 0, 20, 100);
    graphics.generateTexture('playerTx', 20, 100);

    graphics.clear();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(0, 0, 20, 100);
    graphics.generateTexture('pcTx', 20, 100);

    graphics.clear();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(10, 10, 10);
    graphics.generateTexture('ballTx', 20, 20);
  }

  function create(this: Phaser.Scene) {
    this.add.rectangle(400, 200, 800, 400, 0x000000);
    this.add.tileSprite(400, 200, 4, 400, 'separator').setAlpha(0.5);

    if (this.input.keyboard) {
      cursors = this.input.keyboard.createCursorKeys();
    }

    player = this.physics.add.sprite(780, 200, 'playerTx');
    player.setCollideWorldBounds(true);
    player.setImmovable(true);

    pc = this.physics.add.sprite(20, 200, 'pcTx');
    pc.setCollideWorldBounds(true);
    pc.setImmovable(true);

    ball = this.physics.add.sprite(400, 200, 'ballTx');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);

    resetBall(this);

    this.physics.add.collider(ball, player, hitPlayer, undefined, this);
    this.physics.add.collider(ball, pc, hitPc, undefined, this);

    scoreTextPc = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#F00' });
    scoreTextPlayer = this.add.text(550, 16, 'Score: 0', { fontSize: '32px', color: '#00F' });

    infoText = this.add.text(400, 380, 'Lose to Win (First to 5)', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
  }

  function update(this: Phaser.Scene) {
    if (cursors.up.isDown) {
      player.setVelocityY(-300);
    } else if (cursors.down.isDown) {
      player.setVelocityY(300);
    } else {
      player.setVelocityY(0);
    }

    if (ball.y < pc.y - 10) {
      pc.setVelocityY(-250);
    } else if (ball.y > pc.y + 10) {
      pc.setVelocityY(250);
    } else {
      pc.setVelocityY(0);
    }

    if (ball.x > 800) {
      scorePc += 1;
      scoreTextPc.setText('Score: ' + scorePc);

      if (scorePc >= 5) {
        infoText.setText('DEFEAT... (Glitch: Success)');
        this.physics.pause();
        setTimeout(() => onGameOver(), 1000);
      } else {
        resetBall(this);
      }
    }

    if (ball.x < 0) {
      scorePlayer += 1;
      scoreTextPlayer.setText('Score: ' + scorePlayer);

      if (scorePlayer >= 5) {
        infoText.setText('VICTORY! (Glitch: Reset)');
        this.physics.pause();
        setTimeout(() => onVictory(), 1000);
      } else {
        resetBall(this);
      }
    }
  }

  function hitPlayer(b: any, p: any) {
    const currentVel = b.body.velocity.x;
    let newVel = Math.abs(currentVel) + 50;
    if (newVel > 800) newVel = 800;

    b.setVelocityX(-newVel);
  }

  function hitPc(b: any, p: any) {
    const currentVel = b.body.velocity.x;
    let newVel = Math.abs(currentVel) + 50;
    if (newVel > 800) newVel = 800;

    b.setVelocityX(newVel);
  }

  function resetBall(scene: Phaser.Scene) {
    ball.setPosition(400, 200);
    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = Math.random() > 0.5 ? 1 : -1;

    ball.setVelocity(250 * dirX, 250 * dirY);
  }

  return (
    <div ref={gameContainer} className="flex justify-center mt-4" />
  );
};

export default Pong;
