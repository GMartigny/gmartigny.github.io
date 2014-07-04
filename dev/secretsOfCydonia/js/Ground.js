function Ground(grdctx, undctx, blkctx, ovrctx){

	this.layers = {
		grd : {ctx : grdctx},
		und : {ctx : undctx},
		blk : {ctx : blkctx},
		ovr : {ctx : ovrctx}
	};
	
	this.data = [];
	this.tileColumn = 1;
	this.match = {};
	
	var c = document.createElement("canvas");
	this.buf = {
		can : c,
		ctx : c.getContext("2d")
	}
	
	this.setData = function(map){
		this.data = loadMedia([
			{src:"res/"+map+"/grd.png", name:"grd"},
			{src:"res/"+map+"/und.png", name:"und"},
			{src:"res/"+map+"/blk.png", name:"blk"},
			{src:"res/"+map+"/ovr.png", name:"ovr"},
			{src:"res/tiles.png", name:"tile"},
			{src:"res/match.json", name:"match"},
		], this.dataCallBack);
	};
	this.dataCallBack = function(r, n){
		if(ground.layers[n]){
			ground.buf.ctx.clear();
			ground.buf.can.width = ground.data[n].width;
			ground.buf.can.height = ground.data[n].height;
			ground.buf.ctx.drawImage(ground.data[n], 0, 0);
			ground.layers[n].imgdata = ground.buf.ctx.getImageData(0, 0, ground.data[n].width, ground.data[n].height);
		}
		else if(n == "match"){
			var tmp = document.createElement("canvas");
			tmp.width = ground.data.match.width;
			tmp.height = ground.data.match.height;
			var c = tmp.getContext("2d");
			c.drawImage(ground.data.match, 0, 0);
			
			var d = tmp.getImageData(0, 0, tmp.width, tmp.height);
			var a = [];
			
			for(var y;y<tmp.height;++y){
				for(var x=0;x<tmp.width;++x){
					a.push(d.get(x, y).getHexa());
				}
			}
			
			ground.match = a;
		}
		if(100 <= r){
			ground.tileColumn = (ground.data.tile.width / 32) <<0;
			draw();
		}
	};
	
	this.render = function(px, py){
		var x = (px<<0)-12,
			y = (py<<0)-9,
			dx = px - (px<<0),
			dy = py - (py<<0);
		
		var p = "";
		var t = 0;
		for(var l in this.layers){ // layers
			if(this.layers.hasOwnProperty(l)){
				this.layers[l].ctx.clear();
				for(var i=0;i<26;++i){ // width
					for(var j=0;j<20;++j){ // height
						if(p = this.layers[l].imgdata.get(i+x, j+y)){
							t = this.match.indexOf(p.getHexa());
							this.layers[l].ctx.drawImage(this.data.tile, t%this.tileColumn*32, (t/this.tileColumn<<0)*32, 32, 32, (i-dx)*32, (j-dy)*32, 32, 32);
						}
						else if(l == "grd") this.layers["grd"].ctx.drawImage(this.data.tile, 0, 0, 32, 32, (i-dx)*32, (j-dy)*32, 32, 32);
					}
				}
			}
		}
	};
	
	this.block = function(x, y){
		var p = {};
		if((p = this.layers.grd.imgdata.get(x, y)) &&
			p.getHexa() != "#ffffff" &&
			!this.layers.blk.imgdata.get(x, y).isOpac()){
				return false;
		}
		else{
			return true;
		}
	};
}

function Pixel(r, g, b, a){
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
	
	this.getHexa = function(){
		return "#"+hexa(this.r)+hexa(this.g)+hexa(this.b);
	};
	this.isOpac = function(){
		return (this.a == 255);
	}
}

function hexa(n){
	var h = n.toString(16);
	return (h.length < 2)? "0" + h : h;
}

window.ImageData.prototype.get = function(x, y){
	if(x < 0 || this.width <= x || y < 0 || this.height <= y){ // out of bound
		return false;
	}
	else{
		var i = 4*(x + y*this.width);
		return new Pixel(this.data[i], this.data[++i], this.data[++i], this.data[++i]);
	}
};