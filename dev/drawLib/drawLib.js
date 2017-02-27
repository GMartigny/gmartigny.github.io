var Utils = {
    PI: Math.PI,
    sin: Math.sin,
    cos: Math.cos,
    sq: function(x) {
        return Math.pow(x, 2);
    },
    sqrt: Math.sqrt,
    rand: Math.random,
    floor: function(x) {
        return x | 0;
    },
    round: function(x) {
        return this.floor(x + .5);
    },
    ceil: function(x) {
        return this.floor(x + 1);
    },
    random: function(max) {
        return this.round(this.rand() * max);
    },
    /**
     * Create a class prototype from a parent
     * @param {Object} self - An object needing a prototype
     * @param {Object} parent - A parent to draw prototype from
     * @param {Object} override - A map like object with overrides
     */
    extends: function(self, parent, override) {
        if (parent) {
            self.prototype = Object.create(parent.prototype);
        }
        if (override) {
            for (var func in override) {
                if (override.hasOwnProperty(func)) {
                    if (self.prototype[func]) {
                        self.prototype["_" + func] = self.prototype[func];
                    }
                    self.prototype[func] = override[func];
                }
            }
        }
    },
    /**
     * Throw an exception if an array is too short (used for arguments length)
     * @param {Array} array The array to mesure
     * @param {Number} asserted The minimal asserted length
     * @throws {TypeError} An error if array is too short
     */
    assertLength: function(array, asserted) {
        if (array.length < asserted) {
            throw new TypeError("Awaiting at least " + asserted + " arguments, only found " + array.length);
        }
    }
};

/**
 * Represent a display, can be fill with different shape and image
 * @param {HTMLElement} canvas - The canvas element for drawing
 * @param {Object} [options] - Global options for the scene
 * @constructor
 */
function Scene (canvas, options) {
    Utils.assertLength(arguments, 1);

    this.context = canvas.getContext("2d");
    this.options = options || {};
    this.shapes = [];
    this.loop = false;
}
Scene.prototype = {
    /**
     * Start all animations
     */
    startAnimation: function() {
        if (!this.loop) {
            this.loop = true;
            this.render();
        }
    },
    /**
     * Stop all animations
     */
    stopAnimation: function() {
        this.loop = false;
    },
    /**
     * Draw the scene once
     */
    render: function() {
        if (this.loop) {
            requestAnimationFrame(this.render.bind(this));
        }

        var ctx = this.context;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.shapes.forEach(function(layer) {
            layer.forEach((shape) => shape.render(ctx));
        });
    },
    /**
     * Add a shape to the scene
     * @param {Shape} shape - Any shape
     * @param {Number} [zIndex=0] - Used to define a drawing order, should be a positive integer
     */
    add: function(shape, zIndex) {
        Utils.assertLength(arguments, 1);

        zIndex = zIndex || 0;
        if (!this.shapes[zIndex]) {
            this.shapes[zIndex] = [];
        }

        this.shapes[zIndex].push(shape);
        shape.completeOptions(this.options);
    },
    /**
     * Add a background color to the scene
     * @param {String} color - Any color string
     */
    background: function(color) {
        this.context.canvas.style.backgroundColor = color;
    },
    /**
     * Remove all shape from scene
     */
    clear: function() {
        this.shapes = [];
    },
    /**
     * Return the center of the scene
     * @return {Position}
     */
    center: function() {
        return new Position(Utils.floor(this.width() / 2), Utils.floor(this.height() / 2));
    },
    randomPosition: function() {
        return new Position(Utils.random(this.width()), Utils.random(this.height()));
    },
    /**
     * Get the width of the scene
     * @return {Number}
     */
    width: function() {
        return this.context.canvas.width;
    },
    /**
     * Get the height of the scene
     * @return {Number}
     */
    height: function() {
        return this.context.canvas.height;
    }
};

/**
 * A couple of number for positioning
 * @param {Number} x - The x value
 * @param {Number} y - The y value
 * @param {Animation} [animation] - The position animation
 * @constructor
 */
function Position (x, y, animation) {
    this.x = x || 0;
    this.y = y || 0;
    this.origin = {
        x: this.x,
        y: this.y
    };
    this.animation = animation || false;
    this.linked = [];
    this.isLinked = false;
}
/**
 * Return a new position from a shape or a position
 * @param {Position|Shape} other - A reference for a new position, automatically linked
 * @return {Position}
 */
Position.createFrom = function(other) {
    var pos;
    if (other instanceof Shape) {
        pos = Position.createFrom(other.position);
    }
    else if (other instanceof Position) {
        pos = new Position(other.getX(), other.getY());
        other.addLink(pos);
    }
    else {
        throw new TypeError("First argument should be type Shape or Position, but " + other.constructor.name + " given");
    }
    return pos;
};
Position.prototype = {
    /**
     * Get the x value
     * @return {Number}
     */
    getX: function() {
        return this.x;
    },
    /**
     * Get the y value
     * @return {Number}
     */
    getY: function() {
        return this.y;
    },
    /**
     * Set a new value for x and move linked positions
     * @param {Number} x - The new x value
     * @call addX
     * @return {Position} Itself
     */
    setX: function(x) {
        Utils.assertLength(arguments, 1);
        var diff = x - this.x;
        return this.addX(diff);
    },
    /**
     * Set a new value for y and move linked positions
     * @param {Number} y - The new y value
     * @call addY
     * @return {Position} Itself
     */
    setY: function(y) {
        Utils.assertLength(arguments, 1);
        var diff = y - this.y;
        return this.addY(diff);
    },
    /**
     * Add to the x value
     * @param {Number} diff - How much to add
     * @param {Boolean} [override=false] - If true, will change the origin value
     * @return {Position} Itself
     */
    addX: function(diff, override) {
        diff = diff || 0;
        if (diff !== 0) {
            this.x += diff;
            if (override) {
                this.origin.x += diff;
            }
            this.linked.forEach((link) => link.addX(diff, true));
        }
        return this;
    },
    /**
     * Add to the y value
     * @param {Number} diff - How much to add
     * @param {Boolean} [override=false] - If true, will change the origin value
     * @return {Position} Itself
     */
    addY: function(diff, override) {
        diff = diff || 0;
        if (diff !== 0) {
            this.y += diff;
            if (override) {
                this.origin.y += diff;
            }
            this.linked.forEach((link) => link.addY(diff, true));
        }
        return this;
    },
    /**
     * Define the origin of the position
     * @param {Number} x - A x value
     * @param {Number} y - A y value
     * @return {Position} Itself
     */
    setOrigin: function(x, y) {
        this.x = x + (this.x - this.origin.x);
        this.y = y + (this.y - this.origin.y);
        this.origin.x = x;
        this.origin.y = y;
        return this;
    },
    /**
     * Return a position to its origin
     * @return {Position} Itself
     */
    reset: function() {
        return this.setX(this.origin.x).setY(this.origin.y);
    },
    /**
     * Define an animation to apply to this position
     * @param {Animation} animation -
     * @return {Position} Itself
     */
    animateWith: function(animation) {
        this.animation = animation;
        return this;
    },
    /**
     * Run the animation of this position
     * @param {CanvasRenderingContext2D} ctx - The rendering context
     * @return {Position} Itself
     */
    animate: function(ctx) {
        if (this.animation) {
            this.animation.run(this, ctx);
        }
        return this;
    },
    /**
     * Link a position to this one
     * @param {Position} position - Another position to link, will be moved alongside this position
     */
    addLink: function(position) {
        Utils.assertLength(arguments, 1);

        position.isLinked = true;
        this.linked.push(position);
    }
};

/**
 * Modify a position with a constant function
 * @param {Function} func - A function to call for each iteration
 * @constructor
 */
function Animation (func) {
    this.iteration = 0;
    this.func = func;
}
/**
 * Give an animation for circling
 * @param {Number} radius - Radius of the circling
 * @param {Number} [speed=0.1] - Speed ratio of the animation
 * @param {Boolean} [counterClockWise=false] - Circle counter clockwise
 * @return {Animation}
 */
Animation.Circle = function(radius, speed, counterClockWise) {
    Utils.assertLength(arguments, 1);
    speed = speed || .1;
    return new Animation(function(i) {
        var rotation = counterClockWise ? i * speed : -i * speed;
        this.setX(this.origin.x + Utils.sin(rotation) * radius);
        this.setY(this.origin.y + Utils.cos(rotation) * radius);
    });
};
/**
 * Give an animation for rotation
 * @param {Number} [speed=0.1] - Speed ratio of the animation
 * @param {Boolean} [counterClockWise=false] - Rotate counter clockwise
 * @return {Animation}
 */
Animation.Rotate = function(speed, counterClockWise) {
    speed = speed || .1;
    return new Animation(function(i, ctx) {
        ctx.translate(this.getX(), this.getY());
        var rotation = counterClockWise ? -i * speed : i * speed;
        ctx.rotate(rotation);
        ctx.translate(-this.getX(), -this.getY());
    });
};
/**
 * Give an animation of gravity simulation
 * @param {Number} [ground] - Value where position bounce
 * @param {Number} [bounce=0.3] - Vertical restitution of bounce (0 = no bounce, 1 = infinite bounce)
 * @return {Animation}
 */
Animation.Gravity = function(ground, bounce) {
    bounce = bounce === undefined ? 0.3 : bounce;
    return new Animation(function(i, ctx) {
        ground = ground || ctx.canvas.height;
        if (this.getY() >= ground && i > 0) {
            this.setY(ground);
            this.animation.iteration = Utils.floor(-i * bounce);
        }
        else {
            this.addY(0.09 * i);
        }
    });
};
Animation.prototype = {
    /**
     * Apply this animation function to a position
     * @param {Position} position - A position to move
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    run: function(position, ctx) {
        this.func.call(position, this.iteration++, ctx);
    },
    /**
     * Restart this animation
     * @param {Position} position - A position to set
     */
    restart: function(position) {
        this.iteration = 0;
        position.reset();
    }
};

/**
 * A generic shape
 * @param {Position|Shape} position - Its position on the scene
 * @param {Object} options - Specific options for this shape
 * @constructor
 */
function Shape (position, options) {
    Utils.assertLength(arguments, 1);

    this.position = Position.createFrom(position);

    this.options = options || {};
}
Shape.prototype = {
    /**
     * Move and draw the shape
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    render: function(ctx) {
        ctx.save();
        this.position.animate(ctx);
        this.draw(ctx);
        ctx.restore();
    },
    /**
     * Draw the shape into the context
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    draw: function(ctx) {
        ctx.beginPath();
        this.trace(ctx);
        this.fill(ctx);
        this.stroke(ctx);
        ctx.closePath();
        if (this.options.debug) {
            ctx.fillStyle = "#F33";
            ctx.fillRect(this.position.getX() - 1, this.position.getY() - 1, 2, 2);
        }
    },
    /**
     * Make the drawing pen movements
     * This function should be implemented by each shape instance
     */
    trace: function() {
        throw new EvalError("Unimplemented function trace called");
    },
    /**
     * Fill the shape with its color
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    fill: function(ctx) {
        if (this.options.fillColor) {
            ctx.fillStyle = this.options.fillColor;
            ctx.fill();
        }
    },
    /**
     * Stroke the contour of the shape
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    stroke: function(ctx) {
        if (this.options.strokeColor) {
            ctx.strokeStyle = this.options.strokeColor;
            ctx.lineWidth = this.options.strokeWidth || 1;
            ctx.stroke();
        }
    },
    /**
     * Animate this shape position with an animation
     * @param {Animation} animation - Any animation
     */
    animateWith: function(animation) {
        this.position.animateWith(animation);
    },
    /**
     * Add options to the shape without override
     * @param {Object} moreOptions - A map like object
     */
    completeOptions: function(moreOptions) {
        for (var key in moreOptions) {
            if (moreOptions.hasOwnProperty(key) && this.options[key] === undefined) {
                this.options[key] = moreOptions[key];
            }
        }
    }
};

/**
 * A shape from multiple point
 * @extends Shape
 * @param {Array<Position|Shape>} points - A list of points
 * @param {Object} options - Specific options for this shape
 * @constructor
 */
function Polygon (points, options) {
    Utils.assertLength(arguments, 1);
    Utils.assertLength(points, 1);

    this.position = new Position();
    this.options = options || {};
    this.points = [];
    this.isLinkedToOthers = false;

    var sumX = 0;
    var sumY = 0;
    var l = points.length;
    for (var i = 0; i < l; ++i) {
        var p;
        if (points[i] instanceof Shape) {
            this.isLinkedToOthers = true;
            p = Position.createFrom(points[i]);
        }
        else if (points[i] instanceof Position) {
            p = points[i];
        }
        if (p) {
            sumX += p.getX();
            sumY += p.getY();
            this.position.addLink(p);
            this.points.push(p);
        }
        else {
            throw new TypeError("Polygon can only link positions or shapes, but " + points[i].constructor.name + " given.");
        }
    }
    this.position.setOrigin(sumX / l, sumY / l);
}
Utils.extends(Polygon, Shape, /** @lends Polygon.prototype */ {
    /**
     * Trace the polygon
     * @override Shape.trace
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    trace: function(ctx) {
        var first = this.points[0];
        ctx.moveTo(first.getX(), first.getY());

        for (var i = 1, l = this.points.length; i < l; ++i) {
            var p = this.points[i];
            ctx.lineTo(p.getX(), p.getY());
        }

        ctx.lineTo(first.getX(), first.getY());
    },
    /**
     * Check if polygon can be animated
     * @override Shape.animateWith
     * @param {Animation} animation - Any animation
     */
    animateWith: function(animation) {
        if (this.isLinkedToOthers) {
            throw new ReferenceError("Can't animate polygon with link to other.");
        }
        else {
            this._animateWith(animation);
        }
    }
});

/**
 * A shape from multiple point with rounded angle
 * @param {Array<Position|Shape>} points - A list of points
 * @param {Number} tension - Define the roundness of the blob
 * @param {Object} options - Specific options for this shape
 * @constructor
 */
function Blob (points, tension, options) {
    this.tension = tension || 0.5;

    Polygon.call(this, points, options);
}
/**
 * Return an array of coordinates for control points around a point
 * @param {Position} p0 - Previous point
 * @param {Position} p1 - Current point
 * @param {Position} p2 - Next Point
 * @param {Number} tension - Roundness of angles
 * @return {Array<Number>}
 * @private
 * @static
 */
Blob._getControlPoints = function (p0, p1, p2, tension) {
    var x0 = p0.getX();
    var x1 = p1.getX();
    var x2 = p2.getX();
    var y0 = p0.getY();
    var y1 = p1.getY();
    var y2 = p2.getY();

    var d01 = Utils.sqrt(Utils.sq(x1 - x0) + Utils.sq(y1 - y0));
    var d12 = Utils.sqrt(Utils.sq(x2 - x1) + Utils.sq(y2 - y1));

    var fa = tension * d01 / (d01 + d12);
    var fb = tension - fa;

    var p1x = x1 + fa * (x0 - x2);
    var p1y = y1 + fa * (y0 - y2);

    var p2x = x1 - fb * (x0 - x2);
    var p2y = y1 - fb * (y0 - y2);

    return [p1x, p1y, p2x, p2y];
};
Utils.extends(Blob, Polygon, /** @lends Blob.prototype */ {
    /**
     * Trace the blob
     * @override Polygon.trace
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    trace: function(ctx) {
        var cp = [];
        var n = this.points.length;
        for (var i = 0; i < n; ++i) {
            cp[(i + 1) % n] = Blob._getControlPoints(this.points[i], this.points[(i + 1) % n], this.points[(i + 2) % n], this.tension);
        }
        ctx.moveTo(this.points[0].getX(), this.points[0].getY());
        for (i = 0; i < n; ++i) {
            ctx.bezierCurveTo(
                cp[i][2], cp[i][3],
                cp[(i + 1) % n][0], cp[(i + 1) % n][1],
                this.points[(i + 1) % n].getX(), this.points[(i + 1) % n].getY()
            );
        }
    }
});

/**
 * A line between two point
 * @extends Shape
 * @param {Position|Shape} startPoint - Its origin point or shape
 * @param {Position|Shape} endPoint - Its arrival point or shape
 * @param {Object} options - Specific options for this line
 * @constructor
 */
function Line (startPoint, endPoint, options) {
    Utils.assertLength(arguments, 2);

    Polygon.call(this, [startPoint, endPoint], options);
}
Utils.extends(Line, Polygon, /** @lends Line.prototype */ {
    /**
     * One can't fill a line
     * @override Polygon.fill
     */
    fill: function() {}
});

/**
 * An arc shape between two points
 * @extends Shape
 * @param {Position|Shape} position - Its position on the scene
 * @param {Number} radius - The radius of the arc (in pixel)
 * @param {Number} [startAngle=0] - The angle from to start the arc (in radian, 0 is north)
 * @param {Number} [endAngle=PI] - The angle where to end the arc (in radian, 0 is north)
 * @param {Boolean} [clockwise=false] - The direction of rotation is clockwise (false for anti-clockwise)
 * @param {Object} [options] - Specific options for this shape
 * @constructor
 */
function Arc (position, radius, startAngle, endAngle, clockwise, options) {
    Utils.assertLength(arguments, 2);

    Shape.call(this, position, options);
    this.radius = radius;
    this.startAngle = startAngle || 0;
    this.endAngle = endAngle || Utils.PI;
    this.clockwise = !!clockwise;
}
Utils.extends(Arc, Shape, /** @lends Arc.prototype */ {
    /**
     * Trace the arc
     * @override Shape.trace
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    trace: function(ctx) {
        ctx.arc(this.position.getX(), this.position.getY(), this.radius, this.startAngle, this.endAngle, !this.clockwise);
    }
});

/**
 * A circle shape
 * @extends Arc
 * @param {Position|Shape} position - Its position on the scene
 * @param {Number} radius - The radius of the circle (in pixel)
 * @param {Object} [options] - Specific options for this shape
 * @constructor
 */
function Circle (position, radius, options) {
    Utils.assertLength(arguments, 2);

    Arc.call(this, position, radius, 0, 2 * Utils.PI, true, options);
}
Utils.extends(Circle, Arc);

/**
 * A rectangular shape
 * @extends Shape
 * @param {Position|Shape} startPoint - Position of the upper-left corner
 * @param {Number} width - Width of the rectangle
 * @param {Number} height - Height of the rectangle
 * @param {Object} options - Specific options for this shape
 * @constructor
 */
function Rectangle (startPoint, width, height, options) {
    Utils.assertLength(arguments, 2);
    
    this.startPoint = Position.createFrom(startPoint);
    this.endPoint = new Position(this.startPoint.getX() + width, this.startPoint.getY() + height);

    Polygon.call(this, [this.startPoint, this.endPoint], options);
}
/**
 * Create a rectangle between two point
 * @param {Position|Shape} from - Top-left point
 * @param {Position|Shape} to - Bottom-right point
 * @param {Object} options - Specific options for this shape
 * @return {Rectangle}
 */
Rectangle.fromPointToPoint = function(from, to, options) {
    var rect = new Rectangle(from, 0, 0, options);
    rect.endPoint = Position.createFrom(to);
    rect.isLinkedToOthers = true;
    return rect;
};
Utils.extends(Rectangle, Shape, /** @lends Rectangle.prototype */{
    /**
     * Trace the rectangle
     * @override Shape.trace
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    trace: function(ctx) {
        ctx.rect(this.startPoint.getX(), this.startPoint.getY(),
            this.endPoint.getX() - this.startPoint.getX(),
            this.endPoint.getY() - this.startPoint.getY()
        );
    },
    /**
     *
     * @param {Number} value -
     * @return {Rectangle} Itself
     */
    setWidth: function(value) {
        this.endPoint.setX(this.startPoint.getX() + value);
        return this;
    },
    /**
     *
     * @param {Number} value -
     * @return {Rectangle} Itself
     */
    setHeight: function(value) {
        this.endPoint.setY(this.startPoint.getY() + value);
        return this;
    }
});

/**
 * A regular (all side the same length) Rectangle
 * @extends Rectangle
 * @param {Position|Shape} startPoint - Position of the upper-left corner
 * @param {Number} size - Length of the sides (in pixels)
 * @param {Object} [options] - Specific options for this shape
 * @constructor
 */
function Square (startPoint, size, options) {
    Utils.assertLength(arguments, 2);

    Rectangle.call(this, startPoint, size, size, options);
}
Utils.extends(Square, Rectangle);

/**
 * A three point shape
 * @extends Polygon
 * @param {Position|Shape} firstPoint -
 * @param {Position|Shape} secondPoint -
 * @param {Position|Shape} thirdPoint -
 * @param {Object} options - Specific options for this shape
 * @constructor
 */
function Triangle (firstPoint, secondPoint, thirdPoint, options) {
    Utils.assertLength(arguments, 3);

    Polygon.call(this, [firstPoint, secondPoint, thirdPoint], options);
}
Utils.extends(Triangle, Polygon);

/**
 * Draw a text
 * @extends Shape
 * @param {String} text - Content of the text
 * @param {Position|Shape} position - Position
 * @param {Object} options - Specific options for this shape
 * @constructor
 */
function Text (text, position, options) {
    Utils.assertLength(arguments, 2);

    this.text = text;
    Shape.call(this, position, options);
}
Utils.extends(Text, Shape, /** @lends Text.prototype */ {
    /**
     * Trace the text
     * @override Shape.trace
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    trace: function(ctx) {
        ctx.font = this.options.font || "10px sans-serif";
        ctx.textAlign = this.options.align || "left";
        ctx.textBaseline = this.options.baseline || "alphabetic";
    },
    /**
     * Fill the text
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    fill: function(ctx) {
        if (this.options.fillColor) {
            ctx.fillStyle = this.options.fillColor;
            ctx.translate(this.position.getX(), this.position.getY());
            ctx.fillText(this.text, 0, 0);
        }
    },
    /**
     * Stroke the text outline
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     */
    stroke: function(ctx) {
        if (this.options.strokeColor) {
            ctx.strokeStyle = this.options.strokeColor;
            ctx.lineWidth = this.options.strokeWidth;
            ctx.translate(this.position.getX(), this.position.getY());
            ctx.strokeText(this.text, 0, 0);
        }
    }
});
