import SpecialBase from './SpecialBase.js';

export default class SpecialDeadStop extends SpecialBase {
    constructor() {
        super(1, '#DD1111', '0');
    }

    invoke(ship) {
        if (this.cooldown === 0) {
            ship.xVelocity = 0;
            ship.yVelocity = 0;
            this.cooldown = this.cooldownTime;
        }
    }
}