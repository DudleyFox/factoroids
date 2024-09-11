import SpecialBase from './SpecialBase.js';

export default class SpecialDeadStop extends SpecialBase {
    constructor() {
        super({cooldownTime: 1, color: '#DD1111', text: '0'});
    }

    invocation(ship) {
        ship.xVelocity = 0;
        ship.yVelocity = 0;
    }
}
