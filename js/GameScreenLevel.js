import GameScreenBase from './GameScreenBase.js';
import Ship from './Ship.js';
import GhostShip from './GhostShip.js';
import Factoroid from './Factoroid.js';
import primes from './Primes.js';
import Point from './Point.js';
import PowerUpFlip from './PowerUpFlip.js';
import PowerUpHyper from './PowerUpHyper.js';
import { coinToss } from './AAAHelpers.js';

export default class GameScreenLevel extends GameScreenBase {
    constructor(upperBounds, keyHandler, state, level) {
        super(upperBounds, keyHandler, state);
        this.level = level;
        this.gameOverCountdownValue = 10;
        this.gameOverCountdown = this.gameOverCountdownValue;
        this.steps = [5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45];
        this.xtraCooldown = 0;
        this.xtraIndex = 0;
        this.xtras = [PowerUpFlip, PowerUpHyper];

        if (!this.state.ship) {
            const bluntness = coinToss() > 0 ? 100000 : 1000;
            const number = primes[Math.floor(Math.random() * 1000)] * bluntness;
            const stepSize = this.steps[Math.floor(Math.random() * this.steps.length)];
            this.state.ship = new Ship(new Point(this.upperBounds.x / 2, this.upperBounds.y / 2), new Point(this.upperBounds.x, this.upperBounds.y), this.keyHandler, this.state, number, stepSize, 50);
            const delta = 48;
            for (let i = 0; i < this.state.lifeCount - 1; ++i) {
                this.state.lives.push(new GhostShip(new Point(this.upperBounds.x - delta, delta + delta * i), new Point(this.upperBounds.x, this.upperBounds.y), number, stepSize, 50));
            }
            this.state.ship.addpowerUp(PowerUpFlip);
        }

        this.populateLevel(this.level);

    }

    generateColor(p) {
        const adjust = Math.abs(Math.cos(p))
        const blue = Math.floor(88 * adjust);
        return `#7777${(0x77 + blue).toString(16)}`
    }

    getProductFromLevelSimpleMax(level) {
        const index = primes.findIndex(p => p === level);
        const max = (primes[index] * primes[index]) + 1;
        const product = Math.max(2, Math.floor(Math.random() * max));
        return product;
    }

    populateLevel(level) {
        if (level === 'debug') {
            const x = Math.random() * this.upperBounds.x;
            const y = Math.random() * this.upperBounds.y;
            // facts.push(new Factoroid(2 * 3 * 5 * 7 * 11, new Point(x, y), new Point(this.upperBounds.x, this.upperBounds.y)));
            this.state.facts.push(new Factoroid(1172490, new Point(x, y), this.state, new Point(this.upperBounds.x, this.upperBounds.y)));
        } else {
            for (var i = 0; i < level; ++i) {
                const qNumber = this.getProductFromLevelSimpleMax(level);
                const x = Math.random() * this.upperBounds.x;
                const y = Math.random() * this.upperBounds.y;
                this.state.facts.push(new Factoroid(qNumber, new Point(x, y), this.state, new Point(this.upperBounds.x, this.upperBounds.y)));
            }
        }
    }

    update(delta) {
        if (this.state.facts.length === 0) {
            if (this.level !== 'debug') {
                const index = primes.findIndex(l => l === this.level) + 1;
                this.level = primes[index];
            }
            return new GameScreenLevel(this.upperBounds, this.keyHandler, this.state, this.level)
        }

        // TODO: Clean up this mess
        if (this.state.lifeCount === 0 && this.gameOverCountdown > 0) {
            this.gameOverCountdown -= delta;
            if (this.gameOverCountdown <= 0) {
                this.state.lifeCount = 3;
                const delta = 48;
                for (let i = 0; i < this.state.lifeCount - 1; ++i) {
                    this.state.lives.push(new GhostShip(new Point(this.upperBounds.x - delta, delta + delta * i), new Point(this.upperBounds.x, this.upperBounds.y), this.state.ship.number, this.state.ship.stepSize, 50));
                }
                this.state.ship.reset();
                this.level = 2;
                this.state.facts = [];
                this.populateLevel(this.level);
                this.gameOverCountdown = this.gameOverCountdownValue;
                this.state.lifeCount = 3;
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



        for (var i = 0; i < this.state.facts.length; ++i) {
            this.state.facts[i].setUpperBounds(new Point(this.upperBounds.x, this.upperBounds.y));
            if (this.state.lifeCount > 0) {
                this.state.facts[i].update(delta);
            }
        }

        this.state.ship.setUpperBounds(new Point(this.upperBounds.x, this.upperBounds.y));
        if (this.state.lifeCount === 0) {
            this.state.ship.gameOver();
        }
        this.state.ship.update(delta);
        if (this.state.bullets.length > 0) {
            const bullet = this.state.bullets[0];
            bullet.setUpperBounds(new Point(this.upperBounds.x, this.upperBounds.y));
            bullet.update(delta);
            if (bullet.expired()) {
                this.state.bullets.pop();
            }
        }
        this.state.lives.forEach(gs => {
            gs.rotation = this.state.ship.rotation;
            gs.update(delta);
            gs.setUpperBounds(new Point(this.upperBounds.x, this.upperBounds.y))
        });

        if (this.keyHandler.factoroidBehavior() && this.state.fbCooldown === 0) {
            this.state.fbIndex = (this.state.fbIndex + 1) % this.state.fb.length;
            this.state.fbCooldown = 12;
        }

        if (this.state.fbCooldown > 0) {
            this.state.fbCooldown -= 1;
        }



        if (this.keyHandler.xtra() && this.xtraCooldown === 0) {
            this.xtraIndex = (this.xtraIndex + 1) % this.xtras.length;
            this.state.ship.addPowerUp(this.xtras[this.xtraIndex]);
            this.xtraCooldown = 20;
        }
        if (this.xtraCooldown > 0) {
            this.xtraCooldown -= 1;
        }

        return this;
    }

    paintLevel(context, level) {
        context.fillStyle = 'white';
        context.font = '16pt Courier';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(`Level: ${level} (alpha 0.4)`, 5, 10);
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