import { Game } from '../components/Game/Game';

export class InputHandler {
    keys: string[];
    game: Game;
    mobileControls: HTMLElement | null = document.querySelector(
        '.mobile-controls'
    ) as HTMLElement;

    constructor(game: Game) {
        this.keys = [];
        this.game = game;

        addEventListener('keydown', this.keydownHandler);
        addEventListener('keyup', this.keyupHandler);

        this.createMobileControls();
    }

    keydownHandler = (e: KeyboardEvent) => {
        e.preventDefault();

        if (
            (e.code === 'KeyW' ||
                e.code === 'KeyA' ||
                e.code === 'KeyD' ||
                e.code === 'Enter') &&
            this.keys.indexOf(e.code) === -1
        ) {
            this.keys.push(e.code);
        }
    };

    keyupHandler = (e: KeyboardEvent) => {
        e.preventDefault();

        if (e.code === 'KeyA' || e.code === 'KeyD' || e.code === 'Enter') {
            this.keys.splice(this.keys.indexOf(e.code), 1);
        }
    };

    createMobileControls = () => {
        if (this.mobileControls?.children.length) {
            this.mobileControls.innerHTML = '';
        }

        const leftButton = document.createElement('button');
        leftButton.id = 'left-button';
        leftButton.innerHTML = '&lt;';
        leftButton.addEventListener('touchstart', this.onLeftButtonTouchStart, {
            passive: true,
        });
        leftButton.addEventListener('touchend', this.onLeftButtonTouchEnd, {
            passive: true,
        });
        leftButton.addEventListener('mousedown', this.onLeftButtonTouchStart);
        leftButton.addEventListener('mouseup', this.onLeftButtonTouchEnd);

        const fireButton = document.createElement('button');
        fireButton.id = 'fire-button';
        fireButton.innerHTML = 'FIRE';
        fireButton.addEventListener('touchstart', this.onFireButtonTouchStart, {
            passive: true,
        });
        fireButton.addEventListener('touchend', this.onFireButtonTouchEnd, {
            passive: true,
        });
        fireButton.addEventListener('mousedown', this.onFireButtonTouchStart);
        fireButton.addEventListener('mouseup', this.onFireButtonTouchEnd);

        const rightButton = document.createElement('button');
        rightButton.id = 'right-button';
        rightButton.innerHTML = '&gt;';
        rightButton.addEventListener(
            'touchstart',
            this.onRightButtonTouchStart,
            { passive: true }
        );
        rightButton.addEventListener('touchend', this.onRightButtonTouchEnd, {
            passive: true,
        });
        rightButton.addEventListener('mousedown', this.onRightButtonTouchStart);
        rightButton.addEventListener('mouseup', this.onRightButtonTouchEnd);

        this.mobileControls?.append(leftButton, fireButton, rightButton);

        if (window.innerWidth < 600) {
            this.mobileControls?.classList.add('show-mobile-controls');
        }
    };

    onLeftButtonTouchStart = () => {
        this.keys.push('KeyA');
    };

    onRightButtonTouchStart = () => {
        this.keys.push('KeyD');
    };

    onFireButtonTouchStart = () => {
        this.keys.push('Enter');
    };

    onLeftButtonTouchEnd = () => {
        this.keys.splice(this.keys.indexOf('KeyA'), 1);
    };

    onRightButtonTouchEnd = () => {
        this.keys.splice(this.keys.indexOf('KeyD'), 1);
    };

    onFireButtonTouchEnd = () => {
        this.keys.splice(this.keys.indexOf('Enter'), 1);
    };

    destroy = () => {
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('keyup', this.keyupHandler);
    };
}
