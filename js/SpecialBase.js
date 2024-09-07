import Calculator from "./Calculator.js";

export default class SpecialBase {
    constructor(cooldownTime, color, text, uses=-1) {
        this.cooldown = 0;
        this.cooldownTime = cooldownTime;
        this.colorValue = color;
        this.textValue = text;
        this.uses = uses;
        this.invocations = 0;
        this.calculator = new Calculator(this.colorValue, this.textValue, this.uses);
    }

    tick(delta, ship) {
        if (this.cooldown > 0) {
            this.cooldown = Math.max(this.cooldown - delta, 0);
        }
        if (this.cooldown === 0 && this.used() === 0) {
            ship.setSpecial(null);
        }
    }

    used() {
        return this.uses - this.invocations;
    }

    invoke(ship) {
        if (this.cooldown === 0) {
            this.invocations += 1;
            this.invocation(ship);
            this.cooldown = this.cooldownTime;
        }
    }

    invocation(ship) {
        throw new Error("Did you forget to implement this?")
    }

    terminate(ship) {
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
        context.save()
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
        if (this.uses > 0) {
            const x = 52;
            const y = 68;
            const yD = 7
            for (let i = 0; i < this.used(); ++i) {
                context.save();
                context.beginPath();
                context.fillStyle = 'lightgreen';
                context.arc(x, y + yD * i, 3, 0, three60, true);
                context.fill();
                context.closePath();
                context.restore();
            }
        }
    }

    color() {
        return this.colorValue;
    }
}
