import Point from './Point.js';
export default class Button {
    constructor(name, displayName, topLeft, width, height, pointerHandler) {
        this.tl = new Point(topLeft.x, topLeft.y);
        this.width = width;
        this.height = height;
        this.pointerHandler = pointerHandler;
        this.pointerHandler.Subscribe(this);
        this.downInButton = false;
        this.subscribers = [];
        this.name = name;
        this.displayName = displayName;
        this.edge = 'yellow';
        this.face = 'darkblue';
        this.swapped = false;
    }

    inButton(x, y) {
        return (
            x >= this.tl.x &&
            x <= this.tl.x + this.width &&
            y >= this.tl.y &&
            y <= this.tl.y + this.height
        );
    }

    Subscribe(s) {
        this.subscribers.push(s);
    }

    Unsubscribe(s) {
        this.subscribers = this.subscribers.filter(x => x !== s);
    }

    click() {
        this.subscribers.forEach(s => s.click(this.name, this));
    }

    OnDown(evt, x, y) {
        if (this.inButton(x, y)) {
            this.downInButton = true;
            [this.edge, this.face] = [this.face, this.edge];
            this.swapped = true;
        }

    }

    OnUp(evt, x, y) {
        if (this.inButton(x, y) && this.downInButton) {
            this.click()
        }

        // reset for next time
        this.downInButton = false;
        if (this.swapped) {
            [this.edge, this.face] = [this.face, this.edge];
        }

        this.swapped = false;
    }

    OnMove(evt) {
        // nothing to do for a button.
    }

    OnLeave(evt) {
        // nothing to do for a button.
    }

    OnCance(evt) {
        // nothing to do for a button.
    }

    update(delta) {
        if (this.downInButton) {
            // update something for now do nothing
        }
    }

    draw(context) {
        context.save();
        context.beginPath();
        context.strokeStyle = this.edge;
        context.fillStyle = this.face;
        context.lineWidth = 6;
        const x = this.tl.x;
        const y = this.tl.y;
        const width = this.width;
        const height = this.height;
        context.rect(x, y, width, height);
        context.stroke();
        context.fill();

        context.fillStyle = 'yellow';
        context.font = '12pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.displayName, x + (width / 2), y + (height / 2));
        context.restore();

    }

}
