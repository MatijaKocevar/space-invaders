import { HighscoreService } from '../../services/HighscoreService/HighscoreService';
import { changeLog } from '../ChangeLog/ChangeLog';
import { IGameControls } from './entitites/IGameControls.interface';

export class GameOptions {
    props: IGameControls;
    godModeButton: HTMLButtonElement | null;
    shieldsOnButton: HTMLButtonElement | null;
    highscoreButton: HTMLButtonElement | null;
    changeLogButton: HTMLButtonElement | null;
    soundButton: HTMLButtonElement | null;
    isDevelopment = import.meta.env.MODE === 'development';

    highscoreService: HighscoreService;

    constructor(props: IGameControls) {
        this.props = props;
        this.godModeButton = document.querySelector('#god-mode-button');
        this.shieldsOnButton = document.querySelector('#shields-on-button');
        this.highscoreButton = document.querySelector('#highscore-button');
        this.changeLogButton = document.querySelector('#change-log-button');
        this.soundButton = document.querySelector('#sounds-button');

        this.highscoreService = new HighscoreService({
            game: this.props.game,
        });

        this.init();
    }

    init = () => {
        if (this.godModeButton && this.shieldsOnButton) {
            this.godModeButton.addEventListener(
                'click',
                this.onGodModeButtonClick
            );
            this.shieldsOnButton.addEventListener(
                'click',
                this.onShieldsOnButtonClick
            );

            if (!this.isDevelopment) {
                this.godModeButton.style.display = 'none';
                this.shieldsOnButton.style.display = 'none';
            }

            if (this.isDevelopment) {
                this.godModeButton.style.display = 'block';
                this.shieldsOnButton.style.display = 'block';

                const { game } = this.props;

                if (game.godMode) this.godModeButton.classList.add('active');
                if (game.shieldsOn)
                    this.shieldsOnButton.classList.add('active');
            }
        }

        if (this.highscoreButton && this.changeLogButton && this.soundButton) {
            this.highscoreButton.addEventListener(
                'click',
                this.onHighscoreButtonClick
            );
            this.changeLogButton.addEventListener(
                'click',
                this.onChangeLogButtonClick
            );
            this.soundButton.addEventListener(
                'click',
                this.onSoundsButtonClick
            );
        }
    };

    onGodModeButtonClick = () => {
        const { game } = this.props;

        game.godMode = !game.godMode;

        if (game.godMode) this.godModeButton?.classList.add('active');
        else this.godModeButton?.classList.remove('active');
    };

    onShieldsOnButtonClick = () => {
        const { game } = this.props;

        game.shieldsOn = !game.shieldsOn;

        if (game.shieldsOn) this.shieldsOnButton?.classList.add('active');
        else this.shieldsOnButton?.classList.remove('active');
    };

    showPopup = (element: HTMLElement) => {
        const existingPopup = document.querySelector('.popup-wrapper');
        if (existingPopup) {
            document.body.removeChild(existingPopup);
        }

        const popupWrapper = document.createElement('div');
        popupWrapper.classList.add('popup-wrapper');

        const popup = document.createElement('div');
        popup.classList.add('popup');

        popup.appendChild(element);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.style.marginTop = '10px';
        closeButton.classList.add('close-button');
        popup.prepend(closeButton);

        popupWrapper.appendChild(popup);
        document.body.appendChild(popupWrapper);

        document.body.classList.add('no-scroll');

        closeButton.addEventListener('click', function () {
            document.body.removeChild(popupWrapper);
            document.body.classList.remove('no-scroll');
        });

        popupWrapper.addEventListener('click', function (event) {
            if (event.target === popupWrapper) {
                document.body.removeChild(popupWrapper);
                document.body.classList.remove('no-scroll');
            }
        });

        popup.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    };

    showLoadingPopup = () => {
        const popup = document.createElement('div');
        popup.classList.add('loading-popup');

        const loadingContainer = document.createElement('div');
        loadingContainer.classList.add('loading-container');
        loadingContainer.appendChild(popup);

        const loadingText = document.createElement('div');
        loadingText.textContent = 'Loading...';
        loadingText.classList.add('loading-text');
        loadingContainer.appendChild(loadingText);

        this.showPopup(loadingContainer);
        return loadingContainer;
    };

    onHighscoreButtonClick = async () => {
        this.showLoadingPopup();

        try {
            const highscoreElement =
                await this.highscoreService.getHighscoreElement();
            this.showPopup(highscoreElement);
        } catch (error) {
            console.error('Failed to load highscores:', error);
            const errorElement = document.createElement('div');
            errorElement.textContent =
                'Failed to load highscores. Please try again.';
            errorElement.classList.add('error-message');
            this.showPopup(errorElement);
        }
    };

    onChangeLogButtonClick = () => {
        this.showPopup(changeLog());
    };

    saveHighscore = () => {
        const container = document.createElement('div');
        container.classList.add('highscore-container');

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your name';
        input.classList.add('highscore-input');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('save-button');

        const saveFunction = async () => {
            const name = input.value;
            const { game } = this.props;

            if (name) {
                const score = game.scoreService.score;
                this.showLoadingPopup();

                try {
                    await this.highscoreService.onSaveHighscore(name, score);
                    document.body.removeChild(
                        document.querySelector('.popup-wrapper')!
                    );
                    document.body.classList.remove('no-scroll');
                } catch (error) {
                    console.error('Failed to save highscore:', error);
                    const errorElement = document.createElement('div');
                    errorElement.textContent =
                        'Failed to save highscore. Please try again.';
                    errorElement.classList.add('error-message');
                    this.showPopup(errorElement);
                }
            } else {
                alert('Please enter a name.');
            }
        };

        saveButton.addEventListener('click', saveFunction);
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') saveFunction();
        });

        container.appendChild(input);
        container.appendChild(saveButton);
        this.showPopup(container);
    };

    onSoundsButtonClick = () => {
        const { game } = this.props;

        game.playSound = !game.playSound;

        if (game.playSound) {
            this.soundButton?.classList.add('active');
        } else {
            this.soundButton?.classList.remove('active');
        }
    };

    destroy = () => {
        if (this.godModeButton && this.shieldsOnButton) {
            this.godModeButton.removeEventListener(
                'click',
                this.onGodModeButtonClick
            );
            this.shieldsOnButton.removeEventListener(
                'click',
                this.onShieldsOnButtonClick
            );
        }

        if (this.highscoreButton && this.changeLogButton) {
            this.highscoreButton.removeEventListener(
                'click',
                this.onHighscoreButtonClick
            );
            this.changeLogButton.removeEventListener(
                'click',
                this.onChangeLogButtonClick
            );
        }
    };
}
