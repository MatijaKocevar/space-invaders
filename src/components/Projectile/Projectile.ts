import shoot from '../../audio/shoot.wav';
import { IProjectile } from './entities/IProjectile.interface';

export class Projectile {
    props: IProjectile;
    shoot: HTMLAudioElement;

    constructor(props: IProjectile) {
        this.props = props;
        this.shoot = new Audio(shoot);
        this.props.previousX = props.x;
        this.props.previousY = props.y;
    }

    update(deltaTime: number) {
        const speedMultiplier = deltaTime / 16.67; 
        const movement = this.props.speed * speedMultiplier;
        
        const maxMovement = 8; 
        const actualMovement = Math.min(movement, maxMovement);
        
        this.props.previousX = this.props.x;
        this.props.previousY = this.props.y;
        
        if (this.props.direction === 'down') this.props.y += actualMovement;
        if (this.props.direction === 'up') this.props.y -= actualMovement;
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
