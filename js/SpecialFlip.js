import SpecialBase from './SpecialBase.js';

export default class SpecialFlip extends SpecialBase {
    constructor(options) {
        super({cooldownTime: 0.25, color: '#1111DD', text: '180', state: options.state});
    }

    invocation(ship) {
        ship.rotation += 180;
    }
}
