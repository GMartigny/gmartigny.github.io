
function ViewManager(canvas, tiles){
    this.tiles = tiles;
    this.ground = new GroundView(canvas.ground);
    this.under = new UnderView(canvas.under);
    this.block = new BlockView(canvas.block);
    // player's here
    this.over = new OverView(canvas.over);
    this.super = canvas.super;
    
    getDataFromImage("res/match.png", this.catchData);
}
ViewManager.map = localStorage.map || "departure";

ViewManager.prototype.renderAll = function(x, y){
    if(this.ground.ready && this.under.ready && this.block.ready && this.over.ready){
        this.ground.render(x, y);
        this.under.render(x, y);
        this.block.render(x, y);
        this.over.render(x, y);
//        this.super.ctx.clear();
    }
    else{
        this.super.ctx.fillRect(0, 0, this.super.can.width, this.super.can.height);
    }
};
ViewManager.prototype.isBlocked = function(x, y, dir){
    
    var ahead = [];
    if(dir == Player.DIR_UP){
        ahead = [{x: floor(x+0.2), y: floor(y+0.3)}, // up left
            {x: ceil(x-0.2), y: floor(y+0.3)}]; // up right
    }
    else if(dir == Player.DIR_DOWN){
        ahead = [{x: floor(x+0.2), y: ceil(y+0.05)}, // down left
            {x: ceil(x-0.2), y: ceil(y+0.05)}]; // down right
    }
    if(dir == Player.DIR_LEFT){
        ahead.push({x: floor(x+0.1), y: floor(y+0.4)}, // left up
            {x: floor(x+0.1), y: ceil(y-0.1)}); // left down
    }
    else if(dir == Player.DIR_RIGHT){
        ahead.push({x: ceil(x-0.1), y: floor(y+0.4)}, // right up
            {x: ceil(x-0.1), y: ceil(y-0.1)}); // right down
    }
    
    var c = {};
    for(var i=0;i<ahead.length;++i){
        c = this.ground.data.get(ahead[i].x, ahead[i].y);
        if(!c || (c && c.equals(this.ground.defaultPixel)))
            return true;
        if(this.block.data.get(ahead[i].x, ahead[i].y).isOpac())
            return true;
    }
    return false;
};

// will be called by children
ViewManager.prototype.catchData = function(data){
    this.data = data;
    this.ready = true;
};
ViewManager.prototype.render = function(x, y){
    this.layer.ctx.clear();
    
    var dx = x - floor(x),
        dy = y - floor(y);
    x = floor(x);
    y = floor(y);
    
    var p = {};
    for(var i=0;i<GameManager.nbCol;++i){
        for(var j=0;j<GameManager.nbRow;++j){
            p = this.data.get(x+i-GameManager.nbCol/2+1, y+j-GameManager.nbRow/2+1);
            if(!p && this.defaultPixel){
                p = this.defaultPixel;
            }
            
            if(p){
                if(p.isOpac()){
                    this.layer.ctx.fillStyle = p.getHexa();
                    this.layer.ctx.beginPath();
                    this.layer.ctx.fillRect((i-dx)*GameManager.cell, (j-dy)*GameManager.cell, GameManager.cell, GameManager.cell);
                }
            }
        }
    }
};

//children
function GroundView(canvas){
    this.layer = canvas;
    this.data = 0;
    this.defaultPixel = new Pixel(255, 255, 255, 255);
    this.blocks = [this.defaultPixel];
    
    getDataFromImage("res/"+ViewManager.map+"/grd.png", this.catchData, this);
}
GroundView.prototype = Object.create(ViewManager.prototype);

function UnderView(canvas){
    this.layer = canvas;
    this.data = 0;
    this.defaultPixel = false;
    
    getDataFromImage("res/"+ViewManager.map+"/und.png", this.catchData, this);
}
UnderView.prototype = Object.create(ViewManager.prototype);

function BlockView(canvas){
    this.layer = canvas;
    this.data = 0;
    this.defaultPixel = false;
    
    getDataFromImage("res/"+ViewManager.map+"/blk.png", this.catchData, this);
}
BlockView.prototype = Object.create(ViewManager.prototype);

function OverView(canvas){
    this.layer = canvas;
    this.data = 0;
    this.defaultPixel = false;
    
    getDataFromImage("res/"+ViewManager.map+"/ovr.png", this.catchData, this);
}
OverView.prototype = Object.create(ViewManager.prototype);