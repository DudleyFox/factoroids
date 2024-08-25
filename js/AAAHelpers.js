import primes from './Primes.js';

const params = new URLSearchParams(window.location.search);

export function getQueryVariable(variable, fallback = null) {
    return params.get(variable) || fallback;
}

export function getQueryVariableInt(variable, fallback = null) {

    const result = params.get(variable);
    if (!!result) {
        const numeric = parseInt(result);
        if (numeric !== NaN) {
            return numeric;
        }
    }

    return fallback;
}

export function toHex(n, p, v = '0') {
    return `${n.toString(16).padStart(p,v)}`;
}

export function generateColor(p) {
    const adjust = Math.abs(Math.cos(p));
    const blue = Math.floor(88 * adjust);
    return `#7777${(0x77 + blue).toString(16)}`;
}

export function coinToss() {
    return (Math.random() * 100 > 50) ? 1 : -1;
}

export function distanceBetweenTwoPoints(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;

    dx = dx * dx;
    dy = dy * dy;

    return Math.sqrt(dx + dy);
}

export function pointInRectangle(x,y, topLeft, bottomRight) {
    const inX = x >= topLeft.x && x <= bottomRight.x;
    const inY = y >= topLeft.t && y <= bottomRight.y;
    return inX && inY;
}

export function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180.0;
}

export function linesIntersect(l1x1, l1y1, l1x2, l1y2, l2x1, l2y1, l2x2, l2y2) {
    /*
             (Ay-Cy)(Dx-Cx)-(Ax-Cx)(Dy-Cy)
         r = -----------------------------  (eqn 1)
             (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)
 
             (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
         s = -----------------------------  (eqn 2)
             (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)
 
     Let P be the position vector of the intersection point, then
 
         P=A+r(B-A) or
 
         Px=Ax+r(Bx-Ax)
         Py=Ay+r(By-Ay)
 
     By examining the values of r & s, you can also determine some
     other limiting conditions:
 
         If 0<=r<=1 & 0<=s<=1, intersection exists
             r<0 or r>1 or s<0 or s>1 line segments do not intersect
 
         If the denominator in eqn 1 is zero, AB & CD are parallel
         If the numerator in eqn 1 is also zero, AB & CD are collinear.
 
     If they are collinear, then the segments may be projected to the x- 
     or y-axis, and overlap of the projected intervals checked.
 
     If the intersection point of the 2 lines are needed (lines in this
     context mean infinite lines) regardless whether the two line
     segments intersect, then
 
         If r>1, P is located on extension of AB
         If r<0, P is located on extension of BA
         If s>1, P is located on extension of CD
         If s<0, P is located on extension of DC
 
     Also note that the denominators of eqn 1 & 2 are identical.
 
     References:
           (Ay-Cy)(Dx-Cx)-(Ax-Cx)(Dy-Cy)
       r = -----------------------------  (eqn 1)
           (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)

           (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
       s = -----------------------------  (eqn 2)
           (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)
    */


    const denominator = (l1x2 - l1x1) * (l2y2 - l2y1) - (l1y2 - l1y1) * (l2x2 - l2x1);

    if (Math.floor(denominator) == 0) {
        return false;
    }

    const numeratorR = (l1y1 - l2y1) * (l2x2 - l2x1) - (l1x1 - l2x1) * (l2y2 - l2y1);
    const numeratorS = (l1y1 - l2y1) * (l1x2 - l1x1) - (l1x1 - l2x1) * (l1y2 - l1y1);
    const r = numeratorR / denominator;
    const s = numeratorS / denominator;

    if (r > 0 && r < 1 && s > 0 && s < 1)
        return true;

    return false;
}

// TODO: 2022-09-03 - D. Fox - Do we want this to be in a base class?
export function generateFactors(product) {
    const factors = [];
    var t = product
    var index = 0
    var sqt = Math.sqrt(t)
    while (t != 1) {
        var factor = primes[index]
        if ((t % factor) === 0) {
            factors.push(factor);
            t = t / factor;
            sqt = Math.sqrt(t)
        }
        else {
            index += 1;
            factor = primes[index];
            if (factor > sqt) {
                factors.push(t);
                return factors;
            }
        }
    }
    return factors;
}

export function sumTheFactors(theta, factors) {
    let sum = 0;

    for (let i = 0; i < factors.length; i++) {
        const f = factors[i];
        sum += Math.cos(f * theta);
    }


    if (sum < 0) {
        sum = -sum;
    }

    return sum;
}

export function randInt(upper, lower=0) {
    return Math.floor(Math.random() * (upper - lower) + lower);
}

export function randFloat(upper, lower=0) {
    return Math.random() * (upper - lower) + lower;
}

export function normalizeIndex(index, length) {
        if (index < 0) {
            return length - 1;
        } else if (index >= length) {
            return 0;
        }
        return index;
    }
