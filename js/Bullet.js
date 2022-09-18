import BaseSprite from "./BaseSprite.js";
import Point from './Point.js';
import { degreesToRadians } from './AAAHelpers.js';

export default class Bullet extends BaseSprite {
    constructor(number, origin, xVel, yVel, upperBounds, state, color, ttl) {
        super(origin, upperBounds, state);
        this.path = [new Point(this.xPos, this.yPos)];
        this.xVelocity = xVel;
        this.yVelocity = yVel;
        this.ttl = ttl;
        this.number = number;
        this.rotation = 0;
        this.rVelocity = 45;
        this.radius = (Math.floor(Math.log10(number * 10 + 1)) * 9) / 2;
        this.dead = false;
        this.color = 'white';
    }

    expired() {
        return this.ttl < 0 || this.dead;
    }

    getRotatedRadius() {
        const thetaR = degreesToRadians(this.rotation);
        const x1 = this.xPos - (this.radius * Math.cos(thetaR));
        const x2 = this.xPos + (this.radius * Math.cos(thetaR));
        const y1 = this.yPos - (this.radius * Math.sin(thetaR));
        const y2 = this.yPos + (this.radius * Math.sin(thetaR));

        return { x1, y1, x2, y2 };
    }


    update(time) {
        this.xPos += this.xVelocity;
        this.yPos += this.yVelocity;
        this.rotation += this.rVelocity;
        this.path.push(new Point(this.xPos, this.yPos));

        if (this.xPos < 0) {
            this.xPos = this.upperBounds.x + this.xPos;
        }
        if (this.yPos < 0) {
            this.yPos = this.upperBounds.y + this.yPos;
        }
        if (this.xPos > this.upperBounds.x) {
            this.xPos = this.xPos - this.upperBounds.x;
        }
        if (this.yPos > this.upperBounds.y) {
            this.yPos = this.yPos - this.upperBounds.y;
        }

        this.ttl -= 1;
    }

    drawPath(context) {
        this.path.forEach(p => {
            context.beginPath();
            context.fillStyle = 'white';
            context.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            context.fill()
        });
    }

    draw(context) {
        context.save();
        context.translate(this.xPos, this.yPos);
        context.rotate(degreesToRadians(this.rotation));
        context.fillStyle = this.color;
        context.font = '12pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.number, 0, 0);
        context.restore();
    }
};
