import player from '../../sprites/player.png';
import explosion from '../../sprites/defenderExplosion.png';
import defenderDeath from '../../audio/explosion.wav';
import { IDefender } from './entities/IDefender.interface';
import { DefenderService } from '../../services/DefenderService/DefenderService';

export class Defender {
    props: IDefender;
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
    lives = 1;
    previousAnimationSpeed = 0;
    isCollided = false;
    collisionPause = 0;
    frame = 0;
    spriteWidth: number;
    spriteHeight: number;
    defenderDeath: HTMLAudioElement;

    defenderService: DefenderService;

    constructor(props: IDefender) {
        this.props = props;
        this.width = 42;
        this.height = 40;
        this.x = 50;
        this.y = props.game.props.gameHeight - (this.height + 10);
        this.speed = 0;
        this.maxSpeed = 5;
        this.image = new Image();
        this.image.src = player;
        this.explosionImage = new Image();
        this.explosionImage.src = explosion;
        this.spriteWidth = 75;
        this.spriteHeight = 44;
        this.defenderDeath = new Audio(defenderDeath);

        this.defenderService = new DefenderService(props);
    }

    update = () => {
        if (this.defenderService.checkGameOver()) return;

        this.defenderService.animateFrame();
        this.defenderService.handleHorizontalMovement();
        this.defenderService.handleShooting();
        this.defenderService.preventGoingOffScreen();
    };

    draw() {
        const { context } = this.props.game.props;

        if (this.collisionPause > 80) {
            this.isCollided = false;
            this.x = 50;
            this.props.game.invaders.animationSpeed =
                this.previousAnimationSpeed;
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

    destroy = () => {
        clearTimeout(this.timeout);
    };
}
