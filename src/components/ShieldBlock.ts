import { Game } from './Game';
import { Invader } from './Invader';
import { Projectile, Projectiles } from './Projectile';

interface IShieldBlock {
    x: number;
    y: number;
    game: Game;
}

interface IParticle {
    x: number;
    y: number;
    width: number;
    height: number;
    active: boolean;
}

export class ShieldBlock {
    props: IShieldBlock;
    particles: IParticle[] = [];

    constructor({ x, y, game }: IShieldBlock) {
        this.props = { x, y, game };
        this.particles = this.getShape();
    }

    getShape = () => {
        const { x, y } = this.props;
        const blockSize = 1; // Size of each smaller rectangle

        const rectangles: IParticle[] = [];

        // Define the corner points of the shape
        const cornerPoints = [
            { x: x + 0, y: y + 0 },
            { x: x + 0, y: y - 40 },
            { x: x + 18.1, y: y - 60 },
            { x: x + 51.5, y: y - 60 },
            { x: x + 68.1, y: y - 40 },
            { x: x + 68.1, y: y + 0 },
            { x: x + 51.5, y: y + 0 },
            { x: x + 51.5, y: y - 8 },
            { x: x + 44.8, y: y - 18 },
            { x: x + 24.8, y: y - 18 },
            { x: x + 18.1, y: y - 8 },
            { x: x + 18.1, y: y + 0 },
        ];

        // Find the minimum and maximum y-values
        let minY = Infinity;
        let maxY = -Infinity;
        cornerPoints.forEach((point) => {
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });

        // Iterate over each scanline (y-coordinate)
        for (let scanlineY = minY; scanlineY <= maxY; scanlineY++) {
            // Keep track of the active pixels in the current scanline
            const activePixels: number[] = [];

            // Iterate over each pair of consecutive corner points
            for (let i = 0; i < cornerPoints.length; i++) {
                const point1 = cornerPoints[i];
                const point2 = cornerPoints[(i + 1) % cornerPoints.length];

                // Check if the current scanline intersects the edge between the two points
                if (
                    (point1.y <= scanlineY && scanlineY < point2.y) ||
                    (point2.y <= scanlineY && scanlineY < point1.y)
                ) {
                    // Calculate the x-coordinate where the scanline intersects the edge
                    const intersectX =
                        (point1.x * (point2.y - scanlineY) +
                            point2.x * (scanlineY - point1.y)) /
                        (point2.y - point1.y);

                    // Add the intersecting x-coordinate to the active pixels
                    activePixels.push(intersectX);
                }
            }

            // Sort the active pixels in ascending order
            activePixels.sort((a, b) => a - b);

            // Iterate over each pair of active pixels and fill the space between them
            for (let i = 0; i < activePixels.length; i += 2) {
                const startX = Math.ceil(activePixels[i]);
                const endX = Math.floor(activePixels[i + 1]);

                // Iterate over each pixel within the span and fill it
                for (let pixelX = startX; pixelX <= endX; pixelX++) {
                    const rect = {
                        x: pixelX,
                        y: scanlineY,
                        width: blockSize,
                        height: blockSize,
                        active: true,
                    };

                    // Check if the rectangle already exists
                    const existingRect = this.particles.find(
                        (r) => r.x === rect.x && r.y === rect.y
                    );
                    if (existingRect) {
                        // Update the existing rectangle
                        existingRect.width = rect.width;
                        existingRect.height = rect.height;
                    } else {
                        // Add the new rectangle to the array
                        rectangles.push(rect);
                    }
                }
            }
        }

        return rectangles;
    };

    isProjectileCollided = (particle: IParticle, projectile: Projectile) => {
        const rect1 = {
            x: particle.x,
            y: particle.y,
            width: particle.width,
            height: particle.height,
        };
        const rect2 = {
            x: projectile.props.x,
            y: projectile.props.y,
            width: projectile.props.width,
            height: projectile.props.height,
        };

        return !(
            rect1.x > rect2.x + rect2.width ||
            rect1.x + rect1.width < rect2.x ||
            rect1.y > rect2.y + rect2.height ||
            rect1.y + rect1.height < rect2.y
        );
    };

    isInvaderCollided = (particle: IParticle, invader: Invader) => {
        const rect1 = {
            x: particle.x,
            y: particle.y,
            width: particle.width,
            height: particle.height,
        };
        const rect2 = {
            x: invader.props.x,
            y: invader.props.y,
            width: invader.props.width,
            height: invader.props.height,
        };

        return !(
            rect1.x > rect2.x + rect2.width ||
            rect1.x + rect1.width < rect2.x ||
            rect1.y > rect2.y + rect2.height ||
            rect1.y + rect1.height < rect2.y
        );
    };

    handleCollision = (projectiles: Projectiles, index: number) => {
        const { game } = this.props;
        const playerProjectilesToRemove: { index: number }[] = [];
        const invaderProjectilesToRemove: { index: number }[] = [];
        const shieldBlocksToRemove: { index: number; shieldIndex: number }[] =
            [];
        const particlesToRemove: number[] = [];
        const explosionRadius = 2;
        const explosionChance = 0.5;

        if (
            projectiles.defender.some(
                (projectile) => projectile.props.y < 550
            ) ||
            projectiles.invader.some(
                (projectile) => projectile.props.y > 400
            ) ||
            game.invaders.alive.some((invader) => invader.props.y > 400)
        ) {
            this.particles.forEach((particle, i) => {
                projectiles.defender.forEach((projectile, d) => {
                    if (!particle.active) return;

                    if (this.isProjectileCollided(particle, projectile)) {
                        playerProjectilesToRemove.push({ index: d });
                        shieldBlocksToRemove.push({
                            index: i,
                            shieldIndex: index,
                        });
                        particlesToRemove.push(i);

                        // Remove particles in a 3px radius around the hit particle
                        this.particles.forEach((nearbyParticle, j) => {
                            // Check if the particle is within the explosion radius
                            if (
                                Math.hypot(
                                    particle.x - nearbyParticle.x,
                                    particle.y - nearbyParticle.y
                                ) <= explosionRadius
                            ) {
                                if (Math.random() < explosionChance) {
                                    shieldBlocksToRemove.push({
                                        index: j,
                                        shieldIndex: index,
                                    });
                                    particlesToRemove.push(j);
                                }
                            }
                        });
                    }
                });

                projectiles.invader.forEach((projectile, p) => {
                    if (!particle.active) return;

                    if (this.isProjectileCollided(particle, projectile)) {
                        invaderProjectilesToRemove.push({ index: p });
                        shieldBlocksToRemove.push({
                            index: i,
                            shieldIndex: index,
                        });
                        particlesToRemove.push(i);

                        // Remove particles in a 3px radius around the hit particle
                        this.particles.forEach((nearbyParticle, j) => {
                            if (
                                Math.hypot(
                                    particle.x - nearbyParticle.x,
                                    particle.y - nearbyParticle.y
                                ) <= explosionRadius
                            ) {
                                // Check if the particle is within the explosion radius
                                if (Math.random() < explosionChance) {
                                    shieldBlocksToRemove.push({
                                        index: j,
                                        shieldIndex: index,
                                    });
                                    particlesToRemove.push(j);
                                }
                            }
                        });
                    }
                });

                game.invaders.alive.forEach((invader) => {
                    if (!particle.active) return;

                    if (this.isInvaderCollided(particle, invader)) {
                        shieldBlocksToRemove.push({
                            index: i,
                            shieldIndex: index,
                        });
                        particlesToRemove.push(i);

                        // Remove particles in a 3px radius around the hit particle
                        this.particles.forEach((nearbyParticle, j) => {
                            if (
                                Math.hypot(
                                    particle.x - nearbyParticle.x,
                                    particle.y - nearbyParticle.y
                                ) <= explosionRadius
                            ) {
                                // Check if the particle is within the explosion radius
                                if (Math.random() < explosionChance) {
                                    shieldBlocksToRemove.push({
                                        index: j,
                                        shieldIndex: index,
                                    });
                                    particlesToRemove.push(j);
                                }
                            }
                        });
                    }
                });
            });
        }

        if (
            playerProjectilesToRemove.length > 0 ||
            invaderProjectilesToRemove.length > 0 ||
            shieldBlocksToRemove.length > 0 ||
            particlesToRemove.length > 0
        ) {
            playerProjectilesToRemove?.forEach((projectile) =>
                projectiles.defender.splice(projectile.index, 1)
            );
            invaderProjectilesToRemove.forEach((projectile) =>
                projectiles.invader.splice(projectile.index, 1)
            );
            shieldBlocksToRemove?.forEach((block) => {
                this.particles[block.index].active = false;
            });
        }
    };

    draw() {
        const { context } = this.props.game.props;

        this.particles.forEach((rect) => {
            if (rect.active) {
                context.fillStyle = '#00d300';
                context.fillRect(rect.x, rect.y, rect.width, rect.height);
            }
        });
    }

    destroy = () => {
        this.particles = [];
    };
}

interface IShields {
    game: Game;
}

export class Shields {
    shieldArray: ShieldBlock[] = [];
    props: IShields;

    constructor({ game }: IShields) {
        this.props = { game };
        this.createShields(game.props.gameWidth);
    }

    createShields = (width: number) => {
        const { game } = this.props;
        const shieldWidth = 68;
        const shieldSpacing = (width - 4 * shieldWidth) / 5; // Total spacing divided equally before and after the shields

        this.shieldArray.push(
            new ShieldBlock({ x: shieldSpacing, y: 500, game })
        );
        this.shieldArray.push(
            new ShieldBlock({
                x: shieldSpacing + shieldWidth + shieldSpacing,
                y: 500,
                game,
            })
        );
        this.shieldArray.push(
            new ShieldBlock({
                x: shieldSpacing + 2 * shieldWidth + 2 * shieldSpacing,
                y: 500,
                game,
            })
        );
        this.shieldArray.push(
            new ShieldBlock({
                x: shieldSpacing + 3 * shieldWidth + 3 * shieldSpacing,
                y: 500,
                game,
            })
        );
    };

    handleCollision() {
        const projectiles = this.props.game.projectiles;

        this.shieldArray.forEach((shieldBlock, s) => {
            shieldBlock.handleCollision(projectiles, s);
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
