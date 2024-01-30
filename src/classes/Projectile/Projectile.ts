import shoot from '../../audio/shoot.wav';
import { IProjectile } from './entities/IProjectile.interface';

export class Projectile {
    props: IProjectile;
    shoot: HTMLAudioElement;

    constructor(props: IProjectile) {
        this.props = props;
        this.shoot = new Audio(shoot);
    }

    update() {
        if (this.props.direction === 'down') this.props.y += this.props.speed;
        if (this.props.direction === 'up') this.props.y -= this.props.speed;
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

    destroy = () => {};
}
