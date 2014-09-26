
function GameManager(media, canvas){
    this.save = new SaveManager();
    this.view = new ViewManager(canvas);
    this.player = new PlayerController(canvas.player.ctx);
    
    this.initialX = getById("holder").offsetLeft;
    this.initialY = getById("holder").offsetTop;
    
    var self = this;
    window.onmousemove = function(e){
        self.player.updatePosition(e.clientX - self.initialX, e.clientY - self.initialY);
        console.log(self.initialX);
    };
    
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