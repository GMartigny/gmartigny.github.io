
// load all media in a array and do a function (act) with weight as parameter for each
// ex : [{src:"images/tileset.png", type:"image", weight:42}, "images/tileset2.png", {src:"images/j_e6a6aca6.png", weight:15, name:"tileset3"}]
// return an object composed of the elements
// in:	array<Object> || array<String> arr
//		function act
// out:	array<Object>
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
				tmp = new Image(src);
				break;
			case "audio":
				tmp = new Audio([src]);
				break;
			case "video":
				tmp = new Video(src);
				break;
			case "script":
				tmp = new Script(src);
				break;
			case "text":
				tmp = {};
				get(src, function(e){
					gamelib_loading_progress += tmp.weight;
					var n = tmp.name;
					output[n] = this.response;
					act(gamelib_loading_progress/sum*100, n);
				});
		}
		
		tmp.weight = arr[i].weight || 1;
		tmp.name = name;
		if(type == "audio"){
			tmp.addEvent("canplaythrough", function(){
				gamelib_loading_progress += this.weight;
				act(gamelib_loading_progress/sum*100, this.name);
			}, false);
		}
		else{
			try{
				tmp.addEvent("load", function(){
					gamelib_loading_progress += this.weight;
					act(gamelib_loading_progress/sum*100, this.name);
				}, false);
			}
			catch(e){}
		}
		
		output[name] = tmp;
	}
	return output;
}

// *private*
// return the format of a filename
function defineFormat(name){
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
				break;
			case "txt":
			case "json":
				type = "text";
		}
	}
	return type;
}

// enhance HTML element
HTMLElement.prototype.addEvent = HTMLElement.prototype.addEventListener;
window.addEvent = window.addEventListener;

// use good socket
window.WebSocket = window.WebSocket || window.MozWebSocket;

// cross-browser Request Animation Frame
window.raf = window.requestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.msRequestAnimationFrame ||
			function(f){ setTimeout(f, 16); };

function Image(url){
	url = url || "";
	var elm = document.createElement("img");
	elm.src = url;
	return elm;
}

var Video = Video || function(src){
	var elm = document.createElement("video");
	elm.preload = "auto";
	elm.src = src;
	return elm;
};

function Audio(srcs){
	var elm = document.createElement("Audio");
	elm.preload = "auto";
	if(srcs instanceof Array){
		for(var i=0;i<srcs.length;++i){
			var s = document.createElement("source");
			s.src = srcs[i];
			elm.appendChild(s);
		}
	}
	return elm;
}

function Script(src){
	var elm = document.createElement("script");
	elm.src = src;
	document.head.appendChild(elm);
	return elm;
};

// clear whole context
CanvasRenderingContext2D.prototype.clear = function(){
	this.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

// *private*
// generic function for drawing path
CanvasRenderingContext2D.prototype.makePath = function(act){
	this.beginPath();
	act();
	this.stroke();
	this.fill();
	this.closePath();
}

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
function distance(one, two){
	return Math.sqrt(up(two.x-one.x)+up(two.y-one.y));
}
function up(x){
	return Math.pow(x,2);
}
var M = Math;

Array.prototype.out = function(o){
	var index = this.indexOf(o);
	if(0 <= index) this.splice(index, 1);
	else{
		throw o+" not find in this array";
	}
}

function get(url, f){
	var xhr = new XMLHttpRequest();
	xhr.open("get", url);
	xhr.onload = f;
	xhr.send();
	return xhr;
}

function log(mess){
	console.log(mess);
}