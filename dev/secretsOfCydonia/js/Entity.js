
function EntityManager(canvas, img){
    this.entities = [];
}
EntityManager.prototype.renderAll = function(){
    for(var i=0;i<this.entities.length;++i){
        this.entities[i].render();
    }
};
EntityManager.Chest = 0;

function Entity(can, img, id){
    this.layer = c;
    this.img = i;
    
    this.id = id;
}
Entity.prototype.render = function(){
    
};

function Ent_Chest(){
    
}