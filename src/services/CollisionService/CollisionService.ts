import { ICollisionService } from './CollisionService.interface';
import { DefenderCollisionService } from './DefenderCollisionService/DefenderCollisionService';
import { InvaderCollisionService } from './InvaderCollisionService/InvaderCollisionService';
import { ShieldCollisionService } from './ShieldCollisionService/ShieldCollisionService';

export class CollisionService {
    props: ICollisionService;
    shields: ShieldCollisionService;
    defender: DefenderCollisionService;
    invaders: InvaderCollisionService;

    constructor(props: ICollisionService) {
        this.props = props;
        this.shields = new ShieldCollisionService(props);
        this.defender = new DefenderCollisionService(props);
        this.invaders = new InvaderCollisionService(props);
    }

    handleCollisions() {
        const { game } = this.props;

        if (game.shieldsOn) this.shields.handleCollision();
        if (!game.godMode) this.defender.handleCollision();
        this.invaders.handleCollision();
    }
}
