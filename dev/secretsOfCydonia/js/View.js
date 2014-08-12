
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
    }
    else{
        this.super.ctx.fillRect(0, 0, this.super.can.width, this.super.can.height);
    }
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
            p = this.data.get(x+i-GameManager.nbCol/2, y+j-GameManager.nbRow/2);
            
            if(p) this.layer.ctx.fillStyle = p.getHexa();
            if(p && p.isOpac()){
                this.layer.ctx.makePath(function(){
                    this.rect((i-dx)*GameManager.cell, (j-dy)*GameManager.cell, GameManager.cell, GameManager.cell);
                }, 1, 0);
            }
        }
    }
};