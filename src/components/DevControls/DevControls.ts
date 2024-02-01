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
    }

    init = () => {
        if (!this.isDevelopment) {
            this.godModeButton?.style.display === 'none';
            this.shieldsOnButton?.style.display === 'none';
        }
    };
}
