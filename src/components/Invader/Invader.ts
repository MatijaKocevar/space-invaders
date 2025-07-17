import { Projectile } from '../Projectile/Projectile';
import invaderDeath from '../../audio/invaderkilled.wav';
import { IInvader } from './entities/IInvader.interface';

export class Invader {
    props: IInvader;
    spriteWidth: number;
    spriteHeight: number;
    frame = 0;
    animationTimer = 0;
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

    updateInvader = (direction: 'left' | 'right', deltaTime: number) => {
        if (this.currentDirection != direction) {
            this.moveDown();
            this.currentDirection = direction;
            return;
        }
        if (direction === 'left') this.moveLeft();
        if (direction === 'right') this.moveRight();

        // Update animation timer and frame - animate every 0.5 seconds (30 frames at 60fps)
        this.animationTimer += deltaTime;
        const animationInterval = 0.5; // 0.5 seconds - much faster than movement
        
        if (this.animationTimer >= animationInterval) {
            this.frame = this.frame > 0 ? 0 : 1;
            this.animationTimer = 0;
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
        if (this.props.image) {
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
