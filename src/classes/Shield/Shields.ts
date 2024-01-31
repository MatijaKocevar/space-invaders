import { Shield } from './Shield';
import { IShields } from './entities/IShields.interface';

export class Shields {
    shieldArray: Shield[] = [];
    props: IShields;
    allParticles: { [key: string]: boolean } = {};
    explosionRadius = 2;
    explosionHeight = 5;
    explosionChance = 0.1;

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

        this.shieldArray.forEach((shield) => {
            console.log(shield.allParticles);

            this.allParticles = {
                ...this.allParticles,
                ...shield.allParticles,
            };
        });

        this.allParticles;
    };

    handleCollision() {
        const { defender, invader } = this.props.game.projectiles;
        const { invaders } = this.props.game;
        const defenderProjectilesToRemove: { index: number }[] = [];
        const invaderProjectilesToRemove: { index: number }[] = [];

        defender.forEach((projectile, i) => {
            const minX = projectile.props.x;
            const maxX = projectile.props.x + projectile.props.width;
            const minY = projectile.props.y;
            const maxY = projectile.props.y + projectile.props.height;

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const key = `${x}x${y}`;
                    // Check if the particle exists
                    if (this.allParticles[key]) {
                        this.allParticles[key] = false;
                        defenderProjectilesToRemove.push({ index: i });
                    }
                }
            }

            const minXBlast = minX - this.explosionRadius;
            const maxXBlast = maxX + this.explosionRadius;
            const minYBlast = minY - this.explosionRadius;
            const maxYBlast = maxY + this.explosionRadius;

            for (let x = minXBlast; x <= maxXBlast; x++) {
                for (let y = minYBlast; y <= maxYBlast; y++) {
                    const key = `${x}x${y}`;
                    // Check if the particle exists
                    if (this.allParticles[key]) {
                        if (this.explosionChance > Math.random()) {
                            this.allParticles[key] = false;
                        }
                    }
                }
            }
        });

        invader.forEach((projectile, i) => {
            const minX = projectile.props.x;
            const maxX = projectile.props.x + projectile.props.width;
            const minY = projectile.props.y;
            const maxY = projectile.props.y + projectile.props.height;

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const key = `${x}x${y}`;
                    // Check if the particle exists
                    if (this.allParticles[key]) {
                        this.allParticles[key] = false;
                        invaderProjectilesToRemove.push({ index: i });
                    }
                }
            }

            const minXBlast = minX - this.explosionRadius;
            const maxXBlast = maxX + this.explosionRadius;
            const minYBlast = minY - this.explosionRadius;
            const maxYBlast = maxY + this.explosionRadius;

            for (let x = minXBlast; x <= maxXBlast; x++) {
                for (let y = minYBlast; y <= maxYBlast; y++) {
                    const key = `${x}x${y}`;
                    // Check if the particle exists
                    if (this.allParticles[key]) {
                        if (this.explosionChance > Math.random()) {
                            this.allParticles[key] = false;
                        }
                    }
                }
            }
        });

        invaders.livingInvaders.forEach((invader) => {
            const minX = invader.props.x;
            const maxX = invader.props.x + invader.props.width;
            const minY = invader.props.y;
            const maxY = invader.props.y + invader.props.height;

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const key = `${x}x${y}`;
                    // Check if the particle exists
                    if (this.allParticles[key]) {
                        this.allParticles[key] = false;
                    }
                }
            }
        });

        defenderProjectilesToRemove?.forEach((projectile) =>
            defender.splice(projectile.index, 1)
        );

        invaderProjectilesToRemove.forEach((projectile) =>
            invader.splice(projectile.index, 1)
        );
    }

    draw() {
        const { context } = this.props.game.props;

        Object.keys(this.allParticles).forEach((key) => {
            if (this.allParticles[key]) {
                const [x, y] = key.split('x');

                context.fillStyle = '#00d300';
                context.fillRect(parseInt(x), parseInt(y), 1, 1);
            }
        });
    }

    destroy = () => {
        this.shieldArray = [];
    };
}
