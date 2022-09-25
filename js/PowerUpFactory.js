import { coinToss } from './AAAHelpers.js';
import Point from './Point.js';
import PowerUp from './PowerUp.js';
import SpecialFlip from './SpecialFlip.js';
import SpecialHyper from './SpecialHyper.js';

export default class PowerUpFactory {
    constructor(upperBounds, state) {
        this.state = state;
        this.upperBounds = upperBounds;
    }
    tick() {
        const jackPot = Math.floor(Math.random() * 1000) === 997;
        if (jackPot && this.state.powerUps.length === 0) {
            const special = coinToss() === 1 ? new SpecialFlip() : new SpecialHyper();
            const x = Math.random() * this.upperBounds.x;
            const y = Math.random() * this.upperBounds.y;
            this.state.powerUps.push(new PowerUp(new Point(x,y), this.upperBounds, this.state, special))
        }
    }
}