import GameScreenBase from './GameScreenBase.js';
import GameScreenBlue from './GameScreenBlue.js';
import Point from './Point.js';

export default class GameScreenRed extends GameScreenBase {
    constructor(ub) {
        super();
        this.upperBounds = ub;
        this.origin = new Point(this.upperBounds.x / 2, this.upperBounds.y/2);
        this.elapsedTime = 0;
    }

    update(delta) {
        this.elapsedTime += delta;
        if (this.elapsedTime >= 4) {
            this.elapsedTime = 0;
            return new GameScreenBlue(this.upperBounds);
        }
        this.origin = new Point(this.upperBounds.x / 2, this.upperBounds.y/2);
        return this;
    }

    draw(context) {
        context.save();
        context.beginPath();
        context.arc(this.origin.x, this.origin.y, 100, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
        context.closePath();
        context.restore();
    }

    setUpperBounds(ub) {
        this.upperBounds = ub;
    }
}