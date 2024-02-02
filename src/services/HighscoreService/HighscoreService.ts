import { Highscore } from './entities/Highscore.interface';
import { IHighscoreService } from './entities/IHighscoreService.interface';

export class HighscoreService {
    props: IHighscoreService;
    apiUrl = import.meta.env.VITE_API_URL;

    constructor(props: IHighscoreService) {
        this.props = props;
    }

    getHighscoreElement = async () => {
        const highscoreElement = document.createElement('div');
        highscoreElement.classList.add('highscores');

        const title = document.createElement('h2');
        title.textContent = 'Highscores';
        highscoreElement.appendChild(title);

        const highscores = await this.getHighscores();

        if (highscores) {
            highscores.forEach((highscore) => {
                const highscoreItem = document.createElement('div');
                highscoreItem.classList.add('highscore-item');
                highscoreItem.innerHTML = `
                    <span>${
                        highscore.playerName === ''
                            ? 'anonymous'
                            : highscore.playerName
                    }</span>
                    <span>${highscore.scoreValue}</span>
                `;

                highscoreElement.appendChild(highscoreItem);
            });
        }

        return highscoreElement;
    };

    getHighscores = async () => {
        try {
            const response = await fetch(`${this.apiUrl}`);
            const highscores: Highscore[] = await response.json();

            return highscores;
        } catch (error) {
            console.error(error);
        }
    };

    onSaveHighscore = async (name: string, score: number) => {
        const data = {
            playerName: name,
            scoreValue: score,
        };

        try {
            await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error(error);
        }
        console.log('Save highscore button clicked: ', name, score);
    };
}
