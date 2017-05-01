/**
 * Code copied and adapted from http://scaledinnovation.com/analytics/splines/aboutSplines.html
 * By Rob Spencer (thanks dude)
 */

/**
 * Draw a curve through points
 * @param {Array} coords - List of coordinates for points [x1, y1, x2, y2, ... ]
 * @param {Number} [tension=0.5] - The strength of control points
 * @param {Boolean} [closed=false] - If set to true, will close the curve
 */
CanvasRenderingContext2D.prototype.splineThrough = function(coords, tension, closed) {
    var sqrt = Math.sqrt,
        pow = Math.pow,
        sq = function(x) { return pow(x, 2); };

    tension = tension === undefined ? 0.5 : tension;

    function getControlPoints (x0, y0, x1, y1, x2, y2) {
        var d01 = sqrt(sq(x1 - x0) + sq(y1 - y0));
        var d12 = sqrt(sq(x2 - x1) + sq(y2 - y1));

        var fa = tension * d01 / (d01 + d12);
        var fb = tension - fa;

        var p1x = x1 + fa * (x0 - x2);
        var p1y = y1 + fa * (y0 - y2);

        var p2x = x1 - fb * (x0 - x2);
        var p2y = y1 - fb * (y0 - y2);

        return [p1x, p1y, p2x, p2y];
    }

    if (coords.length >= 6) {
        this.save();
        var cp = [],
            n = coords.length;

        if (closed) {
            //   Append and prepend knots and control points to close the curve
            coords.push(coords[0], coords[1], coords[2], coords[3]);
            coords.unshift(coords[n - 1]);
            coords.unshift(coords[n - 1]);
            for (let i = 0; i < n; i += 2) {
                cp = cp.concat(getControlPoints(coords[i], coords[i + 1], coords[i + 2], coords[i + 3], coords[i + 4], coords[i + 5]));
            }
            cp = cp.concat(cp[0], cp[1]);
            for (let i = 2; i < n + 2; i += 2) {
                this.moveTo(coords[i], coords[i + 1]);
                this.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1], coords[i + 2], coords[i + 3]);
            }
        }
        else {
            // Draw an open curve, not connected at the ends
            for (let i = 0; i < n - 4; i += 2) {
                cp = cp.concat(getControlPoints(coords[i], coords[i + 1], coords[i + 2], coords[i + 3], coords[i + 4], coords[i + 5]));
            }
            for (let i = 2; i < coords.length - 5; i += 2) {
                this.moveTo(coords[i], coords[i + 1]);
                this.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1], coords[i + 2], coords[i + 3]);
            }
            //  For open curves the first and last arcs are simple quadratics.
            this.moveTo(coords[0], coords[1]);
            this.quadraticCurveTo(cp[0], cp[1], coords[2], coords[3]);
            this.moveTo(coords[n - 2], coords[n - 1]);
            this.quadraticCurveTo(cp[2 * n - 10], cp[2 * n - 9], coords[n - 4], coords[n - 3]);
        }
        this.restore();
    }
    else if (coords.length >= 4) {
        this.moveTo(coords[0], coords[1]);
        this.lineTo(coords[2], coords[3]);
    }
};
