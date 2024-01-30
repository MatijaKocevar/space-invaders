import { Game } from '../../Game/Game';

export interface IInvader {
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
