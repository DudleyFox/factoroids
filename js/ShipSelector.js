import GameScreenBase from './GameScreenBase.js';
import GameScreenLevel from './GameScreenLevel.js';
import Button from './Button.js';
import Point from './Point.js';
import Ship from './Ship.js';

import Slider from './Slider.js';
import ShipWarehouse from './ShipWarehouse.js';
import StartScreen from './StartScreen.js';

export default class ShipSelector extends GameScreenBase {
    constructor(upperBounds, keyhandler, state, pointerHandler) {
        super(upperBounds, keyhandler, state)
        this.shipWarehouse = new ShipWarehouse();
        this.pointerHandler = pointerHandler;
        this.buttons = [];
        this.sliders = [];

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
        this.buttons.push(new Button('ok', 'OK', new Point(this.leftEdge, 235), 125, 25, pointerHandler));
        this.buttons.push(new Button('play', 'Play', new Point(this.leftEdge, 270), 125, 25, pointerHandler));
        this.sliders.push(new Slider('red', 0, 255, this.shipWarehouse.getRed(), new Point(5, 10), 20, 255, 'up', 'gray', redFill, 'gray', pointerHandler));
        this.sliders.push(new Slider('green', 0, 255, this.shipWarehouse.getGreen(), new Point(5 + 27, 10), 20, 255, 'up', 'gray', greenFill, 'gray', pointerHandler));
        this.sliders.push(new Slider('blue', 0, 255, this.shipWarehouse.getBlue(), new Point(5 + 54, 10), 20, 255, 'up', 'gray', blueFill, 'gray', pointerHandler));
        this.rebuild();
        this.buttons.forEach(b => b.Subscribe(this));
        this.sliders.forEach(s => s.Subscribe(this));
    }

    rebuild() {
        const shipState = this.shipWarehouse.buildShipState();
        this.state.shipNumber = shipState.shipNumber;
        this.state.shipStepSize = shipState.shipStepSize;
        this.state.shipColor = shipState.shipColor;
        this.shipHull = shipState.shipHull;
        let oldAngle = 0;
        let leftRotation = 0;
        let rightRotation = 0;
        if (this.ship) {
            oldAngle = this.ship.rotation;
            leftRotation = this.ship.leftRotation;
            rightRotation = this.ship.rightRotation;
        }
        this.ship = new Ship(new Point(this.upperBounds.x / 2, this.upperBounds.y / 2), this.upperBounds, this.keyHandler, this.state, 500, false, true);
        this.ship.rotation = oldAngle;
        this.ship.leftRotation = leftRotation;
        this.ship.rightRotation = rightRotation;
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
                this.shipWarehouse.setRed(value);
                break
            case 'green':
                this.shipWarehouse.setGreen(value);
                break
            case 'blue':
                this.shipWarehouse.setBlue(value);
                break
        }
        this.rebuild();
    }

    click(x, button) {
        const wh = this.shipWarehouse;
        switch (x) {
            case 'plus': {
                wh.incModelIndex();
            }
                break;
            case 'minus': {
                wh.decModelIndex();
            }
                break;
            case 'plusF': {
                wh.incFustrumCapacitance();
            }
                break;
            case 'minusF': {
                wh.decFustrumCapacitance();
            }
                break;
            case 'plusS': {
                wh.incSweepIndex();
            }
                break;
            case 'minusS': {
                wh.decSweepIndex();
            }
                break;
            case 'plusR': {
                wh.incRivetIndex();
            }
                break;
            case 'minusR': {
                wh.decRivetIndex();
            }
                break;
            case 'random': {
               wh.random();
            }
                break;
            case 'reset':
                {
                   wh.reset();
                }
                break;
            case 'ok': {
                this.done = true;
            }
            case 'play': {
                this.play = true;
            }
                break;
            default:
            // do nothing
        }
        this.rebuild();
    }

    update(delta) {
        if (this.done) {
            //constructor(upperBounds, keyHandler, state, level) 
            return new StartScreen(this.upperBounds, this.keyHandler, this.state, this.pointerHandler);
        }
        if (this.play) {
            //constructor(upperBounds, keyHandler, state, level) 
            return new GameScreenLevel(this.upperBounds, this.keyHandler, this.state, 2, this.pointerHandler);
        }
        this.ship.update(delta);
        return this;
    }

    draw(context) {
        this.buttons.forEach(b => b.draw(context));
        const wh = this.shipWarehouse;
        context.save();
        context.fillStyle = 'yellow';
        context.font = '12pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(wh.getModel(), this.leftEdge + this.textCenter, 37);
        context.fillText(wh.getSteps(), this.leftEdge + this.textCenter, 72);
        context.fillText(wh.getSweep(), this.leftEdge + this.textCenter, 108);
        context.fillText(wh.getRivets(), this.leftEdge + this.textCenter, 142);
        context.restore();
        this.ship.draw(context);
        this.sliders.forEach(s => s.draw(context));
    }
}