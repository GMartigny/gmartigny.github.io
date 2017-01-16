"use strict";

var SHOW_WIREFRAME = false;
var DEBUG = false;

/**
 * Simulation of a clothe
 * @class
 */
class Clothe {
    /**
     * Define a clothe
     * @param {CanvasRenderingContext2D} ctx - A drawing context
     * @param {Number} width - Width in number of nodes
     * @param {Number} height - Height in Number of nodes
     */
    constructor (ctx, width, height) {
        this.ctx = ctx;
        this.nodes = [];

        this.density = 0.5;

        this._init(width, height);
    };

    /**
     * Create node of the clothe
     * @param {Number} w -
     * @param {Number} h -
     * @private
     */
    _init (w, h) {
        this.nodes = [];
        var distance = 20;
        var margin = {
            x: (this.ctx.canvas.width - w * distance) / 2,
            y: (this.ctx.canvas.height - h * distance * Node.GRAVITY) / 2
        };

        for (var i = 0; i < h; ++i) { // Columns
            for (var j = 0; j < w; ++j) { // Lines
                let n = new Node(j * distance + margin.x, i * distance + margin.y);

                if (j !== 0) { // Not first Column
                    var left = this.nodes[(i * w) + (j - 1)];
                    n.linkTo(left);
                }

                if (i === 0) { // First line
                    n.stick();
                }
                else {
                    let top = this.nodes[((i - 1) * w) + j];
                    n.linkTo(top);

                    if (j !== 0) {
                        let topLeft = this.nodes[((i - 1) * w) + (j - 1)];
                        n.polygon = [top, topLeft, left];
                    }
                }

                this.nodes.push(n);
            }
        }
        
        this.render();
    };

    /**
     * Draw clothe (and loop)
     */
    render () {
        requestAnimationFrame(() => this.render());

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.nodes.forEach(n => n.move());
        this.nodes.forEach(n => n.render(this.ctx));

        this.nodes = this.nodes.filter(n => !n.removed);
    }
}
Clothe.COLOR_HUE = "22";
Clothe.COLOR_SAT = "85%";

/**
 * A node of a clothe
 * @class
 */
class Node {
    constructor (x, y) {
        this.id = Math.random().toString(36).slice(2);
        this.sticky = false;
        this.grabbed = false;
        this.removed = false;
        this.pos = {
            x: x,
            y: y
        };
        this.speed = {
            x: 0,
            y: 0
        };
        this.links = [];
        this.polygon = null;
    };

    /**
     * Make node unmovable
     */
    stick () {
        this.sticky = true;
    };

    /**
     * Tied two nodes together
     * @param {Node} other - Any other node
     */
    linkTo (other) {
        var lnk = new Link(this, other);
        this.links.push(lnk);
        other.links.push(lnk);
    };

    unlinkTo (other) {
        var index = this.links.findIndex(function(lnk) {
            return lnk.to.id === other.id;
        });
        this.links.splice(index, 1);
        if (this.links.length === 1) {
            this.links[0].breakIt();
            this.remove();
        }

        var thisId = this.id;
        index = other.links.findIndex(function(lnk) {
            return lnk.from.id === thisId;
        });
        other.links.splice(index, 1);
        if (other.links.length === 1) {
            other.links[0].breakIt();
            other.remove();
        }
    };

    remove () {
        this.removed = true;

    }

    /**
     * Draw the node into the context
     * @param {CanvasRenderingContext2D} ctx -
     */
    render (ctx) {
        // draw node
        if (SHOW_WIREFRAME) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, Node.SIZE, 0, Math.PI*2);
            ctx.fillStyle = "#333";
            ctx.fill();

            if (DEBUG) {
                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(this.pos.x + (this.speed.x * 10), this.pos.y + (this.speed.y * 10));
                ctx.closePath();
                ctx.strokeStyle = "#F33";
                ctx.stroke();
            }
        }
        else if (this.links.length) {

            if (this.polygon) {
                var filtered = this.polygon.filter(point => !point.removed);
                if (filtered.length < 3) {
                    this.polygon = null;
                }
            }

            if (this.polygon) {
                var luminosity = 100 - (Quadri.area(this, this.polygon[0], this.polygon[1], this.polygon[2]) / 30 + 25);
                if (luminosity > 80) {
                    luminosity = 80;
                }
                else if (luminosity < 20) {
                    luminosity = 20;
                }

                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);

                this.polygon.forEach(function(point) {
                    if (!point.removed) {
                        ctx.lineTo(point.pos.x, point.pos.y);
                    }
                    else {
                    }
                });

                var color = "hsl(" + Clothe.COLOR_HUE + ", " + Clothe.COLOR_SAT + ", " + luminosity + "%)";
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.fill();
            }
        }

        // draw links => will apply tension to node
        this.links.forEach(lnk => lnk.render(ctx));
    };

    /**
     * Apply speed to position
     */
    move () {
        if (!this.sticky) {
            if (this.grabbed) {
                this.pos.x = Mouse.pos.x;
                this.pos.y = Mouse.pos.y;

                this.speed.x = 0;
                this.speed.y = 0;
            }
            else {
                // move position according to speed
                this.pos.x += this.speed.x;
                this.pos.y += this.speed.y;

                // add gravity
                this.speed.y += Node.GRAVITY / 10;

                // add wind
                this.speed.x += (Wind.x * Math.random()) / 2.5;
                this.speed.y += (Wind.y * Math.random()) / 2.5;

                // air friction
                this.speed.x *= 1 - Node.FRICTION;
                this.speed.y *= 1 - Node.FRICTION;
            }

            if (!Mouse.busy) {
                if (Mouse.pressed && Node.distance(this, Mouse) < Node.SIZE) {
                    this.grabbed = true;
                    Mouse.busy = true;
                }
                else {
                    this.grabbed = false;
                }
            }
        }
        else {
            this.speed.x = 0;
            this.speed.y = 0;
        }
    };

    /**
     * Compute distance between two nodes
     * @param {Node} from - Any node
     * @param {Node} to - Any node
     * @return {number}
     */
    static distance (from, to) {
        return Math.sqrt(Math.pow((from.pos.x - to.pos.x), 2) + Math.pow((from.pos.y - to.pos.y), 2));
    };
}
Node.SIZE = 4;
Node.FRICTION = 0.04; // 0 no friction
Node.GRAVITY = 1.4;

/**
 * A link between two nodes
 * @class
 */
class Link {
    constructor (from, to) {
        this.from = from;
        this.to = to;
        this.length = Node.distance(from, to);
    };

    /**
     * Draw the link into the context
     * @param {CanvasRenderingContext2D} ctx - The rendering context
     */
    render (ctx) {
        // draw this link
        ctx.beginPath();
        ctx.moveTo(this.from.pos.x, this.from.pos.y);
        ctx.lineTo(this.to.pos.x, this.to.pos.y);
        ctx.lineWidth = Link.SIZE;
        if (SHOW_WIREFRAME) {
            ctx.strokeStyle = "#333";
        }
        ctx.stroke();
        ctx.closePath();

        var tension = this.getTension();
        // X
        if (this.from.pos.x < this.to.pos.x) {
            this.from.speed.x += tension.x / 4;
            this.to.speed.x -= tension.x / 4;
        }
        else {
            this.from.speed.x -= tension.x / 4;
            this.to.speed.x += tension.x / 4;
        }
        // Y
        if (this.from.pos.y < this.to.pos.y) {
            this.from.speed.y += tension.y / 4;
            this.to.speed.y -= tension.y / 4;
        }
        else {
            this.from.speed.y -= tension.y / 4;
            this.to.speed.y += tension.y / 4;
        }
    };

    /**
     * Get the tension force of this link
     * @return {{x: number, y: number}}
     */
    getTension () {
        var tension = {
            x: 0,
            y: 0
        };
        var distance = Node.distance(this.from, this.to);

        if (distance > this.length) {
            if (distance > this.length * Link.RESISTANCE) {
                this.breakIt();
            }
            else {
                var ratio = (distance - this.length) * Link.STIFFNESS * 0.005;

                tension.x = Math.abs(this.from.pos.x - this.to.pos.x) * ratio;
                tension.y = Math.abs(this.from.pos.y - this.to.pos.y) * ratio;
            }
        }

        return tension;
    };

    /**
     * Return the opposite of a node
     * @param {Node} node - One of the link's node
     * @return {Node}
     */
    getOther (node) {
        if (node.id === this.from.id) {
            return this.to;
        }
        else if (node.id === this.to.id) {
            return this.from;
        }
    }

    /**
     * Break the link
     */
    breakIt () {
        this.from.unlinkTo(this.to);
    };
}
Link.SIZE = 1; // Drawing size
Link.STIFFNESS = 5; // Resistance to elongation (high values lead to bug)
Link.RESISTANCE = 3; // Can elongate by

var Wind = (function() {

    var vector = {
        x: 0,
        y: 0
    };
    var arrowKeys = [37, 38, 39, 40];
    var pressed = [];

    window.addEventListener("keydown", function(e) {
        var keyCode = e.keyCode;
        if (arrowKeys.includes(keyCode) && !pressed.includes(keyCode)) {
            pressed.push(keyCode);
            switch (keyCode) {
                case 39: // right
                    vector.x += 1;
                    break;
                case 37: // left
                    vector.x -= 1;
                    break;
                case 38: // up
                    vector.y -= 1;
                    break;
                case 40: // down
                    vector.y += 1;
            }
        }
    });
    window.addEventListener("keyup", function(e) {
        var keyCode = e.keyCode;
        var keyIndex = pressed.indexOf(keyCode);
        if (arrowKeys.includes(keyCode) && keyCode >= 0) {
            pressed.splice(keyIndex, 1);
            switch (keyCode) {
                case 39: // right
                    vector.x -= 1;
                    break;
                case 37: // left
                    vector.x += 1;
                    break;
                case 38: // up
                    vector.y += 1;
                    break;
                case 40: // down
                    vector.y -= 1;
            }
        }
    });

    return vector;
})();

var Mouse = (function() {

    var data = {
        pos: {
            x: 0,
            y: 0
        },
        pressed: false,
        busy: false
    };

    window.addEventListener("mousemove", function(e) {
        data.pos.x = e.clientX;
        data.pos.y = e.clientY;
    });
    window.addEventListener("mousedown", function() {
        data.pressed = true;
    });
    window.addEventListener("mouseup", function() {
        data.pressed = false;
        data.busy = false;
    });

    return data;
})();

var Triangle = (function() {
    return {
        area: function(p1, p2, p3) {
            var side1 = Node.distance(p1, p2);
            var side2 = Node.distance(p2, p3);
            var side3 = Node.distance(p3, p1);
            var halfPerimeter = (side1 + side2 + side3) / 2;

            return Math.sqrt(halfPerimeter * (halfPerimeter - side1) * (halfPerimeter - side2) * (halfPerimeter - side3));
        }
    };
})();

var Quadri = (function() {
    return {
        area: function(p1, p2, p3, p4) {
            return Math.abs((p1.pos.x - p3.pos.x) * (p2.pos.y - p4.pos.y)) + Math.abs((p2.pos.x - p4.pos.x) * (p1.pos.y - p3.pos.y));
        }
    };
})();
