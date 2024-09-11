import GameScreenBase from './GameScreenBase.js';
import GameOver from './GameOver.js';

import SpecialFlip from './SpecialFlip.js';
import SpecialFreeze from './SpecialFreeze.js';
import SpecialHyper from './SpecialHyper.js';
import SpecialDeadStop from './SpecialDeadStop.js';
import SpecialMagnetar from './SpecialMagnetar.js';
import SpecialX from './SpecialX.js';
import SpecialOmega from './SpecialOmega.js';

import Factoroid from './Factoroid.js';
import primes from './Primes.js';
import Point from './Point.js';

import { degreesToRadians, randFloat, randInt } from './AAAHelpers.js';

const pickSpecial = () => {
    const specials = [
        SpecialFlip,
        SpecialHyper,
        SpecialDeadStop,
        SpecialMagnetar,
        SpecialX,
        SpecialOmega,
        SpecialFreeze
    ];

    const special = new (specials[randInt(specials.length)])();
    special.yOffset = -50;
    return special;
};

export default class GameScreenSolitaire extends GameScreenBase {
    constructor(options) {
        super(options);
        const {upperBounds, keyHandler, state, level, pointerHandler} = options;
        this.pointerHandler = pointerHandler;
        this.gameOverCountdownValue = 5;
        this.gameOverCountdown = this.gameOverCountdownValue;
        this.product = 1;

        this.state.lives = [];
        this.state.lifeCount = 1;
        this.state.ship.reset();
        this.state.ship.setSpecial(pickSpecial());
        this.populateLevel(this.level);
    }

    generateColor(p) {
        const adjust = Math.abs(Math.cos(p))
        const blue = Math.floor(88 * adjust);
        return `#7777${(0x77 + blue).toString(16)}`
    }

    populateLevel() {

        this.product += 1;

        const x = randFloat(this.upperBounds.x);
        const y = randFloat(this.upperBounds.y);
        const options = {
            product: this.product,
            origin: new Point(x, y),
            state: this.state,
            upperBounds: this.upperBounds,
        };
        this.state.facts.push(new Factoroid(options));
    }

    resize(){
        for (var i = 0; i < this.state.facts.length; ++i) {
            this.state.facts[i].setUpperBounds(new Point(this.upperBounds.x, this.upperBounds.y));
        }
        this.state.ship.setUpperBounds(new Point(this.upperBounds.x, this.upperBounds.y));
        if (this.state.bullets.length > 0){
        const bullet = this.state.bullets[0];
        bullet.setUpperBounds(new Point(this.upperBounds.x, this.upperBounds.y));
        }
        this.state.lives.forEach(gs => {
            gs.setUpperBounds(new Point(this.upperBounds.x, this.upperBounds.y))
        });
        this.upperBoundsChanged = false;
    }

    buildOptions() {
        const {upperBounds, keyHandler, state, pointerHandler} = this;
        return {upperBounds, keyHandler, state, level: 0, pointerHandler, playAgain: GameScreenSolitaire};
    }

    update(delta) {
        if (this.state.facts.length === 0) {
            this.populateLevel();
        }

        if (this.upperBoundsChanged) {
            this.resize();
        }

        // TODO: Clean up this mess
        if (this.state.lifeCount === 0 && this.gameOverCountdown > 0) {
            this.gameOverCountdown -= delta;
            if (this.gameOverCountdown <= 0) {
                return new GameOver(this.buildOptions());
            }
        }

        this.state.bullets.forEach(b => {
            this.state.facts.forEach(f => f.detectBulletCollision(b))
        });

        this.state.facts.forEach(f => f.detectShipCollision(this.state.ship));

        const spawner = this.state.facts.filter(f => f.hasSpawn)[0]; // should only be one;
        this.state.facts = this.state.facts.filter(f => !f.dead && !f.hasSpawn);
        if (spawner) {
            const newFactoroids = spawner.spawn.map(x => {
                x.hasSpawn = false; // no recursive spawning;
                x.spawn = []; // clean up the spawn array; 
                return x;
            });
            this.state.facts = this.state.facts.concat(newFactoroids);
        }

        if (this.state.lifeCount > 0) {
            for (var i = 0; i < this.state.facts.length; ++i) {
                this.state.facts[i].update(delta);
            }
        }

        if (this.state.lifeCount === 0) {
            this.state.ship.gameOver();
        }

        this.state.ship.update(delta);
        if (this.state.bullets.length > 0) {
            const bullet = this.state.bullets[0];
            bullet.update(delta);
            if (bullet.expired()) {
                this.state.bullets.pop();
            }
        }
        this.state.lives.forEach(gs => {
            gs.rotation = this.state.ship.rotation;
            gs.update(delta);
        });

        return this;
    }

    draw(context) {

        for (var i = 0; i < this.state.facts.length; ++i) {
            this.state.facts[i].draw(context);
        }

        this.state.ship.draw(context);
        if (this.state.bullets.length > 0) {
            const bullet = this.state.bullets[0];
            bullet.draw(context);
            if (this.level === 'debug') {
                bullet.drawPath(context);
            }
        }
        this.state.lives.forEach(gs => {
            gs.draw(context);
        });
    }
}

