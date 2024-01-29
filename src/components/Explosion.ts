import { Game } from './Game';
import explosionSprite from '../sprites/explosion.png';

interface IExplosion {
    x: number;
    y: number;
    game: Game;
}

export class Explosion {
    props: IExplosion;
    image = new Image();
    width: number;
    height: number;
    lingerCount = 0;

    constructor({ x, y, game }: IExplosion) {
        this.props = { x, y, game };
        this.width = 35;
        this.height = 25;

        this.image.src = explosionSprite;
    }

    draw = () => {
        const { context } = this.props.game.props;
        this.lingerCount++;
        context.drawImage(
            this.image,
            this.props.x - 2,
            this.props.y - 2,
            this.width,
            this.height
        );
    };
}

export class Explosions {
    props: { game: Game };
    explosions: Explosion[] = [];

    constructor({ game }: { game: Game }) {
        this.props = { game };
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
