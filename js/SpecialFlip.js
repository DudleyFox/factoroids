import SpecialBase from './SpecialBase.js';

export default class SpecialFlip extends SpecialBase {
    constructor() {
        super();
    }

    update(ship, delta) {
        if (this.cooldown === 0) {
            ship.rotation += 180;
            this.cooldown = 15;
        }

    }

    color() {
        return '#1111DD';
    }
}