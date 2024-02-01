import { ICollisionService } from '../CollisionService.interface';

export class ShieldCollisionService {
    props: ICollisionService;

    constructor(props: ICollisionService) {
        this.props = props;
    }

    handleCollision() {
        const { projectiles, invaders, shields } = this.props.game;
        const defenderProjectilesToRemove: { index: number }[] = [];
        const invaderProjectilesToRemove: { index: number }[] = [];

        projectiles.defender.forEach((projectile, i) => {
            const minX = projectile.props.x;
            const maxX = projectile.props.x + projectile.props.width;
            const minY = projectile.props.y;
            const maxY = projectile.props.y + projectile.props.height;

            const isCollided = this.collideWithShield(
                minX,
                maxX,
                minY,
                maxY,
                true
            );
            if (isCollided) {
                defenderProjectilesToRemove.push({ index: i });
                shields.drawParticles();
            }
        });

        projectiles.invader.forEach((projectile, i) => {
            const minX = projectile.props.x;
            const maxX = projectile.props.x + projectile.props.width;
            const minY = projectile.props.y;
            const maxY = projectile.props.y + projectile.props.height;

            const isCollided = this.collideWithShield(
                minX,
                maxX,
                minY,
                maxY,
                true
            );
            if (isCollided) {
                invaderProjectilesToRemove.push({ index: i });
                shields.drawParticles();
            }
        });

        invaders.livingInvaders.forEach((invader) => {
            const minX = invader.props.x;
            const maxX = invader.props.x + invader.props.width;
            const minY = invader.props.y;
            const maxY = invader.props.y + invader.props.height;

            const isCollided = this.collideWithShield(
                minX,
                maxX,
                minY,
                maxY,
                false
            );
            if (isCollided) {
                shields.drawParticles();
            }
        });

        defenderProjectilesToRemove?.forEach((projectile) =>
            projectiles.defender.splice(projectile.index, 1)
        );

        invaderProjectilesToRemove.forEach((projectile) =>
            projectiles.invader.splice(projectile.index, 1)
        );
    }

    collideWithShield(
        minX: number,
        maxX: number,
        minY: number,
        maxY: number,
        blast: boolean
    ) {
        const { shields } = this.props.game;
        let isCollided = false;

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                const key = `${x}x${y}`;
                // Check if the particle exists
                if (shields.allParticles[key]) {
                    shields.allParticles[key] = false;
                    isCollided = true;
                }
            }
        }

        if (isCollided && blast) {
            const minXBlast = minX - shields.explosionRadius;
            const maxXBlast = maxX + shields.explosionRadius;
            const minYBlast = minY - shields.explosionHeight;
            const maxYBlast = maxY + shields.explosionHeight;

            for (let x = minXBlast; x <= maxXBlast; x++) {
                for (let y = minYBlast; y <= maxYBlast; y++) {
                    const key = `${x}x${y}`;
                    // Check if the particle exists
                    if (shields.allParticles[key]) {
                        if (shields.explosionChance > Math.random()) {
                            shields.allParticles[key] = false;
                        }
                    }
                }
            }
        }

        return isCollided;
    }
}
