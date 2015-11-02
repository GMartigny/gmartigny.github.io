
function GameController(media){
    this.map = new MapManager(media.links);
    
    var canvas = prepareCanvas("c", GameController.nbCol*GameController.cell, GameController.nbRow*GameController.cell);
    this.player = new Player(canvas.player.ctx, media.player);
    this.entities = new EntityManager(canvas.entities.ctx, media.entities);
    this.view = new ViewManager(canvas, media.tiles, this.map.getMap());
    
    this.key = new KeyboardManager();
    
    var o = this.view.overlay;
    this.fps = new FPS(function(fps){
        o.ctx.clear();
        o.ctx.fillText(fps, 5, 15);
    }, 200);
    
    this.render();
}
GameController.cell = 32;
GameController.nbRow = 21;
GameController.nbCol = 35;

GameController.prototype.render = function(){
    var self = this;
    raf(function(){
        self.render.call(self);
    });
    
    if(this.view.ready){
        this.player.move(this.key, this.view);
        this.player.render();

        this.entities.renderAll(this.view, this.player);

        this.view.renderAll(this.player.pos.x-this.player.display.x, this.player.pos.y-this.player.display.y);

        this.fps.update();
    }
    else{
        this.view.checkReady();
    }
};
GameController.prototype.teleport = function(dir){
    this.map.changeMap(dir);
    
    this.view.setMap(this.map.getMap());
};
