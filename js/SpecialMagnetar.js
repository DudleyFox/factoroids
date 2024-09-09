import SpecialBase from './SpecialBase.js';

export default class SpecialMagentar extends SpecialBase {
    constructor() {
        super({cooldownTime: 5, color: '#DD11DD', text: 'Err'});
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

    tick(delta, ship) {
        super.tick(delta, ship);
        if (this.cooldown <= 0 && this.active) {
            this.state.facts.forEach(f => { f.magnetarOff(); });
            this.active = false;
        }

    }

    invocation(ship) {
        this.active = true;
        this.state = ship.state;
        this.state.facts.forEach(f => { f.magnetarOn(); });
    }
}
