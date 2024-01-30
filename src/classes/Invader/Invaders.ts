import { Invader } from './Invader';
import invaderMove0 from '../../audio/invader-move-0.wav';
import invaderMove1 from '../../audio/invader-move-1.wav';
import invaderMove2 from '../../audio/invader-move-2.wav';
import invaderMove3 from '../../audio/invader-move-3.wav';
import invader1 from '../../sprites/invader1.png';
import invader2_3 from '../../sprites/invader2-3.png';
import invader3_4 from '../../sprites/invader3-4.png';
import { IInvaders } from './entities/IInvaders.interface';

export class Invaders {
    props: IInvaders;
    invadersCount = 55;
    invader1 = new Image();
    invader2_3 = new Image();
    invader3_4 = new Image();
    animationSpeed = 70;
    livingInvaders: Invader[] = [];
    speed = 5;
    currentDirection: 'left' | 'right';
    moveSounds: { [key: string]: HTMLAudioElement };
    moveCount = 0;

    constructor(props: IInvaders) {
        this.props = props;
        this.invader1.src = invader1;
        this.invader2_3.src = invader2_3;
        this.invader3_4.src = invader3_4;
        this.currentDirection = 'right';
        this.moveSounds = {
            0: new Audio(invaderMove0),
            1: new Audio(invaderMove1),
            2: new Audio(invaderMove2),
            3: new Audio(invaderMove3),
        };

        this.createInvaders();
    }

    updateDirection = () => {
        const { game } = this.props;

        const hitLeftWall = this.livingInvaders.some(
            (invader) => invader.props.x <= 5
        );
        const hitRightWall = this.livingInvaders.some(
            (invader) =>
                invader.props.x + invader.props.width + 5 >=
                game.props.gameWidth
        );

        if (hitLeftWall) {
            this.currentDirection = 'right';
        }

        if (hitRightWall) {
            this.currentDirection = 'left';
        }
    };

    createInvaders = () => {
        const { game } = this.props;
        const invaderWidth = 32;
        const invaderHeight = 24;
        const invaderPadding = 20;
        const invaderOffsetTop = 30;
        const invaderOffsetLeft = 30;

        const invaders: Invader[] = [];

        for (let i = 0; i < this.invadersCount; i++) {
            const invaderX =
                (i % 11) * (invaderWidth + invaderPadding - 5) +
                invaderOffsetLeft;
            const invaderY =
                Math.floor(i / 11) * (invaderHeight + invaderPadding) +
                invaderOffsetTop;

            if (i < 11) {
                // first row from top
                const invader = new Invader({
                    x: invaderX,
                    y: invaderY,
                    width: invaderWidth,
                    height: invaderHeight,
                    speed: this.speed,
                    image: this.invader1,
                    animationSpeed: this.animationSpeed,
                    game,
                    points: 30,
                });
                invaders.push(invader);
            }

            if (i < 33 && i >= 11) {
                // second and thrird row from top
                const invader = new Invader({
                    x: invaderX,
                    y: invaderY,
                    width: invaderWidth,
                    height: invaderHeight,
                    speed: this.speed,
                    image: this.invader2_3,
                    animationSpeed: this.animationSpeed,
                    game,
                    points: 20,
                });
                invaders.push(invader);
            }

            if (i < 55 && i >= 33) {
                // fourth and fifth row from top
                const invader = new Invader({
                    x: invaderX,
                    y: invaderY,
                    width: invaderWidth,
                    height: invaderHeight,
                    speed: this.speed,
                    image: this.invader3_4,
                    animationSpeed: this.animationSpeed,
                    game,
                    points: 10,
                });
                invaders.push(invader);
            }
        }

        this.livingInvaders = invaders;
    };

    updateInvaders = (gameFrame: number) => {
        this.handleCollision();

        const { game } = this.props;
        const invadersArrayLength = this.livingInvaders.length;
        let speedChanged = false;

        if (this.animationSpeed > 0) {
            // Adjust the animation speed and invader speed based on the number of remaining invaders
            if (
                invadersArrayLength < 44 &&
                this.animationSpeed != 35 &&
                this.speed != 6
            ) {
                this.speed = 6;
                this.animationSpeed = 35;
                speedChanged = true;
            }
            if (
                invadersArrayLength < 33 &&
                this.animationSpeed != 20 &&
                this.speed != 7
            ) {
                this.speed = 7;
                this.animationSpeed = 20;
                speedChanged = true;
            }
            if (
                invadersArrayLength < 22 &&
                this.animationSpeed != 10 &&
                this.speed != 8
            ) {
                this.speed = 8;
                this.animationSpeed = 10;
                speedChanged = true;
            }
            if (
                invadersArrayLength < 11 &&
                this.animationSpeed != 8 &&
                this.speed != 10
            ) {
                this.speed = 10;
                this.animationSpeed = 8;
                speedChanged = true;
            }
            if (
                invadersArrayLength === 1 &&
                this.animationSpeed != 4 &&
                this.speed != 11
            ) {
                this.speed = 20;
                this.animationSpeed = 4;
                speedChanged = true;
            }

            if (speedChanged) {
                this.livingInvaders.forEach((invader) => {
                    invader.props.speed = this.speed;
                    invader.props.animationSpeed = this.animationSpeed;
                });
                speedChanged = false;
            }
        }

        // Update the invader direction and position
        if (
            this.livingInvaders.length > 0 &&
            gameFrame % this.animationSpeed === 0
        ) {
            this.updateDirection();
            this.livingInvaders.forEach((invader) => {
                invader.updateInvader(this.currentDirection);
            });

            if (this.moveCount >= 3) this.moveCount = 0;
            else this.moveCount++;

            if (game.playSound)
                this.moveSounds[this.moveCount.toString()].play();
        }

        // Fire a projectile if the invader is livingInvaders and the game frame is a multiple of the animation speed
        if (
            this.livingInvaders.length > 0 &&
            gameFrame % this.animationSpeed === 0
        ) {
            const randomInvader = Math.floor(
                Math.random() * this.livingInvaders.length
            );

            if (gameFrame % 25 === 0 && game.projectiles.invader.length < 3) {
                game.projectiles.invader.push(
                    this.livingInvaders[randomInvader].fire()
                );
            }
        }

        if (this.livingInvaders.some((invader) => invader.props.y > 550)) {
            game.gameService.setGameOverMessage(
                'Invaders have reached the ground! You lose!'
            );
            game.gameService.setGameOver(true);

            game.inputHandler.destroy();
            // game.props.setShowPopupScore(true);
        }

        if (this.livingInvaders.length === 0) {
            // game.setGameOverMessage("You win!");
            // game.setGameOver(true);

            this.speed = 6;
            this.animationSpeed = 35;

            game.shields.shieldArray = [];
            game.shields.createShields(game.props.gameWidth);

            game.invaders.createInvaders();
        }
    };

    handleCollision = () => {
        const playerProjectilesToRemove: { index: number }[] = [];
        const invadersToRemove: { index: number }[] = [];
        const { game } = this.props;

        // Check if any of the invaders have been hit by a projectile
        this.livingInvaders.forEach((invader, i) => {
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
                    this.livingInvaders[invadersToRemove[i].index].props.x;
                const invaderY =
                    this.livingInvaders[invadersToRemove[i].index].props.y;

                game.explosions.add(invaderX, invaderY);

                if (game.playSound)
                    this.livingInvaders[
                        invadersToRemove[i].index
                    ].invaderDeath.play();
                this.livingInvaders.splice(invadersToRemove[i].index, 1);
            }

            for (let i = playerProjectilesToRemove.length - 1; i >= 0; i--) {
                game.projectiles.defender.splice(
                    playerProjectilesToRemove[i].index,
                    1
                );
            }
        }
    };

    draw = () => {
        this.livingInvaders.forEach((invader) => invader.draw());
    };

    destroy = () => {
        this.invadersCount = 0;
        this.livingInvaders = [];
    };
}
