import SpecialBase from './SpecialBase.js';

export default class SpecialMagentar extends SpecialBase {
    constructor() {
        super(5, '#DD11DD', 'Err');
        this.state = {
            facts: []
        };
        this.active = false;
    }

    terminate() {
        if (this.active) {
            this.state.facts.forEach(f => { f.magnetarOff(); });
            this.active = false;
            this.cooldown = 0;
        }
    }

    tick(delta) {
        super.tick(delta);
        if (this.cooldown <= 0 && this.active) {
            this.state.facts.forEach(f => { f.magnetarOff(); });
            this.active = false;
        }

    }

    invoke(ship) {
        if (this.cooldown === 0) {
            this.active = true;
            this.state = ship.state;
            this.state.facts.forEach(f => { f.magnetarOn(); });
            this.cooldown = this.cooldownTime;
        }
    }
}