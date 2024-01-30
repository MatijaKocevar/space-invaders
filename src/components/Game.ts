import { drawText } from '../utils/utils';
import { Defender } from './Defender';
import { Explosions } from './Explosion';
import { InputHandler } from './InputHandler';
import { Invaders } from './Invader';
import { Projectiles } from './Projectile';
import { Shields } from './ShieldBlock';

interface IGame {
    gameWidth: number;
    gameHeight: number;
    // mobileControls: any;
    context: CanvasRenderingContext2D;
    // setShowPopupScore: any;
}

export class Game {
    props: IGame;
    gameFrame = 0;
    inputHandler: InputHandler;
    defender: Defender;
    invaders: Invaders;
    shields: Shields;
    projectiles: Projectiles;
    explosions: Explosions;
    score = 0;
    gameOverMessage = '';
    gameOver = false;
    playSound = false;

    constructor({ gameHeight, gameWidth, context }: IGame) {
        this.props = {
            gameHeight,
            gameWidth,
            context,
        };
        this.inputHandler = new InputHandler(this);
        this.shields = new Shields({ game: this });
        this.invaders = new Invaders({ game: this });
        this.defender = new Defender({ game: this });
        this.projectiles = new Projectiles({ game: this });
        this.explosions = new Explosions({ game: this });
    }

    update = () => {
        this.invaders.updateInvaders(this.gameFrame);
        this.defender.update();
        this.projectiles.update();
        this.handleCollision();
    };

    draw = () => {
        const { context } = this.props;

        this.gameFrame++;
        context.clearRect(0, 0, this.props.gameWidth, this.props.gameHeight);

        this.invaders.draw();
        this.defender.draw();
        this.shields.draw();
        this.projectiles.draw();
        this.explosions.draw();

        this.drawHighscore();
        this.drawLives();
    };

    handleCollision = () => {
        this.projectiles.checkOutOfBounds();
        this.invaders.handleCollision();
        this.defender.handleCollision();
        this.shields.handleCollision();
    };

    drawHighscore = () => {
        const { context } = this.props;

        drawText(context, {
            alignment: 'center',
            fillStyle: 'white',
            font: 'bold 15px Arial',
            text: 'SCORE',
            x: 40,
            y: 20,
        });

        drawText(context, {
            alignment: 'center',
            fillStyle: 'white',
            font: 'bold 15px Arial',
            text: this.score.toString(),
            x: 80,
            y: 20,
        });
    };

    drawLives = () => {
        const { context, gameWidth } = this.props;

        const livesText = this.defender.lives.toString();

        drawText(context, {
            alignment: 'center',
            fillStyle: 'white',
            font: 'bold 15px Arial',
            text: livesText,
            x: gameWidth - 80,
            y: 20,
        });

        for (let i = 0; i < this.defender.lives - 1; i++) {
            const lifeXpos = gameWidth - 65 + i * 30;
            context.drawImage(this.defender.image, lifeXpos, 3, 20, 20);
        }
    };

    drawGameOver = () => {
        const { context, gameWidth, gameHeight } = this.props;

        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, this.props.gameWidth, this.props.gameHeight);

        drawText(context, {
            alignment: 'center',
            fillStyle: 'white',
            font: '48px Arial',
            text: 'GAME OVER',
            x: gameWidth / 2,
            y: gameHeight / 2.2,
        });

        drawText(context, {
            alignment: 'center',
            fillStyle: this.gameOverMessage === 'You win!' ? 'green' : 'red',
            font: '24px Arial',
            text: this.gameOverMessage ?? '',
            x: gameWidth / 2,
            y: gameHeight / 2.2 + 50,
        });

        drawText(context, {
            alignment: 'center',
            fillStyle: 'white',
            font: '18px Arial',
            text: 'Click anywhere to reset',
            x: gameWidth / 2,
            y: gameHeight / 2.2 + 100,
        });
    };

    setGameOver = (gameOver: boolean) => {
        this.gameOver = gameOver;
    };

    setGameOverMessage = (message: string) => {
        this.gameOverMessage = message;
    };

    destroy = () => {
        this.inputHandler.destroy();
        this.invaders.destroy();
        this.shields.destroy();
        this.defender.destroy();
    };
}
