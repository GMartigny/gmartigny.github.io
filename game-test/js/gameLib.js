
// load all media in a array and do a function (act) with weight as parameter for each
// ex : [{src:"images/tileset.png", type:"image", weight:42}, "images/tileset2.png", {src:"images/j_e6a6aca6.png", weight:15, name:"tileset3"}]
// return an object composed of the loaded elements
// in:	array<Object> || array<String> arr
//		function act
// out:	set<Object>
var gamelib_loading_progress = 0;
function loadMedia(arr, act){
	gamelib_loading_progress = 0;
	act = act || function(){};
	var sum = 0;
	var src = "";
	var type = "";
	var name = "";
	var output = {};
	
	for(var i=0;i<arr.length;++i){
		sum += arr[i].weight || 1;
		src = arr[i].src || arr[i];
		name = arr[i].name || src;
		type = arr[i].type || defineFormat(src);
		
		var tmp;
		switch(type){
			case "image":
				tmp = new Image();
				tmp.src = src;
				break;
			case "audio":
				tmp = new Audio([src]);
				break;
			case "video":
				tmp = new Video(src);
				break;
			case "script":
				tmp = new Script(src);
		}
		
		tmp.weight = arr[i].weight || 1;
		if(type == "audio"){
			tmp.addEvent("canplaythrough", function(){
				gamelib_loading_progress += this.weight;
				act(gamelib_loading_progress/sum*100);
			}, false);
		}
		else{
			tmp.addEvent("load", function(){
				gamelib_loading_progress += this.weight;
				act(gamelib_loading_progress/sum*100);
			}, false);
		}
		
		output[name] = tmp;
	}
	return output;
}

// *private*
// return the format of a filename
function defineFormat(name){
	if(false){
		var match = true;
		var i=1;
		var type = defineFormat(name[0]);
		while(match && name[i]){
			if(type != defineFormat(name[i++])) match = false;;
		}
		if(!match) throw "Media type doesn\'t match";
		else return type;
	}
	else{
		var type = false;
		if(0 < name.lastIndexOf('.')){
			var ext = name.substring(name.lastIndexOf('.')+1);
			switch(ext){
				case "jpg":
				case "jpeg":
				case "png":
				case "gif":
				case "tif":
				case "bmp":
					type = "image";
					break;
				case "mp3":
				case "ogg":
				case "m4a":
				case "wma":
				case "raw":
				case "wav":
					type = "audio";
					break;
				case "mp4":
				case "avi":
				case "wmv":
				case "mov":
				case "flv":
				case "mkv":
				case "mpg":
				case "ogv":
				case "webm":
					type = "video";
					break;
				case "js":
					type = "script";
			}
		}
	}
	return type;
}

// *private*
// define the video object if not exists
var Video = Video || function(src){
	var elm = document.createElement("video");
	elm.preload = "auto";
	elm.src = src;
	return elm;
};

var Audio = function(srcs){
	var elm = document.createElement("Audio");
	elm.preload = "auto";
	for(var i=0;i<srcs.length;++i){
		var s = document.createElement("source");
		s.src = srcs[i];
		elm.appendChild(s);
	}
	return elm;
}

var Script = Script || function(src){
	var elm = document.createElement("script");
	document.body.appendChild(elm);
	elm.src = src;
	return elm;
};

// init usefull variables with canvas' id
// in:	array<string> id
//out: array<object> canvas + context
function init(ids){
	var canvas = [];
	for(var i=0;i<ids.length;++i){
		canvas[ids[i]] = {};
		canvas[ids[i]].can = getById(ids[i]);
		canvas[ids[i]].ctx = canvas[ids[i]].can.getContext("2d");
	}
	
	// window.raf = function(o){ setTimeout(o, 100); };
	
	window.raf = window.requestAnimationFrame || 
				window.mozRequestAnimationFrame || 
				window.webkitRequestAnimationFrame || 
				window.msRequestAnimationFrame;
	
	HTMLElement.prototype.addEvent = HTMLElement.prototype.addEventListener;
	window.addEvent = window.addEventListener;
	
	return canvas;
}

// clear whole canvas
function clear(){
	window.ctx.clearRect(0, 0, window.can.width, window.can.height);
}

// set function to execute on each step
// in:	array<function> arr
function setFunction(arr){
	window.drawingFunction = arr;
}

// execute all function and step next
function step(){
	raf(step);
	for(var i=0;i<window.drawingFunction.length;++i){
		window.drawingFunction[i]();
	}
}

// draw a rectangle
// in:	x, y, w, h int
//		*optional* fill, stroke string
function rect(x, y, w, h, fill, stroke){
	makePath(function(){
		window.ctx.rect(x, y, w, h);
	}, fill, stroke);
}

// draw a circle
// in:	x, y, r int
//		*optional* fill, stroke string
function circ(x, y, r, fill, stroke){
	makePath(function(){
		window.ctx.arc(x, y, r, 0, 2*Math.PI, true);
	}, fill, stroke);
}

var Shape = function(x, y, fill, stroke){
	this.posx = x;
	this.posy = y;
	this.fillStyle = fill;
	this.stokeStyle = stroke;
	
	this.draw = function(){
		makePath();
	}
}

// add an image to the canvas. Can have a source x, y, width and height and a destination width and height
// in:	img Image
//		x, y int
//		*optional* sx, sy int
//		*optional* sw, sh int
//		*optional* dw, dh int
function image(img, x, y, sx, sy, sw, sh, dw, dh){
	makePath(function(){
		window.ctx.drawImage();
	});
}

// *private*
// generic function for path
function makePath(act, fill, stroke){
	window.ctx.beginPath();
	act();
	if(fill){
		window.ctx.fillStyle = fill;
		window.ctx.fill();
	}
	if(stroke){
		window.ctx.strokeStyle = stroke;
		window.ctx.stroke();
	}
	window.ctx.closePath();
}

// class for coordinates
var Coord = function(){
	this.x = 0;
	this.y = 0;
	
	function setX(v){
		this.x = v;
	}
	function setY(v){
		this.y = v;
	}
	
	function getX(){
		return this.x;
	}
	function getY(){
		return this.y;
	}
	
	function distanceTo(c){
		return Math.sqrt(Math.pow((this.x-c.getX()), 2)+Math.pow((this.y-c.getY()), 2));
	}
};

// return the element matching id
// in:	string id
// out:	element
function getById(id){
	return document.getElementById(id);
}

// return all elements matching classname (cross-browser)
// in:	string c
//		*optional* element elm
// out:	array<element>
function getByClass(c, elm){
	elm = elm || document;
	if (!elm.getElementsByClassName){
		var elements = elm.getElementsByTagName('*'),
		i=0,
		nodeList = [],
		reg = new RegExp('(^|\\s)' + c + '(\\s|$)')

		for (i=0;i<elements.length;++i){
			if(elements[i].className.match(reg) !== null){
				nodeList.push(elements[i]);
			}
		}
		return nodeList;
	}
	else{
		return elm.getElementsByClassName(c);
	}
}

function log(mess){
	console.log(mess);
}