import { Shield } from './Shield';
import { IShields } from './entities/IShields.interface';

export class Shields {
    shieldArray: Shield[] = [];
    props: IShields;
    allParticles: { [key: string]: boolean } = {};
    explosionRadius = 2;
    explosionHeight = 5;
    explosionChance = 0.5;

    offScreenCanvas: HTMLCanvasElement;
    offScreenContext: CanvasRenderingContext2D | null;

    constructor(props: IShields) {
        this.props = props;
        this.createShields(props.game.props.gameWidth);

        this.offScreenCanvas = document.createElement('canvas');
        this.offScreenCanvas.width = props.game.props.gameWidth;
        this.offScreenCanvas.height = props.game.props.gameHeight;
        this.offScreenContext = this.offScreenCanvas.getContext('2d');

        this.drawParticles();
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

        this.shieldArray.forEach((shield) => {
            this.allParticles = {
                ...this.allParticles,
                ...shield.allParticles,
            };
        });

        this.allParticles;
    };

    draw() {
        const { context } = this.props.game.props;

        context.drawImage(this.offScreenCanvas, 0, 0);
    }

    drawParticles() {
        this.offScreenContext?.clearRect(
            0,
            0,
            this.offScreenCanvas.width,
            this.offScreenCanvas.height
        );

        Object.keys(this.allParticles).flatMap((key) => {
            if (this.allParticles[key]) {
                const [x, y] = key.split('x');

                if (this.offScreenContext) {
                    this.offScreenContext.fillStyle = '#00d300';
                    this.offScreenContext.fillRect(
                        parseInt(x),
                        parseInt(y),
                        1,
                        1
                    );
                }
            }
        });
    }

    destroy = () => {
        this.shieldArray = [];
    };
}
