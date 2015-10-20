
function Player(canvas, img){
    this.layer = canvas;
    this.img = img;
    
    var save = [];
    (localStorage.SoC_P && localStorage.SoC_P.hashCode() == localStorage.SoC_HP)?
        save = localStorage.SoC_P.split(";") : save = [9, 7, Player.DIR_DOWN];
	
    this.pos = {
        x: +save[0],
        y: +save[1]
    };
    this.dir = +save[2];
    this.anim = 0;
	
	this.display = {
		x : (this.layer.can.width/2)-GameController.cell/2,
		y : (this.layer.can.height/2)-GameController.cell/2
	};
	
	this.moving = false;
    this.SPEED = 0.08;
}
Player.DIR_DOWN = 0;
Player.DIR_LEFT = 1;
Player.DIR_RIGHT = 2;
Player.DIR_UP = 3;

Player.prototype.move = function(keyboard, view){
    this.moving = false;
    if(keyboard.keys.length){
        
        var dx = 0,
            dy = 0;
        if(keyboard.isPressed(KeyboardManager.DOWN)){
            this.dir = Player.DIR_DOWN;
            if(!view.isBlocked(this.pos.x, this.pos.y, this.dir)){
                dy = this.SPEED;
                this.moving = true;
            }
        }
        else if(keyboard.isPressed(KeyboardManager.UP)){
            this.dir = Player.DIR_UP;
            if(!view.isBlocked(this.pos.x, this.pos.y, this.dir)){
                dy = -this.SPEED;
                this.moving = true;
            }
        }
        if(keyboard.isPressed(KeyboardManager.RIGHT)){
            this.dir = Player.DIR_RIGHT;
            if(!view.isBlocked(this.pos.x, this.pos.y, this.dir)){
                if(this.moving){
                    dx = this.SPEED*SQRT2;
                    dy *= SQRT2;
                }
                else{
                    dx = this.SPEED;
                    this.moving = true;
                }
            }
        }
        else if(keyboard.isPressed(KeyboardManager.LEFT)){
            this.dir = Player.DIR_LEFT;
            if(!view.isBlocked(this.pos.x, this.pos.y, this.dir)){
                if(this.moving){
                    dx = -this.SPEED*SQRT2;
                    dy *= SQRT2;
                }
                else{
                    dx = -this.SPEED;
                    this.moving = true;
                }
            }
        }
        
        if(this.moving){
            this.pos.x += dx;
            this.pos.y += dy;
            this.anim += this.SPEED*1.5;
        }
        else this.anim = 0;
        
        var s = this.pos.x+";"+this.pos.y+";"+this.dir;
        localStorage.SoC_P = s;
        localStorage.SoC_HP = s.hashCode();
    }
    else this.anim = 0;
};
Player.prototype.render = function(){
    // draw charactere
    this.layer.ctx.clear();
    var step = round(2/PI*asin(sin(this.anim))+1);
    this.layer.ctx.drawImage(this.img,
        GameController.cell*round(step), GameController.cell*this.dir, GameController.cell, GameController.cell,
        this.display.x, this.display.y, GameController.cell, GameController.cell);
};