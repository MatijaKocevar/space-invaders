import { Defender } from '../../components/Defender/Defender';

export interface ILivesService {
    defender: Defender;
    context: CanvasRenderingContext2D;
    gameWidth: number;
}
