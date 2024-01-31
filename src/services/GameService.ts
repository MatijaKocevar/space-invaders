import { drawText } from '../utils/utils';

interface IGameService {
    gameWidth: number;
    gameHeight: number;
    context: CanvasRenderingContext2D;
}

export class GameService {
    props: IGameService;
    gameOverMessage = '';
    isGameOver = false;

    constructor(props: IGameService) {
        this.props = props;
    }

    drawGameOver = () => {
        const { context, gameWidth, gameHeight } = this.props;

        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, gameWidth, gameHeight);

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
        this.isGameOver = gameOver;
    };

    setGameOverMessage = (message: string) => {
        this.gameOverMessage = message;
    };
}
