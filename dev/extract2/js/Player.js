
function PlayerManager(media, ctx){
    this.ctx = ctx;
    this.pos = {
        x: -100,
        y: -100
    };
    this.lives = 3;
    this.money = 0;
}

PlayerManager.prototype = {
    render: function(){
        this.ctx.fillStyle = "#9DF";
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, 8, 0, PI2, 0);
        this.ctx.fill();
        this.ctx.closePath();
    },
    updatePosition: function(x, y){
        this.pos.x = x;
        this.pos.y = y;
    },
    getHit: function(){
        if(--this.lives == 0)
            this.dies();
    },
    dies: function(){
        
    }
};