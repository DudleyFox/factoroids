import BaseSprite from './BaseSprite.js';
import Point from './Point.js';
import {
    degreesToRadians,
    randFloat
} from './AAAHelpers.js';


// Given a value, return the defVal if it is undefine or null,
// otherwise use the number as it is. This helps where the
// number could be zero.
const getNumericOption = (option, defVal) => {
    if (option === undefined || option === null) {
        return defVal;
    }
    return option;
}
/**
 * Handles motion and detecting how close we are to the edge, so we can draw extra
 * for the wrap around effect.
 * 
 * The child class needs to provide a drawPrivate method that takes a context, and an x and y location.
 */
export default class MobileSprite extends BaseSprite {
    constructor(options) {
        super(options);
        const {origin, upperBounds, state} = options;
        const mScale = options.mScale || 1;
        this.vector = getNumericOption(options.vector, randFloat(360));
        this.magnitude = getNumericOption(options.magnitude, randFloat(30*mScale, 10*mScale));
        this.xVelocity = Math.cos(degreesToRadians(this.vector)) * this.magnitude;
        this.yVelocity = Math.sin(degreesToRadians(this.vector)) * this.magnitude;
        this.wrap = !(options.noWrap || false);

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
        if (this.wrap) {
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
        }

        return this.centers;
    }


    updatePosition(delta) {
        this.xPos += this.xVelocity * delta;
        this.yPos += this.yVelocity * delta;


        if (this.wrap) {
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
        }

        this.generateCenters();
    }

    draw(context) {
        this.centers.forEach(p => {
            this.privateDraw(context, p.x, p.y);
        });
    }
}
