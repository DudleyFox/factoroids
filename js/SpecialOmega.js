import SpecialBase from './SpecialBase.js';
import Lightning from './Lightning.js';

export default class SpecialOmega extends SpecialBase {
    constructor(options) {
        super({ cooldownTime: 5, color:'gold', text:'Ω', state: options.state});
        this.active = false;
        this.redBase = 75;
        this.greenBase = 75;
        this.blueBase = 150;
    }

    terminate(ship) {
        if (this.active) {
            this.active = false;
            this.cooldown = 0;
            ship.lighning = null;
        }
    }

    generateColor() {
    // return `#7777${(0x77 + blue).toString(16)}`;
        const delta = this.cooldownTime - this.cooldown;
        const percentComplete = delta / this.cooldownTime;
        const maxColor = 255;
        const redDelta = (maxColor - this.redBase) * percentComplete;
        const greenDelta = (maxColor - this.greenBase) * percentComplete;
        const blueDelta = (maxColor - this.blueBase) * percentComplete;
        const redString = (Math.floor(this.redBase + redDelta)).toString(16);
        const greenString = (Math.floor(this.greenBase + greenDelta)).toString(16);
        const blueString = (Math.floor(this.blueBase + blueDelta)).toString(16);
        const result = '#' + redString + greenString + blueString;
        return result;
    }

    tick(delta, ship) {
        super.tick(delta, ship);
        if (this.active) {
            if (this.cooldown <= 0) {
                ship.lightning = null;
                this.active = false;
                this.factoroid?.factorize();
            }
            if (this.factoroid) {
                this.factoroid.color = this.generateColor();
            }
        }

    }

    invocation(ship) {
        this.active = true;
        this.factoroid = null;
        this.state = ship.state;
        let maxFactors = 0;
        let maxProduct = 0;
        let factoroid = null;
        this.state.facts.forEach(f => { 
            if (f.factors.length >= maxFactors) {
                if (f.product > maxProduct) {
                    maxFactors = f.factors.length;
                    maxProduct = f.product;
                    factoroid = f;
                }
            }
        });
        if (maxFactors > 1) {
            factoroid.color = 'black';
            this.factoroid = factoroid;
            ship.lightning = new Lightning(ship, factoroid);
        }
    }
}

