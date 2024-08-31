import SpecialBase from './SpecialBase.js';

export default class SpecialDeadStop extends SpecialBase {
    constructor() {
        super(1, '#DD1111', '0');
    }

    invocation(ship) {
        ship.xVelocity = 0;
        ship.yVelocity = 0;
    }
}
