import { Projectile } from '../Projectile/Projectile';
import invaderDeath from '../../audio/invaderkilled.wav';
import { IInvader } from './entities/IInvader.interface';

export class Invader {
    props: IInvader;
    spriteWidth: number;
    spriteHeight: number;
    frame = 0;
    currentDirection: 'left' | 'right' = 'right';
    invaderDeath: HTMLAudioElement;

    constructor(props: IInvader) {
        this.props = props;
        this.spriteWidth = 57;
        this.spriteHeight = 38;
        this.invaderDeath = new Audio(invaderDeath);
    }

    moveLeft = () => (this.props.x -= this.props.speed);

    moveRight = () => (this.props.x += this.props.speed);

    moveDown = () => (this.props.y += this.props.height);

    updateInvader = (direction: 'left' | 'right') => {
        const { gameFrame } = this.props.game;

        if (this.currentDirection != direction) {
            // Change direction and move down when the invader reaches the edge of the canvas
            this.moveDown();
            this.currentDirection = direction;
            return;
        }
        // If the invader is not at the edge of the canvas, continue moving in the current direction
        if (direction === 'left') this.moveLeft();
        if (direction === 'right') this.moveRight();

        // Update the frame of the invader's animation
        if (gameFrame % this.props.animationSpeed === 0) {
            this.frame > 0 ? (this.frame = 0) : this.frame++;
        }
    };

    fire = () => {
        const projectile = new Projectile({
            height: 10,
            width: 2,
            speed: 10,
            x: this.props.x + this.props.width / 2 - 2,
            y: this.props.y,
            color: 'white',
            direction: 'down',
            game: this.props.game,
        });

        return projectile;
    };

    draw = () => {
        const { context } = this.props.game.props;
        // Draw the invader on the canvas
        if (this.props.image) {
            // context.fillStyle = "red";
            // context.fillRect(this.props.x, this.props.y, this.props.width, this.props.height);
            context.drawImage(
                this.props.image,
                this.frame * this.spriteWidth,
                0,
                this.spriteWidth,
                this.spriteHeight,
                this.props.x,
                this.props.y,
                this.props.width,
                this.props.height
            );
        }
    };
}
