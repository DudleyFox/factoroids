import BaseSprite from './BaseSprite.js';
import Point from './Point.js';
import {
    degreesToRadians,
} from './AAAHelpers.js';

/**
 * Handles motion and detecting how close we are to the edge, so we can draw extra
 * for the wrap around effect.
 * 
 * The child class needs to provide a drawPrivate method that takes a context, and an x and y location.
 */
export default class MobileSprite extends BaseSprite {
    constructor(origin, upperBounds, state, vector, magnitude) {
        super(origin, upperBounds, state);
        this.vector = vector || Math.random() * 360;
        this.magnitude = magnitude || (Math.random() * 20 + 10);
        this.xVelocity = Math.cos(degreesToRadians(this.vector)) * this.magnitude;
        this.yVelocity = Math.sin(degreesToRadians(this.vector)) * this.magnitude;

        this.generateCenters();
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


    updatePosition(delta) {
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

    draw(context) {
        this.centers.forEach(p => {
            this.privateDraw(context, p.x, p.y);
        });
    }
}