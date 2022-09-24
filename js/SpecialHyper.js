import SpecialBase from "./SpecialBase.js";

export default class SpecialHyper extends SpecialBase {
    constructor() {
        super();
    }

    update(ship, delta) {
        if (this.cooldown === 0) {
            const newX = Math.random() * ship.upperBounds.x;
            const newY = Math.random() * ship.upperBounds.y;
            const newR = Math.random() * 360;
            ship.xPos = newX;
            ship.yPos = newY;
            ship.rotation = newR;
            ship.xVelocity = 0;
            ship.yVelocity = 0;
            this.cooldown = 15;
        }
    }
    color() {
        return '#DD1111';
    }
}