import { ICollisionService } from '../CollisionService.interface';

export class DefenderCollisionService {
    props: ICollisionService;

    constructor(props: ICollisionService) {
        this.props = props;
    }

    handleCollision = () => {
        const { projectiles, defender } = this.props.game;
        const { game } = this.props;
        if (
            projectiles.invader.some(
                (projectile) => projectile.props.y > game.props.gameHeight - 500
            )
        ) {
            projectiles.invader.forEach((projectile) => {
                const {
                    x: pX,
                    y: pY,
                    width: pW,
                    height: pH,
                } = projectile.props;

                const collided =
                    pX < defender.x + defender.width &&
                    pX + pW > defender.x &&
                    pY < defender.y + 17 + (defender.height - 23) &&
                    pY + pH > defender.y + 17;

                if (collided) {
                    if (defender.lives > 0) {
                        defender.isCollided = true;
                        defender.lives--;
                        projectiles.invader.splice(
                            projectiles.invader.indexOf(projectile),
                            1
                        );
                        defender.previousAnimationSpeed =
                            defender.props.game.invaders.animationSpeed;
                        defender.props.game.invaders.animationSpeed = 0;
                        if (defender.props.game.playSound)
                            defender.defenderDeath.play();
                    }
                }
            });
        }
    };
}
