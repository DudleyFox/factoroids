import Point from './Point.js';
import PowerUp from './PowerUp.js';
import SpecialFlip from './SpecialFlip.js';
import SpecialHyper from './SpecialHyper.js';
import SpecialDeadStop from './SpecialDeadStop.js';
import SpecialMagnetar from './SpecialMagnetar.js';

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
        const jackPot = Math.floor(Math.random() * 1000) === 997;
        if (jackPot && this.state.powerUps.length === 0) {
           this.boom();
        }
        if (this.cooldown > 0) {
            this.cooldown -= delta
            this.cooldown = Math.max(0, this.cooldown);
        }
    }

    boom() {
        const index = Math.floor(Math.random() * this.specials.length);
        const special = new this.specials[index]();
        const x = Math.random() * this.upperBounds.x;
        const y = Math.random() * this.upperBounds.y;
        this.state.powerUps.push(new PowerUp(new Point(x,y), this.upperBounds, this.state, special))
    }

    create() {
        if (this.cooldown === 0) {
            this.boom();
            this.cooldown = 1;
        }
    }
}