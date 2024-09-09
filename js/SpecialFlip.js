import SpecialBase from './SpecialBase.js';

export default class SpecialFlip extends SpecialBase {
    constructor() {
        super({cooldownTime: 0.25, color: '#1111DD', text: '180'});
    }

    invocation(ship) {
        ship.rotation += 180;
    }
}
