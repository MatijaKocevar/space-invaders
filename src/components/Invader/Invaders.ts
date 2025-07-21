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
    timeSinceLastMove = 0;
    moveInterval = 1167;
    timeSinceLastShot = 0;
    shotInterval = 3000;

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

    updateInvaders = (deltaTime: number) => {
        const { game } = this.props;
        const invadersArrayLength = this.livingInvaders.length;
        let speedChanged = false;

        if (this.animationSpeed > 0) {
            if (
                invadersArrayLength < 44 &&
                this.animationSpeed != 35 &&
                this.speed != 6
            ) {
                this.speed = 6;
                this.animationSpeed = 35;
                this.moveInterval = 583;
                this.shotInterval = 2500;
                speedChanged = true;
            }
            if (
                invadersArrayLength < 33 &&
                this.animationSpeed != 20 &&
                this.speed != 7
            ) {
                this.speed = 7;
                this.animationSpeed = 20;
                this.moveInterval = 333;
                this.shotInterval = 2000;
                speedChanged = true;
            }
            if (
                invadersArrayLength < 22 &&
                this.animationSpeed != 10 &&
                this.speed != 8
            ) {
                this.speed = 8;
                this.animationSpeed = 10;
                this.moveInterval = 167;
                this.shotInterval = 1500;
                speedChanged = true;
            }
            if (
                invadersArrayLength < 11 &&
                this.animationSpeed != 8 &&
                this.speed != 9
            ) {
                this.speed = 9;
                this.animationSpeed = 8;
                this.moveInterval = 133;
                this.shotInterval = 1000;
                speedChanged = true;
            }
            if (
                invadersArrayLength === 1 &&
                this.animationSpeed != 4 &&
                this.speed != 11
            ) {
                this.speed = 20;
                this.animationSpeed = 4;
                this.moveInterval = 67;
                this.shotInterval = 500;
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

        this.timeSinceLastMove += deltaTime;
        this.timeSinceLastShot += deltaTime;

        if (
            this.livingInvaders.length > 0 &&
            this.timeSinceLastMove >= this.moveInterval
        ) {
            this.updateDirection();
            this.livingInvaders.forEach((invader) => {
                invader.updateInvader(this.currentDirection);
            });

            if (this.moveCount >= 3) this.moveCount = 0;
            else this.moveCount++;

            if (game.playSound)
                this.moveSounds[this.moveCount.toString()].play();

            this.timeSinceLastMove = 0; // Reset timer
        }

        let fireChance = 0.05;
        if (invadersArrayLength < 44) fireChance = 0.08;
        if (invadersArrayLength < 33) fireChance = 0.12;
        if (invadersArrayLength < 22) fireChance = 0.15;
        if (invadersArrayLength < 11) fireChance = 0.2;
        if (invadersArrayLength === 1) fireChance = 0.3;

        if (
            this.livingInvaders.length > 0 &&
            this.timeSinceLastShot >= this.shotInterval &&
            game.projectiles.invader.length < 3 &&
            Math.random() < fireChance
        ) {
            const randomInvader = Math.floor(
                Math.random() * this.livingInvaders.length
            );

            game.projectiles.invader.push(
                this.livingInvaders[randomInvader].fire()
            );

            this.timeSinceLastShot = 0;
        }

        if (this.livingInvaders.some((invader) => invader.props.y > 550)) {
            game.gameService.setGameOverMessage(
                'Invaders have reached the ground! You lose!'
            );
            game.gameService.setGameOver(true);
        }

        if (this.livingInvaders.length === 0) {
            game.gameService.setGameOverMessage('You win!');
            game.gameService.setGameOver(true);

            this.speed = 6;
            this.animationSpeed = 35;
            this.moveInterval = 583;
        }
    };

    draw = () => {
        this.livingInvaders.forEach((invader) => invader.draw());
    };

    destroy = () => {
        this.invadersCount = 0;
        this.livingInvaders = [];
        this.timeSinceLastMove = 0;
        this.timeSinceLastShot = 0;
    };
}
