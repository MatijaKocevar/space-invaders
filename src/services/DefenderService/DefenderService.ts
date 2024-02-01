import { Projectile } from '../../classes/Projectile/Projectile';
import { IDefenderService } from './IDefenderService.interface';

export class DefenderService {
    props: IDefenderService;

    constructor(props: IDefenderService) {
        this.props = props;
    }

    checkGameOver = () => {
        const { defender } = this.props.game;
        const { game } = this.props;

        if (defender.lives === 0) {
            game.gameService.gameOverMessage = 'An invader shot you! You Lose!';
            game.gameService.setGameOver(true);
            game.inputHandler.destroy();
            return true;
        }
        return false;
    };

    animateFrame = () => {
        const { game } = this.props;
        const { defender } = this.props.game;

        if (game.gameFrame % 10 === 0) {
            defender.frame = defender.frame > 0 ? 0 : 1;
        }
    };

    handleHorizontalMovement = () => {
        const { inputHandler } = this.props.game;
        const { defender } = this.props.game;

        if (inputHandler.keys.includes('KeyD')) {
            defender.speed = defender.maxSpeed;
        } else if (inputHandler.keys.includes('KeyA')) {
            defender.speed = -defender.maxSpeed;
        } else {
            defender.speed = 0;
        }

        defender.x += defender.speed;
    };

    handleShooting = () => {
        const { inputHandler, defender } = this.props.game;
        const { game } = this.props;

        if (
            inputHandler.keys.includes('Enter') &&
            game.projectiles.defender.length === 0
        ) {
            if (!defender.reload) {
                game.projectiles.defender.push(this.fire());
                defender.reload = true;
                defender.timeout = setTimeout(() => {
                    defender.reload = false;
                }, 200);
            }
        }
    };

    preventGoingOffScreen = () => {
        const { defender } = this.props.game;
        const { game } = this.props;

        if (defender.x < 0) {
            defender.x = 0;
        } else if (defender.x > game.props.gameWidth - defender.width) {
            defender.x = game.props.gameWidth - defender.width;
        }
    };

    fire = () => {
        const { defender } = this.props.game;
        const { game } = this.props;

        const projectile = new Projectile({
            height: 10,
            width: 2,
            speed: 10,
            x: defender.x + defender.width / 2 - 2,
            y: defender.y,
            color: '#00d300',
            direction: 'up',
            game: game,
        });

        if (game.playSound) {
            projectile.shoot.play();
        }

        return projectile;
    };
}
