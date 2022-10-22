import Factoroid from "./Factoroid.js";
import GameScreenBase from "./GameScreenBase.js";
import GameScreenLevel from "./GameScreenLevel.js";
import ShipWarehouse from "./ShipWarehouse.js";
import ShipSelector from "./ShipSelector.js";
import Button from "./Button.js";
import Point from "./Point.js";

export default class StartScreen extends GameScreenBase {
    constructor(upperBounds, keyhandler, state, pointerHandler) {
        super(upperBounds, keyhandler, state);
        this.pointerHandler = pointerHandler;
        this.shipWarehouse = new ShipWarehouse
        this.state = { ...this.state, ...(this.shipWarehouse.buildShipState()) };
        this.play = false;
        this.selectShip = false;
        this.facts = []; // only on this screen.
        for (var i = 0; i < 7; ++i) {
            const qNumber = Math.floor(Math.random() * 10000) + 7;
            const x = Math.random() * this.upperBounds.x;
            const y = Math.random() * this.upperBounds.y;
            this.facts.push(new Factoroid(qNumber, new Point(x, y), this.state, new Point(this.upperBounds.x, this.upperBounds.y)));
        }
        this.buildButtons();
        
    }

    setUpperBounds(ub) {
        super.setUpperBounds(ub);
        this.facts.forEach(f => f.setUpperBounds(ub));
        this.buildButtons();
    }

    buildButtons() {
        if (this.buttons) {
            this.buttons.forEach(b => b.Unsubscribe(this));
        }
        this.buttons = [];
        this.yDelta = 40;
        this.leftEdge = this.upperBounds.x / 2 - 60;
        this.topEdge = this.upperBounds.y / 2 - this.yDelta;
       
        this.buttons.push(new Button('select', 'Select Ship', new Point(this.leftEdge, this.topEdge), 120, 25, this.pointerHandler));
        this.buttons.push(new Button('play', 'Play', new Point(this.leftEdge, this.topEdge + this.yDelta), 120, 25, this.pointerHandler));
        this.buttons.forEach(b => b.Subscribe(this));
    }

    click(x, button) {
        switch (x) {
            case 'play': {
                this.play = true;
            }
                break;
            case 'select': {
                this.selectShip = true;
            }
                break;
            default:
            // do nothing
        }
    }

    update(delta) {
        this.facts.forEach(f => f.update(delta));
        this.buttons.forEach(b => b.update(delta));
        if (this.play) {
            return new GameScreenLevel(this.upperBounds, this.keyHandler, this.state, 2, this.pointerHandler);
        }
        if (this.selectShip) {
            return new ShipSelector(this.upperBounds, this.keyHandler, this.state, this.pointerHandler);
        }
        return this;
    }

    draw(context) {
        this.facts.forEach(f => f.draw(context));
        this.buttons.forEach(b => b.draw(context));
    }

}