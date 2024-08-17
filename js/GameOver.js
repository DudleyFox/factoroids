import GameScreenBase from './GameScreenBase.js';
import GameScreenLevel from './GameScreenLevel.js';
import SpecialFlip from './SpecialFlip.js';
import GhostShip from './GhostShip.js';
import StartScreen from './StartScreen.js';
import Factoroid from './Factoroid.js';
import Button from './Button.js';
import primes from './Primes.js';
import Point from './Point.js';
import {
    randFloat
} from './AAAHelpers.js';

export default class GameScreenOver extends GameScreenBase {
    constructor(options) {
        super(options);
        const {upperBounds, keyHandler, state, level, pointerHandler} = options;
        this.pointerHandler = pointerHandler;
        this.level = level;
        this.facts = [];
        const x = this.upperBounds.x / 2 - 225 / 2;
        const y = this.upperBounds.y / 2 - 12.5;
        this.playAgainButton = new Button('again', 'Play Again', new Point(x, y), 100, 25, this.pointerHandler);
        this.menuButton = new Button('menu', 'Main Menu', new Point(x + 125, y), 100, 25, this.pointerHandler);
        let primesIndex = 0;
        this.buttonState = 'wait';
        while (primes[primesIndex] < level) {
            const x = randFloat(this.upperBounds.x);
            const y = randFloat(this.upperBounds.y);
            this.facts.push(new Factoroid(primes[primesIndex], new Point(x, y), this.state, new Point(this.upperBounds.x, this.upperBounds.y),0,0,()=>'gold'));
            primesIndex += 1;
        }
        this.facts.push(new Factoroid(level, new Point(x, y), this.state, new Point(this.upperBounds.x, this.upperBounds.y)));
        this.playAgainButton.Subscribe(this);
        this.menuButton.Subscribe(this);
        this.state.lifeCount = 3;
        const delta = 48;
        for (let i = 0; i < this.state.lifeCount - 1; ++i) {
            this.state.lives.push(new GhostShip(new Point(this.upperBounds.x - delta, delta + delta * i), new Point(this.upperBounds.x, this.upperBounds.y), this.state.ship.number, this.state.ship.stepSize, 50));
        }
        this.state.ship.reset();
        this.state.ship.setSpecial(new SpecialFlip());
        this.level = 2;
        this.state.facts = [];
    }

    click(x, button) {
        this.buttonState = x;
    }

    cleanUp() {
        this.playAgainButton.Unsubscribe(this);
        this.menuButton.Unsubscribe(this);
    }

    resize() {
        this.facts.forEach(f => f.setUpperBounds(this.upperBounds))
        const x = this.upperBounds.x / 2 - 225 / 2;
        const y = this.upperBounds.y / 2 - 12.5;
        const playTopLeft = new Point(x, y);
        const menuTopLeft = new Point(x + 125, y);
        this.playAgainButton.tl = playTopLeft;
        this.menuButton.tl = menuTopLeft;
        this.upperBoundsChanged = false;
    }

    buildOptions() {
        const {upperBounds, keyHandler, state, pointerHandler} = this;
        return {upperBounds, keyHandler, state, level:2, pointerHandler};
    }

    update(delta) {
        if (this.upperBoundsChanged) {
            this.resize();
        }
        this.playAgainButton.update(delta);
        this.menuButton.update(delta);
        this.facts.forEach(f => f.update(delta));
        if (this.buttonState === 'again') {
            this.cleanUp();
            return new GameScreenLevel(this.buildOptions());
        } else if (this.buttonState === 'menu') {
            this.cleanUp();
            return new StartScreen(this.buildOptions());
        }
        return this;
    }

    draw(context) {
        this.facts.forEach(f => f.draw(context));
        this.playAgainButton.draw(context);
        this.menuButton.draw(context);

        context.fillStyle = 'yellow';
        context.font = '64pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('GAME OVER', this.upperBounds.x / 2, (this.upperBounds.y / 2) - 47);

    }
}
