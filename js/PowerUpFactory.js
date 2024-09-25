import Point from './Point.js';
import PowerUp from './PowerUp.js';
import SpecialFlip from './SpecialFlip.js';
import SpecialFreeze from './SpecialFreeze.js';
import SpecialHyper from './SpecialHyper.js';
import SpecialDeadStop from './SpecialDeadStop.js';
import SpecialMagnetar from './SpecialMagnetar.js';
import SpecialX from './SpecialX.js';
import SpecialOmega from './SpecialOmega.js';
import {
    randInt,
    randFloat
} from './AAAHelpers.js'

export default class PowerUpFactory {
    constructor(upperBounds, state) {
        this.state = state;
        this.cooldown = 0;
        this.upperBounds = upperBounds;
        this.specials = [
            SpecialFlip,
            SpecialHyper,
            SpecialDeadStop,
            SpecialMagnetar,
            SpecialX,
            SpecialOmega,
            SpecialFreeze
        ]
    }

    tick(delta) {
        const jackPot = randInt(10000) === 997;
        if (jackPot && this.state.powerUps.length === 0) {
           this.boom();
        }
        if (this.cooldown > 0) {
            this.cooldown -= delta
            this.cooldown = Math.max(0, this.cooldown);
        }
    }

    boom() {
        const index = randInt(this.specials.length);
        const special = new this.specials[index]({state: this.state});
        const x = randFloat(this.upperBounds.x);
        const y = randFloat(this.upperBounds.y);
        const options = {
            origin: new Point(x,y),
            upperBounds: this.upperBounds,
            state: this.state,
            special: special
        };
        this.state.powerUps.push(new PowerUp(options));
    }

    create() {
        if (this.cooldown === 0) {
            this.boom();
            this.cooldown = 1;
        }
    }
}
