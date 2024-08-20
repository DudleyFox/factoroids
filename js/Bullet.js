import MobileSprite from "./MobileSprite.js";
import Point from './Point.js';
import { degreesToRadians } from './AAAHelpers.js';

export default class Bullet extends MobileSprite {
    constructor(options) {
        super(options);
        const {number, origin, upperBounds, state, vector, magnitude } = options;
        this.path = [new Point(this.xPos, this.yPos)];
        this.ttl = 90;
        this.number = number;
        this.rotation = 0;
        this.rVelocity = 45;
        this.maxRadius = (Math.floor(Math.log10(number * 10 + 1)) * 9) / 2;
        this.dead = false;
        this.color = 'white';
    }

    expired() {
        return this.ttl < 0 || this.dead;
    }

    getRotatedRadius() {
        const thetaR = degreesToRadians(this.rotation);
        const x1 = this.xPos - (this.maxRadius * Math.cos(thetaR));
        const x2 = this.xPos + (this.maxRadius * Math.cos(thetaR));
        const y1 = this.yPos - (this.maxRadius * Math.sin(thetaR));
        const y2 = this.yPos + (this.maxRadius * Math.sin(thetaR));

        return { x1, y1, x2, y2 };
    }


    update(delta) {
        this.rotation += this.rVelocity;
        this.path.push(new Point(this.xPos, this.yPos));
        this.updatePosition(delta);

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

    privateDraw(context, x, y) {
        context.save();
        context.translate(x, y);
        context.rotate(degreesToRadians(this.rotation));
        context.fillStyle = this.color;
        context.font = '12pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.number, 0, 0);
        context.restore();
    }
};
