import { IGameControls } from './entitites/IGameControls.interface';

export class GameOptions {
    props: IGameControls;
    godModeButton: HTMLButtonElement | null;
    shieldsOnButton: HTMLButtonElement | null;
    highscoreButton: HTMLButtonElement | null;
    changeLogButton: HTMLButtonElement | null;
    isDevelopment = import.meta.env.MODE === 'development';

    constructor(props: IGameControls) {
        this.props = props;
        this.godModeButton = document.querySelector('#god-mode-button');
        this.shieldsOnButton = document.querySelector('#shields-on-button');
        this.highscoreButton = document.querySelector('#highscore-button');
        this.changeLogButton = document.querySelector('#change-log-button');

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

        if (this.highscoreButton && this.changeLogButton) {
            this.highscoreButton.addEventListener(
                'click',
                this.onHighscoreButtonClick
            );
            this.changeLogButton.addEventListener(
                'click',
                this.onChangeLogButtonClick
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

    onHighscoreButtonClick = () => {};

    onChangeLogButtonClick = () => {};

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
