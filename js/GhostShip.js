export class GhostShip extends BaseSprite {
    constructor(origin, upperBounds, number, stepSize, maxSize, outline = 'grey', drawRadii = false) {
        super(origin, upperBounds);
        this.origin = origin;
        this.count = 0;
        this.radius = 12;
        this.number = number;
        this.factors = new Array();
        this.points = new Array();
        this.innerPoints = new Array();
        this.radii = new Array();
        this.maxRadius = 0;
        this.minRadius = 100000;
        this.origin = origin;
        this.stepSize = stepSize % 180;
        this.maxSize = maxSize / 2;
        this.outline = outline;
        this.drawR = drawRadii

        this.generateFactors();
        this.generatePoints();
        this.reset();
    }

    generateFactors() {
        // GetFactors
        var t = this.number
        var index = 0
        var sqt = Math.sqrt(t)
        while (t != 1) {
            var factor = primes[index]
            if ((t % factor) === 0) {
                this.factors.push(factor);
                t = t / factor;
                sqt = Math.sqrt(t)
            }
            else {
                index += 1;
                factor = primes[index];
                if (factor > sqt) {
                    this.factors.push(t);
                    return;
                }
            }
        }
    }


    sumTheFactors(theta) {
        let sum = 0;

        for (var i = 0; i < this.factors.length; i++) {
            const f = this.factors[i];
            sum += Math.cos(f * theta);
        }

        if (sum < 0) {
            sum = -sum;
        }
        return sum;
    }

    generatePoints() {
        var innerDelta = Math.max(this.number, 4);
        let i;
        for (i = 0; i < 360; i += this.stepSize) {
            var theta = degreesToRadians(Number(i));
            var sum = this.sumTheFactors(theta);
            var radius = (Math.log(this.number) * (5 + sum)) + 7;
            this.radii.push(radius);
            this.maxRadius = Math.max(this.maxRadius, radius);
            this.minRadius = Math.min(this.minRadius, radius);
        }

        // scale it down to our max size
        if (this.maxRadius > this.maxSize) {
            // maxRadius * x = maxSize;
            // x = maxSize / maxRadius;
            const ratio = this.maxSize / this.maxRadius;
            this.radii = this.radii.map(r => r * ratio);
        }

        i = 0;
        this.radii.forEach(r => {
            var theta = degreesToRadians(Number(i));
            var x = (r * Math.cos(theta));
            var y = -(r * Math.sin(theta));
            var innerX = ((r - innerDelta) * Math.cos(theta));
            var innerY = -((r - innerDelta) * Math.sin(theta));
            this.points.push(new Point(x, y));
            this.innerPoints.push(new Point(innerX, innerY));
            i += this.stepSize;
        });
    }

    setUpperBounds(ub) {
        super.setUpperBounds(ub);
        this.origin.x = ub.x / 2;
        this.origin.y = ub.y / 2;
        this.xPos = ub.x - 47;
    }

    getRotatedRadius() {
        const thetaR = degreesToRadians(this.rotation - 90);
        const x1 = this.xPos - (this.radius * Math.cos(thetaR));
        const x2 = this.xPos + (this.radius * Math.cos(thetaR));
        const y1 = this.yPos - (this.radius * Math.sin(thetaR));
        const y2 = this.yPos + (this.radius * Math.sin(thetaR));

        return { x1, y1, x2, y2 };
    }

    reset() {
        this.xPos = this.origin.x;
        this.yPos = this.origin.y;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.rotation = 0;
    }

    update(delta) {

    }

    drawRadii(context, xLoc, yLoc) {
        context.save();

        for (i = 0; i < this.points.length; ++i) {
            context.beginPath();
            context.lineWidth = 0.75
            context.strokeStyle = 'black';
            context.moveTo(xLoc, yLoc);
            context.lineTo(this.points[i].x + xLoc, this.points[i].y + yLoc);

            context.stroke();
        }
        context.restore();
    }

    draw(context) {
        context.save();
        context.translate(this.xPos, this.yPos);
        context.rotate(degreesToRadians(this.rotation - 90));
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        for (i = 1; i < this.points.length; ++i) {
            context.lineTo(this.points[i].x, this.points[i].y);
        }

        context.lineTo(this.points[0].x, this.points[0].y);
        context.closePath();

        context.lineWidth = 1;
        context.strokeStyle = this.outline;
        context.stroke();
        context.restore();

        if (this.drawR) {
            this.drawRadii(context, this.xPos, this.yPos)
        }
    }
}