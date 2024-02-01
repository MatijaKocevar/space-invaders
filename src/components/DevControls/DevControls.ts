import { IDevControls } from './entitites/DevControls.interface';

export class DevControls {
    props: IDevControls;
    godModeButton: HTMLButtonElement | null;
    shieldsOnButton: HTMLButtonElement | null;
    isDevelopment = import.meta.env.MODE === 'development';

    constructor(props: IDevControls) {
        this.props = props;
        this.godModeButton = document.querySelector('#god-mode-button');
        this.shieldsOnButton = document.querySelector('#shields-on-button');

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
}
