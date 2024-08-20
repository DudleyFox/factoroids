import BaseSprite from "./BaseSprite.js";
import Point from './Point.js';
import {
generateFactors,
sumTheFactors,
degreesToRadians
} from './AAAHelpers.js';

export default class GhostShip extends BaseSprite {
    constructor(options) {
        super({ ...options, state:null});
        const { origin, upperBounds, number, stepSize, maxSize} = options;
        const outline = options.outline || 'grey';
        const drawRadii = options.drawRadii || false;
        this.origin = origin;
        this.count = 0;
        this.radius = 12;
        this.number = number;
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

        this.factors = generateFactors(this.number);
        this.generatePoints();
        this.reset();
    }

    generatePoints() {
        var innerDelta = Math.max(this.number, 4);
        let i;
        for (i = 0; i < 360; i += this.stepSize) {
            var theta = degreesToRadians(Number(i));
            var sum = sumTheFactors(theta, this.factors);
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
        for (let i = 1; i < this.points.length; ++i) {
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
