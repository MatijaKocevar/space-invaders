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

    showPopup = (message: string) => {
        // Create the popup wrapper
        const popupWrapper = document.createElement('div');
        popupWrapper.classList.add('popup-wrapper');

        // Create the popup element
        const popup = document.createElement('div');
        popup.classList.add('popup');

        // Add message to the popup
        const popupText = document.createElement('p');
        popupText.innerText = message;
        popup.appendChild(popupText);

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.style.marginTop = '10px';
        closeButton.classList.add('close-button');
        popup.prepend(closeButton);

        // Append the popup to the wrapper, then the wrapper to the body
        popupWrapper.appendChild(popup);
        document.body.appendChild(popupWrapper);

        // Close popup on button click
        closeButton.addEventListener('click', function () {
            document.body.removeChild(popupWrapper);
        });

        // Close popup when clicking outside of it
        popupWrapper.addEventListener('click', function (event) {
            if (event.target === popupWrapper) {
                document.body.removeChild(popupWrapper);
            }
        });

        // Prevent popup inner click from propagating to the wrapper
        popup.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    };

    onHighscoreButtonClick = () => {
        this.showPopup('Highscores feature is currently under construction.');
    };

    onChangeLogButtonClick = () => {
        this.showPopup('Check back soon for updates!');
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
