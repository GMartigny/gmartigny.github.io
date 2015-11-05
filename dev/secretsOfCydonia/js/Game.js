
function GameController(media){
    this.map = new MapManager(media.links);
    
    var canvas = prepareCanvas("c", GameController.nbCol*GameController.cell, GameController.nbRow*GameController.cell);
    this.player = new Player(canvas.entities.ctx, media.player);
    this.entities = new EntityManager(canvas.entities.ctx, media.entities);
    this.view = new ViewManager(canvas, media.tiles, this.map.getMap());
    
    this.key = new KeyboardManager();
    
    this.camera = {
        x: 0,
        y: 0
    };
    this.centerCameraOn(this.player.pos.x, this.player.pos.y);
    
    var o = this.view.overlay;
    this.fps = new FPS(function(fps){
        o.ctx.clear();
        o.ctx.fillText(fps, 5, 15);
    }, 200);
    
    this.loop();
}
GameController.cell = 32;
GameController.nbRow = 21;
GameController.nbCol = 39;

GameController.tickLength = 1000/60;
GameController.lastTick = 0;

GameController.prototype = {
    loop: function(time){
        var self = this;
        raf(function(time){
            self.loop.call(self, time);
        });

        if(this.view.ready){
            this.update(floor((time-GameController.lastTick)/GameController.tickLength));
            this.render();

            this.fps.update();
        }
        else{
            this.view.checkReady();
        }
    },
    update: function(nbTick){
        for(var i=0;i<nbTick;++i){
            this.player.move(this.key, this.view);
            this.centerCameraOn(this.player.pos.x, this.player.pos.y);
            this.entities.moveAll(this.player, this.view);
        }
        GameController.lastTick += GameController.tickLength*nbTick;
    },
    render: function(){
        this.player.render(this.camera);
        this.entities.renderAll(this.camera);
        this.view.renderAll(this.camera);
    },
    centerCameraOn: function(x, y){
        this.camera = {
            x: x - floor((GameController.nbCol-1)/2),
            y: y - floor((GameController.nbRow-1)/2)
        };
    },
    teleport: function(dir){
        this.map.changeMap(dir);

        this.view.setMap(this.map.getMap());
    }
};
