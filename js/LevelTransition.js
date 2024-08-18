import GameScreenBase from './GameScreenBase.js';
import GameScreenLevel from './GameScreenLevel.js';
import SpecialFlip from './SpecialFlip.js';
import GhostShip from './GhostShip.js';
import StartScreen from './StartScreen.js';
import Factoroid from './Factoroid.js';
import Button from './Button.js';
import primes from './Primes.js';
import Point from './Point.js';

export default class LevelTransition extends GameScreenBase {
    constructor(options) {
        super(options);
        const {upperBounds, keyHandler, state, level, pointerHandler} = options
        this.pointerHandler = pointerHandler;
        this.level = level;
        const factOptions = {
            product: this.level,
            origin: new Point(this.upperBounds.x / 2, this.upperBounds.y / 2),
            state: this.state,
            upperBound: this.upperBounds,
            cg: ()=>'gold'
        };
        this.fact = new Factoroid(factOptions);
        this.fact.xVelocity = 0;
        this.fact.yVelocity = 0;
        const x = this.upperBounds.x / 2 - 225 / 2;
        const y = this.upperBounds.y / 2 + this.fact.maxRadius + 10;
        this.continueButton = new Button('continue', '(C)ontinue', new Point(x, y), 100, 25, this.pointerHandler);
        this.menuButton = new Button('menu', 'Main Menu', new Point(x + 125, y), 100, 25, this.pointerHandler);
        let primesIndex = primes.findIndex(p => p === this.level) + 1;
        this.buttonState = 'wait';
        this.nextLevel = primes[primesIndex];


        this.continueButton.Subscribe(this);
        this.menuButton.Subscribe(this);
    }

    click(x, button) {
        this.buttonState = x;
    }

    cleanUp() {
        this.continueButton.Unsubscribe(this);
        this.menuButton.Unsubscribe(this);
    }

    resize() {
        this.fact.setUpperBounds(this.upperBounds);
        this.fact.xPos = this.upperBounds.x / 2;
        this.fact.yPos = this.upperBounds.y / 2;
        const x = this.upperBounds.x / 2 - 225 / 2;
        const y = this.upperBounds.y / 2 + this.fact.maxRadius + 10;
        const continueTopLeft = new Point(x, y);
        const menuTopLeft = new Point(x + 125, y);
        this.continueButton.tl = continueTopLeft;
        this.menuButton.tl = menuTopLeft;
        
        this.upperBoundsChanged = false;

    }

    buildOptions(level) {
        const {upperBounds, keyHandler, state, pointerHandler} = this;
        return {upperBounds, keyHandler, state, level, pointerHandler};
    }

    update(delta) {
        if (this.upperBoundsChanged) {
            this.resize();
        }
        this.continueButton.update(delta);
        this.menuButton.update(delta);
        if (this.buttonState === 'continue' || this.keyHandler.continue()) {
            this.cleanUp();
            return new GameScreenLevel(this.buildOptions(this.nextLevel));
        } else if (this.buttonState === 'menu') {
            this.cleanUp();
            return new StartScreen(this.buildOptions(2));
        }
        this.fact.update(delta);
        return this;
    }

    draw(context) {
        this.fact.draw(context);
        this.continueButton.draw(context);
        this.menuButton.draw(context);

        context.fillStyle = 'yellow';
        context.font = '16pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Completed Level', this.upperBounds.x / 2, (this.upperBounds.y / 2) - (this.fact.maxRadius + 10 + 8));
    }
}
