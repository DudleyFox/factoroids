import MobileSprite from './MobileSprite.js';
import {
    distanceBetweenTwoPoints,
    pointInRectangle
} from './AAAHelpers.js';
import Calculator from './Calculator.js';

export default class PowerUp extends MobileSprite {
    constructor(options) {
        super({...options, vector:undefined, magnitude:80});
        const { origins, upperBounds, state, special } = options;
        this.special = special;
        this.maxRadius = 30;
        this.active = true;
        this.ttl = 12;
        this.calculator = new Calculator(this.special.color(), this.special.text());
    }

    privateDraw(context, x, y) {
        this.calculator.draw(context, x, y);
    }

    update(delta) {
        this.ttl = this.ttl - delta;
        this.active = this.ttl > 0;
        this.updatePosition(delta);

    }

    inCollision(item, x, y) {
        const dist = distanceBetweenTwoPoints(item.xPos, item.yPos, x, y);
        if (dist > (this.maxRadius + item.radius)) {
            return false;
        }
        if (dist < (this.maxRadius + item.radius)) {
            return true;
        }

        const topLeft = this.calculator.topLeft(x,y);
        const bottomRight = this.calculator.bottomRight(x,y);

        const points = item.points;
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (pointInRectangle(p.x,p.y, topLeft, bottomRight)) {
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

    detectShipCollision(ship) {
        if (!ship.dead && this.detectCollision(ship)) {
            ship.setSpecial(this.special);
            this.active = false;
        }
    }
}
