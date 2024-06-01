import Point from './Point.js';
import PowerUp from './PowerUp.js';
import SpecialFlip from './SpecialFlip.js';
import SpecialHyper from './SpecialHyper.js';
import SpecialDeadStop from './SpecialDeadStop.js';
import SpecialMagnetar from './SpecialMagnetar.js';
import {
    randInt
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
            SpecialMagnetar
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
        const special = new this.specials[index]();
        const x = randFloat(this.upperBounds.x);
        const y = randFloat(this.upperBounds.y);
        this.state.powerUps.push(new PowerUp(new Point(x,y), this.upperBounds, this.state, special))
    }

    create() {
        if (this.cooldown === 0) {
            this.boom();
            this.cooldown = 1;
        }
    }
}