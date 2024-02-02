import { drawText } from '../../utils/utils';
import { IGameService } from './GameService.interface';

export class GameService {
    props: IGameService;
    gameOverMessage = '';
    isGameOver = false;

    constructor(props: IGameService) {
        this.props = props;

        window.addEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const { innerWidth } = window;
        const { inputHandler } = this.props.game;

        if (innerWidth < 600) {
            inputHandler.mobileControls?.classList.add('show-mobile-controls');
        } else {
            inputHandler.mobileControls?.classList.remove(
                'show-mobile-controls'
            );
        }
    };

    drawGameOver = () => {
        const { context, gameWidth, gameHeight } = this.props.game.props;

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
            text:
                this.gameOverMessage === 'You win!'
                    ? 'Click anywhere to continue'
                    : 'Click anywhere to reset',
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

    drawInstructions = () => {
        const { context, gameWidth } = this.props.game.props;

        drawText(context, {
            alignment: 'center',
            fillStyle: 'white',
            font: '12px Arial',
            text: 'A/D to move, Space to shoot',
            x: gameWidth / 2,
            y: 20,
        });
    };
}
