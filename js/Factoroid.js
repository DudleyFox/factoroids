import MobileSprite from "./MobileSprite.js";
import Point from "./Point.js";
import {
    distanceBetweenTwoPoints,
    degreesToRadians,
    linesIntersect,
    generateFactors,
    sumTheFactors,
    coinToss,
    generateColor,
    randInt,
    randFloat
} from './AAAHelpers.js';

export default class Factoroid extends MobileSprite {
    constructor(product, origin, state, upperBounds, vector, magnitude, cg) {
        super(origin, upperBounds, state, vector, magnitude);
        this.product = product;
        this.points = new Array();
        this.innerPoints = new Array();
        this.radii = new Array();
        this.maxRadius = 0;
        this.minRadius = 100000;
        this.rotationSpeed = this.adjustDirection(randFloat(1));
        this.rotation = 0;
        this.dead = false;
        this.centers;
        this.maxSize = product * 7;
        this.spawn = [];
        this.hasSpawn = false;
        this.magnetar = false;

        if (cg) {
            this.color = cg();
        } else {
            this.color = generateColor(this.product);
        }

        this.factors = generateFactors(this.product);
        this.generatePoints();
        this.generateCenters();
    }

    adjustDirection(aValue) {
        return aValue * coinToss();
    }

    calculatePosition(src, dst, vel, delta) {
        if (src < dst) {
            return src + vel * delta;
        } else if (src > dst) {
            return src - vel * delta;
        }
        return src;
    }

    findShortestDistanceToShip() {
        let shortest = 99999999;
        const offsets = [
            { // ships original position
                x: 0,
                y: 0,
            },
            { // off screen left
                x: -1,
                y: 0
            },
            { // off screen upper left
                x: -1,
                y: -1,
            },
            { // off screen upper center
                x: 0,
                y: -1,
            },
            { // off screen upper right
                x:1,
                y: -1,
            },
            { // off screen right
                x: 1,
                y: 0
            },
            { // off screen bottom right
                x: 1,
                y: 1
            },
            { // off screen bottom center
                x: 0,
                y: 1
            },
            { // off screen bottom left
                x: -1,
                y: 1
            }
        ];
        const shipX = this.state.ship.xPos;
        const shipY = this.state.ship.yPos;
        const thisX = this.xPos;
        const thisY = this.yPos;
        let shortestX;
        let shortestY;
        offsets.forEach( o => {
            const testX = shipX + this.upperBounds.x * o.x;
            const testY = shipY + this.upperBounds.x * o.y;
            const dx = thisX - testX;
            const dy = thisY - testY;
            const dist = dx*dx+dy*dy;
            if (dist < shortest) {
                shortestX = testX;
                shortestY = testY;
                shortest = dist;
            }
        });

        return [shortestX, shortestY]

    }

    calculateMagnetarPosition(delta) {
        const magnetarVelocity = 80;
        const [x,y] = this.findShortestDistanceToShip();
        const dx = Math.abs(this.xPos - x);
        const dy = Math.abs(this.yPos - y);
        const hypo = Math.sqrt(dx * dx + dy * dy);
        const ratioX = dx / hypo;
        const rationY = dy / hypo;
        this.xVelocity = magnetarVelocity * ratioX;
        this.yVelocity = magnetarVelocity * rationY;
        this.xPos = this.calculatePosition(this.xPos, x, this.xVelocity, delta);
        this.yPos = this.calculatePosition(this.yPos, y, this.yVelocity, delta);
        if (this.xPos < 0) {
            this.xPos = this.upperBounds.x + this.xPos;
        }
        else if (this.xPos > this.upperBounds.x) {
            this.xPos = this.xPos - this.upperBounds.x
        }
        if (this.yPos < 0) {
            this.yPos = this.upperBounds.y + this.yPos;
        }
        else if (this.yPos > this.upperBounds.y) {
            this.yPos = this.yPos - this.upperBounds.y
        }

        this.generateCenters();
    }

    update(delta) {
        this.rotation = (this.rotation + this.rotationSpeed) % 360;
        this.points = new Array();
        for (let i = 0; i < 360; i += 5) {
            var theta = degreesToRadians(i + this.rotation);
            var x = (this.radii[i / 5] * Math.cos(theta));
            var y = -(this.radii[i / 5] * Math.sin(theta));
            this.points.push(new Point(x, y));
        }
        if (this.magnetar) {
            this.calculateMagnetarPosition(delta);
        } else {
            this.updatePosition(delta);
        }
    }

    magnetarOn() {
        this.magnetar = true;
    }

    magnetarOff() {
        this.magnetar = false;
        this.xVelocity = Math.cos(degreesToRadians(this.vector)) * this.magnitude;
        this.yVelocity = Math.sin(degreesToRadians(this.vector)) * this.magnitude;
    }

    generatePoints() {
        this.points = [];
        this.innerPoints = [];
        this.radii = [];
        var innerDelta = Math.max(this.product, 4);
        var i;
        for (i = 0; i < 360; i += 5) {
            var theta = degreesToRadians(Number(i));
            var sum = sumTheFactors(theta, this.factors);
            var radius = (Math.log(this.product) * (5 + sum)) + 7;
            var x = (radius * Math.cos(theta));
            var y = -(radius * Math.sin(theta));
            var innerX = ((radius - innerDelta) * Math.cos(theta));
            var innerY = -((radius - innerDelta) * Math.sin(theta));
            this.points.push(new Point(x, y));
            this.innerPoints.push(new Point(innerX, innerY));
            this.radii.push(radius);
            this.maxRadius = Math.max(this.maxRadius, radius);
            this.minRadius = Math.min(this.minRadius, radius);
        }
    }

    stabilize() {
        let num = this.product;
        const vector = randFloat(360);
        const stableFactoroids = [];
        while (num > 2) {
            let s = randInt(num);
            if (s >= 2) {
                num -= s;
                if (num < 2) {
                    s += num; // just take the rest
                    num = 0;
                }
                const v = coinToss() === 1 ? vector : vector + 180;
                const f = new Factoroid(s, new Point(this.xPos, this.yPos), this.state, this.upperBounds, v, randFloat(50));
                stableFactoroids.push(f);
            }

        }
        return stableFactoroids;
    }

    inCollision(item, fx, fy) {
        const dist = distanceBetweenTwoPoints(item.xPos, item.yPos, fx, fy);
        if (dist > (this.maxRadius + item.radius)) {
            return false;
        }
        if (dist < (this.minRadius + item.radius)) {
            return true;
        }

        const rr = item.getRotatedRadius();

        for (let i = 0; i < this.points.length; ++i) {
            if (
                linesIntersect(rr.x1, rr.y1, rr.x2, rr.y2, this.xPos, this.yPos, this.points[i].x + this.xPos, this.points[i].y + this.yPos)
                || linesIntersect(item.xPos, item.yPos, item.xPos - item.xVel, item.yPos - item.yVel, this.xPos, this.yPos, this.points[i].x + this.xPos, this.points[i].y + this.yPos)
            ) {
                return true;
            }
        }

        return false;
    }

    detectCollision(item) {
        for (let i = 0; i < this.centers.length; ++i) {
            if (this.inCollision(item, this.centers[i].x, this.centers[i].y)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Detect collision.
     * Return 0 for no collision
     * Return 1 for collision
     * Retrun 2 for collision but the new asteroid is unstable.
     */
    detectBulletCollision(bullet) {
        if (bullet.dead) {
            return 0;
        }
        if (this.detectCollision(bullet)) {
            bullet.dead = true;
            const number = this.factors.find(x => x === bullet.number);
            if (number) {
                this.product = this.product / number;
                this.color = generateColor(this.product);
                if (this.product === 1) {
                    this.dead = true;
                    return 1;
                } else {
                    const vector = this.vector + (180 + (randFloat(20) * coinToss()));
                    const magnitude = this.magnitude * ((randFloat(5) + 1));
                    const f = new Factoroid(number, new Point(this.xPos, this.yPos), this.state, this.upperBounds, vector, magnitude);
                    if (this.state.fb[this.state.fbIndex].name === 'Splinter') {
                        this.hasSpawn = true;
                        this.spawn.push(this);
                        this.spawn.push(f);
                    }
                }
            } else {
                this.product = this.product * bullet.number;
            }
            if (this.product > this.maxSize) {
                this.hasSpawn = true;
                this.spawn = this.stabilize();
                return 2;
            }
            this.factors = generateFactors(this.product);
            this.generatePoints();

            return 1;
        }
        return 0;
    }

    detectShipCollision(ship) {
        if (ship.collisionShieldCountdown <= 0 && !ship.dead && this.detectCollision(ship)) {
            ship.death();
            this.state.lifeCount -= 1;
        }
    }

    getLabel() {
        return this.product;
    }

    privateDraw(context, xLoc, yLoc) {
        context.save();
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = this.color;
        context.moveTo(this.points[0].x + xLoc, this.points[0].y + yLoc);
        for (let i = 1; i < this.points.length; ++i) {
            context.lineTo(this.points[i].x + xLoc, this.points[i].y + yLoc);
        }

        context.lineTo(this.points[0].x + xLoc, this.points[0].y + yLoc);
        context.closePath();

        context.stroke();
        context.restore();

        context.save();
        context.fillStyle = 'white';
        context.font = '14pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const label = this.getLabel()
        context.fillText(label, xLoc, yLoc);
        context.restore();
    }


    privateDrawRadii(context, xLoc, yLoc) {
        context.save();

        for (i = 0; i < this.points.length; ++i) {
            context.beginPath();
            context.lineWidth = 0.75
            context.strokeStyle = 'orange';
            context.moveTo(xLoc, yLoc);
            context.lineTo(this.points[i].x + xLoc, this.points[i].y + yLoc);

            context.stroke();
        }
        context.restore();
    }

    drawRadii(context) {
        this.centers.forEach(p => {
            this.privateDrawRadii(context, p.x, p.y);
        });
    }
}
