import SpecialBase from './SpecialBase.js';

export default class SpecialFlip extends SpecialBase {
    constructor() {
        super(0.25, '#1111DD', '180');
    }

    invoke(ship) {
        if (this.cooldown === 0) {
            ship.rotation += 180;
            this.cooldown = this.cooldownTime;
        }
    }
}