//**
// * Base class for a game screen. 
// * Allows the game to be screen agnostic on the
// * animation loop.
// *
export default class GameScreenBase {
    constructor(upperBounds, KeyHandler) {
        this.keyHandler = KeyHandler;
        this.upperBounds = upperBounds;
    }

    update (delta) {

    }

    draw(context) {

    }

    setUpperBounds(ub) {
        this.upperBounds = ub;
    }
}
