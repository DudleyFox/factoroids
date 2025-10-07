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

export default class NameScreen extends GameScreenBase {
    constructor(options) {
        super(options);
        const {upperBounds, keyHandler, state, pointerHandler} = options;
        this.pointerHandler = pointerHandler;
        this.keyHandler = keyHandler;
        this.startScreen = false;
        this.down = false;

        this.factoroid = null;
        this.keyHandler.Subscribe(this);
        this.name = "Thomas";
        this.currentName="";
    }

    OnKeyDown(key) {
        // do nothing
    }

    OnKeyUp(key) {
        // do nothing
        // A - 65
        // Z - 90
        // backspace = 8
        // delete = 46
        if (key >= 65 && key <= 90) {
            if (this.keyHandler.shift()) {
                // upper case letters
                this.name += String.fromCharCode(key);
            } else {
                // lower case letters
                this.name += String.fromCharCode(key+32);
            }
        } else if (key === 8 || key === 46) {
            if (this.name.length > 0) {
                this.name = this.name.slice(0,-1);
            }
        }
    }

    buildFactoroid(name) {
        const opts = {
            label: name,
            title: "",
            origin: new Point(this.upperBounds.x/2, this.upperBounds.y/2),
            state: this.state,
            upperBounds: this.upperBounds,
            vector: 90,
            magnitude: 75,
            maxSize: 196,
            cg: label === 'Dudley' ? () => 'gold' : null
        };
        const newA = new ASCIIRoid(opts);
        newA.xVelocity = 0;
        newA.yVelocity = 0;
    }

    handleFactoroidUpdate(factoroid, delta) {
        factoroid.update(delta);
    }

    buildOptions() {
        const {upperBounds, keyHandler, state, pointerHandler} = this;
        return {upperBounds, keyHandler, state, pointerHandler};
    }

    update(delta) {
        if (this.name !== this.currentName) {
            this.factoroid = this.buildFactoroid(this.name);
            this.currentName = this.name;
        }
        this.handleFactoroidUpdate(this.factoroid, delta); 
        this.startScreen = this.keyHandler.escape();
        if (this.upperBoundsChanged) {
            this.resize();
        }
        if (this.startScreen) {
            return new StartScreen(this.buildOptions());
        }
        return this;
    }

    resize() {
        this.factoroid.xPos = this.upperBounds.x / 2;
        this.factoroid.yPos = this.upperBounds.y / 2;
        this.factoroid.setUpperBounds(this.upperBounds);
        this.upperBoundsChanged = false;
    }

    draw(context) {
        this.factoroid.draw(context);
    }
}

