import primes from './Primes.js';
import {
    getItemInt,
    setItem
} from './Storage.js';
import { toHex } from './AAAHelpers.js';

const randInt = (max) => Math.floor(Math.random() * max);

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
        this.red = getItemInt('sr', 255);
        this.green = getItemInt('sg', 255);
        this.blue = getItemInt('sb', 0);
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

    normalizeIndex(index, length) {
        if (index < 0) {
            return length - 1;
        } else if (index >= length) {
            return 0;
        }
        return index;
    }

    random() {
        this.setFustrumCapacitance(randInt(this.steps.length));
        this.setModelIndex(randInt(1500));
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
        this.modelIndex = this.normalizeIndex(i, primes.length);
        setItem('m', this.modelIndex);    
    }

    incModelIndex() {
        this.setModelIndex(this.modelIndex + 1);
    }

    decModelIndex() {
        this.setModelIndex(this.modelIndex - 1);
    }

    setFustrumCapacitance(i) {
        this.fustrumCapacitance = this.normalizeIndex(i, this.steps.length);
        setItem('f', this.fustrumCapacitance);
    }

    incFustrumCapacitance() {
        this.setFustrumCapacitance(this.fustrumCapacitance + 1);
    }

    decFustrumCapacitance() {
        this.setFustrumCapacitance(this.fustrumCapacitance - 1);
    }

    setSweepIndex(i) {
        this.sweepIndex = this.normalizeIndex(i, this.sweep.length);
        setItem('s', this.sweepIndex);
    }

    incSweepIndex() {
        this.setSweepIndex(this.sweepIndex + 1);
    }

    decSweepIndex() {
        this.setSweepIndex(this.sweepIndex - 1);
    }

    setRivetIndex(i) {
        this.rivetIndex = this.normalizeIndex(i, this.rivets.length);
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
        this.red = this.normalizeIndex(r, 256);
        setItem('sr', this.red);
    }

    getGreen() {
        return this.green;
    }

    setGreen(g) {
        this.green = this.normalizeIndex(g, 256);
        setItem('sg', this.green);
    }

    getBlue() {
        return this.blue;
    }

    setBlue(b) {
        this.blue = this.normalizeIndex(b, 256);
        setItem('sb', this.blue);
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