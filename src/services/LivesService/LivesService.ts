import { drawText } from '../../utils/utils';
import { ILivesService } from './LivesService.interface';

export class LivesService {
    props: ILivesService;

    constructor(props: ILivesService) {
        this.props = props;
    }

    drawLives = () => {
        const { context, gameWidth, defender } = this.props;

        const livesText = defender.lives.toString();

        drawText(context, {
            alignment: 'center',
            fillStyle: 'white',
            font: 'bold 15px Arial',
            text: livesText,
            x: gameWidth - 80,
            y: 20,
        });

        for (let i = 0; i < defender.lives - 1; i++) {
            const lifeXpos = gameWidth - 65 + i * 30;
            context.drawImage(defender.image, lifeXpos, 3, 20, 20);
        }
    };
}
