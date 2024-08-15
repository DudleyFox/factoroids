import ASCIIRoid from './ASCIIRoid.js';
import GameScreenBase from './GameScreenBase.js';
import StartScreen from './StartScreen.js';
import Point from './Point.js';
import stateFactory from './StateFactory.js';
import {
    randFloat,
    randInt
} from './AAAHelpers.js';

export default class CreditsScreen extends GameScreenBase {
    constructor(upperBounds, keyHandler, state, pointerHandler) {
        super(upperBounds, keyHandler, state);
        this.pointerHandler = pointerHandler;
        this.startScreen = false;

        this.facts = []; // only on this screen.
        const dudley = new ASCIIRoid(
            'Dudley',
            'Programmer',
            new Point(this.upperBounds.x/2, this.upperBounds.y),
            this.state,
            this.upperBounds,
            270,
            20
        );
        this.facts.push(dudley);
        }

    setUpperBounds(ub) {
        super.setUpperBounds(ub);
        this.facts.forEach(f => f.setUpperBounds(ub));
        this.buildButtons();
    }

    handleFactoroidUpdate(factoroid, delta) {
        factoroid.update(delta);
        if (factoroid.yPos < 5) {
            factoroid.dead = true;
        }
    }

    update(delta) {
        this.facts.forEach(f => this.handleFactoroidUpdate(f, delta)); 
        this.facts = this.facts.filter(f => !f.dead);
        this.startScreen = this.keyHandler.escape();
        if (this.startScreen) {
            return new StartScreen(this.upperBounds, this.keyHandler, this.state, this.pointerHandler);
        }
        return this;
    }

    draw(context) {
        this.facts.forEach(f => f.draw(context));
    }

}
