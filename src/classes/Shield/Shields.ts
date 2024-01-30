import { Shield } from './Shield';
import { IShields } from './entities/IShields.interface';

export class Shields {
    shieldArray: Shield[] = [];
    props: IShields;

    constructor(props: IShields) {
        this.props = props;
        this.createShields(props.game.props.gameWidth);
    }

    createShields = (width: number) => {
        const { game } = this.props;
        const shieldWidth = 68;
        const shieldSpacing = (width - 4 * shieldWidth) / 5; // Total spacing divided equally before and after the shields

        this.shieldArray.push(new Shield({ x: shieldSpacing, y: 500, game }));
        this.shieldArray.push(
            new Shield({
                x: shieldSpacing + shieldWidth + shieldSpacing,
                y: 500,
                game,
            })
        );
        this.shieldArray.push(
            new Shield({
                x: shieldSpacing + 2 * shieldWidth + 2 * shieldSpacing,
                y: 500,
                game,
            })
        );
        this.shieldArray.push(
            new Shield({
                x: shieldSpacing + 3 * shieldWidth + 3 * shieldSpacing,
                y: 500,
                game,
            })
        );
    };

    handleCollision() {
        const { projectiles } = this.props.game;

        this.shieldArray.forEach((Shield, s) => {
            Shield.handleCollision(projectiles, s);
        });
    }

    draw() {
        this.shieldArray.forEach((shield) => {
            shield.draw();
        });
    }

    destroy = () => {
        this.shieldArray = [];
    };
}
