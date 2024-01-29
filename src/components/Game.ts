import { Defender } from './Defender';
import { Explosions } from './Explosion';
import { InputHandler } from './InputHandler';
import { Invaders } from './Invader';
import { Projectiles } from './Projectile';
import { Shields } from './ShieldBlock';

interface IGame {
    width: number;
    height: number;
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

    constructor({ height, width, context }: IGame) {
        this.props = {
            height,
            width,
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

    handleCollision = () => {
        this.projectiles.checkOutOfBounds();
        this.invaders.handleCollision();
        this.defender.handleCollision();
        this.shields.handleCollision();
    };

    drawHighscore = () => {
        const { context } = this.props;

        context.fillStyle = 'white';
        context.font = 'bold 15px Arial';
        context.textAlign = 'center';
        context.fillText('SCORE ', 40, 20);

        context.fillStyle = '#00d300';
        context.font = 'bold 15px Arial';
        context.textAlign = 'center';
        context.fillText(this.score.toString(), 80, 20);
    };

    drawLives = () => {
        const { context, width } = this.props;

        context.fillStyle = 'white';
        context.font = 'bold 15px Arial';
        context.textAlign = 'center';
        context.fillText(this.defender.lives.toString(), width - 80, 20);

        for (let i = 0; i < this.defender.lives - 1; i++) {
            const offset = i * 10;
            context.drawImage(
                this.defender.image,
                width - 65 + i * 20 + offset,
                3,
                20,
                20
            );
        }
    };

    draw = () => {
        const { context } = this.props;
        this.gameFrame++;
        context.clearRect(0, 0, this.props.width, this.props.height);

        this.invaders.draw();
        this.defender.draw();
        this.shields.draw();
        this.projectiles.draw();
        this.explosions.draw();

        this.drawHighscore();
        this.drawLives();
    };

    setGameOver = (gameOver: boolean) => {
        this.gameOver = gameOver;
    };

    setGameOverMessage = (message: string) => {
        this.gameOverMessage = message;
    };

    drawGameOver = () => {
        this.props.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.props.context.fillRect(0, 0, this.props.width, this.props.height);

        this.props.context.fillStyle = 'white';
        this.props.context.font = '48px Arial';
        this.props.context.textAlign = 'center';
        this.props.context.fillText(
            'GAME OVER',
            this.props.width / 2,
            this.props.height / 2
        );

        this.props.context.fillStyle =
            this.gameOverMessage === 'You win!' ? 'green' : 'red';
        this.props.context.font = '24px Arial';
        this.props.context.textAlign = 'center';
        this.props.context.fillText(
            this.gameOverMessage ?? '',
            this.props.width / 2,
            this.props.height / 2 + 50
        );

        this.props.context.fillStyle = 'white';
        this.props.context.font = '18px Arial';
        this.props.context.textAlign = 'center';
        this.props.context.fillText(
            'Click anywhere to reset',
            this.props.width / 2,
            this.props.height / 2 + 100
        );
    };

    destroy = () => {
        this.inputHandler.destroy();
        this.invaders.destroy();
        this.shields.destroy();
        this.defender.destroy();
    };
}
