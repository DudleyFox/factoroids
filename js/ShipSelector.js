import GameScreenBase from './GameScreenBase.js';
import GameScreenLevel from './GameScreenLevel.js';
import Button from './Button.js';
import Point from './Point.js';
import Ship from './Ship.js';
import {
    getItem,
    setItem
} from './Storage.js';
import primes from './Primes.js';

const wrapBackwards = (c, m) => c < 0 ? m - 1 : c;
const randInt = (max) => Math.floor(Math.random() * max);

export default class ShipSelector extends GameScreenBase {
    constructor(upperBounds, keyhandler, state, pointerHandler) {
        super(upperBounds, keyhandler, state)
        this.pointerHandler = pointerHandler;
        this.buttons = [];
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
        this.modelIndex = getItem('m', 0);
        this.fustrumCapacitance = getItem('f', 13);
        this.sweepIndex = getItem('s', 0);
        this.rivetIndex = getItem('r', 0);
        this.qNumber = 7;
        this.stepSize = 5;

        this.angle = 0;

        this.drawRadii = false;
        this.leftEdge = 850;
        this.textCenter = 62;
        this.buttons.push(new Button('plus', '+', new Point(950, 25), 25, 25, pointerHandler));
        this.buttons.push(new Button('minus', '-', new Point(this.leftEdge, 25), 25, 25, pointerHandler));
        this.buttons.push(new Button('plusF', '+', new Point(950, 60), 25, 25, pointerHandler));
        this.buttons.push(new Button('minusF', '-', new Point(this.leftEdge, 60), 25, 25, pointerHandler));
        this.buttons.push(new Button('plusS', '>', new Point(950, 95), 25, 25, pointerHandler));
        this.buttons.push(new Button('minusS', '<', new Point(this.leftEdge, 95), 25, 25, pointerHandler));
        this.buttons.push(new Button('plusR', '+', new Point(950, 130), 25, 25, pointerHandler));
        this.buttons.push(new Button('minusR', '-', new Point(this.leftEdge, 130), 25, 25, pointerHandler));
        this.buttons.push(new Button('random', 'Random', new Point(this.leftEdge, 165), 125, 25, pointerHandler));
        //this.buttons.push(new Button('struts', 'Struts', new Point(this.leftEdge, 200), 125, 25, pointerHandler));
        this.buttons.push(new Button('ok', 'Save', new Point(this.leftEdge, 235), 125, 25, pointerHandler));

        this.normalizeIndices();
        this.buttons.forEach(b => b.Subscribe(this));
    }

    normalizeIndices() {
        this.fustrumCapacitance = wrapBackwards(this.fustrumCapacitance, this.steps.length);
        this.modelIndex = wrapBackwards(this.modelIndex, primes.length);
        this.sweepIndex = wrapBackwards(this.sweepIndex, this.sweep.length);
        this.rivetIndex = wrapBackwards(this.rivetIndex, this.rivets.length);
        this.fustrumCapacitance = this.fustrumCapacitance % this.steps.length;
        this.modelIndex = this.modelIndex % primes.length;
        this.sweepIndex = this.sweepIndex % this.sweep.length;
        this.rivetIndex = this.rivetIndex % this.rivets.length;
        this.qNumber = primes[this.modelIndex] * Math.pow(this.sweep[this.sweepIndex].root, this.rivets[this.rivetIndex])
        this.stepSize = this.steps[this.fustrumCapacitance];
        this.state.shipNumber = this.qNumber;
        this.state.shipStepsize = this.stepSize;

        setItem('f', this.fustrumCapacitance);
        setItem('m', this.modelIndex);
        setItem('s', this.sweepIndex);
        setItem('r', this.rivetIndex);
        this.ship = new Ship(new Point(this.upperBounds.x / 2, this.upperBounds.y / 2), this.upperBounds, this.keyHandler, this.state, 500, 'yellow', false);
    }

    click(x, button) {
        switch (x) {
            case 'plus': {
                this.modelIndex += 1;
            }
                break;
            case 'minus': {
                this.modelIndex -= 1;
            }
                break;
            case 'plusF': {
                this.fustrumCapacitance += 1;
            }
                break;
            case 'minusF': {
                this.fustrumCapacitance -= 1;
            }
                break;
            case 'plusS': {
                this.sweepIndex += 1;
            }
                break;
            case 'minusS': {
                this.sweepIndex -= 1;
            }
                break;
            case 'plusR': {
                this.rivetIndex += 1;
            }
                break;
            case 'minusR': {
                this.rivetIndex -= 1;
            }
                break;
            case 'random': {
                this.fustrumCapacitance = randInt(this.steps.length);
                this.modelIndex = randInt(1500);
                this.sweepIndex = randInt(this.sweep.length);
                this.rivetIndex = randInt(this.rivets.length);
            }
                break;
            // case 'struts': {
            //     this.drawRadii = !this.drawRadii;
            //     button.displayName = this.drawRadii ? 'No Struts' : 'Struts';
            // }
            // break;
            case 'ok': {
                this.done = true;
            }
                break;
            default:
            // do nothing
        }
        this.normalizeIndices();
    }

    update(delta) {
        if (this.done) {
            //constructor(upperBounds, keyHandler, state, level) 
            return new GameScreenLevel(this.upperBounds, this.keyHandler, this.state);
        }
        this.ship.update(delta);
        return this;
    }

    draw(context) {
        this.buttons.forEach(b => b.draw(context));
        context.save();
        context.fillStyle = 'yellow';
        context.font = '12pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(primes[this.modelIndex], this.leftEdge + this.textCenter, 37);
        context.fillText(360 / this.steps[this.fustrumCapacitance], this.leftEdge + this.textCenter, 72);
        context.fillText(this.sweep[this.sweepIndex].symbol, this.leftEdge + this.textCenter, 108);
        context.fillText(this.rivets[this.rivetIndex], this.leftEdge + this.textCenter, 142);
        context.restore();
        this.ship.draw(context);
    }
}