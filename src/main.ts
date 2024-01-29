import { Game } from './components/Game';
import './style.css';

let game: Game | undefined = undefined;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#game-canvas') as HTMLCanvasElement;
    canvas.addEventListener('click', handleReset);

    if (canvas) {
        const context = canvas.getContext('2d');

        const canvasWidth = 600;
        const canvasHeight = 290;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        if (context) {
            game = new Game({
                context,
                width: canvasWidth,
                height: canvasHeight,
            });

            animate();
        }
    }
});

const handleReset = () => {
    if (game?.gameOver) {
        game.setGameOver(false);

        const canvas = document.querySelector(
            '#game-canvas'
        ) as HTMLCanvasElement;

        if (canvas) {
            const context = canvas.getContext('2d');

            if (context) {
                game = new Game({
                    context,
                    width: canvas.width,
                    height: canvas.height,
                });

                animate();
            }
        }
    }
};

const animate = () => {
    game?.update();
    game?.draw();

    if (game?.gameOver) {
        game?.drawGameOver();
        return;
    }
    requestAnimationFrame(animate);
};
