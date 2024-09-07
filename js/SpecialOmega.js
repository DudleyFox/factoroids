import SpecialBase from './SpecialBase.js';
import Lightning from './Lightning.js';

export default class SpecialOmega extends SpecialBase {
    constructor() {
        super(5, 'gold', 'Ω');
        this.active = false;
    }

    terminate(ship) {
        if (this.active) {
            this.active = false;
            this.cooldown = 0;
            ship.lighning = null;
        }
    }

    tick(delta, ship) {
        super.tick(delta, ship);
        if (this.cooldown <= 0 && this.active) {
            ship.lightning = null;
            this.active = false;
        }

    }

    invocation(ship) {
        this.active = true;
        this.state = ship.state;
        let max = 0;
        let factoroid = null;
        this.state.facts.forEach(f => { 
            if (f.product > max) {
                max = f.product;
                factoroid = f;
            }
        });
        factoroid.color = 'red';
        ship.lightning = new Lightning(ship, factoroid);
    }
}

