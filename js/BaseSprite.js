export default class BaseSprite {
    constructor(options) {
        this.upperBounds = options.upperBounds;
        this.xPos = options.origin.x;
        this.yPos = options.origin.y;
        this.state = options.state;
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
