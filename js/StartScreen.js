import Factoroid from "./Factoroid.js";
import GameScreenBase from "./GameScreenBase.js";
import GameScreenLevel from "./GameScreenLevel.js";
import CreditsScreen from "./CreditsScreen.js";
import ShipWarehouse from "./ShipWarehouse.js";
import ShipSelector from "./ShipSelector.js";
import Button from "./Button.js";
import Point from "./Point.js";
import stateFactory from './StateFactory.js';
import {
    randFloat,
    randInt
} from './AAAHelpers.js';

export default class StartScreen extends GameScreenBase {
    constructor(upperBounds, keyhandler, state, pointerHandler) {
        super(upperBounds, keyhandler, stateFactory(upperBounds, keyhandler));
        this.pointerHandler = pointerHandler;
        this.shipWarehouse = new ShipWarehouse
        this.play = false;
        this.selectShip = false;
        this.howToPlay = false;
        this.credits = false;
        this.facts = []; // only on this screen.
        for (var i = 0; i < 7; ++i) {
            const qNumber = randInt(10000) + 7;
            const x = randFloat(this.upperBounds.x);
            const y = randFloat(this.upperBounds.y);
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
        this.buttons.push(new Button('howToPlay', 'How To Play', new Point(this.leftEdge, this.topEdge + this.yDelta * 2), 120, 25, this.pointerHandler));
        this.buttons.push(new Button('credits', 'Credits', new Point(this.leftEdge, this.topEdge + this.yDelta * 3), 120, 25, this.pointerHandler));
        this.buttons.forEach(b => b.Subscribe(this));
    }

    click(x, button) {
        this.play = x === 'play';
        this.selectShip = x === 'select';
        this.howToPlay = x === 'howToPlay';
        this.credits = x === 'credits'
        console.log(x)
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
        if (this.howToPlay) {
            // do something
        }
        if (this.credits) {
            return new CreditsScreen(this.upperBounds, this.keyHandler, this.state, this.pointerHandler);
        }
        return this;
    }

    draw(context) {
        this.facts.forEach(f => f.draw(context));
        this.buttons.forEach(b => b.draw(context));
    }

}
