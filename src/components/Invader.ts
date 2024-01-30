import invader1 from '../sprites/invader1.png';
import invader2_3 from '../sprites/invader2-3.png';
import invader3_4 from '../sprites/invader3-4.png';
import { Game } from './Game';
import { Projectile } from './Projectile';
import invaderDeath from '../audio/invaderkilled.wav';
import invaderMove0 from '../audio/invader-move-0.wav';
import invaderMove1 from '../audio/invader-move-1.wav';
import invaderMove2 from '../audio/invader-move-2.wav';
import invaderMove3 from '../audio/invader-move-3.wav';

interface IInvader {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    image: HTMLImageElement;
    animationSpeed: number;
    game: Game;
    points: number;
}

export class Invader {
    props: IInvader;
    spriteWidth: number;
    spriteHeight: number;
    frame = 0;
    currentDirection: 'left' | 'right' = 'right';
    invaderDeath: HTMLAudioElement;

    constructor({
        x,
        y,
        width,
        height,
        speed,
        image,
        animationSpeed,
        game,
        points,
    }: IInvader) {
        this.props = {
            x,
            y,
            width,
            height,
            speed,
            image,
            animationSpeed,
            game,
            points,
        };
        this.spriteWidth = 57;
        this.spriteHeight = 38;
        this.invaderDeath = new Audio(invaderDeath);
    }

    moveLeft = () => (this.props.x -= this.props.speed);

    moveRight = () => (this.props.x += this.props.speed);

    moveDown = () => (this.props.y += this.props.height);

    updateInvader = (direction: 'left' | 'right') => {
        const { gameFrame } = this.props.game;

        if (this.currentDirection != direction) {
            // Change direction and move down when the invader reaches the edge of the canvas
            this.moveDown();
            this.currentDirection = direction;
            return;
        }
        // If the invader is not at the edge of the canvas, continue moving in the current direction
        if (direction === 'left') this.moveLeft();
        if (direction === 'right') this.moveRight();

        // Update the frame of the invader's animation
        if (gameFrame % this.props.animationSpeed === 0) {
            this.frame > 0 ? (this.frame = 0) : this.frame++;
        }
    };

    fire = () => {
        const projectile = new Projectile({
            height: 10,
            width: 2,
            speed: 10,
            x: this.props.x + this.props.width / 2 - 2,
            y: this.props.y,
            color: 'white',
            direction: 'down',
            game: this.props.game,
        });

        return projectile;
    };

    draw = () => {
        const { context } = this.props.game.props;
        // Draw the invader on the canvas
        if (this.props.image) {
            // context.fillStyle = "red";
            // context.fillRect(this.props.x, this.props.y, this.props.width, this.props.height);
            context.drawImage(
                this.props.image,
                this.frame * this.spriteWidth,
                0,
                this.spriteWidth,
                this.spriteHeight,
                this.props.x,
                this.props.y,
                this.props.width,
                this.props.height
            );
        }
    };
}

interface IInvaders {
    game: Game;
}

export class Invaders {
    props: IInvaders;
    invadersCount = 55;
    invader1 = new Image();
    invader2_3 = new Image();
    invader3_4 = new Image();
    animationSpeed = 70;
    alive: Invader[] = [];
    speed = 5;
    currentDirection: 'left' | 'right';
    moveSounds: { [key: string]: HTMLAudioElement };
    moveCount = 0;

    constructor({ game }: IInvaders) {
        this.props = { game };
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

        const hitLeftWall = this.alive.some((invader) => invader.props.x <= 5);
        const hitRightWall = this.alive.some(
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

        this.alive = invaders;
    };

    updateInvaders = (gameFrame: number) => {
        const { game } = this.props;
        const invadersArrayLength = this.alive.length;
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
                this.alive.forEach((invader) => {
                    invader.props.speed = this.speed;
                    invader.props.animationSpeed = this.animationSpeed;
                });
                speedChanged = false;
            }
        }

        // Update the invader direction and position
        if (this.alive.length > 0 && gameFrame % this.animationSpeed === 0) {
            this.updateDirection();
            this.alive.forEach((invader) => {
                invader.updateInvader(this.currentDirection);
            });

            if (this.moveCount >= 3) this.moveCount = 0;
            else this.moveCount++;

            if (game.playSound)
                this.moveSounds[this.moveCount.toString()].play();
        }

        // Fire a projectile if the invader is alive and the game frame is a multiple of the animation speed
        if (this.alive.length > 0 && gameFrame % this.animationSpeed === 0) {
            const randomInvader = Math.floor(Math.random() * this.alive.length);

            if (gameFrame % 25 === 0 && game.projectiles.invader.length < 3) {
                game.projectiles.invader.push(this.alive[randomInvader].fire());
            }
        }

        if (this.alive.some((invader) => invader.props.y > 550)) {
            game.setGameOverMessage(
                'Invaders have reached the ground! You lose!'
            );
            game.setGameOver(true);

            game.inputHandler.destroy();
            // game.props.setShowPopupScore(true);
        }

        if (this.alive.length === 0) {
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
        this.alive.forEach((invader, i) => {
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

                    game.score += invader.props.points;
                }
            });
        });

        // Remove the playerProjectiles and invaders that collided
        if (
            playerProjectilesToRemove.length > 0 ||
            invadersToRemove.length > 0
        ) {
            for (let i = invadersToRemove.length - 1; i >= 0; i--) {
                const invaderX = this.alive[invadersToRemove[i].index].props.x;
                const invaderY = this.alive[invadersToRemove[i].index].props.y;

                game.explosions.add(invaderX, invaderY);

                if (game.playSound)
                    this.alive[invadersToRemove[i].index].invaderDeath.play();
                this.alive.splice(invadersToRemove[i].index, 1);
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
        this.alive.forEach((invader) => invader.draw());
    };

    destroy = () => {
        this.invadersCount = 0;
        this.alive = [];
    };
}
