import SpecialBase from './SpecialBase.js';

export default class SpecialOmega extends SpecialBase {
    constructor() {
        super(5, '#DD11DD', 'Err');
        this.state = {
            facts: []
        };
        this.active = false;
    }

    terminate() {
        if (this.active) {
            this.state.facts.forEach(f => { f.omegaOff(); });
            this.active = false;
            this.cooldown = 0;
        }
    }

    tick(delta, ship) {
        super.tick(delta, ship);
        if (this.cooldown <= 0 && this.active) {
            this.state.facts.forEach(f => { f.omegaOff(); });
            this.active = false;
        }

    }

    invocation(ship) {
        this.active = true;
        this.state = ship.state;
        this.state.facts.forEach(f => { f.omegaOn(); });
    }


}

