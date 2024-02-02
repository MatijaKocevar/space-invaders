import { GameOptions } from './components/GameOptions/GameOptions';
import { Game } from './components/Game/Game';
import './style.css';
import { Shields } from './components/Shield/Shields';

let game: Game | undefined;
let devControls: GameOptions | undefined;
const canvasWidth = 600;
const canvasHeight = 600;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#game-canvas') as HTMLCanvasElement;
    canvas.addEventListener('click', handleReset);

    if (canvas) {
        const context = canvas.getContext('2d');

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

            devControls = new GameOptions({ game });

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

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            if (context) {
                let currentScore = game.scoreService.score;
                let currentShields = game.shields;
                let currentPlayerX = game.defender.x;

                if (game.gameService.gameOverMessage !== 'You win!') {
                    currentScore = 0;
                    currentShields = new Shields({ game });
                    currentPlayerX = 50;
                }

                game.destroy();

                game = new Game({
                    context,
                    gameWidth: canvasWidth,
                    gameHeight: canvasHeight,
                    godMode: game.godMode,
                    shieldsOn: game.shieldsOn,
                });

                game.scoreService.score = currentScore;
                game.shields = currentShields;
                game.defender.x = currentPlayerX;

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

window.addEventListener('beforeunload', () => {
    game?.destroy();
});
