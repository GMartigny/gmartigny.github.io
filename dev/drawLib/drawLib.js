
Utils = {
    PI: Math.PI,
    /**
     * Wrap a function call to put it in a context
     * @param {Function} func A function to call
     * @param {*} self A context for that function
     * @returns {*} Return an anonymous function to use
     */
    proxy: function(func, self){
        return function(){
            func.apply(self, arguments);
        };
    },
    /**
     * Throw an exception if an array is too short (used for arguments length)
     * @param {Array} array The array to mesure
     * @param {Number} asserted The minimal asserted length
     * @throws {TypeError} An error if array is too short
     */
    assertLength: function(array, asserted){
        if(array.length < asserted){
            throw new TypeError("Awaiting at least " + asserted + " arguments, only found " + array.length);
        }
    }
};
/**
 * Merge item from another object without overriding
 * @param {Object} other A set of items to merge to this
 */
Object.prototype.extends = function(other){
    for(var key in other){
        if(other.hasOwnProperty(key)){
            this[key] = other[key];
        }
    }
};

/**
 * Represent a display, can be fill with different shape and image
 * @param {HTMLElement} canvas The canvas element for drawing
 * @param {Set} options Global options for the scene
 * @returns {Scene}
 */
function Scene(canvas, options){
    Utils.assertLength(arguments, 1);

    this.context = canvas.getContext("2d");
    this.options = options || {
        fillColor: "#000",
        strokeColor: "#000",
        strokeWidth: 1
    };
    this.shapes = [];
    this.loop = false;
}
Scene.prototype = {
    startAnimation: function(){
        if(!this.loop){
            this.loop = true;
            this.render();
        }
    },
    stopAnimation: function(){
        this.loop = false;
    },
    render: function(){
        if(this.loop)
            requestAnimationFrame(Utils.proxy(this.render, this));

        var ctx = this.context;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.shapes.forEach(function(layer){
            layer.forEach((shape) => shape.draw(ctx));
        });
    },
    add: function(shape, zIndex){
        Utils.assertLength(arguments, 1);

        zIndex = zIndex || this.shapes.length;
        if(!this.shapes[zIndex])
            this.shapes[zIndex] = [];

        this.shapes[zIndex].push(shape);
        shape.completeOptions(this.options);
    },
    clear: function(){
        this.shapes = [];
    },
    center: function(){
        return new Position(this.width() / 2 <<0, this.height() / 2 <<0);
    },
    width: function(){
        return this.context.canvas.width;
    },
    height: function(){
        return this.context.canvas.height;
    }
};

/**
 * A couple of number for positionning
 * @param {Number} x The x value
 * @param {Number} y The y value
 * @param {Animation} animation [optional] The position animation
 * @returns {Position}
 */
function Position(x, y, animation){
    this.x = x || 0;
    this.y = y || 0;
    this.origin = {
        x: x,
        y: y
    };
    this.animation = animation || false;
    this.linked = [];
}
Position.createFrom = function(other){
    var pos;
    if(other instanceof Shape){
        pos = Position.createFrom(other.position);
        pos.relatedTo(other.position);
    }
    else if(other instanceof Position){
        pos = new Position(other.getX(), other.getY());
    }
    else{
        throw new TypeError("First argument should be type Shape or Position, but " + other.constructor.name + " given");
    }
    return pos;
};
Position.prototype = {
    getX: function(){
        return this.x;
    },
    getY: function(){
        return this.y;
    },
    setX: function(x){
        Utils.assertLength(arguments, 1);
        var diff = x - this.x;
        return this.addX(diff);
    },
    setY: function(y){
        Utils.assertLength(arguments, 1);
        var diff = y - this.y;
        return this.addY(diff);
    },
    addX: function(diff, override){
        diff = diff || 0;
        if(diff !== 0){
            this.x += diff;
            if(override)
                this.origin.x += diff;
            this.linked.forEach((link) => link.addX(diff, true));
        }
        return this;
    },
    addY: function(diff, override){
        diff = diff || 0;
        if(diff !== 0){
            this.y += diff;
            if(override)
                this.origin.y += diff;
            this.linked.forEach((link) => link.addY(diff, true));
        }
        return this;
    },
    setOrigin: function(x, y){
        this.origin.x = x;
        this.origin.y = y;
    },
    reset: function(){
        this.setX(this.origin.x);
        this.setY(this.origin.y);
    },
    animate: function(){
        if(this.animation)
            this.animation.run(this);
    },
    relatedTo: function(position){
        Utils.assertLength(arguments, 1);

        position.addLink(this);
    },
    addLink: function(position){
        Utils.assertLength(arguments, 1);

        this.linked.push(position);
    }
};

/**
 *
 * @param {Function} func A function to call for each iteration
 * @returns {Animation}
 */
function Animation(func){
    this.iteration = 0;
    this.func = func;
}
Animation.CIRCLE = function(speed, radius){
    Utils.assertLength(arguments, 2);
    return new Animation(function(i){
        this.setX(this.origin.x + Math.sin(-i * speed) * radius / 2);
        this.setY(this.origin.y + Math.cos(-i * speed) * radius / 2);
    });
};
Animation.GRAVITY = function(ground, bounce){
    Utils.assertLength(arguments, 1);
    bounce = bounce || 0.3;
    return new Animation(function(i){
        if(this.getY() >= ground && i > 0){
            this.setY(ground);
            this.animation.iteration = (-i * bounce)<<0;
        }
        else
            this.addY(0.09 * i);
    });
};
Animation.prototype = {
    run: function(position){
        this.func.call(position, this.iteration++);
    },
    restart: function(position){
        this.iteration = 0;
        position.reset();
    }
};

/**
 * A generic shape
 * @param {Position} point Its position on the scene
 * @param {Set} options Specific options for this shape
 * @returns {Shape}
 */
function Shape(point, options){
    Utils.assertLength(arguments, 1);

    if(point instanceof Shape){
        this.position = Position.createFrom(point);
    }
    else if(point instanceof Position){
        this.position = point;
    }
    else{
        throw new TypeError("Weird position");
    }

    this.options = options || {};
}
Shape.prototype = {
    draw: function(ctx){
        this.position.animate();
        ctx.beginPath();
        this.trace(ctx);
        this.fill(ctx);
        this.stroke(ctx);
        ctx.closePath();
    },
    fill: function(ctx){
        if(this.options.fillColor)
            ctx.fillStyle = this.options.fillColor;
        ctx.fill();
    },
    stroke: function(ctx){
        if(this.options.strokeColor){
            ctx.strokeStyle = this.options.strokeColor;
            ctx.lineWidth = this.options.strokeWidth || 1;
            ctx.stroke();
        }
    },
    animateWith: function(animation){
        this.position.animation = animation;
    },
    completeOptions: function(moreOptions){
        for(var key in moreOptions){
            if(moreOptions.hasOwnProperty(key) && !this.options[key]){
                this.options[key] = moreOptions[key];
            }
        }
    }
};

/**
 * A line between two point
 * @extends Shape
 * @param {Position|Shape} startPoint Its origin point or shape
 * @param {Position|Shape} endPoint Its arrivel point or shape
 * @param {Set} options Specific options for this line
 * @returns {Line}
 */
function Line(startPoint, endPoint, options){
    Utils.assertLength(arguments, 2);

    Shape.call(this, startPoint, options);
    this.startPoint = this.position;

    if(endPoint instanceof Shape){
        this.endPoint = Position.createFrom(endPoint);
    }
    else if(endPoint instanceof Position){
        this.endPoint = endPoint;
    }
}
Line.prototype = Object.create(Shape.prototype);
Line.prototype.extends({
    trace: function(ctx){
        ctx.moveTo(this.startPoint.getX(), this.startPoint.getY(ctx));
        ctx.lineTo(this.endPoint.getX(), this.endPoint.getY(ctx));
    },
    stroke: function(ctx){
        ctx.strokeStyle = this.options.strokeColor;
        ctx.lineWidth = this.options.strokeWidth || 1;
        ctx.stroke();
    }
});

/**
 * An arc shape between two points
 * @extends Shape
 * @param {Position|Shape} position Its position on the scene
 * @param {Number} radius The radius of the arc (in pixel)
 * @param {Number} startAngle The angle from to start the arc (in radian, 0 is north)
 * @param {Number} endAngle The angle where to end the arc (in radian, 0 is north)
 * @param {Boolean} clockwise The direction of rotation is clockwise (false for anti-clockwise)
 * @param {Set} options Specific options for this shape
 * @returns {Arc}
 */
function Arc(position, radius, startAngle, endAngle, clockwise, options){
    Utils.assertLength(arguments, 5);

    Shape.call(this, position, options);
    this.radius = radius;
    this.startAngle = startAngle || 0;
    this.endAngle = endAngle || 2 * Utils.PI;
    this.clockwise = !!clockwise;
}
Arc.prototype = Object.create(Shape.prototype);
Arc.prototype.extends({
    trace: function(ctx){
        ctx.arc(this.position.getX(ctx), this.position.getY(ctx), this.radius, this.startAngle, this.endAngle, !this.clockwise);
    }
});

/**
 * A circle shape
 * @extends Arc
 * @param {Position|Shape} position Its position on the scene
 * @param {Number} radius The radius of the circle (in pixel)
 * @param {Set} options Specific options for this shape
 * @returns {Circle}
 */
function Circle(position, radius, options){
    Utils.assertLength(arguments, 2);

    Arc.call(this, position, radius, 0, 2 * Utils.PI, true, options);
}
Circle.prototype = Object.create(Arc.prototype);

/**
 * A rectangle shape
 * @extends Shape
 * @param {Position|Shape} startPoint
 * @param {Number} width Width of the rectangle
 * @param {Number} height Height of the rectangle
 * @param {Set} options Specific options for this shape
 * @returns {Rectangle}
 */
function Rectangle(startPoint, width, height, options){
    Utils.assertLength(arguments, 2);

    Shape.call(this, startPoint, options);
    this.startPoint = this.position;
    this.endPoint = new Position(this.startPoint.getX() + width, this.startPoint.getY() + height);

    this.position = new Position(this.startPoint.getX() + (width / 2), this.startPoint.getY() + (height / 2));
}
Rectangle.FROM_TO = function(from, to, options){
    var rect = new Rectangle(from, 0, 0, options);
    rect.endPoint = Position.createFrom(to);
    return rect;
};
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.extends({
    trace: function(ctx){
        ctx.rect(
            this.startPoint.getX(), this.startPoint.getY(),
            this.endPoint.getX() - this.startPoint.getX(), this.endPoint.getY() - this.startPoint.getY()
        );
    }
});

/**
 * A regular (all side the same length) Rectangle
 * @extends Rectangle
 * @param {Position|Shape} startPoint
 * @param {Number} size
 * @param {Set} options
 * @returns {Square}
 */
function Square(startPoint, size, options){
    Utils.assertLength(arguments, 1);

    size = size || 0;
    Rectangle.call(this, startPoint, size, size, options);
}
Square.prototype = Object.create(Rectangle.prototype);

/**
 * A three point shape
 * @extends Shape
 * @param {Position|Shape} firstPoint
 * @param {Position|Shape} secondPoint
 * @param {Position|Shape} thirdPoint
 * @param {Set} options
 * @returns {Triangle}
 */
function Triangle(firstPoint, secondPoint, thirdPoint, options){
    Utils.assertLength(arguments, 3);

    Line.call(this, firstPoint, secondPoint, options);
    delete this.endPoint;

    if(thirdPoint instanceof Shape){
        this.thirdPoint = new Position(thirdPoint.position.getX(), thirdPoint.position.getY());
        this.thirdPoint.relatedTo(thirdPoint.position);
    }
    else if(thirdPoint instanceof Position){
        this.thirdPoint = thirdPoint;
    }
}
Triangle.prototype = Object.create(Shape.prototype);
