import { GameOptions } from './components/GameOptions/GameOptions';
import { Game } from './components/Game/Game';
import './style.css';
import { Shields } from './components/Shield/Shields';

let game: Game | undefined;
let gameOptions: GameOptions | undefined;
const gameWidth = 800;
const gameHeight = 600;
let lastTime = 0;

const setupCanvas = (canvas: HTMLCanvasElement) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const gameOptionsHeight = 80;
    
    const mobileControlsHeight = windowWidth <= 768 ? 80 : 0;
    
    const availableHeight = windowHeight - gameOptionsHeight - mobileControlsHeight;
    
    const availableSize = Math.min(windowWidth, availableHeight);
    
    const canvasSize = Math.min(gameWidth, gameHeight);
    const scale = availableSize / canvasSize;
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    canvas.style.width = `${canvasSize * scale}px`;
    canvas.style.height = `${canvasSize * scale}px`;
    
    canvas.style.position = 'fixed';
    canvas.style.left = '50%';
    canvas.style.top = `${gameOptionsHeight + (availableHeight / 2)}px`;
    canvas.style.transform = 'translate(-50%, -50%)';
    canvas.style.zIndex = '1';
};

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#game-canvas') as HTMLCanvasElement;
    canvas.addEventListener('click', handleReset);

    if (canvas) {
        const context = canvas.getContext('2d');

        setupCanvas(canvas);

        if (context) {
            game = new Game({
                context,
                gameWidth: Math.min(gameWidth, gameHeight),
                gameHeight: Math.min(gameWidth, gameHeight),
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

            setupCanvas(canvas);

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
                    gameWidth: Math.min(gameWidth, gameHeight),
                    gameHeight: Math.min(gameWidth, gameHeight),
                    godMode: game.godMode,
                    shieldsOn: game.shieldsOn,
                });

                game.scoreService.score = currentScore;
                game.shields = currentShields;
                game.defender.x = currentPlayerX;

                if (gameOptions) gameOptions.props.game = game;

                lastTime = 0; 
                animate();
            }
        }
    }
};

const animate = (currentTime: number = 0) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const clampedDeltaTime = Math.min(deltaTime, 33.33); 
    
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

window.addEventListener('resize', () => {
    const canvas = document.querySelector('#game-canvas') as HTMLCanvasElement;
    if (canvas) {
        setupCanvas(canvas);
    }
});
