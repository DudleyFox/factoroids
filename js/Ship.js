import MobileSprite from './MobileSprite.js';
import Bullet from './Bullet.js';
import Point from './Point.js';
import {
    generateFactors,
    sumTheFactors,
    degreesToRadians,
    coinToss,
    randFloat
} from './AAAHelpers.js';

// TODO: 2022-09-02 D. Fox - Find a better home for the firing solutions.
function fireBullet(ship, b) {
    const bulletOptions = {
        number: b,
        origin: new Point(ship.xPos, ship.yPos),
        upperBounds: ship.upperBounds,
        state: ship.state,
        vector: ship.rotation - 90,
        magnitude: Math.abs(ship.xVelocity) + Math.abs(ship.yVelocity) + 1000
    };
    ship.state.bullets.push(new Bullet(bulletOptions));
}


function generateFiringSolutions(ship) {
    const fs1 = {
        fire: () => {
            if (ship.keyHandler.fire() && ship.breachNumber > 0) {
                if (ship.state.bullets.length === 0) {
                    const b = ship.keyHandler.number();
                    fireBullet(ship, b);
                    ship.breachNumber = 0;
                    ship.keyHandler.clearNumber();
                }
            }
        },
        name: 'Default'
    }

    const fs2 = {
        fire: () => {
            const b = ship.keyHandler.number();
            if (b > 0 && ship.state.bullets.length === 0) {
                fireBullet(ship, b);
            }
            ship.breachNumber = 0;
            ship.keyHandler.clearNumber();
        },
        name: 'Rapid'
    }

    const fs3 = {
        fire: () => {
            if (ship.keyHandler.fire() && ship.breachNumber > 0) {
                if (ship.state.bullets.length === 0) {
                    const b = ship.keyHandler.number();
                    fireBullet(ship, b);
                    ship.breachNumber = 0;
                    ship.keyHandler.fired();
                }
            }
        },
        name: 'Sticky'
    }

    return [fs1, fs2, fs3];
}


export default class Ship extends MobileSprite {
    constructor(options) {
        super({...options, vector:0, magnitude:0});
        const { origin, upperBounds, keyHandler, state, maxSize } = options;
        const drawRadii = options.drawRadii || false;
        const demo = options.demo || false;
        this.origin = origin;
        this.breachNumber = 0;
        this.keyHandler = keyHandler;
        this.count = 0;
        this.radius = 12;
        this.number = this.state.shipNumber;
        this.points = new Array();
        this.innerPoints = new Array();
        this.radii = new Array();
        this.maxRadius = 0;
        this.minRadius = 100000;
        this.origin = origin;
        this.stepSize = this.state.shipStepSize % 180;
        this.maxSize = maxSize / 2;
        this.outline = state.shipColor;
        this.drawR = drawRadii
        this.firingSolutionIndex = 0;
        this.firingSolutions = generateFiringSolutions(this);
        this.firingSolutionCooldown = 0;
        this.isGameOver = false;
        this.demo = demo;
        this.color = state.shipColor;
        this.rotationMin = 0.1;
        this.rotationMax = 2;
        this.rotationInc = 0.1;
        this.leftRotation = this.rotationMin;
        this.rightRotation = this.rotationMin;

        this.factors = generateFactors(this.number);
        this.generatePoints();
        this.reset();
    }

    generatePoints() {
        var innerDelta = Math.max(this.number, 4);
        let i;
        for (i = 0; i < 360; i += this.stepSize) {
            var theta = degreesToRadians(Number(i));
            var sum = sumTheFactors(theta, this.factors);
            var radius = (Math.log(this.number) * (5 + sum)) + 7;
            this.radii.push(radius);
            this.maxRadius = Math.max(this.maxRadius, radius);
            this.minRadius = Math.min(this.minRadius, radius);
        }

        // scale it to our max size
        const ratio = this.maxSize / this.maxRadius;
        this.radii = this.radii.map(r => r * ratio);

        i = 0;
        this.radii.forEach(r => {
            var theta = degreesToRadians(Number(i));
            var x = (r * Math.cos(theta));
            var y = -(r * Math.sin(theta));
            var innerX = ((r - innerDelta) * Math.cos(theta));
            var innerY = -((r - innerDelta) * Math.sin(theta));
            this.points.push(new Point(x, y));
            this.innerPoints.push(new Point(innerX, innerY));
            i += this.stepSize;
        });
    }

    setUpperBounds(ub) {
        super.setUpperBounds(ub);
        this.origin.x = ub.x / 2;
        this.origin.y = ub.y / 2;
    }

    getRotatedRadius() {
        const thetaR = degreesToRadians(this.rotation - 90);
        const x1 = this.xPos - (this.radius * Math.cos(thetaR));
        const x2 = this.xPos + (this.radius * Math.cos(thetaR));
        const y1 = this.yPos - (this.radius * Math.sin(thetaR));
        const y2 = this.yPos + (this.radius * Math.sin(thetaR));

        return { x1, y1, x2, y2 };
    }

    death() {
        this.dead = true;
        this.special?.terminate();
    }

    gameOver() {
        this.isGameOver = true;
    }

    reset() {
        this.xPos = this.origin.x;
        this.yPos = this.origin.y;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.rotation = 0;
        this.dead = false;
        this.isGameOver = false;
        this.deathCountDown = 5;
        this.particleCloudExtent = 2;
        if (!this.demo) {
            this.collisionShieldCountdown = 4;
        }
        this.breachNumber = 0;
        this.keyHandler.clearNumber();
    }

    setSpecial(special) {
        this.special?.terminate();
        this.special = special;
    }

    update(delta) {
        if (this.dead && this.deathCountDown > 0) {
            this.deathCountDown -= delta;
            this.particleCloudExtent *= 1.02;
            this.updatePosition(delta);
            if (this.deathCountDown < 0 && !this.isGameOver) {
                this.state.lives.pop();
                this.reset();
            }
            return;
        }
        if (this.collisionShieldCountdown > 0) {
           this.collisionShieldCountdown -= delta;
        }
        if (this.keyHandler.left()) {
            this.rotation -= this.leftRotation;
            this.leftRotation = Math.min(this.rotationMax, this.leftRotation + this.rotationInc);
        } else {
            this.leftRotation = this.rotationMin;

        }
        if (this.keyHandler.right()) {
            this.rotation += this.rightRotation;
            this.rightRotation = Math.min(this.rotationMax, this.rightRotation + this.rotationInc);
        } else {
            this.rightRotation = this.rotationMin;
        }
        if (this.keyHandler.accelerate() && !this.demo) {
            const constant = 4;
            this.xVelocity -= Math.cos(degreesToRadians(this.rotation + 90)) * constant;
            this.yVelocity -= Math.sin(degreesToRadians(this.rotation + 90)) * constant;
        }
        else {
            const slowdown = 1 / 1.002;
            this.xVelocity = this.xVelocity * slowdown;
            this.yVelocity = this.yVelocity * slowdown;
        }

        if (this.special) {
            this.special.tick(delta);
            if (this.keyHandler.special()) {
                this.special.invoke(this);
            }
        }

        this.updatePosition(delta);

        if (this.keyHandler.reset()) {
            this.reset();
        }
        this.updateBreach(delta);
    }

    fire() {
        this.firingSolutions[this.firingSolutionIndex].fire();
    }

    updateBreach(time) {
        this.breachNumber = this.keyHandler.number();
        if (this.keyHandler.firingSolution() && this.firingSolutionCooldown === 0) {
            this.firingSolutionIndex = (this.firingSolutionIndex + 1) % this.firingSolutions.length;
            this.firingSolutionCooldown = 12;
        }
        if (this.firingSolutionCooldown > 0) {
            this.firingSolutionCooldown -= 1;
        }
        this.fire();
    }

    drawRadii(context, xLoc, yLoc) {
        context.save();

        for (let i = 0; i < this.points.length; ++i) {
            context.beginPath();
            context.lineWidth = 0.75
            context.strokeStyle = 'black';
            context.moveTo(xLoc, yLoc);
            context.lineTo(this.points[i].x + xLoc, this.points[i].y + yLoc);

            context.stroke();
        }
        context.restore();
    }

    getFillColor() {
        if (this.demo) {
            return this.color;
        }
        return this.collisionShieldCountdown > 0 ? 'nope' : this.color;
    }

    getOutlineColor() {
        if (this.demo) {
            return this.outline;
        }
        return this.collisionShieldCountdown > 0 ? 'white' : this.outline;
    }

    privateDraw(context, x, y) {
        if (!this.dead && !this.isGameOver) {
            context.save();
            context.translate(x, y);
            context.rotate(degreesToRadians(this.rotation - 90));
            context.beginPath();
            context.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; ++i) {
                context.lineTo(this.points[i].x, this.points[i].y);
            }

            context.lineTo(this.points[0].x, this.points[0].y);
            context.closePath();
            const fillColor = this.getFillColor();
            if (fillColor !== 'nope') {
                context.fillStyle = fillColor;
                context.fill();
            }
            context.lineWidth = 0.5;
            context.strokeStyle = this.getOutlineColor();
            context.stroke();
            context.restore();

            if (this.special) {
                this.special.draw(context);
            }

            context.save();
            context.translate(x, y);
            context.rotate(degreesToRadians(this.rotation));
            if (this.breachNumber > 0) {
                context.fillStyle = 'white';
                context.font = '12pt Courier';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(this.breachNumber, 0, -31);
            }
            context.restore();
            if (this.drawR) {
                this.drawRadii(context, x, y)
            }
        } else {
            for (let i = 0; i < 20; ++i) {
                const range = this.radius + this.particleCloudExtent;
                const angle = randFloat(2 * Math.PI);
                const xR = randFloat(range) * Math.cos(angle);
                const yR = randFloat(range) * Math.sin(angle);
                const size = randFloat(2);
                context.beginPath();
                context.arc(x + xR, y + yR, size, 0, 2 * Math.PI);
                const color = coinToss() > 0 ? this.color : 'white';
                context.fillStyle = color;
                context.fill();
                context.closePath();
            }
        }
    }
}


