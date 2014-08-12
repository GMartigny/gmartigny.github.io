
function Player(canvas, img){
    this.layer = canvas;
    this.img = img;
	
	this.data = {
		pos : {},
		dir : 0,
		anim : 1
	};
    this.pos = {
        x: 0.5,
        y: 0
    };
    this.dir = 0;
    this.anim = 0;
	
	this.display = {
		x : (this.layer.can.width/2)-GameManager.cell/2,
		y : (this.layer.can.height/2)-GameManager.cell/2
	};
	
	this.moving = false;
}
Player.SPEED = 0.08;
Player.DIR_DOWN = 0;
Player.DIR_LEFT = 1;
Player.DIR_RIGHT = 2;
Player.DIR_UP = 3;

Player.prototype.move = function(keyboard){
    this.moving = false;
    if(keyboard.keys.length){
        
        if(keyboard.isPressed(KeyboardManager.DOWN)){
            this.dir = Player.DIR_DOWN;
            this.pos.y += Player.SPEED;
            this.moving = true;
        }
        else if(keyboard.isPressed(KeyboardManager.UP)){
            this.dir = Player.DIR_UP;
            this.pos.y -= Player.SPEED;
            this.moving = true;
        }
        if(keyboard.isPressed(KeyboardManager.RIGHT)){
            this.dir = Player.DIR_RIGHT;
            this.pos.x += Player.SPEED;
            this.moving = true;
        }
        else if(keyboard.isPressed(KeyboardManager.LEFT)){
            this.dir = Player.DIR_LEFT;
            this.pos.x -= Player.SPEED;
            this.moving = true;
        }
        
        if(this.moving){
            this.anim += Player.SPEED*1.5;
        }
    }
    else this.anim = 0;
};
Player.prototype.render = function(){
    // draw charactere
    this.layer.ctx.clear();
    var step = round(2/PI*asin(sin(this.anim))+1);
    this.layer.ctx.drawImage(this.img,
        GameManager.cell*round(step), GameManager.cell*this.dir, GameManager.cell, GameManager.cell,
        this.display.x, this.display.y, GameManager.cell, GameManager.cell);
};