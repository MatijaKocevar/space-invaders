import { Explosion } from './Explosion';
import { IExplosions } from './entities/IExplosions.interface';

export class Explosions {
    props: IExplosions;
    explosions: Explosion[] = [];

    constructor(props: IExplosions) {
        this.props = props;
    }

    add = (x: number, y: number) => {
        const explosion = new Explosion({ x, y, game: this.props.game });
        this.explosions.push(explosion);
    };

    draw = () => {
        const explosionsToRemove: number[] = [];

        this.explosions.forEach((explosion) => {
            explosion.draw();

            if (explosion.lingerCount >= 20) {
                explosionsToRemove.push(this.explosions.indexOf(explosion));
            }
        });

        explosionsToRemove.forEach((index) => {
            this.explosions.splice(index, 1);
        });
    };
}
