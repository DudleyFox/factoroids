import SpecialBase from './SpecialBase.js';

export default class SpecialX extends SpecialBase {
    constructor() {
        super(9, 'purple', 'X', 3);
        this.state = {
            facts: []
        };
        this.active = false;
    }

    invocation(ship) {
        this.active = true;
        this.state = ship.state;
        let largestFactor = 0;
        let factoroid = null;
        this.state.facts.forEach(f => { 
            f.factors.forEach(pf => {
                if (pf > largestFactor) {
                    largestFactor = pf;
                    factoroid = f;
                }
            });
        });
        ship.keyHandler.setNumberDirect(largestFactor);
        factoroid.color = 'gold';
    }
}
