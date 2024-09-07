import SpecialBase from './SpecialBase.js';

export default class SpecialFlip extends SpecialBase {
    constructor() {
        super(0.25, '#1111DD', '180');
    }

    invocation(ship) {
        ship.rotation += 180;
    }
}
