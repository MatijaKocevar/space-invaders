import { Highscore } from './entities/Highscore.interface';
import { IHighscoreService } from './entities/IHighscoreService.interface';

export class HighscoreService {
    props: IHighscoreService;
    apiUrl = import.meta.env.VITE_API_URL;

    constructor(props: IHighscoreService) {
        this.props = props;
    }

    private obfuscateScore = (score: number): string => {
        const timestamp = Date.now() % 1000000;
        const scrambled = (score * 7919 + timestamp) ^ 0xabcdef;
        return btoa(`${scrambled}:${timestamp}:${score.toString(36)}`);
    };

    private generateFingerprint = (name: string, score: number): string => {
        const userAgent = navigator.userAgent;
        const screenData = `${screen.width}x${screen.height}`;
        const combined = `${name}${score}${userAgent}${screenData}${Date.now()}`;

        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    };

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
        const payload = this.obfuscateScore(score);
        const fingerprint = this.generateFingerprint(name, score);

        const data = {
            playerName: name,
            payload: payload,
            fingerprint: fingerprint,
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
    };
}
