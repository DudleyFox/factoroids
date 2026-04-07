import SpecialBase from './SpecialBase.js';

export default class SpecialDeadStop extends SpecialBase {
    constructor(options) {
        super({cooldownTime: 1, color: '#DD1111', text: '0', state: options.state});
    }

    invocation(ship) {
        ship.xVelocity = 0;
        ship.yVelocity = 0;
    }
}
