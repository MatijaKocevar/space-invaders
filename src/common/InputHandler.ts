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

    createMobileControls = () => {
        if (this.mobileControls?.children.length) {
            this.mobileControls.innerHTML = '';
        }

        const leftButton = document.createElement('button');
        leftButton.id = 'left-button';
        leftButton.innerHTML = '&lt;';
        leftButton.addEventListener('touchstart', this.onLeftButtonTouchStart);
        leftButton.addEventListener('touchend', this.onLeftButtonTouchEnd);
        leftButton.addEventListener('mousedown', this.onLeftButtonTouchStart);
        leftButton.addEventListener('mouseup', this.onLeftButtonTouchEnd);

        const fireButton = document.createElement('button');
        fireButton.id = 'fire-button';
        fireButton.innerHTML = 'FIRE';
        fireButton.addEventListener('touchstart', this.onFireButtonTouchStart);
        fireButton.addEventListener('touchend', this.onFireButtonTouchEnd);
        fireButton.addEventListener('mousedown', this.onFireButtonTouchStart);
        fireButton.addEventListener('mouseup', this.onFireButtonTouchEnd);

        const rightButton = document.createElement('button');
        rightButton.id = 'right-button';
        rightButton.innerHTML = '&gt;';
        rightButton.addEventListener(
            'touchstart',
            this.onRightButtonTouchStart
        );
        rightButton.addEventListener('touchend', this.onRightButtonTouchEnd);
        rightButton.addEventListener('mousedown', this.onRightButtonTouchStart);
        rightButton.addEventListener('mouseup', this.onRightButtonTouchEnd);

        this.mobileControls?.append(leftButton, fireButton, rightButton);

        if (window.innerWidth < 600) {
            this.mobileControls?.classList.add('show-mobile-controls');
        }
    };

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

    onLeftButtonTouchStart = (e: Event) => {
        console.log('left button touched');

        e.preventDefault();

        this.keys.push('KeyA');
    };

    onRightButtonTouchStart = (e: Event) => {
        console.log('right button touched');

        e.preventDefault();

        this.keys.push('KeyD');
    };

    onFireButtonTouchStart = (e: Event) => {
        console.log('fire button touched');

        e.preventDefault();

        this.keys.push('Enter');
    };

    onLeftButtonTouchEnd = (e: Event) => {
        console.log('left button released');

        e.preventDefault();

        this.keys.splice(this.keys.indexOf('KeyA'), 1);
    };

    onRightButtonTouchEnd = (e: Event) => {
        console.log('right button released');

        e.preventDefault();

        this.keys.splice(this.keys.indexOf('KeyD'), 1);
    };

    onFireButtonTouchEnd = (e: Event) => {
        console.log('fire button released');

        e.preventDefault();

        this.keys.splice(this.keys.indexOf('Enter'), 1);
    };

    destroy = () => {
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('keyup', this.keyupHandler);
    };
}
