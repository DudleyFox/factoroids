import Point from './Point.js';
import Line from './Line.js';
import {
    degreesToRadians,
    distanceBetweenTwoPoints,
    coinToss,
} from './AAAHelpers.js';

export default class Lightning {
    constructor(ship, factoroid) {
        this.ship = ship;
        this.factoroid = factoroid;
        this.points = [];
        this.branchPoints = [];
        this.elapsed = 0;
        this.lineWidth = 2;
        this.branchWidth = 1;
        this.isPaused = false;
        this.mainColor = '#ccffff';
        this.branchColor = '#ddccff';
        this.rebuildCooldown = 0.1;
        this.buildLightning();
    }

    getShipPoint() {
        const r = this.ship.radii[0];
        let rotation = this.ship.rotation - 90;
        let theta = degreesToRadians(rotation);
        const x = (r * Math.cos(theta));
        const y = (r * Math.sin(theta));
        return new Point(x + this.ship.xPos, y + this.ship.yPos);
    }

    getFactoroidPoint(shipPoint) {
        const pl = this.factoroid.points.length;
        let min = 999999;
        let closest = null;
        for (let i = 0; i < pl; i++) {
            const tp = this.factoroid.points[i];
            const p = new Point(tp.x + this.factoroid.xPos, tp.y + this.factoroid.yPos);
            const d = distanceBetweenTwoPoints(shipPoint.x, shipPoint.y, p.x, p.y);
            if (d < min) {
                min = d;
                closest = p;
            }
        }
        return closest;
    }

    wiggle(amplitude) {
        const a = Math.random() * amplitude;
        return coinToss() * a;
    }

    direction(n1,n2) {
       return n1 > n2 ? -1 : 1; 
    }

    buildLightning() {
        // our angle is T, but we don't actually need to know it.
        this.points = [];
        this.branches = [];
        const shipPoint = this.getShipPoint();
        const fPoint = this.getFactoroidPoint(shipPoint);
        const dx = Math.abs(shipPoint.x - fPoint.x);
        const dy = Math.abs(shipPoint.y - fPoint.y);
        const hypo = Math.sqrt(dx * dx + dy * dy);
        const cosT = dx / hypo;
        const sinT = dy / hypo;
        let x = shipPoint.x;
        let y = shipPoint.y;
        const dirX = this.direction(shipPoint.x, fPoint.x);
        const dirY = this.direction(shipPoint.y, fPoint.y);
        let d = 0;
        const p1 = new Point(x, y);
        this.points.push(p1);

        const segments = hypo / 20;
        for (let i = 0; d < hypo - 20; i++) {
            d += Math.random() * 20;
            x = ((d * cosT) * dirX + (shipPoint.x)) + this.wiggle(5);
            y = ((d * sinT) * dirY + (shipPoint.y)) + this.wiggle(5);
            const p2 = new Point(x, y);
            this.points.push(p2);
            if (i > 1) {
                this.buildBranches(x, y, 12, 3);
            }
        }
        this.points.push(fPoint);
    }

    buildBranches(x, y, length, depth) {
        if (depth === 0) return;

        const p1 = new Point(x, y);
        let newLength = length * Math.random() + length / 3; 
        let newAngle = degreesToRadians(Math.random() * 360);
        let newX = x + newLength * Math.cos(newAngle);
        let newY = y + newLength * Math.sin(newAngle);
        const p2 = new Point(newX, newY);
        this.branches.push(new Line(p1, p2));

        this.buildBranches(newX, newY, length, depth - 1);
        if (Math.random() < 0.3) {
            this.buildBranches(newX, newY, length, depth - 1);
        }
        if (Math.random() < 0.3) {
            this.buildBranches(newX, newY, length, depth - 1);
        }
    }

    update(delta) {
        this.elapsed += delta;
        if (true || this.elapsed > this.rebuildCooldown) {
            this.branchWidth = Math.floor(Math.random() * 3) + 1;
            this.lineWidth = Math.floor(Math.random() * 5) + 1;
            this.branchWidth = Math.min(this.branchWidth, this.lineWidth);
            this.buildLightning(this.pointerX, this.pointerY);
            this.elapsed = 0;
        }
    }

    drawPoints(context, points, width, color) {
        context.save();
        context.beginPath();
        context.moveTo(points[0].x,points[0].y);
        for(let i = 0; i < points.length; i++) {
            const p = points[i];
            context.lineTo(p.x,p.y);
        }
        context.lineWidth = width;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
    }

    drawLine(context, line, width, color) {
        context.save();
        context.beginPath();
        context.moveTo(line.p1.x, line.p1.y);
        context.lineTo(line.p2.x, line.p2.y);
        context.lineWidth = width;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
    }

    draw(context) {
        const point = this.getShipPoint();

        context.save();
        context.beginPath();
        context.arc(point.x,point.y, 5, 0, Math.PI*2);
        context.strokeStyle = this.branchColor;
        context.stroke();
        context.restore();

        // context.save();
        // context.moveTo(point.x, point.y);
        // context.lineTo(fPoint.x, fPoint.y);
        // context.strokeStyle = 'orange';
        // context.stroke();
        // context.restore();

        this.drawPoints(context, this.points, this.lineWidth, this.mainColor);
        // this.branches.forEach(l => {
            // this.drawLine(context, l, this.branchWidth, this.branchColor);
        // });
    }
}

