
function ViewManager(canvas, tiles, controller){
    this.controller = controller;
    this.tiles = tiles;
    
    var map = this.getMap();
    this.ground = new GroundView(canvas.ground, map);
    this.under = new UnderView(canvas.under, map);
    this.block = new BlockView(canvas.block, map);
    // player's here
    this.over = new OverView(canvas.over, map);
    this.super = canvas.super;
    
    getDataFromImage("res/match.png", this.catchData);
}

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
ViewManager.prototype.getMap = function(){
    return this.controller.links[this.controller.pos[0]][this.controller.pos[1]];
};
ViewManager.prototype.changeMap = function(){
    var map = this.getMap();
    this.ground.ready = false;
    getDataFromImage("res/"+map+"/grd.png", this.ground.catchData, this.ground);
    this.under.ready = false;
    getDataFromImage("res/"+map+"/und.png", this.under.catchData, this.under);
    this.block.ready = false;
    getDataFromImage("res/"+map+"/blk.png", this.block.catchData, this.block);
    this.over.ready = false;
    getDataFromImage("res/"+map+"/ovr.png", this.over.catchData, this.over);
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
    for(var i=0;i<GameController.nbCol;++i){
        for(var j=0;j<GameController.nbRow;++j){
            p = this.data.get(x+i-GameController.nbCol/2+1, y+j-GameController.nbRow/2+1);
            if(!p && this.defaultPixel){
                p = this.defaultPixel;
            }
            
            if(p){
                if(p.isOpac()){
                    this.layer.ctx.fillStyle = p.getHexa();
                    this.layer.ctx.beginPath();
                    this.layer.ctx.fillRect((i-dx)*GameController.cell, (j-dy)*GameController.cell, GameController.cell+1, GameController.cell+1);
                }
            }
        }
    }
};

//children
function GroundView(c, m){
    this.layer = c;
    this.data = 0;
    this.defaultPixel = new Pixel(255, 255, 255, 255);
    this.blocks = [this.defaultPixel];
    
    getDataFromImage("res/"+m+"/grd.png", this.catchData, this);
}
GroundView.prototype = Object.create(ViewManager.prototype);

function UnderView(c, m){
    this.layer = c;
    this.data = 0;
    this.defaultPixel = false;
    
    getDataFromImage("res/"+m+"/und.png", this.catchData, this);
}
UnderView.prototype = Object.create(ViewManager.prototype);

function BlockView(c, m){
    this.layer = c;
    this.data = 0;
    this.defaultPixel = false;
    
    getDataFromImage("res/"+m+"/blk.png", this.catchData, this);
}
BlockView.prototype = Object.create(ViewManager.prototype);

function OverView(c, m){
    this.layer = c;
    this.data = 0;
    this.defaultPixel = false;
    
    getDataFromImage("res/"+m+"/ovr.png", this.catchData, this);
}
OverView.prototype = Object.create(ViewManager.prototype);