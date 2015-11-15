
function ViewManager(canvas, tileSet, map){
    this.ready = false;
    
    this.ground = new GroundView(canvas.ground.ctx);
    this.block = new View(canvas.block.ctx, View.BLOCK_NAME);
    this.under = new View(canvas.under.ctx, View.UNDER_NAME);
    this.over = new View(canvas.over.ctx, View.OVER_NAME);
    this.layers = [
        this.ground,
        this.under,
        this.block,
        // Player's here //
        this.over
    ];
    this.overlay = canvas.overlay;
    
    var match = new Image("res/match.png");
    match.onload = function(){
        View.match = this.getData();
    };
    View.tileSet = tileSet;
    
    this.setMap(map);
}

ViewManager.prototype = {
    checkReady: function(){
        var ok = true;
        this.layers.forEach(function(view){
            ok &= view.ready;
        });
        return this.ready = ok;
    },
    renderAll: function(camera){
        if(this.ready){
            this.layers.forEach(function(view){
                view.render(camera);
            });
        }
    },
    isBlocked: function(x, y, dir){
        var ahead = [],
            max = 0,
            horMargin = 0.2,
            upMargin = 0.7,
            downMargin = 0,
            noFriction = Player.SPEED;
        switch(dir){
            case Player.DIR_UP:
                ahead = [{x: (x+horMargin+noFriction), y: (y+upMargin)}, // up left
                    {x: (x+1-horMargin-noFriction), y: (y+upMargin)}]; // up right
                max = floor(y+1)-upMargin;
                break;
            case Player.DIR_DOWN:
                ahead = [{x: (x+horMargin+noFriction), y: (y+1-downMargin)}, // down left
                    {x: (x+1-horMargin-noFriction), y: (y+1-downMargin)}]; // down right
                max = floor(y)+downMargin;
                break;
            case Player.DIR_LEFT:
                ahead = [{x: (x+horMargin), y: (y+upMargin+noFriction)}, // left up
                    {x: (x+horMargin), y: (y+1-downMargin-noFriction)}]; // left down
                max = floor(x+1)-horMargin;
                break;
            case Player.DIR_RIGHT:
                ahead = [{x: (x+1-horMargin), y: (y+upMargin+noFriction)}, // right up
                    {x: (x+1-horMargin), y: (y+1-downMargin-noFriction)}]; // right down
                max = floor(x)+horMargin;
                break;
        }

        for(var i=0, l=ahead.length;i<l;++i){
            if(!this.ground.tileAt(floor(ahead[i].x), floor(ahead[i].y)) || this.block.tileAt(floor(ahead[i].x), floor(ahead[i].y))){
                return max;
            }
        }
        return false;
    },
    setMap: function(map){
        this.layers.forEach(function(view){
            view.getData(map);
        });
    }
};

function View(ctx, name){
    this.layer = ctx;
    this.data;
    this.name = name;
    this.rendering;
    this.ready = false;
}
View.GROUND_NAME = "grd";
View.UNDER_NAME = "und";
View.BLOCK_NAME = "blk";
View.OVER_NAME = "ovr";
View.match;
View.tileSet;
View.prototype = {
    getData: function(map){
        this.ready = false;
        var map = new Image("res/" + map + "/" + this.name + ".png");
        var self = this;
        map.onload = function(){
            self.catchData.call(self, map.getData());
        };
    },
    catchData: function(data){
        this.data = data;
        
        var can = document.createElement("canvas"),
            ctx = can.getContext("2d");
        this.rendering = ctx;
        can.width = data.width*GameController.cell;
        can.height = data.height*GameController.cell;
        var pix = {},
            hexa = "",
            tilePos = {};
        for(var x=0, mx=data.width; x<mx; ++x){
            for(var y=0, my=data.height; y<my; ++y){
                pix = data.get(x, y);
                if(pix && pix.isOpac())
                    hexa = pix.getHexa();
                else
                    hexa = 0;
                
                if(hexa && (tilePos = this.getTilePos(hexa)))
                    this.drawTile(x, y, tilePos);
            }
        }
        
        this.ready = true;
    },
    drawTile: function(x, y, tilePos){
        var cell = GameController.cell;
        this.rendering.drawImage(View.tileSet, tilePos.x*cell<<0, tilePos.y*cell<<0, cell, cell, x*cell, y*cell, cell, cell);
    },
    tileAt: function(x, y){
        var tile = this.data.get(x, y);
        if(tile)
            return tile.isOpac();
        return false;
    },
    clear: function(){
        this.layer.clear();
    },
    render: function(camera){
        this.clear();
        
        var cell = GameController.cell,
            width = GameController.nbCol * cell,
            height = GameController.nbRow * cell;
        this.layer.drawImage(this.rendering.canvas, camera.x*cell, camera.y*cell, width, height, 0, 0, width, height);
        
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
function GroundView(ctx){
    View.call(this, ctx, "grd");
    this.layer.fillStyle = "#97d4f7";
}
GroundView.prototype = Object.create(View.prototype);
// overrides
GroundView.prototype.clear = function(){
    this.layer.fillRect(0, 0, this.layer.canvas.width, this.layer.canvas.height);
};
GroundView.prototype.drawTile = function(x, y, tilePos){
    var ctx = this.rendering,
        cell = GameController.cell;
    ctx.save();
    ctx.translate((x+0.5)*cell<<0, (y+0.5)*cell<<0);
    ctx.rotate((random(0, 3)<<0) * PI / 2);
    ctx.drawImage(View.tileSet, tilePos.x*cell<<0, tilePos.y*cell<<0, cell, cell, -0.5*cell<<0, -0.5*cell<<0, cell, cell);
    ctx.restore();
};
