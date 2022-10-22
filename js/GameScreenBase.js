//**
// * Base class for a game screen. 
// * Allows the game to be screen agnostic on the
// * animation loop.
// *
export default class GameScreenBase {
    constructor(upperBounds, KeyHandler, state) {
        this.keyHandler = KeyHandler;
        this.upperBounds = upperBounds;
        this.state = state;
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
