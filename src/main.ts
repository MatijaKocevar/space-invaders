import { DevControls } from './components/DevControls/DevControls';
import { Game } from './components/Game/Game';
import './style.css';

let game: Game | undefined;
let devControls: DevControls | undefined;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#game-canvas') as HTMLCanvasElement;
    canvas.addEventListener('click', handleReset);

    if (canvas) {
        const context = canvas.getContext('2d');

        const canvasWidth = 600;
        const canvasHeight = 600;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        if (context) {
            game = new Game({
                context,
                gameWidth: canvasWidth,
                gameHeight: canvasHeight,
                godMode: false,
                shieldsOn: true,
            });

            devControls = new DevControls({ game });

            animate();
        }
    }
});

const handleReset = () => {
    if (game?.gameService.isGameOver) {
        const canvas = document.querySelector(
            '#game-canvas'
        ) as HTMLCanvasElement;
        canvas.addEventListener('click', handleReset);

        if (canvas) {
            const context = canvas.getContext('2d');

            const canvasWidth = 600;
            const canvasHeight = 600;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            if (context) {
                let currentScore = game.scoreService.score;
                if (game.gameService.gameOverMessage !== 'You win!') {
                    currentScore = 0;
                }

                game = new Game({
                    context,
                    gameWidth: canvasWidth,
                    gameHeight: canvasHeight,
                    godMode: game.godMode,
                    shieldsOn: game.shieldsOn,
                });

                game.scoreService.score = currentScore;

                if (devControls) devControls.props.game = game;

                animate();
            }
        }
    }
};

const animate = () => {
    game?.update();
    game?.draw();

    if (game?.gameService.isGameOver) {
        game?.gameService.drawGameOver();
        return;
    }
    requestAnimationFrame(animate);
};
