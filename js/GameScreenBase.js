//**
// * Base class for a game screen. 
// * Allows the game to be screen agnostic on the
// * animation loop.
// *
export default class GameScreenBase {
    constructor(options) {
        this.keyHandler = options.keyHandler;
        this.upperBounds = options.upperBounds;
        this.state = options.state;
        this.upperBoundsChanged = false;
    }

    update (delta) {
    }

    draw(context) {
    }

    setUpperBounds(ub) {
        this.upperBounds = ub;
        this.upperBoundsChanged = true;
    }
}
