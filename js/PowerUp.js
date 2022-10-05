import MobileSprite from './MobileSprite.js';
import {
    distanceBetweenTwoPoints,
} from './AAAHelpers.js';

export default class PowerUp extends MobileSprite {
    constructor(origins, upperBounds, state, special) {
        super(origins, upperBounds, state, undefined, 80);
        this.special = special;
        this.maxRadius = 25;
        this.active = true;
        this.ttl = 10;
    }
   

    privateDraw(context, x, y) {
        context.save();
        context.beginPath();
        context.arc(x, y, this.maxRadius, 0, 2 * Math.PI);
        var gradient = context.createRadialGradient(x, y, 0, x, y, this.maxRadius);
        gradient.addColorStop(0, '#AAAAAA');
        gradient.addColorStop(0.5, this.special.color());
        gradient.addColorStop(1, '#000000');
        context.fillStyle = gradient;
        context.fill();
        context.strokeStyle = 'white';
        context.lineWidth = 0.1;
        context.stroke();
        context.restore();
    }

    update(delta) {
        this.ttl = this.ttl - delta;
        this.active = this.ttl > 0;
        this.updatePosition(delta);
        
    }

    inCollision(item, fx, fy) {
        const dist = distanceBetweenTwoPoints(item.xPos, item.yPos, fx, fy);
        if (dist > (this.maxRadius + item.radius)) {
            return false;
        }
        if (dist < (this.maxRadius + item.radius)) {
            return true;
        }
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
        if (!ship.dead && this.detectCollision(ship, this.xPos, this.yPos)) {
            ship.setSpecial(this.special);
            this.active = false;
        }
    }
}