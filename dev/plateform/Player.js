function Player(ctx, map){
	this.ctx = ctx;
	this.map = map;
	this.pos = {
		x : 0,
		y : 1
	};
	this.vit = {
		x : 0,
		y : 0
	};
	this.air = false;
	this.w = 32;
	this.h = 32;
	
	var tile = new Image();
	tile.src = "perso.png";
	
	this.render = function(){
		if(tile.width){
			this.ctx.drawImage(tile, 0, 0, 32, 32, this.pos.x, this.pos.y, 32, 32);
		}
	}
	
	this.move = function(){
		this.pos.x += this.vit.x;
		this.pos.y += this.vit.y;
		
		this.vit.x /= 1.1;
		
		this.vit.y += 1;
		if(this.vit.y < -10) this.vit.y = -10;
		else if(10 < this.vit.y) this.vit.y = 10;
		
		if(this.map.collide(this.pos.x, this.pos.y+this.h) || this.map.collide(this.pos.x+this.w, this.pos.y+this.h)){ // dessous
			this.vit.y = 0;
			this.air = false;
		}
	};
	this.run = function(v){
		this.vit.x = v*3;
	};
	
	this.jump = function(){
		if(!this.air){
			this.vit.y = -10;
			this.air = true;
		}
	};
}