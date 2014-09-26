
function PlayerController(ctx){
    this.ctx = ctx;
    this.pos = {
        x: 0,
        y: 0
    };
}

PlayerController.prototype.render = function(){
    this.ctx.clear();
    this.ctx.fillStyle = "#9DF";
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, 10, 0, PI2, 0);
    this.ctx.fill();
    this.ctx.closePath();
};
PlayerController.prototype.updatePosition = function(x, y){
    this.pos.x = x;
    this.pos.y = y;
};