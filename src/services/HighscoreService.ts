import { drawText } from '../utils/utils';

interface IScoreService {
    context: CanvasRenderingContext2D;
}

export class ScoreService {
    props: IScoreService;
    score = 0;

    constructor(props: IScoreService) {
        this.props = props;
    }

    drawHighscore = () => {
        const { context } = this.props;

        drawText(context, {
            alignment: 'center',
            fillStyle: 'white',
            font: 'bold 15px Arial',
            text: 'SCORE',
            x: 40,
            y: 20,
        });

        drawText(context, {
            alignment: 'center',
            fillStyle: 'white',
            font: 'bold 15px Arial',
            text: this.score.toString(),
            x: 80,
            y: 20,
        });
    };
}
