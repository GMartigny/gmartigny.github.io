
function ViewManager(canvas, tiles, map){
    this.tiles = tiles;
    
    this.ready = false;
    this.ground = new GroundView(canvas.ground, map);
    this.block = new BlockView(canvas.block, map);
    this.layers = [
        this.ground,
        new UnderView(canvas.under, map),
        this.block,
        // Player's here
        new OverView(canvas.over, map)
    ];
    this.super = canvas.super;
    
    getDataFromImage("res/match.png", function(data){
        ViewManager.match = data;
        this.setReady();
    }, this);
}
ViewManager.match = [];

ViewManager.prototype = {
    setReady: function(){
        var ok = true;
        this.layers.forEach(function(view){
            ok &= view.ready;
        });
        return ok;
    },
    renderAll: function(x, y){
        if(this.ready){
            var tiles = this.tiles;
            this.layers.forEach(function(view){
                view.render(tiles, x, y);
            });
        }
    },
    isBlocked: function(x, y, dir){
        var ahead = [];
        if(dir == Player.DIR_UP){
            ahead = [{x: floor(x+0.2), y: floor(y+0.3)}, // up left
                {x: ceil(x-0.2), y: floor(y+0.3)}]; // up right
        }
        else if(dir == Player.DIR_DOWN){
            ahead = [{x: floor(x+0.2), y: ceil(y+0.08)}, // down left
                {x: ceil(x-0.2), y: ceil(y+0.08)}]; // down right
        }
        if(dir == Player.DIR_LEFT){
            ahead.push({x: floor(x+0.1), y: floor(y+0.4)}, // left up
                {x: floor(x+0.1), y: ceil(y-0.1)}); // left down
        }
        else if(dir == Player.DIR_RIGHT){
            ahead.push({x: ceil(x-0.1), y: floor(y+0.4)}, // right up
                {x: ceil(x-0.1), y: ceil(y-0.1)}); // right down
        }

        var cell = {};
        for(var i=0;i<ahead.length;++i){
            cell = this.ground.data.get(ahead[i].x, ahead[i].y);
            if(!cell || !cell.isOpac())
                return true;
            if(this.block.data.get(ahead[i].x, ahead[i].y).isOpac())
                return true;
        }
        return false;
    },
    setMap: function(map){
        this.layers.forEach(function(view){
            view.getData(map);
        });
    }
};

function View(ctx, map, defaultPixel){
    this.layer = ctx;
    this.defaultPixel = defaultPixel || false;
    this.ready = false;
    
    this.getData(map);
}
View.prototype = {
    getData: function(map){
        this.ready = false;
        this.tiles = "res/" + map + "/" + this.name + ".png";
        getDataFromImage(this.tiles, this.catchData, this);
    },
    catchData: function(data){
        this.data = data;
        this.ready = true;
    },
    render: function(tiles, x, y){
        this.layer.ctx.clear();

        var dx = x - floor(x),
            dy = y - floor(y);
        x = floor(x);
        y = floor(y);

        var p = {},
            hexa = "",
            tile = {},
            cell = GameController.cell;
        for(var i=0;i<GameController.nbCol;++i){
            for(var j=0;j<GameController.nbRow;++j){
                p = this.data.get(x+i-GameController.nbCol/2+1, y+j-GameController.nbRow/2+1);
                if(p && p.isOpac()){
                    hexa = p.getHexa();
                }
                else if(this.defaultPixel){
                    hexa = this.defaultPixel;
                }
                else hexa = 0;
                if(hexa && (tile = this.getTile(hexa)))
                    this.layer.ctx.drawImage(tiles,
                        cell*tile.x, cell*tile.y, cell, cell,
                        (i-dx)*cell, (j-dy)*cell, cell, cell);
            }
        }
        this.anim += this.spd;
    },
    getTile: function(hexa){
        for(var x=0, w=ViewManager.match.width; x<w; ++x){
            for(var y=0, h=ViewManager.match.height; y<h; ++y){
                if(ViewManager.match.get(x, y).getHexa() === hexa)
                    return {x:x, y:y};
            }
        }
        return false;
    }
};

// Children
function GroundView(ctx, map){
    View.call(this, ctx, map, "#97d4f7");
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