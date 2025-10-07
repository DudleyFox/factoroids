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
        this.keyMap = new Map();
        this.shiftKeyMap = new Map();
        this.buildMaps();
    }

    buildMaps() {
        // initialize maps to nothing
        for (let i = 0; i < 256; ++i) {
            this.keyMap.set(i, '');
            this.shiftKeyMap.set(i, '');
        }
        // letters first
        for (let i = 65; i < 91; ++i) {
            this.keyMap.set(i, String.fromCharCode(i+32));
            this.shiftKeyMap.set(i, String.fromCharCode(i));
        }
        // space
        this.keyMap.set(32, ' ');
        this.shiftKeyMap.set(32, ' ');

        // Numbers
        for (let i = 48; i < 58; ++i) {
            this.keyMap.set(i, String.fromCharCode(i));
        }
        this.shiftKeyMap.set(48, ')');
        this.shiftKeyMap.set(49, '!');
        this.shiftKeyMap.set(50, '@');
        this.shiftKeyMap.set(51, '#');
        this.shiftKeyMap.set(52, '$');
        this.shiftKeyMap.set(53, '%');
        this.shiftKeyMap.set(54, '^');
        this.shiftKeyMap.set(55, '&');
        this.shiftKeyMap.set(56, '*');
        this.shiftKeyMap.set(57, '(');

        // Everything else
        this.keyMap.set(186, ';');
        this.shiftKeyMap.set(186, ':');
        this.keyMap.set(222, '\'');
        this.shiftKeyMap.set(222, '"');
        this.keyMap.set(219, '[');
        this.shiftKeyMap.set(219, '{');
        this.keyMap.set(221, ']');
        this.shiftKeyMap.set(221, '}');
        this.keyMap.set(189, '-');
        this.shiftKeyMap.set(189, '_');
        this.keyMap.set(220, '\\');
        this.shiftKeyMap.set(220, '|');
        this.keyMap.set(188, ',');
        this.shiftKeyMap.set(188, '<');
        this.keyMap.set(190, '.');
        this.shiftKeyMap.set(190, '>');
        this.keyMap.set(191, '/');
        this.shiftKeyMap.set(191, '?');
        this.keyMap.set(192, '`');
        this.shiftKeyMap.set(192, '~');
        this.keyMap.set(187, '=');
        this.shiftKeyMap.set(187, '+');
    }

    getMappedChar(key) {
        if (this.keyHandler.shift()) {
            return this.shiftKeyMap.get(key);
        }
        return this.keyMap.get(key);
    }

    OnKeyDown(key) {
        if (key === 8 || key === 46) {
            if (this.name.length > 0) {
                this.name = this.name.slice(0,-1);
            }
        } else {
            this.name += this.getMappedChar(key);
        }
    }

    OnKeyUp(key) {
        // do nothing
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
            cg: null
        };
        const newA = new ASCIIRoid(opts);
        newA.xVelocity = 0;
        newA.yVelocity = 0;
        return newA;
    }

    handleFactoroidUpdate(factoroid, delta) {
        factoroid.update(delta);
    }

    buildOptions() {
        const {upperBounds, keyHandler, state, pointerHandler} = this;
        return {upperBounds, keyHandler, state, pointerHandler};
    }

    paintInstructions(context) {
        context.fillStyle = 'white';
        context.font = '16pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`Type your name!`, this.upperBounds.x/2, (this.upperBounds.y / 2) - 175);
        context.font = '12pt Courier';
        context.fillText(`ESC - Main Screen`, this.upperBounds.x/2, (this.upperBounds.y / 2) - 135);
    }

    update(delta) {
        if (this.name !== this.currentName) {
            if (this.name === "") {
                this.factoroid = this.buildFactoroid("<Type Something>");
            } else {
                this.factoroid = this.buildFactoroid(this.name);
            }
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
        this.paintInstructions(context);
    }
}

