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

        const roundedMinX = Math.floor(minX);
        const roundedMaxX = Math.ceil(maxX);
        const roundedMinY = Math.floor(minY);
        const roundedMaxY = Math.ceil(maxY);

        for (let x = roundedMinX; x <= roundedMaxX; x++) {
            for (let y = roundedMinY; y <= roundedMaxY; y++) {
                const key = `${x}x${y}`;
                if (shields.allParticles[key]) {
                    shields.allParticles[key] = false;
                    isCollided = true;
                }
            }
        }

        if (isCollided && blast) {
            const minXBlast = roundedMinX - shields.explosionRadius;
            const maxXBlast = roundedMaxX + shields.explosionRadius;
            const minYBlast = roundedMinY - shields.explosionHeight;
            const maxYBlast = roundedMaxY + shields.explosionHeight;

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
