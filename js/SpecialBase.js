import Calculator from "./Calculator.js";

export default class SpecialBase {
    constructor(cooldownTime, color, text) {
        this.cooldown = 0;
        this.cooldownTime = cooldownTime;
        this.colorValue = color;
        this.textValue = text;
        this.calculator = new Calculator(this.colorValue, this.textValue);
    }

    tick(delta) {
        if (this.cooldown > 0) {
            this.cooldown = Math.max(this.cooldown - delta, 0);
        }
    }

    invoke(ship) {
        throw new Error('Did you forget to implement this?');
    }

    terminate() {
        // called when we switch out specials.
    }

    text() {
        return this.textValue;
    }

    draw(context) {
        const x = 30;
        const y = 95;
        const radius = 40;
        const three60 = Math.PI * 2;
        this.calculator.draw(context, x, y);
        if (this.cooldown > 0) {
            const startAngle = 0 - Math.PI * 0.5;
            const arcAngle = (1 - (this.cooldown / this.cooldownTime)) * (three60) - Math.PI * 0.5;
            context.beginPath();
            context.fillStyle = 'rgba(0, 0, 0, .5)';
            context.arc(x, y, radius, startAngle, arcAngle, true);
            context.lineTo(x,y);
            context.fill();
            context.closePath();
        }
        context.restore();
    }

    color() {
        return this.colorValue;
    }
}