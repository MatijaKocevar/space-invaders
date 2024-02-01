import { ICollisionService } from '../CollisionService.interface';

export class InvaderCollisionService {
    props: ICollisionService;

    constructor(props: ICollisionService) {
        this.props = props;
    }

    handleCollision = () => {
        const playerProjectilesToRemove: { index: number }[] = [];
        const invadersToRemove: { index: number }[] = [];
        const { game } = this.props;
        const { invaders } = this.props.game;

        // Check if any of the invaders have been hit by a projectile
        invaders.livingInvaders.forEach((invader, i) => {
            game.projectiles.defender.forEach((projectile, p) => {
                if (
                    projectile.props.x > invader.props.x &&
                    projectile.props.x <
                        invader.props.x + invader.props.width &&
                    projectile.props.y > invader.props.y &&
                    projectile.props.y < invader.props.y + invader.props.height
                ) {
                    playerProjectilesToRemove.push({ index: p });
                    invadersToRemove.push({ index: i });

                    game.scoreService.score += invader.props.points;
                }
            });
        });

        // Remove the playerProjectiles and invaders that collided
        if (
            playerProjectilesToRemove.length > 0 ||
            invadersToRemove.length > 0
        ) {
            for (let i = invadersToRemove.length - 1; i >= 0; i--) {
                const invaderX =
                    invaders.livingInvaders[invadersToRemove[i].index].props.x;
                const invaderY =
                    invaders.livingInvaders[invadersToRemove[i].index].props.y;

                game.explosions.add(invaderX, invaderY);

                if (game.playSound)
                    invaders.livingInvaders[
                        invadersToRemove[i].index
                    ].invaderDeath.play();
                invaders.livingInvaders.splice(invadersToRemove[i].index, 1);
            }

            for (let i = playerProjectilesToRemove.length - 1; i >= 0; i--) {
                game.projectiles.defender.splice(
                    playerProjectilesToRemove[i].index,
                    1
                );
            }
        }
    };
}
