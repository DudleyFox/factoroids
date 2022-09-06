
const params = new URLSearchParams(window.location.search);

function getQueryVariable(variable, fallback = null) {
    return params.get(variable) || fallback;
}

function getQueryVariableInt(variable, fallback = null) {

    const result = params.get(variable);
    if (!!result) {
        const numeric = parseInt(result);
        if (numeric !== NaN) {
            return numeric;
        }
    }

    return fallback;
}

function coinToss() {
    return (Math.random() * 100 > 50) ? 1 : -1;
}

function distanceBetweenTwoPoints(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;

    dx = dx * dx;
    dy = dy * dy;

    return Math.sqrt(dx + dy);
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180.0;
}

function linesIntersect(l1x1, l1y1, l1x2, l1y2, l2x1, l2y1, l2x2, l2y2) {
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