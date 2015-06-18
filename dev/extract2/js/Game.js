function GameManager(media, canvas){
    this.save = new SaveManager();
    this.state = GameManager.PLAYING;
    this.view = new ViewManager(media, canvas);
    this.player = new PlayerManager(media, canvas.player.ctx);
    
    var holder = getById("holder");
    this.initialX = holder.offsetLeft;
    this.initialY = holder.offsetTop;
    
    var self = this;
    window.onmousemove = function(e){
        self.player.updatePosition(e.clientX - self.initialX, e.clientY - self.initialY);
    };
    window.onkeydown = function(e){
        console.log(e.keyCode);
        if(e.keyCode == 32){ // space
            if(self.state == GameManager.PLAYING)
                self.setState(GameManager.PLAYING_UPGRADES);
            else if(self.state == GameManager.PLAYING_UPGRADES)
                self.setState(GameManager.PLAYING);
        }
    };
    
    this.fps = new FPS(function(n){
        fps.innerHTML = n;
    });
    this.loop();
}
GameManager.MENU = 10;
GameManager.MENU_SAVES = 11;
GameManager.MENU_CREDITS = 12;
GameManager.PLAYING = 20;
GameManager.PLAYING_UPGRADES = 21;
GameManager.PLAYING_DEATH = 22;

GameManager.prototype = {
    loop: function(){
        this.fps.update();
        var self = this;
        raf(function(){
            self.loop.call(self);
        });

        if(this.state == GameManager.PLAYING)
            this.view.animate();
        this.view.render();
        this.player.render();
    },
    
    setState: function(state){
        this.state = state;
        this.view;
    }
};
