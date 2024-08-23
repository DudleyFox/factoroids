import ASCIIRoid from './ASCIIRoid.js';
import GameScreenBase from './GameScreenBase.js';
import StartScreen from './StartScreen.js';
import Point from './Point.js';
import stateFactory from './StateFactory.js';
import {
    randFloat,
    randInt,
    normalizeIndex
} from './AAAHelpers.js';

const credits = [
    {
        label: 'Dudley',
        title: 'Programmer',
    },
    {
        label: 'Deborah',
        title: 'Muse',
    },
    {
        label: 'Nathan',
        title: 'Tester',
    },
    {
        label: 'Marc',
        title: 'Philosopher',
    },
    {
        label: 'Derek',
        title: 'The Antagonist',
    },
    {
        label: 'Dave!',
        title: 'Tester',
    },
    {
        label: 'Sunny Jim',
        title: 'Closet Extravert',
    },
    {
        label: 'ojo',
        title: 'Prime Target',
    },

];

export default class CreditsScreen extends GameScreenBase {
    constructor(options) {
        super(options);
        const {upperBounds, keyHandler, state, pointerHandler} = options;
        this.pointerHandler = pointerHandler;
        this.startScreen = false;
        this.spawnCounter = 0;
        this.creditIndex = 0;

        this.facts = []; // only on this screen.
        this.spawnNext();
        }

    handleFactoroidUpdate(factoroid, delta) {
        factoroid.update(delta);
        if (factoroid.yPos < -factoroid.maxRadius) {
            factoroid.dead = true;
        }
    }

    spawnNext() {
        if (this.creditIndex >= credits.length) {
            this.spawnCounter = 100;
            return; // do nothing
        }
        const credit = credits[this.creditIndex];
        const {label, title} = credit;
        const opts = {
            label,
            title,
            origin: new Point(this.upperBounds.x/2, this.upperBounds.y),
            state: this.state,
            upperBounds: this.upperBounds,
            vector: 270,
            magnitude: 75,
            maxSize: 196,
            cg: label === 'Dudley' ? () => 'gold' : null
        };
        const newA = new ASCIIRoid(opts);
        newA.yPos = newA.yPos + (newA.maxRadius);
        newA.updatePosition(0);// make sure we have the correct starting center
        this.facts.push(newA);
        this.spawnCounter = 3;
        this.creditIndex = this.creditIndex + 1;
    }

    buildOptions() {
        const {upperBounds, keyHandler, state, pointerHandler} = this;
        return {upperBounds, keyHandler, state, pointerHandler};
    }

    reset() {
        this.creditIndex = 0;
        this.facts = [];
        this.spawnNext();
    }

    update(delta) {
        this.facts.forEach(f => this.handleFactoroidUpdate(f, delta)); 
        this.facts = this.facts.filter(f => !f.dead);
        this.startScreen = this.keyHandler.escape();
        this.spawnCounter -= delta;
        if (this.upperBoundsChanged) {
            this.resize();
        }
        if (this.spawnCounter <= 0) {
            this.spawnNext();
        }
        if (this.startScreen || this.facts.length === 0) {
            return new StartScreen(this.buildOptions());
        }
        if (this.keyHandler.reset()) {
            this.reset();
        }
        return this;
    }

    resize() {
        this.facts.forEach(f => {
            f.xPos = this.upperBounds.x / 2;
            f.setUpperBounds(this.upperBounds);
        });
        this.upperBoundsChanged = false;
    }

    draw(context) {
        this.facts.forEach(f => f.draw(context));
    }

}
