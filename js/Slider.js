import Point from './Point.js';

export default class Slider {
    constructor(name, lowerValue, upperValue, startValue, topLeft, width, height, direction, edge, face, bar, pointerHandler) {
        this.tl = new Point(topLeft.x, topLeft.y);
        this.width = width;
        this.height = height;
        this.pointerHandler = pointerHandler;
        this.pointerHandler.Subscribe(this);
        this.down = false;
        this.subscribers = [];
        this.name = name;
        this.edge = edge;
        this.face = face;
        this.bar = bar;
        this.lower = lowerValue;
        this.upper = upperValue;
        this.current = lowerValue;
        this.barPosition = this.tl.y;
        this.direction = direction || 'up';
        this.value = startValue;
        this.calculateStartBarPosition(this.value);
    }

    inSlider(x, y) {
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

    updateValue() {
        this.subscribers.forEach(s => s.updateValue(this.name, this.value, this));
    }

    OnDown(evt, x, y) {
        if (this.inSlider(x, y)) {
            this.down = true;
            this.OnMove(evt, x, y);
            evt.preventDefault();
        }

    }

    OnUp(evt, x, y) {
        // reset for next time
        this.down = false;
        evt.preventDefault();
    }

    OnCancel(evt) {
        // reset for next time
        this.down = false;
    }

    OnLeave(evt) {
        // reset for next time
        this.down = false;
    }

    OnMove(evt, x, y) {
        if (this.down) {
            const relativeY = y - this.tl.y;
            const relativeX = x = this.tl.x;
            const newValue = this.calculteValue(relativeX, relativeY);
            this.calculteBarPosition(relativeX, relativeY, newValue);
            if (this.value !== newValue) {
                this.value = Math.max(Math.min(newValue, this.upper), this.lower);
                this.updateValue();
            }
            evt.preventDefault();
        }
    }

    calculteValue(x, y) {
        switch (this.direction) {
            case 'up':
                return Math.floor((this.upper - this.lower) * ((this.height - y) / this.height)) + this.lower;
            case 'down':
                return Math.floor((this.upper - this.lower) * (y / this.height)) + this.lower;
            case 'left':
                return Math.floor((this.upper - this.lower) * ((this.width - x) / this.width)) + this.lower;
            case 'right':
                return Math.floor((this.upper - this.lower) * (x / this.width)) + this.lower;
        }
        return this.lower; // don't get here
    }

    calculteBarPosition(x, y) {
        switch (this.direction) {
            case 'up':
            case 'down':
                this.barPosition = Math.min(y, this.tl.y + this.height);
                this.barPosition = Math.max(this.barPosition, this.tl.y);
                break;
            case 'left':
            case 'right':
                this.barPosition = Math.min(x, this.tl.x + this.width);
                this.barPosition = Math.max(this.barPosition, this.tl.x);
                break;
        }
    }

    calculateStartBarPosition(value) {
        switch (this.direction) {
            case 'up':
                // return Math.floor((this.upper - this.lower) * ((this.height - y) / this.height)) + this.lower;
                this.barPosition = Math.floor((this.upper - value) / (this.upper - this.lower) * this.height) + this.tl.y; 
                break;
            case 'down':
                this.barPosition = Math.floor(value / (this.upper - this.lower) * this.height) + this.tl.y; 
                break;
            case 'left':
                this.barPosition = Math.floor(value / (this.upper - this.lower) * this.width) + this.tl.x; 
                break;
            case 'right':
                this.barPosition = Math.floor((this.upper - value) / (this.upper - this.lower) * this.width) + this.tl.x; 
                break;
        }
    }

    update(delta) {
        if (this.down) {
            // update something for now do nothing
        }
    }

    draw(context) {
        context.save();
        context.beginPath();
        context.strokeStyle = this.edge;
        context.fillStyle = this.face instanceof Function ? this.face(context, this) : this.face;
        context.lineWidth = 6;
        const x = this.tl.x;
        const y = this.tl.y;
        const width = this.width;
        const height = this.height;
        context.rect(x, y, width, height);
        context.stroke();
        context.fill();


        context.beginPath();
        context.strokeStyle = this.bar;
        context.fillStyle = this.bar;
        context.lineWidth = 1;
        const bar = this.barPosition;
        switch (this.direction) {
            case 'up':
            case 'down':
                context.rect(x, bar - 2, width, 4);
                break;
            case 'left':
            case 'right':
                context.rect(y, bar - 2, height, 4);
                break;
        }

        context.stroke();
        context.fill();
        context.restore();

    }

}
