function Map(ctx, url){
	this.ctx = ctx;
	this.imageData = null;
	
	var tileset = new Image();
	tileset.src = "tileset.png";
	
	var can = document.createElement("canvas");
	var ctx = can.getContext("2d");
	var img = new Image();
	img.holder = this;
	img.src = url;
	img.onload = function(){
		can.width = this.width; can.height = this.height;
		ctx.drawImage(this, 0, 0);
		this.holder.imageData = ctx.getImageData(0, 0, can.width, can.height);
	};
	
	this.setData = function(d){
		this.data = d;
	}
	
	this.render = function(){
		if(this.imageData){
			for(var i=0;i<this.imageData.width;++i){
				for(var j=0;j<this.imageData.height;++j){
					switch(this.imageData.getPixel(i, j).toHexa()){
						case "#000000":
							this.ctx.drawImage(tileset, 0, 0, 32, 32, i*32, j*32, 32, 32);
						break;
					}
				}
			}
		}
	};
	
	this.collide = function(x, y){
		if(this.imageData){
			//return false;
			return this.imageData.getPixel((x/32)<<0, (y/32)<<0).toHexa() != "#ffffff";
		}
	}
}

function Pixel(r, g, b, a){
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
	
	this.toHexa = function(){
		return "#"+hexa(this.r)+hexa(this.g)+hexa(this.b);
	}
	
	function hexa(v){
		if(v < 10) return "0"+v;
		else return v.toString(16);
	}
}