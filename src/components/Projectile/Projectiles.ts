import { Projectile } from './Projectile';
import { IProjectiles } from './entities/IProjectiles.interface';

export class Projectiles {
    props: IProjectiles;
    defender: Projectile[];
    invader: Projectile[];
    defenderProjectilesToRemove: { index: number }[];
    invaderProjectilesToRemove: { index: number }[];

    constructor(props: IProjectiles) {
        this.props = props;
        this.defender = [];
        this.invader = [];
        this.defenderProjectilesToRemove = [];
        this.invaderProjectilesToRemove = [];
    }

    update = () => {
        this.checkOutOfBounds();

        this.defender.forEach((projectile) => projectile.update());
        this.invader.forEach((projectile) => projectile.update());
    };

    draw = () => {
        this.defender.forEach((projectile) => projectile.draw());
        this.invader.forEach((projectile) => projectile.draw());
    };

    checkOutOfBounds = () => {
        const { gameHeight } = this.props.game.props;
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
            if (projectile.props.y > gameHeight) {
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
}
