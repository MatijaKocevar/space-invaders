import explosionSprite from '../../sprites/explosion.png';
import { IExplosion } from './entities/IExplosion.interface';

export class Explosion {
    props: IExplosion;
    image = new Image();
    width: number;
    height: number;
    lingerCount = 0;

    constructor(props: IExplosion) {
        this.props = props;
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
