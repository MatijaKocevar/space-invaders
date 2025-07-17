import shoot from '../../audio/shoot.wav';
import { IProjectile } from './entities/IProjectile.interface';

export class Projectile {
    props: IProjectile;
    shoot: HTMLAudioElement;

    constructor(props: IProjectile) {
        this.props = props;
        this.shoot = new Audio(shoot);
    }

    update(deltaTime: number) {
        // Speed is now in pixels per second, so we multiply by deltaTime
        const movement = this.props.speed * deltaTime * 60; // Scale by 60 to maintain similar speeds
        
        if (this.props.direction === 'down') this.props.y += movement;
        if (this.props.direction === 'up') this.props.y -= movement;
    }

    draw() {
        const { context } = this.props.game.props;
        context.fillStyle = this.props.color;
        context.fillRect(
            this.props.x,
            this.props.y,
            this.props.width,
            this.props.height
        );
    }
}
