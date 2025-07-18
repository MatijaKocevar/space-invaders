import { GameOptions } from './components/GameOptions/GameOptions';
import { Game } from './components/Game/Game';
import './style.css';
import { Shields } from './components/Shield/Shields';

let game: Game | undefined;
let gameOptions: GameOptions | undefined;
const canvasWidth = 600;
const canvasHeight = 600;
let lastTime = 0;

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

            gameOptions = new GameOptions({ game });

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

                if (gameOptions) gameOptions.props.game = game;

                lastTime = 0; // Reset timing for new game
                animate();
            }
        }
    }
};

const animate = (currentTime: number = 0) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Cap deltaTime to prevent large jumps and normalize to 60 FPS
    const clampedDeltaTime = Math.min(deltaTime, 33.33); // Max 33.33ms (30 FPS minimum)
    
    if (clampedDeltaTime > 0) {
        game?.update(clampedDeltaTime);
    }
    game?.draw();

    if (game?.gameService.isGameOver) {
        game?.gameService.drawGameOver();

        if (game.gameService.gameOverMessage !== 'You win!') {
            gameOptions?.saveHighscore();
        }

        return;
    }
    requestAnimationFrame(animate);
};

window.addEventListener('beforeunload', () => {
    game?.destroy();
});
