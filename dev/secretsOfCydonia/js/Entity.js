
function EntityManager(canvas, img){
    this.entities = [];
}
EntityManager.prototype.renderAll = function(){
    for(var i=0;i<this.entities.length;++i){
        this.entities[i].render();
    }
};

function Entity(ctx, pos){
    this.layer = ctx;
    
    this.anim = 0;
    this.animSpeed = 0;
    this.pos = pos;
    this.moveSpeed = 0;
}
Entity.prototype.render = function(x, y){
    var c = GameController.cell;
    this.layer.drawImage(this.img,
        this.anim, 0, c, c,
        this.pos.x, this.pos.y, c, c);
};
