function EntitiesManager(media){
    Asteroid.asset = media.asteroid;
}

function Entity(ctx, x, y, sx, sy){
    this.pos = {
        x: x,
        y: y
    };
    this.spd = {
        x: sx || 0,
        y: sy || 0
    };
    this.ctx = ctx;
    this.isOut = false;
    this.solid = false;
}
Entity.prototype = {
    move: function(){
        this.pos.x += this.spd.x;
        this.pos.y += this.spd.y;
        if(this.pos.y > this.ctx.canvas.height + this.radius)
            this.isOut = true;
    },
    collide: function(other){
        if(this.radius < other.radius){
            this.isOut = true;
            other.spd.x += this.spd.x;
            other.spd.y += this.spd.y;
        }
        else{
            other.isOut = true;
            this.spd.x += other.spd.x;
            this.spd.y += other.spd.y;
        }
    },
    distance: function(other){
        return sqrt(sq(this.pos.x-other.pos.x) + sq(this.pos.y-other.pos.y)) - this.radius - other.radius;
    }
};

function Asteroid(ctx, x, y, r){
    Entity.call(this, ctx, x, y, random(-1, 1), random(0.5, 4));
    this.radius = r || random(10, 18);
    this.asset = "";
    this.solid = true;
}
Asteroid.prototype = Object.create(Entity.prototype);
Asteroid.prototype.render = function(){
//    this.ctx.drawImage(Asteroid.asset, this.pos.x-this.radius, this.pos.y-this.radius);
    this.ctx.beginPath();
    this.ctx.fillStyle = "#A00";
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, PI2, 0);
    this.ctx.fill();
    this.ctx.closePath();

    this.move();
};

function Nebulae(ctx, x, y){
    Entity.call(this, ctx, x, y, 0, random(0.3, 0.9));
    this.radius = 45; // max radius
    this.color = Nebulae.colors[random(0, Nebulae.colors.length)<<0];
    this.elms = [];
    var n = random(4, 8)<<0;
    for(var i=0;i<n;++i)
        this.elms.push({
            x: random(-25, 25), y: random(-25, 25), s: random(10, 20)
        });
}
Nebulae.colors = ["#3EF", "#B61", "#992", "#6D9", "#AAA"];
Nebulae.prototype = Object.create(Entity.prototype);
Nebulae.prototype.render = function(){
    var self = this;
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = 0.3;
    this.elms.forEach(function(e){
        self.ctx.beginPath();
        self.ctx.arc(self.pos.x+e.x, self.pos.y+e.y, e.s, 0, PI2, 0);
        self.ctx.fill();
    });
    this.ctx.globalAlpha = 1;

    this.move();
};

function Star(ctx, x, y){
    Entity.call(this, ctx, x, y, 0, random(0.1, 0.5));
    this.radius = random(0.5, 2);
}
Star.prototype = Object.create(Entity.prototype);
Star.prototype.render = function(){
    this.ctx.fillStyle = "#FFF";
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, PI2, 0);
    this.ctx.fill();
    
    this.move();
};