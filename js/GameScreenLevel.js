import GameScreenBase from './GameScreenBase.js';
import GameOver from './GameOver.js';

import Factoroid from './Factoroid.js';
import primes from './Primes.js';
import Point from './Point.js';

import { degreesToRadians, randFloat, randInt } from './AAAHelpers.js';
import PowerUpFactory from './PowerUpFactory.js';
import LevelTransition from './LevelTransition.js';

export default class GameScreenLevel extends GameScreenBase {
    constructor(options) {
        super(options);
        const {upperBounds, keyHandler, state, level, pointerHandler} = options;
        this.pointerHandler = pointerHandler;
        this.level = level || 2;
        this.gameOverCountdownValue = 5;
        this.gameOverCountdown = this.gameOverCountdownValue;

        this.powerUpFactory = new PowerUpFactory(upperBounds, state);
        this.levelCount = this.calculateFactoroidCount(this.level);
        this.levelMax = this.calculateLevelMax(this.level);

        this.state.ship.reset();
        this.populateLevel(this.level);
    }

    generateColor(p) {
        const adjust = Math.abs(Math.cos(p))
        const blue = Math.floor(88 * adjust);
        return `#7777${(0x77 + blue).toString(16)}`
    }

    calculateLevelMax(level) {
        const phi = 1.618033988749895;
        const max = level * phi;
        return Math.floor(max);
    }

    calculateFactoroidCount(level) {
        if (level === 2 || level == 3) {
            return level;
        }

        const halfLevel = level / 2; 

        return Math.floor(3*Math.sin((halfLevel))+halfLevel);
    }

    getRandomProduct(max) {
        return Math.max(2, randInt(max));
    }

    populateLevel(level) {
        if (level === 'debug') {
            const x = randFloat(this.upperBounds.x);
            const y = randFloat(this.upperBounds.y);
            const options = {
                product: 1172490,
                origin: new Point(x, y),
                state: this.state,
                upperBounds: this.upperBounds
            };
            this.state.facts.push(new Factoroid(options));
        } else {
            const factoroids = this.levelCount;
            for (var i = 0; i < factoroids; ++i) {
                const qNumber = this.getRandomProduct(this.levelMax);
                const x = randFloat(this.upperBounds.x);
                const y = randFloat(this.upperBounds.y);
                const options = {
                    product: qNumber,
                    origin: new Point(x, y),
                    state: this.state,
                    upperBounds: this.upperBounds,
                    mScale: 1 + level/73
                };
                this.state.facts.push(new Factoroid(options));
            }
        }
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
        const {upperBounds, keyHandler, state, level, pointerHandler} = this;
        return {upperBounds, keyHandler, state, level, pointerHandler, playAgain: GameScreenLevel};
    }

    update(delta) {
        if (this.state.facts.length === 0) {
            return new LevelTransition(this.buildOptions());
        }

        if (this.upperBoundsChanged) {
            this.resize();
        }

        if (this.keyHandler.powerUp()) {
            this.powerUpFactory.create();
        } else {
            this.powerUpFactory.tick(delta);
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
            this.state.powerUps.forEach(p => {p.update(delta); p.detectShipCollision(this.state.ship)});
            this.state.powerUps = this.state.powerUps.filter(x => x.active);
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

        if (this.keyHandler.factoroidBehavior() && this.state.fbCooldown === 0) {
            this.state.fbIndex = (this.state.fbIndex + 1) % this.state.fb.length;
            this.state.fbCooldown = 12;
        }

        if (this.state.fbCooldown > 0) {
            this.state.fbCooldown -= 1;
        }

        return this;
    }

    paintLevel(context, level) {
        context.fillStyle = 'white';
        context.font = '16pt Courier';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(`Level: ${level} (max: ${this.levelMax}) (%category x%) (${this.state.facts.length})`, 5, 10);
    }

    paintFiringSolution(context, ship) {
        context.fillStyle = 'white';
        context.font = '12pt Courier';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(`FS: ${ship.firingSolutions[ship.firingSolutionIndex].name}`, 5, 30);
    }

    paintFactoroidBehavoir(context) {
        context.fillStyle = 'white';
        context.font = '12pt Courier';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(`FB: ${this.state.fb[this.state.fbIndex].name}`, 5, 47);
    }

    draw(context) {

        this.state.powerUps.forEach(p => p.draw(context));

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
        this.paintLevel(context, this.level);
        this.paintFiringSolution(context, this.state.ship);
        this.paintFactoroidBehavoir(context);

    }
}
