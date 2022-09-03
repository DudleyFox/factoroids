export default class Factoroid extends BaseSprite {
    constructor(product, origin, upperBounds, vector, magnitude = 10) {
        super(origin, upperBounds);
        this.product = product;
        this.factors = new Array();
        this.points = new Array();
        this.innerPoints = new Array();
        this.radii = new Array();
        this.maxRadius = 0;
        this.minRadius = 100000;
        this.rotationSpeed = this.adjustDirection(Math.random());
        this.rotation = 0;
        this.vector = vector || Math.random() * 360;
        this.magnitude = magnitude;
        this.xVelocity = Math.cos(degreesToRadians(this.vector)) * magnitude;
        this.yVelocity = Math.sin(degreesToRadians(this.vector)) * magnitude;
        this.color = generateColor(this.product);
        this.dead = false;
        this.centers;
        this.maxSize = product * 7;
        this.spawn = [];
        this.hasSpawn = false;

        this.generateFactors();
        this.generatePoints();
        this.generateCenters();
    }

    adjustDirection(aValue) {
        return aValue * coinToss();
    }

    update(delta) {
        this.rotation = (this.rotation + this.rotationSpeed) % 360;
        this.points = new Array();
        for (i = 0; i < 360; i += 5) {
            var theta = degreesToRadians(i + this.rotation);
            var x = (this.radii[i / 5] * Math.cos(theta));
            var y = -(this.radii[i / 5] * Math.sin(theta));
            this.points.push(new Point(x, y));
        }
        this.xPos += this.xVelocity * delta;
        this.yPos += this.yVelocity * delta;


        if (this.xPos < 0) {
            this.xPos = this.upperBounds.x + this.xPos;
        }
        else if (this.xPos > this.upperBounds.x) {
            this.xPos = this.xPos - this.upperBounds.x
        }
        if (this.yPos < 0) {
            this.yPos = this.upperBounds.y + this.yPos;
        }
        else if (this.yPos > this.upperBounds.y) {
            this.yPos = this.yPos - this.upperBounds.y
        }

        this.generateCenters();
    }

    generateFactors() {
        // GetFactors
        this.factors = [];
        var t = this.product
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

        for (let i = 0; i < this.factors.length; i++) {
            const f = this.factors[i];
            sum += Math.cos(f * theta);
        }


        if (sum < 0) {
            sum = -sum;
        }

        return sum;
    }

    generatePoints() {
        this.points = [];
        this.innerPoints = [];
        this.radii = [];
        var innerDelta = Math.max(this.product, 4);
        var i;
        for (i = 0; i < 360; i += 5) {
            var theta = degreesToRadians(Number(i));
            var sum = this.sumTheFactors(theta);
            var radius = (Math.log(this.product) * (5 + sum)) + 7;
            var x = (radius * Math.cos(theta));
            var y = -(radius * Math.sin(theta));
            var innerX = ((radius - innerDelta) * Math.cos(theta));
            var innerY = -((radius - innerDelta) * Math.sin(theta));
            this.points.push(new Point(x, y));
            this.innerPoints.push(new Point(innerX, innerY));
            this.radii.push(radius);
            this.maxRadius = Math.max(this.maxRadius, radius);
            this.minRadius = Math.min(this.minRadius, radius);
        }
    }

    stabilize() {
        let num = this.product;
        const vector = Math.random() * 360;
        const stableFactoroids = [];
        while (num > 2) {
            let s = Math.floor(Math.random() * num);
            if (s >= 2) {
                num -= s;
                if (num < 2) {
                    s += num; // just take the rest
                    num = 0;
                }
                const v = coinToss() === 1 ? vector : vector + 180;
                const f = new Factoroid(s, new Point(this.xPos, this.yPos), this.upperBounds, v, Math.random() * 50);
                stableFactoroids.push(f);
            }

        }
        return stableFactoroids;
    }

    inCollision(item, fx, fy) {
        const dist = distanceBetweenTwoPoints(item.xPos, item.yPos, fx, fy);
        if (dist > (this.maxRadius + item.radius)) {
            return false;
        }
        if (dist < (this.minRadius + item.radius)) {
            return true;
        }

        const rr = item.getRotatedRadius();

        for (let i = 0; i < this.points.length; ++i) {
            if (
                linesIntersect(rr.x1, rr.y1, rr.x2, rr.y2, this.xPos, this.yPos, this.points[i].x + this.xPos, this.points[i].y + this.yPos)
                || linesIntersect(item.xPos, item.yPos, item.xPos - item.xVel, item.yPos - item.yVel, this.xPos, this.yPos, this.points[i].x + this.xPos, this.points[i].y + this.yPos)
            ) {
                return true;
            }
        }

        return false;
    }

    detectCollision(item) {
        for (let i = 0; i < this.centers.length; ++i) {
            if (this.inCollision(item, this.centers[i].x, this.centers[i].y)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Detect collision.
     * Return 0 for no collision
     * Return 1 for collision
     * Retrun 2 for collision but the new asteroid is unstable.
     */
    detectBulletCollision(bullet) {
        if (bullet.dead) {
            return 0;
        }
        if (this.detectCollision(bullet)) {
            bullet.dead = true;
            const number = this.factors.find(x => x === bullet.number);
            if (number) {
                this.product = this.product / number;
                if (this.product === 1) {
                    this.dead = true;
                    return 1;
                } else {
                    const vector = this.vector + (180 + (Math.random() * 20 * coinToss()));
                    const magnitude = this.magnitude * ((Math.random() * 5) + 1)
                    const f = new Factoroid(number, new Point(this.xPos, this.yPos), this.upperBounds, vector, magnitude);
                    if (fb[fbIndex].name === 'Splinter') {
                        this.hasSpawn = true;
                        this.spawn.push(this);
                        this.spawn.push(f);
                    }
                }
            } else {
                this.product = this.product * bullet.number;
            }
            if (this.product > this.maxSize) {
                this.hasSpawn = true;
                this.spawn = this.stabilize();
                return 2;
            }
            this.generateFactors();
            this.generatePoints();

            return 1;
        }
        return 0;
    }

    detectShipCollision(ship) {
        if (ship.collisionShieldCountdown <= 0 && !ship.dead && this.detectCollision(ship)) {
            ship.death();
            lives.pop();
            lifeCount -= 1;
        }
    }

    onRight() {
        return this.xPos + this.maxRadius > this.upperBounds.x
    }

    onLeft() {
        return this.xPos - this.maxRadius < 0;
    }

    onBottom() {
        return this.yPos + this.maxRadius > this.upperBounds.y;
    }

    onTop() {
        return this.yPos - this.maxRadius < 0;
    }

    generateCenters() {
        this.centers = [new Point(this.xPos, this.yPos)];
        if (this.onRight()) {
            this.centers.push(new Point(
                this.xPos - this.upperBounds.x,
                this.yPos));
            if (this.onTop()) {
                this.centers.push(new Point(
                    this.xPos - this.upperBounds.x,
                    this.yPos + this.upperBounds.y));
            }
            if (this.onBottom()) {
                this.centers.push(new Point(
                    this.xPos - this.upperBounds.x,
                    this.yPos - this.upperBounds.y));
            }

        }
        if (this.onLeft()) {
            this.centers.push(new Point(
                this.xPos + this.upperBounds.x,
                this.yPos));
            if (this.onTop()) {
                this.centers.push(new Point(
                    this.xPos + this.upperBounds.x,
                    this.yPos + this.upperBounds.y));
            }
            if (this.onBottom()) {
                this.centers.push(new Point(
                    this.xPos + this.upperBounds.x,
                    this.yPos - this.upperBounds.y));
            }
        }
        if (this.onBottom()) {
            this.centers.push(new Point(
                this.xPos,
                this.yPos - this.upperBounds.y));
        }
        if (this.onTop()) {
            this.centers.push(new Point(
                this.xPos,
                this.yPos + this.upperBounds.y));
        }

        return this.centers;
    }



    privateDraw(context, xLoc, yLoc) {
        context.save();
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = this.color;
        context.moveTo(this.points[0].x + xLoc, this.points[0].y + yLoc);
        for (i = 1; i < this.points.length; ++i) {
            context.lineTo(this.points[i].x + xLoc, this.points[i].y + yLoc);
        }

        context.lineTo(this.points[0].x + xLoc, this.points[0].y + yLoc);
        context.closePath();

        context.stroke();

        context.restore();

        context.fillStyle = 'white';
        context.font = '14pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.product, xLoc, yLoc);
    }


    privateDrawRadii(context, xLoc, yLoc) {
        context.save();

        for (i = 0; i < this.points.length; ++i) {
            context.beginPath();
            context.lineWidth = 0.75
            context.strokeStyle = 'orange';
            context.moveTo(xLoc, yLoc);
            context.lineTo(this.points[i].x + xLoc, this.points[i].y + yLoc);

            context.stroke();
        }
        context.restore();
    }

    drawRadii(context) {
        this.centers.forEach(p => {
            this.privateDrawRadii(context, p.x, p.y);
        });

    }

    draw(context) {

        this.centers.forEach(p => {
            this.privateDraw(context, p.x, p.y);
        });
    }
}
