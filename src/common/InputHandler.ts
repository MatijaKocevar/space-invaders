import { Game } from '../components/Game/Game';

export class InputHandler {
    keys: string[];
    game: Game;

    constructor(game: Game) {
        this.keys = [];
        this.game = game;

        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('keyup', this.keyupHandler);
    }

    keydownHandler = (e: KeyboardEvent) => {
        e.preventDefault();

        if (
            (e.code === 'KeyW' ||
                e.code === 'KeyA' ||
                e.code === 'KeyS' ||
                e.code === 'KeyD' ||
                e.code === 'Enter') &&
            this.keys.indexOf(e.code) === -1
        ) {
            this.keys.push(e.code);
        }
    };

    keyupHandler = (e: KeyboardEvent) => {
        e.preventDefault();

        if (
            e.code === 'KeyW' ||
            e.code === 'KeyA' ||
            e.code === 'KeyS' ||
            e.code === 'KeyD' ||
            e.code === 'Enter'
        ) {
            this.keys.splice(this.keys.indexOf(e.code), 1);
        }
    };

    destroy = () => {
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('keyup', this.keyupHandler);
    };
}
