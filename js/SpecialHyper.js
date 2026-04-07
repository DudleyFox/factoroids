import SpecialBase from "./SpecialBase.js";
import {
    randFloat
} from './AAAHelpers.js';

export default class SpecialHyper extends SpecialBase {
    constructor(options) {
        super({cooldownTime: 1, color: '#11DD11', text: 'i', state: options.state});
    }

    invocation(ship) {
        const newX = randFloat(ship.upperBounds.x);
        const newY = randFloat(ship.upperBounds.y);
        const newR = randFloat(360);
        ship.xPos = newX;
        ship.yPos = newY;
        ship.rotation = newR;
        ship.xVelocity = 0;
        ship.yVelocity = 0;
    }
}
