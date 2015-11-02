
function ViewManager(canvas, tileSet, map){
    this.ready = false;
    
    this.ground = new GroundView(canvas.ground.ctx, map);
    this.block = new BlockView(canvas.block.ctx, map);
    this.layers = [
        this.ground,
        new UnderView(canvas.under.ctx, map),
        this.block,
        // Entities are there //
        // Player's there //
        new OverView(canvas.over.ctx, map)
    ];
    this.overlay = canvas.overlay;
    
    getImageDataFromUrl("res/match.png", function(data){
        View.match = data;
    }, this);
    View.tileSet = tileSet;
}

ViewManager.prototype = {
    checkReady: function(){
        var ok = true;
        this.layers.forEach(function(view){
            ok &= view.ready;
        });
        return this.ready = ok;
    },
    renderAll: function(x, y){
        if(this.ready){
            this.layers.forEach(function(view){
                view.render(x, y);
            });
        }
    },
    isBlocked: function(x, y, dir){
        var ahead = [],
            horMargin = 0.1,
            upMargin = 0.7,
            downMargin = 0.1,
            noFriction = Player.SPEED;
        switch(dir){
            case Player.DIR_UP:
                ahead = [{x: (x+horMargin+noFriction), y: (y+upMargin)}, // up left
                    {x: (x-horMargin-noFriction+1), y: (y+upMargin)}]; // up right
                break;
            case Player.DIR_DOWN:
                ahead = [{x: (x+horMargin+noFriction), y: (y-downMargin+1)}, // down left
                    {x: (x-horMargin-noFriction+1), y: (y-downMargin+1)}]; // down right
                break;
            case Player.DIR_LEFT:
                ahead = [{x: (x+horMargin), y: (y+upMargin+noFriction)}, // left up
                    {x: (x+horMargin), y: (y-downMargin-noFriction+1)}]; // left down
                break;
            case Player.DIR_RIGHT:
                ahead = [{x: (x-horMargin+1), y: (y+upMargin+noFriction)}, // right up
                    {x: (x-horMargin+1), y: (y-downMargin-noFriction+1)}]; // right down
                break;
        }

        var cell = {};
        for(var i=0, l=ahead.length;i<l;++i){
            cell = this.ground.data.get(floor(ahead[i].x), floor(ahead[i].y));
            if(!cell || !cell.isOpac())
                return {x: ahead[i].x, y: ahead[i].y};
            if(this.block.data.get(floor(ahead[i].x), floor(ahead[i].y)).isOpac())
                return {x: ahead[i].x, y: ahead[i].y};
        }
        return false;
    },
    setMap: function(map){
        this.layers.forEach(function(view){
            view.getData(map);
        });
    }
};

function View(ctx, map, defaultHexa){
    this.layer = ctx;
    this.data;
    this.rendering = {};
    this.defaultHexa = defaultHexa || false;
    this.layer.fillStyle = defaultHexa;
    this.randomize = false;
    this.ready = false;
    
    this.getData(map);
}
View.match;
View.tileSet;
View.prototype = {
    getData: function(map){
        this.ready = false;
        getImageDataFromUrl("res/" + map + "/" + this.name + ".png", this.catchData, this);
    },
    catchData: function(data){
        this.data = data;
        
        var can = document.createElement("canvas"),
            ctx = can.getContext("2d"),
            cell = GameController.cell;
        can.width = data.width*cell;
        can.height = data.height*cell;
        var pix = {},
            hexa = "",
            pos = {};
        for(var x=0, mx=data.width; x<mx; ++x){
            for(var y=0, my=data.height; y<my; ++y){
                pix = data.get(x, y);
                if(pix && pix.isOpac())
                    hexa = pix.getHexa();
                else
                    hexa = 0;
                if(hexa && (pos = this.getTilePos(hexa))){
                    ctx.save();
                    ctx.translate(floor((x+0.5)*cell), floor((y+0.5)*cell));
                    if(this.randomize)
                        ctx.rotate(floor(random(0, 3)) * PI / 2);
                    ctx.drawImage(View.tileSet, pos.x*cell, pos.y*cell, cell, cell, -floor(cell/2), -floor(cell/2), cell, cell);
                    ctx.restore();
                }
            }
        }
        this.rendering = can;
        
        this.ready = true;
    },
    render: function(x, y){
        this.layer.clear();
        
        var cell = GameController.cell,
            width = GameController.nbCol * cell,
            height = GameController.nbRow * cell;
        if(this.defaultHexa)
            this.layer.fillRect(0, 0, width, height);
        this.layer.drawImage(this.rendering, (x)*cell, (y)*cell, width, height, 0, 0, width, height);
        
        this.anim += this.spd;
    },
    getTilePos: function(hexa){
        for(var x=0, w=View.match.width; x<w; ++x){
            for(var y=0, h=View.match.height; y<h; ++y){
                if(View.match.get(x, y).getHexa() === hexa)
                    return {x:x, y:y};
            }
        }
        return false;
    }
};

// Children
function GroundView(ctx, map){
    View.call(this, ctx, map, "#97d4f7");
    this.randomize = true;
}
GroundView.prototype = Object.create(View.prototype);
GroundView.prototype.name = "grd";

function UnderView(ctx, map){
    View.call(this, ctx, map);
}
UnderView.prototype = Object.create(View.prototype);
UnderView.prototype.name = "und";

function BlockView(ctx, map){
    View.call(this, ctx, map);
}
BlockView.prototype = Object.create(View.prototype);
BlockView.prototype.name = "blk";

function OverView(ctx, map){
    View.call(this, ctx, map);
}
OverView.prototype = Object.create(View.prototype);
OverView.prototype.name = "ovr";
