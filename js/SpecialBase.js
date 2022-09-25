export default class SpecialBase {
    constructor(cooldownTime, color) {
        this.cooldown = 0;
        this.cooldownTime = cooldownTime;
        this.colorValue = color;
    }
    tick(delta) {
        if (this.cooldown > 0) {
            this.cooldown = Math.max(this.cooldown - delta, 0);
        }
    }
    invoke(ship) {
        throw new Error('Did you forget to implement this?');
    }

    draw(context) {
        const x = 30;
        const y = 75;
        const radius = 25;
        const three60 = Math.PI * 2;
        context.save();
        context.beginPath();
        context.arc(x, y, radius, 0, three60);
        var gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, '#AAAAAA');
        gradient.addColorStop(0.5, this.color());
        gradient.addColorStop(1, '#000000');
        context.fillStyle = gradient;
        context.fill();
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