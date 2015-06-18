
function ViewManager(media, canvas){
    this.entitiesManager = new EntitiesManager(media);
    this.back = new BackView(canvas.back.ctx);
    this.player = new PlayerView(canvas.player.ctx);
    this.over = new OverView(canvas.over.ctx);
}
ViewManager.prototype = {
    render: function(){
        this.back.render();
        this.player.render();
        this.over.render();
    },
    animate: function(){
        this.back.animate();
        this.player.animate();
        this.over.animate();
    }
};

function View(ctx){
    this.ctx = ctx;
    this.entities = [];
}
View.prototype = {
    render: function(){
        this.ctx.clear();
//        this.draw();
        var l = this.entities.length;
        while(l--){
            var entity = this.entities[l];
            entity.render();
            if(this.moves)
                entity.move();
            if(entity.isOut)
                this.entities.out(entity);
            else{
                if(entity.solid){
                    var o = l;
                    while(o--){
                        var other = this.entities[o];
                        if(entity.distance(other) < 0){
                            entity.collide(other);
                        }
                    }
                }
            }
        }
        this.moves = false;
    },
    animate: function(){
        this.spawn();
        this.moves = true;
    }
};

function BackView(ctx){
    View.call(this, ctx);
    var n = 6;
    while(n--){
        this.entities.push(new Star(this.ctx, random(0, this.ctx.canvas.width), random(0, this.ctx.canvas.height)));
        this.entities.push(new Nebulae(this.ctx, random(0, this.ctx.canvas.width), random(0, this.ctx.canvas.height)));
    }
}
BackView.prototype = Object.create(View.prototype);
BackView.prototype.spawn = function(){
    if(!(random(0, 300)<<0))
        this.entities.push(new Nebulae(this.ctx, random(0, this.ctx.canvas.width), -18));
    if(!(random(0, 200)<<0))
        this.entities.push(new Star(this.ctx, random(0, this.ctx.canvas.width), -5));
};

function PlayerView(ctx){
    View.call(this, ctx);
}
PlayerView.prototype = Object.create(View.prototype);
PlayerView.prototype.spawn = function(){
    if(!(random(0, 50)<<0))
        this.entities.push(new Asteroid(this.ctx, random(0, this.ctx.canvas.width), -30))
};

function OverView(ctx){
    View.call(this, ctx);
}
OverView.prototype = Object.create(View.prototype);
OverView.prototype.spawn = function(){
    
};