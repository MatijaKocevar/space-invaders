import { Game } from './Game';
import { Projectile } from './Projectile';
import player from '../sprites/player.png';
import explosion from '../sprites/defenderExplosion.png';
import defenderDeath from '../audio/explosion.wav';
interface IDefender {
    game: Game;
}

export class Defender {
    game: Game;
    width: number;
    height: number;
    x: number;
    y: number;
    speed: number;
    maxSpeed: number;
    timeout: NodeJS.Timeout = setTimeout(() => {}, 0);
    reload = false;
    image: HTMLImageElement;
    explosionImage: HTMLImageElement;
    lives = 3;
    previousAnimationSpeed = 0;
    isCollided = false;
    collisionPause = 0;
    frame = 0;
    spriteWidth: number;
    spriteHeight: number;
    defenderDeath: HTMLAudioElement;

    constructor({ game }: IDefender) {
        this.game = game;
        this.width = 42;
        this.height = 40;
        this.x = 50;
        this.y = this.game.props.gameHeight - (this.height + 10);
        this.speed = 0;
        this.maxSpeed = 5;
        this.image = new Image();
        this.image.src = player;
        this.explosionImage = new Image();
        this.explosionImage.src = explosion;
        this.spriteWidth = 75;
        this.spriteHeight = 44;
        this.defenderDeath = new Audio(defenderDeath);
    }

    update = () => {
        if (this.checkGameOver()) return;

        this.animateFrame();
        this.handleHorizontalMovement();
        this.handleShooting();
        this.preventGoingOffScreen();
    };

    checkGameOver = () => {
        if (this.lives === 0) {
            this.game.gameOverMessage = 'An invader shot you! You Lose!';
            this.game.setGameOver(true);
            this.game.inputHandler.destroy();
            // this.game.props.setShowPopupScore(true);
            return true;
        }
        return false;
    };

    animateFrame = () => {
        if (this.game.gameFrame % 10 === 0) {
            this.frame = this.frame > 0 ? 0 : 1;
        }
    };

    handleHorizontalMovement = () => {
        const { inputHandler } = this.game;

        if (inputHandler.keys.includes('KeyD')) {
            this.speed = this.maxSpeed;
        } else if (inputHandler.keys.includes('KeyA')) {
            this.speed = -this.maxSpeed;
        } else {
            this.speed = 0;
        }

        this.x += this.speed;
    };

    handleShooting = () => {
        const { inputHandler } = this.game;

        if (
            inputHandler.keys.includes('Enter') &&
            this.game.projectiles.defender.length === 0
        ) {
            if (!this.reload) {
                this.game.projectiles.defender.push(this.fire());
                this.reload = true;
                this.timeout = setTimeout(() => {
                    this.reload = false;
                }, 200);
            }
        }
    };

    preventGoingOffScreen = () => {
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > this.game.props.gameWidth - this.width) {
            this.x = this.game.props.gameWidth - this.width;
        }
    };

    fire = () => {
        const projectile = new Projectile({
            height: 10,
            width: 2,
            speed: 10,
            x: this.x + this.width / 2 - 2,
            y: this.y,
            color: '#00d300',
            direction: 'up',
            game: this.game,
        });

        if (this.game.playSound) {
            projectile.shoot.play();
        }

        return projectile;
    };

    draw() {
        const { context } = this.game.props;

        if (this.collisionPause > 80) {
            this.isCollided = false;
            this.x = 50;
            this.game.invaders.animationSpeed = this.previousAnimationSpeed;
            this.collisionPause = 0;
        }

        if (this.isCollided) {
            this.collisionPause++;
            context.drawImage(
                this.explosionImage,
                this.frame * this.spriteWidth,
                0,
                this.spriteWidth,
                this.spriteHeight,
                this.x,
                this.y - 3,
                this.width + 2,
                this.height
            );
        } else {
            context.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }

    handleCollision = () => {
        const { projectiles } = this.game;
        if (
            projectiles.invader.some(
                (projectile) =>
                    projectile.props.y > this.game.props.gameHeight - 500
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
                    pX < this.x + this.width &&
                    pX + pW > this.x &&
                    pY < this.y + 17 + (this.height - 23) &&
                    pY + pH > this.y + 17;

                if (collided) {
                    if (this.lives > 0) {
                        this.isCollided = true;
                        this.lives--;
                        projectiles.invader.splice(
                            projectiles.invader.indexOf(projectile),
                            1
                        );
                        this.previousAnimationSpeed =
                            this.game.invaders.animationSpeed;
                        this.game.invaders.animationSpeed = 0;
                        if (this.game.playSound) this.defenderDeath.play();
                    }
                }
            });
        }
    };

    destroy = () => {
        clearTimeout(this.timeout);
    };
}
