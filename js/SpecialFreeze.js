import SpecialBase from './SpecialBase.js';

export default class SpecialFreeze extends SpecialBase {
    constructor() {
        super(9, '#FFFFFF', 'x00', 3);
        this.state = {
            facts: []
        };
        this.active = false;
    }

    terminate() {
        if (this.active) {
            this.state.facts.forEach(f => { f.freezeOff(); });
            this.active = false;
            this.cooldown = 0;
        }
    }

    tick(delta, ship) {
        super.tick(delta, ship);
        if (this.cooldown <= 0 && this.active) {
            this.state.facts.forEach(f => { f.freezeOff(); });
            this.active = false;
        }

    }

    invocation(ship) {
        this.active = true;
        this.state = ship.state;
        this.state.facts.forEach(f => { f.freezeOn(); });
    }
}
