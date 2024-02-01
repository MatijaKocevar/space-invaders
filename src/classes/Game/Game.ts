import { GameService } from '../../services/GameService/GameService';
import { ScoreService } from '../../services/ScoreService/ScoreService';
import { LivesService } from '../../services/LivesService/LivesService';
import { Defender } from '../Defender/Defender';
import { Explosions } from '../Explosion/Explosions';
import { InputHandler } from '../../common/InputHandler';
import { Invaders } from '../Invader/Invaders';
import { Projectiles } from '../Projectile/Projectiles';
import { Shields } from '../Shield/Shields';
import { IGame } from './entities/IGame.interface';
import { CollisionService } from '../../services/CollisionService/CollisionService';

export class Game {
    props: IGame;
    gameFrame = 0;
    inputHandler: InputHandler;
    defender: Defender;
    invaders: Invaders;
    shields: Shields;
    projectiles: Projectiles;
    explosions: Explosions;
    playSound = false;

    //services
    gameService: GameService;
    livesService: LivesService;
    scoreService: ScoreService;
    collisionService: CollisionService;

    constructor(props: IGame) {
        this.props = props;
        this.inputHandler = new InputHandler(this);
        this.shields = new Shields({ game: this });
        this.invaders = new Invaders({ game: this });
        this.defender = new Defender({ game: this });
        this.projectiles = new Projectiles({ game: this });
        this.explosions = new Explosions({ game: this });

        //services
        this.gameService = new GameService({
            context: props.context,
            gameHeight: props.gameHeight,
            gameWidth: props.gameWidth,
        });

        this.livesService = new LivesService({
            defender: this.defender,
            context: props.context,
            gameWidth: props.gameWidth,
        });

        this.scoreService = new ScoreService({
            context: props.context,
        });

        this.collisionService = new CollisionService({
            game: this,
        });

        this.shields.draw();
    }

    update = () => {
        this.projectiles.update();
        this.invaders.updateInvaders();
        this.defender.update();
        this.collisionService.handleCollisions();
    };

    draw = () => {
        const { context } = this.props;

        this.gameFrame++;
        context.clearRect(0, 0, this.props.gameWidth, this.props.gameHeight);

        this.projectiles.draw();
        this.invaders.draw();
        this.defender.draw();
        this.explosions.draw();
        this.shields.draw();

        this.scoreService.drawHighscore();
        this.livesService.drawLives();
    };

    destroy = () => {
        this.inputHandler.destroy();
        this.invaders.destroy();
        this.shields.destroy();
        this.defender.destroy();
    };
}
