import { Game } from '../../Game/Game';

export interface IProjectile {
    speed: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    direction: 'up' | 'down';
    game: Game;
}
