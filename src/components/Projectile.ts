import { Game } from './Game';
import shoot from '../audio/shoot.wav';

interface IProjectile {
    speed: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    direction: 'up' | 'down';
    game: Game;
}

export class Projectile {
    props: IProjectile;
    shoot: HTMLAudioElement;

    constructor({
        height,
        speed,
        width,
        x,
        y,
        color,
        direction,
        game,
    }: IProjectile) {
        this.props = { height, speed, width, x, y, color, direction, game };
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

interface IProjectiles {
    game: Game;
}

export class Projectiles {
    props: IProjectiles;
    defender: Projectile[];
    invader: Projectile[];
    defenderProjectilesToRemove: { index: number }[];
    invaderProjectilesToRemove: { index: number }[];

    constructor({ game }: IProjectiles) {
        this.props = { game };
        this.defender = [];
        this.invader = [];
        this.defenderProjectilesToRemove = [];
        this.invaderProjectilesToRemove = [];
    }

    checkOutOfBounds = () => {
        const { height } = this.props.game.props;
        this.defenderProjectilesToRemove = [];
        this.invaderProjectilesToRemove = [];

        // Chech if playerProjectiles go off the screen
        this.defender.forEach((projectile, i) => {
            if (projectile.props.y < 0) {
                this.defenderProjectilesToRemove.push({ index: i });
            }
        });

        // Chech if invaderProjectiles go off the screen
        this.invader.forEach((projectile, i) => {
            if (projectile.props.y > height) {
                this.invaderProjectilesToRemove.push({ index: i });
            }
        });

        if (
            this.invaderProjectilesToRemove.length > 0 ||
            this.defenderProjectilesToRemove.length > 0
        ) {
            this.defenderProjectilesToRemove?.forEach((projectile) =>
                this.defender.splice(projectile.index, 1)
            );
            this.invaderProjectilesToRemove.forEach((projectile) =>
                this.invader.splice(projectile.index, 1)
            );
        }
    };

    update = () => {
        this.defender.forEach((projectile) => projectile.update());
        this.invader.forEach((projectile) => projectile.update());
    };

    draw = () => {
        this.defender.forEach((projectile) => projectile.draw());
        this.invader.forEach((projectile) => projectile.draw());
    };
}
