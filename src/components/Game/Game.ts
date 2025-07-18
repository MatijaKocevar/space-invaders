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
    deltaTime = 0;
    accumulatedTime = 0;
    inputHandler: InputHandler;
    defender: Defender;
    invaders: Invaders;
    shields: Shields;
    projectiles: Projectiles;
    explosions: Explosions;
    playSound = false;
    godMode;
    shieldsOn;

    gameService: GameService;
    livesService: LivesService;
    scoreService: ScoreService;
    collisionService: CollisionService;

    constructor(props: IGame) {
        this.props = props;

        this.godMode = props.godMode;
        this.shieldsOn = props.shieldsOn;

        this.inputHandler = new InputHandler(this);
        this.shields = new Shields({ game: this });
        this.invaders = new Invaders({ game: this });
        this.defender = new Defender({ game: this });
        this.projectiles = new Projectiles({ game: this });
        this.explosions = new Explosions({ game: this });

        this.gameService = new GameService({
            game: this,
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

    update = (deltaTime: number) => {
        this.deltaTime = deltaTime;
        this.accumulatedTime += deltaTime;
        
        const frameInterval = 1000 / 60; 
        while (this.accumulatedTime >= frameInterval) {
            this.gameFrame++;
            this.accumulatedTime -= frameInterval;
        }
        
        this.projectiles.update(deltaTime);
        this.invaders.updateInvaders(deltaTime);
        this.defender.update(deltaTime);
        this.collisionService.handleCollisions();
    };

    draw = () => {
        const { context, gameWidth, gameHeight } = this.props;

        this.gameFrame++;
        context.clearRect(0, 0, gameWidth, gameHeight);

        this.projectiles.draw();
        this.invaders.draw();
        this.defender.draw();
        this.explosions.draw();
        if (this.shieldsOn) this.shields.draw();

        if (window.innerWidth > 600) this.gameService.drawInstructions();
        this.scoreService.drawHighscore();
        this.livesService.drawLives();
    };

    setGameSize = (width: number, height: number) => {
        this.props.gameWidth = width;
        this.props.gameHeight = height;
    };

    destroy = () => {
        this.inputHandler.destroy();
        this.invaders.destroy();
        this.shields.destroy();
        this.defender.destroy();
    };
}
