export default class Lightning {
    constructor(ship, factoroid, mainColor, branchColor) {
        super(pointerHandler);
        this.ship = ship;
        this.factoroid = factoroid;
        this.lines = [];
        this.branches = [];
        this.elapsed = 0;
        this.lineWidth = 2;
        this.branchWidth = 1;
        this.isPaused = false;
        this.pauseElapsed = 0;
        this.pauseDelay = Math.random();
        this.mainColor = '#ccffff';
        this.branchColor = '#ddccff';
    }

    getShipPoint() {
        const r = this.ship.radii[0];
        let rotation = this.ship.rotation - 90;
        let theta = degreesToRadians(rotation);
        const x = r * Math.cos(theta);
        const y = -(r * Math.sin(theta));
        return new Point(x + this.ship.xLoc, y + this.ship.yLoc);
    }

    getFactoroidPoint() {
        return new Point(this.factoroid.xLoc, this.factoroid.yLoc);
    }

    buildLightning() {
        const shipPoint = this.getShipPoint();
        const fPoint = this.getFactoroidPoint();
        const dx = Math.abs(shipPoint.x - fPoint.x);
        const dy = Math.abs(shipPoint.y - fPoint.y);
        const hypo = Math.sqrt(dx * dx + dy * dy);
        const ratioX = dx / hypo;
        const ratioy = dy / hypo;
        this.lines = [];
        this.branches = [];
        let x = shipPoint.x;
        let y = shipPoint.y;
        const segments = hypo / 20;
        for (let i = 0; i < segments; i++) {
            const p1 = new Point(x, y);
            x += Math.random() * 20 * ratioX;
            y += Math.random() * 20 * ratioY;
            const p2 = new Point(x, y);
            this.lines.push(new Line(p1, p2));
            if (i > 1) {
                this.buildBranches(x, y, 12, Math.PI / 2, 3);
            }
        }
    }

    buildBranches(x, y, length, angle, depth) {
        if (depth === 0) return;

        const p1 = new Point(x, y);
        let newLength = length - Math.random() * length / 3;
        let newAngle = angle + (Math.random() - 0.5) * Math.PI / 2;
        let newX = x + newLength * Math.cos(newAngle);
        let newY = y + newLength * Math.sin(newAngle);
        const p2 = new Point(newX, newY);
        this.branches.push(new Line(p1, p2));

        this.buildBranches(newX, newY, newLength, newAngle, depth - 1);
        if (Math.random() < 0.3) {
            this.buildBranches(newX, newY, newLength, angle, depth - 1);
        }
        if (Math.random() < 0.3) {
            this.buildBranches(newX, newY, newLength, angle + Math.PI, depth - 1);
        }
    }

    update(delta) {
        if (this.down) {
            dirty = true;
            if (this.isPaused) {
                this.pauseElapsed += delta;
                if (this.pauseElapsed > this.pauseDelay) {
                    this.pauseElapsed = 0;
                    this.isPaused = false;
                    this.buildLightning(this.pointerX, this.pointerY);
                }
            } else {
                this.elapsed += delta;
                this.branchWidth = Math.floor(Math.random() * 3) + 1;
                this.lineWidth = Math.floor(Math.random() * 5) + 1;
                this.branchWidth = Math.min(this.branchWidth, this.lineWidth);
                if (this.elapsed > 0.125) {
                    this.lines = [];
                    this.branches = [];
                    this.elapsed = 0;
                    this.pauseElapsed = 0;
                    this.pauseDelay = Math.random();
                    this.isPaused = true;
                }
            }
        }
    }

    drawLine(context, line, width, color) {
        context.beginPath();
        context.moveTo(line.p1.x, line.p1.y);
        context.lineTo(line.p2.x, line.p2.y);
        context.lineWidth = width;
        context.strokeStyle = color;
        context.stroke();
    }

    draw(context) {
        if (this.down) {
            this.lines.forEach(l => {
                this.drawLine(context, l, this.lineWidth, this.mainColor);
            });
            this.branches.forEach(l => {
                this.drawLine(context, l, this.branchWidth, this.branchColor);
            });
        }
    }
}

