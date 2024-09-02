import MobileSprite from './MobileSprite.js';
import Bullet from './Bullet.js';
import Point from './Point.js';
import Ship from './Ship.js';
import {
    generateFactors,
    sumTheFactors,
    degreesToRadians,
    coinToss,
    randInt
} from './AAAHelpers.js';


export default class CreditShip extends Ship {
    constructor(options) {
        super(options);
        this.color = 'red'// for now
        this.rotation = randInt(360);
        this.acceleration = randInt(16) + 16;
        this.immortal = true;
        this.collisionShieldCountdown = 0;
    }

    update (delta) {
        this.xVelocity -= Math.cos(degreesToRadians(this.rotation + 90)) * this.acceleration;
        this.yVelocity -= Math.sin(degreesToRadians(this.rotation + 90)) * this.acceleration;
        this.updatePosition(delta);
    }

    getFillColor() {
        return 'red';
    }

    reset() {
        // just do nothing
    }
}
