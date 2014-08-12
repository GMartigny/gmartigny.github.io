
function GameManager(canvas, media){
    this.player = new Player(canvas.player, media.player);
    this.view = new ViewManager(canvas, media.tiles);
    this.key = new KeyboardManager();
    this.links = JSON.parse(media.links);
    
    var s = this.view.super;
    this.fps = new FPS(function(fps){
        s.ctx.clear();
        s.ctx.fillText(fps, 10, 15);
    }, 500);
    
    this.render();
}
GameManager.cell = 32;
GameManager.nbRow = 20;
GameManager.nbCol = 26;

GameManager.prototype.render = function(){
    var self = this;
    raf(function(){
        self.render.call(self);
    });
    
    this.fps.update();
    
    this.player.move(this.key);
    this.player.render();
    
    this.view.renderAll(this.player.pos.x, this.player.pos.y);
};