
function GameController(media){
    this.links = JSON.parse(media.links);
    
    (localStorage.SoC_M && localStorage.SoC_M.hashCode() == localStorage.SoC_HM)?
        this.pos = localStorage.SoC_M.split(";") : this.pos = [0, 0];
    
    var canvas = prepareCanvas(getById("c"));
    this.player = new Player(canvas.player, media.player);
    this.view = new ViewManager(canvas, media.tiles, this);
    
    this.key = new KeyboardManager();
    
    var s = this.view.super;
    this.fps = new FPS(function(fps){
        s.ctx.clear();
        s.ctx.fillText(fps, 5, 15);
    }, 200);
    
    this.render();
}
GameController.cell = 32;
GameController.nbRow = 20;
GameController.nbCol = 26;

GameController.prototype.render = function(){
    var self = this;
    raf(function(){
        self.render.call(self);
    });
    
    this.player.move(this.key, this.view);
    this.player.render();
    
    this.view.renderAll(this.player.pos.x, this.player.pos.y);
    this.fps.update();
};
GameController.prototype.teleport = function(dir){
    switch (dir){
        case Player.DIR_DOWN:
            if(++this.pos[0]>this.links[0].length) this.pos[0] = this.links[0].length;
            break;
        case Player.DIR_UP:
            if(--this.pos[0]<0) this.pos[0] = 0;
            break;
        case Player.DIR_RIGHT:
            if(++this.pos[1]>this.links.length) this.pos[1] = this.links.length;
            break;
        case Player.DIR_LEFT:
            if(--this.pos[1]<0) this.pos[1] = 0;
            break;
    }
    
    this.view.changeMap();
    
    var s = this.pos[0]+";"+this.pos[1];
    localStorage.SoC_M = s;
    localStorage.SoC_HM = s.hashCode();
};