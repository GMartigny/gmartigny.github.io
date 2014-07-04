function Player(ctx, img, grd){
	this.ctx = ctx;
	this.img = img;
	this.pseudo = false;
	this.grd = grd;
	
	this.d = {
		map : "",
		pos : {},
		dir : 0,
		anim : 1,
		mess : []
	};
	
	this.pos = {
		x : (this.ctx.canvas.width/2)-16,
		y : (this.ctx.canvas.height/2)-16
	};
	
	this.moving = false;
	
	this.move = function(key){
		this.moving = true;
		switch(key){
			case Keyboard.UP:
				this.d.dir = 3;
				break;
			case Keyboard.RIGHT:
				this.d.dir = 2;
				break;
			case Keyboard.DOWN:
				this.d.dir = 0;
				break;
			case Keyboard.LEFT:
				this.d.dir = 1;
				break;
			default:
				this.moving = false;
		}
	};
	this.stop = function(){
		this.moving = false;
		this.d.anim = 1;
	};
	
	this.talk = function(mess){
		if(mess){
			keys.listening = true;
			chat.style.display = "none";
			
			this.d.mess.push({m:blah.value, t:Date.now()});
			
			blah.value = "";
			blah.blur();
		}
		else{
			this.moving = false;
			this.d.anim = 1;
			chat.style.display = "";
			blah.focus();
		}
	};
	
	this.render = function(){
		// move and animate
		if(this.moving){
			switch(this.d.dir){
				case 0: // down
					this.d.pos.y += 0.08;
					var mx = Math.ceil(this.d.pos.x-0.2),
						my = Math.ceil(this.d.pos.y);
					if(this.grd.block(M.floor(this.d.pos.x+0.2), my) || this.grd.block(mx, my)){
						this.d.pos.y = my-1;
					}
					break;
				case 1: // left
					this.d.pos.x -= 0.08;
					var mx = Math.ceil(this.d.pos.x),
						my = Math.ceil(this.d.pos.y);
					if(this.grd.block(M.floor(this.d.pos.x+0.2), M.floor(this.d.pos.y+0.4)) || this.grd.block(M.floor(this.d.pos.x+0.2), my)){
						this.d.pos.x = mx-0.2;
					}
					break;
				case 2: // right
					this.d.pos.x += 0.08;
					var mx = Math.ceil(this.d.pos.x-0.2),
						my = Math.ceil(this.d.pos.y);
					if(this.grd.block(mx, M.floor(this.d.pos.y+0.4)) || this.grd.block(mx, my)){
						this.d.pos.x = mx-0.8;
					}
					break;
				case 3: // up
					this.d.pos.y -= 0.08;
					var mx = Math.ceil(this.d.pos.x-0.2),
						my = Math.ceil(this.d.pos.y);
					if(this.grd.block(M.floor(this.d.pos.x+0.2), M.floor(this.d.pos.y+0.4)) || this.grd.block(mx, M.floor(this.d.pos.y+0.4))){
						this.d.pos.y = my-0.4;
					}
					break;
			}
			this.d.anim += 0.08;
		}
		if(2 < this.d.anim) this.d.anim = 0;
		
		// draw charactere
		this.ctx.drawImage(this.img, 32*(this.d.anim<<0), 32*this.d.dir, 32, 32, this.pos.x, this.pos.y, 32, 32);
		
		// teleportation
		var p;
		if(p = this.grd.layers.und.imgdata.get(M.round(this.d.pos.x), M.round(this.d.pos.y))){
			if(p.getHexa() == "#613875") log("tp");
		}

		var now = Date.now(),
			m = {};
		// draw messages
		for(var i=0;i<this.d.mess.length;++i){
			m = this.d.mess[i];
			//if(m.t < now + m.m.length*100) this.d.mess.out(i--);
		}
	};
}