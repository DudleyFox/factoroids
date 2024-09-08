import primes from './Primes.js';
import {
    getItemInt,
    setItem
} from './Storage.js';
import { toHex, randInt, normalizeIndex } from './AAAHelpers.js';

/**
 * Class to read and write ship settings to and from storage
 * to and from state.
 */
export default class ShipWarehouse {
    constructor() {
        this.steps = [45, 40, 36, 30, 24, 20, 18, 15, 12, 10, 9, 8, 6, 5];
        this.sweep = [
            {
                symbol: 'B',
                root: 10
            },
            {
                symbol: 'F',
                root: 14
            },
            {
                symbol: 'L',
                root: 6
            },
        ];
        this.rivets = [4, 5, 6, 7, 8, 9];
        this.modelIndex = getItemInt('m', 0);
        this.fustrumCapacitance = getItemInt('f', 13);
        this.sweepIndex = getItemInt('s', 0);
        this.rivetIndex = getItemInt('r', 0);
        this.red = getItemInt('sr', randInt(256));
        this.green = getItemInt('sg', randInt(256));
        this.blue = getItemInt('sb', randInt(256));
    }

    getSteps() {
        return this.steps;
    }

    getSweep() {
        return this.sweep;
    }

    getRivets() {
        return this.rivets;
    }

    calculateColor() {
        return `#${toHex(this.red, 2)}${toHex(this.green, 2)}${toHex(this.blue, 2)}`;
    }


    random() {
        this.setFustrumCapacitance(randInt(this.steps.length));
        this.setModelIndex(randInt(2000));
        this.setSweepIndex(randInt(this.sweep.length));
        this.setRivetIndex(randInt(this.rivets.length));
    }

    reset() {
        this.setFustrumCapacitance(13);
        this.setModelIndex(0);
        this.setSweepIndex(0);
        this.setRivetIndex(0);
    }


    setModelIndex(i) {
        this.modelIndex = normalizeIndex(i, primes.length);
        setItem('m', this.modelIndex);    
    }

    incModelIndex() {
        this.setModelIndex(this.modelIndex + 1);
    }

    decModelIndex() {
        this.setModelIndex(this.modelIndex - 1);
    }

    setFustrumCapacitance(i) {
        this.fustrumCapacitance = normalizeIndex(i, this.steps.length);
        setItem('f', this.fustrumCapacitance);
    }

    incFustrumCapacitance() {
        this.setFustrumCapacitance(this.fustrumCapacitance + 1);
    }

    decFustrumCapacitance() {
        this.setFustrumCapacitance(this.fustrumCapacitance - 1);
    }

    setSweepIndex(i) {
        this.sweepIndex = normalizeIndex(i, this.sweep.length);
        setItem('s', this.sweepIndex);
    }

    incSweepIndex() {
        this.setSweepIndex(this.sweepIndex + 1);
    }

    decSweepIndex() {
        this.setSweepIndex(this.sweepIndex - 1);
    }

    setRivetIndex(i) {
        this.rivetIndex = normalizeIndex(i, this.rivets.length);
        setItem('r', this.rivetIndex);
    }

    incRivetIndex() {
        this.setRivetIndex(this.rivetIndex + 1);
    }

    decRivetIndex() {
        this.setRivetIndex(this.rivetIndex - 1);
    }

    getRed() {
        return this.red;
    }

    setRed(r) {
        this.red = normalizeIndex(r, 256);
        setItem('sr', this.red);
    }

    getGreen() {
        return this.green;
    }

    setGreen(g) {
        this.green = normalizeIndex(g, 256);
        setItem('sg', this.green);
    }

    getBlue() {
        return this.blue;
    }

    setBlue(b) {
        this.blue = normalizeIndex(b, 256);
        setItem('sb', this.blue);
    }

    buildRandomShipState(colorFn) {
        const stepsIndex = randInt(this.steps.length);
        const modelIndex = randInt(2000);
        const sweepIndex = randInt(this.sweep.length);
        const rivetIndex = randInt(this.rivets.length);
        const qNumber = primes[modelIndex] * Math.pow(this.sweep[sweepIndex].root, this.rivets[rivetIndex]);
        const stepSize = this.steps[stepsIndex];
        const color = colorFn();
        const state = {
            shipNumber: qNumber,
            shipStepSize: stepSize,
            shipColor: color,
            shipHull: color,
        };

        return state;
    }

    buildShipState() {
        const qNumber = primes[this.modelIndex] * Math.pow(this.sweep[this.sweepIndex].root, this.rivets[this.rivetIndex])
        const stepSize = this.steps[this.fustrumCapacitance];
        const color = this.calculateColor();
        const state = {
            shipNumber: qNumber,
            shipStepSize: stepSize,
            shipColor: color,
            shipHull: color,
        };

        return state;
    }

    getModel() {
        return primes[this.modelIndex];
    }
    
    getSteps() {
        return 360 / this.steps[this.fustrumCapacitance];
    }

    getSweep() {
        return this.sweep[this.sweepIndex].symbol;
    }

    getRivets() {
        return this.rivets[this.rivetIndex];
    }
}
