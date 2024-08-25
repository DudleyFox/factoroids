import ASCIIRoid from './ASCIIRoid.js';
import GameScreenBase from './GameScreenBase.js';
import StartScreen from './StartScreen.js';
import Point from './Point.js';
import Ship from './Ship.js';
import stateFactory from './StateFactory.js';
import {
    randFloat,
    randInt,
    normalizeIndex
} from './AAAHelpers.js';

export default class HowToPlay extends GameScreenBase {
    constructor(options) {
        super(options);
        const {upperBounds, keyHandler, state, pointerHandler} = options;
        this.pointerHandler = pointerHandler;
        this.startScreen = false;
        this.spawnCounter = 0;
        this.creditIndex = 0;

        this.facts = []; // only on this screen.
        const shipOptions = {
            origin: new Point(this.upperBounds.x/2, this.upperBounds.y/2),
            upperBounds,
            keyHandler,
            state,
            maxSize: 50,
        };
        this.ship = new Ship(shipOptions);
        }

    buildOptions() {
        const {upperBounds, keyHandler, state, pointerHandler} = this;
        return {upperBounds, keyHandler, state, pointerHandler};
    }

    update(delta) {
        this.startScreen = this.keyHandler.escape();
        this.ship.update(delta);
        if (this.upperBoundsChanged) {
            this.resize();
        }
        if (this.startScreen) {
            return new StartScreen(this.buildOptions());
        }
        return this;
    }

    resize() {
        this.facts.forEach(f => {
            f.xPos = this.upperBounds.x / 2;
            f.setUpperBounds(this.upperBounds);
        });
        this.ship.setUpperBounds(this.upperBounds);
        this.upperBoundsChanged = false;
    }

    draw(context) {
        this.facts.forEach(f => f.draw(context));
        this.ship.draw(context);
    }

}
