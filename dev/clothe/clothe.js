"use strict";

var Global = {
    wireframe: 0, // Show wireframe mode
    color_hue: 10, // Color hue of the clothe
    color_sat: 70, // color saturation of the clothe
    gravity: 1.5, // Gravity to apply to nodes
    link_stiffness: 5, // Resistance to elongation (high values lead to bug)
    link_elongation: 3 // Maximum ratio for link elongation
};

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
        this.width = width;
        this.height = height;
        this.margin = {
            x: (this.ctx.canvas.width - width * Clothe.DENSITY) / 2,
            y: (this.ctx.canvas.height - height * Clothe.DENSITY * Global.gravity) / 2
        };

        var fpsNode = document.getElementById("fps");
        this.fps = new FPS(function(fps) {
            fpsNode.textContent = fps;
        }, 500);

        this.init();
        this.render();
    };

    /**
     * Create node of the clothe
     */
    init () {
        var w = this.width;
        var h = this.height;
        this.nodes = [];

        for (var i = 0; i < h; ++i) { // Columns
            for (var j = 0; j < w; ++j) { // Lines
                let n = new Node(j * Clothe.DENSITY + this.margin.x, i * Clothe.DENSITY + this.margin.y);

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
    };

    /**
     * Draw clothe (and loop)
     */
    render () {
        this.fps.update();
        requestAnimationFrame(() => this.render());

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        var closestToMouse = this.nodes[0];
        var distanceToClosest = Infinity;
        this.nodes.forEach(function(node) {
            node.move();
            node.grabbed = false;
            let dist = Node.distance(Mouse, node);
            if (dist < distanceToClosest) {
                closestToMouse = node;
                distanceToClosest = dist;
            }
        });
        if (Mouse.pressed && !Mouse.busy && distanceToClosest < Clothe.DENSITY) {
            closestToMouse.grabbed = true;
        }
        this.nodes.forEach(n => n.render(this.ctx));

        this.nodes = this.nodes.filter(n => !n.removed);
    }
}
Clothe.DENSITY = 20;

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
     * Tie two nodes together
     * @param {Node} other - Any other node
     */
    linkTo (other) {
        var lnk = new Link(this, other);
        this.links.push(lnk);
        other.links.push(lnk);
    };

    /**
     * Determine if this node is linked to another
     * @param {Node} other - Any other node
     * @return {Boolean|String} - Return false if not linked and the index otherwise
     */
    isLinkedTo (other) {
        var self = this;
        var index = this.links.findIndex(function(lnk) {
            return lnk.getOther(self).id === other.id;
        });
        if (index < 0) {
            return false;
        }
        else {
            return index + "";
        }
    }

    /**
     * Untie from another node
     * @param {Node} other - Any other node
     * @param {Boolean} isReversal - Set to true if it's reverse call
     */
    unlinkTo (other, isReversal) {
        var index = this.isLinkedTo(other);
        if (index) {
            var minLink = 2;
            this.links.splice(+index, 1);
            if (this.links.length < minLink) {
                this.remove();
            }

            if (!isReversal) {
                other.unlinkTo(this, true);
            }
        }
    };

    /**
     * Set this node for removal
     */
    remove () {
        this.links.forEach(lnk => lnk.breakIt());
        this.removed = true;
    }

    /**
     * Draw the node into the context
     * @param {CanvasRenderingContext2D} ctx -
     */
    render (ctx) {
        // draw node
        if (Global.wireframe) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, Node.SIZE, 0, Math.PI*2);
            ctx.fillStyle = "#333";
            ctx.fill();
        }
        else if (this.links.length) {

            if (this.polygon) {
                var broke = false;
                var previous = this;
                for (var i = 0, l = this.polygon.length; i < l; ++i) {
                    var point = this.polygon[i];
                    if (point.removed || !point.isLinkedTo(previous)) {
                        broke = true;
                    }
                    previous = point;
                }
                broke = broke || !previous.isLinkedTo(this);
                if (broke) {
                    this.polygon = null;
                }
            }

            if (this.polygon) {
                var luminosity = 100 - (Quadri.area(this, this.polygon[0], this.polygon[1], this.polygon[2]) / (Clothe.DENSITY * 1.5) + 30);
                if (luminosity > 90) {
                    luminosity = 90;
                }
                else if (luminosity < 20) {
                    luminosity = 20;
                }

                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);

                var self = this;
                this.polygon.forEach(function(point) {
                    ctx.lineTo(point.pos.x, point.pos.y);
                });

                var color = "hsl(" + Global.color_hue + ", " + Global.color_sat + "%, " + luminosity + "%)";
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
                this.speed.y += Global.gravity / 10;

                // add wind
                this.speed.x += (Wind.x * Math.random()) / 2.5;
                this.speed.y += (Wind.y * Math.random()) / 2.5;

                // air friction
                this.speed.x *= 1 - Node.FRICTION;
                this.speed.y *= 1 - Node.FRICTION;
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
Node.FRICTION = 0.03; // 0 no friction

/**
 * A link between two nodes
 * @class
 */
class Link {
    constructor (from, to) {
        this.from = from;
        this.to = to;
        this.originalLength = Node.distance(from, to);
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
        if (Global.wireframe) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#333";
        }
        else {
            ctx.lineWidth = 1;
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

    length () {
        return Node.distance(this.from, this.to);
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
        var distance = this.length();

        if (distance > this.originalLength) {
            if (distance > this.originalLength * Global.link_elongation) {
                this.breakIt();
            }
            else {
                var ratio = (distance - this.originalLength) * Global.link_stiffness * 0.005;

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
        this.to.unlinkTo(this.from);
    };
}
Link.SIZE = 1; // Drawing size

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
            return (Math.abs((p1.pos.x - p3.pos.x) * (p2.pos.y - p4.pos.y)) + Math.abs((p2.pos.x - p4.pos.x) * (p1.pos.y - p3.pos.y))) / 2;
        }
    };
})();
