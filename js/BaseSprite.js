export default class BaseSprite {
    constructor(origin, upperBounds, state) {
        this.upperBounds = upperBounds;
        this.xPos = origin.x;
        this.yPos = origin.y;
        this.state = state;
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