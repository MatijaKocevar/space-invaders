import { Defender } from '../../classes/Defender/Defender';

export interface ILivesService {
    defender: Defender;
    context: CanvasRenderingContext2D;
    gameWidth: number;
}
