
function GameManager(canvas){
    this.save = new SaveManager();
    this.view = new ViewManager(canvas);
    this.player = new PlayerController();
    
    this.loop();
}

GameManager.prototype.loop = function(){
    var self = this;
    raf(function(){
        self.loop.call(self);
    });
    
    this.view.render();
    this.player.render();
};