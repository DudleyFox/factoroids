import BaseSprite from './BaseSprite.js';
import {
    distanceBetweenTwoPoints,
} from './AAAHelpers.js';

export default class PowerUp extends BaseSprite {
    constructor(origins, upperBounds, state, special) {
        super(origins, upperBounds, state);
        this.special = special;
        this.xVelocity = 2;
        this.yVelocity = 0
        this.size = 25;
        this.active = true;
        
    }
    updatePosition() {
        this.xPos += this.xVelocity;
        this.yPos += this.yVelocity;

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
    }

    draw(context) {
        context.save();
        context.beginPath();
        context.arc(this.xPos, this.yPos, this.size, 0, 2 * Math.PI);
        var gradient = context.createRadialGradient(this.xPos, this.yPos, 0, this.xPos, this.yPos, this.size);
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
        this.updatePosition();
    }

    inCollision(item, fx, fy) {
        const dist = distanceBetweenTwoPoints(item.xPos, item.yPos, fx, fy);
        if (dist > (this.size + item.radius)) {
            return false;
        }
        if (dist < (this.size + item.radius)) {
            return true;
        }
    }

    detectShipCollision(ship) {
        if (!ship.dead && this.inCollision(ship, this.xPos, this.yPos)) {
            ship.special = this.special;
            this.active = false;
        }
    }
}