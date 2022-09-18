import GameScreenBase from './GameScreenBase.js';
import GameScreenLevel from './GameScreenLevel.js';
import Button from './Button.js';
import Point from './Point.js';
import Ship from './Ship.js';
import {
    getItemInt,
    setItem
} from './Storage.js';
import primes from './Primes.js';
import Slider from './Slider.js';
import { toHex } from './AAAHelpers.js';

const wrapBackwards = (c, m) => c < 0 ? m - 1 : c;
const randInt = (max) => Math.floor(Math.random() * max);

export default class ShipSelector extends GameScreenBase {
    constructor(upperBounds, keyhandler, state, pointerHandler) {
        super(upperBounds, keyhandler, state)
        this.pointerHandler = pointerHandler;
        this.buttons = [];
        this.sliders = [];
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
        this.color = this.calculateColor();
        this.qNumber = 7;
        this.stepSize = 5;

        const gradientFill = (color) => (ctx, slider) => {
            // This assume the direction is up for the slider
            const x0 = slider.tl.x;
            const y0 = slider.tl.y + slider.height;
            const x1 = slider.width;
            const y1 = slider.tl.y;
            const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
            gradient.addColorStop(0, 'black');
            gradient.addColorStop(1, color);
            return gradient;
        }

        const redFill = gradientFill('red');
        const greenFill = gradientFill('green');
        const blueFill = gradientFill('blue');

        this.angle = 0;

        this.drawRadii = false;
        this.leftEdge = this.upperBounds.x - 150;
        this.textCenter = 62;
        this.buttons.push(new Button('plus', '+', new Point(this.leftEdge + 100, 25), 25, 25, pointerHandler));
        this.buttons.push(new Button('minus', '-', new Point(this.leftEdge, 25), 25, 25, pointerHandler));
        this.buttons.push(new Button('plusF', '+', new Point(this.leftEdge + 100, 60), 25, 25, pointerHandler));
        this.buttons.push(new Button('minusF', '-', new Point(this.leftEdge, 60), 25, 25, pointerHandler));
        this.buttons.push(new Button('plusS', '>', new Point(this.leftEdge + 100, 95), 25, 25, pointerHandler));
        this.buttons.push(new Button('minusS', '<', new Point(this.leftEdge, 95), 25, 25, pointerHandler));
        this.buttons.push(new Button('plusR', '+', new Point(this.leftEdge + 100, 130), 25, 25, pointerHandler));
        this.buttons.push(new Button('minusR', '-', new Point(this.leftEdge, 130), 25, 25, pointerHandler));
        this.buttons.push(new Button('random', 'Random', new Point(this.leftEdge, 165), 125, 25, pointerHandler));
        this.buttons.push(new Button('reset', 'Reset', new Point(this.leftEdge, 200), 125, 25, pointerHandler));
        this.buttons.push(new Button('ok', 'Save', new Point(this.leftEdge, 235), 125, 25, pointerHandler));
        this.sliders.push(new Slider('red', 0, 255, this.red, new Point(5, 10), 20, 255, 'up', 'gray', redFill, 'gray', pointerHandler));
        this.sliders.push(new Slider('green', 0, 255, this.green, new Point(5 + 27, 10), 20, 255, 'up', 'gray', greenFill, 'gray', pointerHandler));
        this.sliders.push(new Slider('blue', 0, 255, this.blue, new Point(5 + 54, 10), 20, 255, 'up', 'gray', blueFill, 'gray', pointerHandler));
        this.normalizeIndices();
        this.buttons.forEach(b => b.Subscribe(this));
        this.sliders.forEach(s => s.Subscribe(this));
    }

    calculateColor() {
        return `#${toHex(this.red, 2)}${toHex(this.green, 2)}${toHex(this.blue, 2)}`;
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
        this.color = this.calculateColor();
        this.state.shipNumber = this.qNumber;
        this.state.shipStepSize = this.stepSize;
        this.state.shipColor = this.color;
        this.state.shipHull = this.color;


        setItem('f', this.fustrumCapacitance);
        setItem('m', this.modelIndex);
        setItem('s', this.sweepIndex);
        setItem('r', this.rivetIndex);
        setItem('sr', this.red);
        setItem('sg', this.green);
        setItem('sb', this.blue);
        this.ship = new Ship(new Point(this.upperBounds.x / 2, this.upperBounds.y / 2), this.upperBounds, this.keyHandler, this.state, 500, false, true);
    }

    setUpperBounds(ub) {
        super.setUpperBounds(ub);
        const delta = this.leftEdge - (this.upperBounds.x - 150);
        this.leftEdge -= delta;
        this.buttons.forEach(b => b.tl.x = b.tl.x - delta);
        this.ship.xPos = this.upperBounds.x / 2;
        this.ship.yPos = this.upperBounds.y / 2;
    }

    updateValue(name, value, slider) {
        switch (name) {
            case 'red':
                this.red = value;
                break
            case 'green':
                this.green = value;
                break
            case 'blue':
                this.blue = value;
                break
        }
        this.normalizeIndices();
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
            case 'reset':
                {
                    this.fustrumCapacitance = 13;
                    this.modelIndex = 0;
                    this.sweepIndex = 0;
                    this.rivetIndex = 0;
                }
                break;
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
        this.sliders.forEach(s => s.draw(context));
    }
}