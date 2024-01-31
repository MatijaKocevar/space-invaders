import { Game } from '../classes/Game/Game';

export class InputHandler {
    keys: string[]; // Array to store the currently pressed keys
    // mobileControls: any; // Refs to the mobile control buttons
    game: Game;

    constructor(game: Game) {
        this.keys = [];
        // this.mobileControls = mobileControls;
        this.game = game;

        // // Add event listeners for touch events on mobile control buttons
        // this.mobileControls?.forEach((control: any) => {
        //     if (control.current) {
        //         control.current.addEventListener('touchstart', (e: any) =>
        //             this.onTouchStart(e, control)
        //         );
        //         control.current.addEventListener('touchend', (e: any) =>
        //             this.onTouchEnd(e, control)
        //         );
        //     }
        // });

        // Add event listeners for keydown and keyup events on window
        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('keyup', this.keyupHandler);
    }

    // onTouchStart = (e: TouchEvent, control: any) => {
    //     e.preventDefault();
    //     if (control.current) {
    //         // Map touch events to corresponding key codes and add to the keys array
    //         if (control.current.id === 'left') this.keys.push('KeyA');
    //         if (control.current.id === 'right') this.keys.push('KeyD');
    //         if (control.current.id === 'fire') this.keys.push('Enter');
    //     }
    // };

    // onTouchEnd = (e: TouchEvent, control: any) => {
    //     e.preventDefault();
    //     if (control.current) {
    //         // Remove the corresponding key code from the keys array when touch ends
    //         if (control.current.id === 'left')
    //             this.keys.splice(this.keys.indexOf('KeyA'), 1);
    //         if (control.current.id === 'right')
    //             this.keys.splice(this.keys.indexOf('KeyD'), 1);
    //         if (control.current.id === 'fire')
    //             this.keys.splice(this.keys.indexOf('Enter'), 1);
    //     }
    // };

    keydownHandler = (e: KeyboardEvent) => {
        e.preventDefault();

        // Add the pressed key code to the keys array if it's not already present
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

        // Remove the released key code from the keys array
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
        // Remove the event listeners when destroying the input handler
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('keyup', this.keyupHandler);
    };
}
