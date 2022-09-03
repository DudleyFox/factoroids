export class BaseSprite {
    constructor(origin, upperBounds) {
        this.upperBounds = upperBounds;
        this.xPos = origin.x;
        this.yPos = origin.y;
    }
    setUpperBounds(ub) {
        this.upperBounds = ub;
    }
    draw(context) {
        throw new Error('Did you forget to implement this?');
    }
    update(delta) {
        throw new Error('Did you forget to implement this?');
    }
}