var cnv;
var ctx;

var dragated = false;
var start = {
	x : 0,
	y : 0
};

var origin = {
	x : 400,
	y : 300
};
var points = {
	minX : -8,
	maxX : 8,
	minY : -6,
	maxY : 6
};

var funcs = [{
	id : 0,
	name : "f",
	doable : true,
	style : "red",
	res : function(x){
		return Math.pow(x, 3);
	}
}];

var lan

window.onload = init;
function init(){
	document.getElementById("add").getElementsByClassName("name")[0].focus();
	cnv = document.getElementById("can");
	ctx = cnv.getContext("2d");
	
	cnv.onmousewheel = function(e){
		e.preventDefault();
		zoom(e.wheelDelta);
	};
	cnv.onmousedown = function(e){
		dragated = true;
		e.preventDefault();
		start.x = e.clientX;
		start.y = e.clientY;
	};
	window.onmousemove = function(e){
		drag(e.clientX, e.clientY);
	};
	window.onmouseup = function(){
		dragated = false;
	};
	
	var clrP = document.getElementById("colorPicker");
	clrP.options[0].selected = true;
	color(clrP);
	
	draw();
}

function draw(){
	ctx.clearRect(0, 0, 800, 600);
	ctx.textBaseline = "top";
	ctx.font = "12pt Calibri";
	drawLandmark();
	var f = {};
	var x = 0, y = 0, i = 0, j = 0;
	var diffX = Math.abs(points.minX) + Math.abs(points.maxX);
	var diffY = Math.abs(points.minY) + Math.abs(points.maxY);
	
	for(var n in funcs){
		var done = false;
		f = funcs[n];
		if(f.doable){
			ctx.strokeStyle = f.style;
			ctx.fillStyle = f.style;
			ctx.moveTo(0, f.res(0));
			ctx.beginPath();
			for(i=1;i<800;++i){
				x = (i - origin.x)/800*diffX;
				y = f.res(x);
				j = origin.y - (y*600/diffY);
				if(5 < j && j < 575 && !done){
					ctx.fillText(f.name+"()", i+8, j);
					done = true;
				}
				ctx.lineTo(i, j);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
}

function drawLandmark(){
	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#000000";
	
	ctx.moveTo(0, origin.y);
	ctx.lineTo(800, origin.y);
	ctx.moveTo(origin.x, 0);
	ctx.lineTo(origin.x, 600);
	
	var min = max = true;
	var i = 1;
	var step = 800/(Math.abs(points.minX) + Math.abs(points.maxX));
	ctx.fillText(1, origin.x+step-5, origin.y+5);
	while(min || max){
		if(min){
			ctx.moveTo(origin.x-i*step, origin.y-5);
			ctx.lineTo(origin.x-i*step, origin.y+5);
			if(origin.x-i*step < 0) min = false;
		}
		if(max){
			ctx.moveTo(origin.x+i*step, origin.y-5);
			ctx.lineTo(origin.x+i*step, origin.y+5);
			if(800 < origin.x+i*step) max = false;
		}
		++i;
	}
	min = max = true;
	i = 1;
	step = 600/(Math.abs(points.minY) + Math.abs(points.maxY));
	ctx.fillText(1, origin.x-15, origin.y-step-10);
	while(min || max){
		if(min){
			ctx.moveTo(origin.x-5, origin.y-i*step);
			ctx.lineTo(origin.x+5, origin.y-i*step);
			if(origin.y-i*step < 0) min = false;
		}
		if(max){
			ctx.moveTo(origin.x-5, origin.y+i*step);
			ctx.lineTo(origin.x+5, origin.y+i*step);
			if(800 < origin.y+i*step) max = false;
		}
		++i;
	}
	
	ctx.stroke();
	ctx.closePath();
}

function zoom(dir){
	
	var mod = (dir < 0) ? 1.2 : 1/1.2;
	
	points.minX *= mod;
	points.maxX *= mod;
	points.minY *= mod;
	points.maxY *= mod;
	draw();
}

function drag(x, y){
	if(dragated){
		origin.x += x - start.x;
		origin.y += y - start.y;
		draw();
		start.x = x;
		start.y = y;
	}
}

function addFunc(form){
	if(form.name.value !== "" && form.func.value !== ""){
		
		var res = parsing(form.func.value);
		
		if(res){
			var ul = document.getElementById("funcs");
			var li = document.getElementById("patern").cloneNode(true);
			li.id = "f" + funcs.length;
			li.getElementsByClassName("color")[0].style.background = form.colorPicker.value;
			li.getElementsByClassName("name")[0].innerHTML = form.name.value;
			li.getElementsByClassName("func")[0].innerHTML = form.func.value;
			ul.appendChild(li);
			setTimeout(function(){ li.className = "final"; }, 1);
			
			var id = (funcs[funcs.length-1])? funcs[funcs.length-1].id + 1 : 0;
			
			funcs[funcs.length] = {
				id : id,
				name : form.name.value,
				doable : (res)? true : false,
				style : form.colorPicker.value,
				res : res
			};
			
			draw();
			
			form.reset();
			color(form.colorPicker);
			document.getElementById("add").getElementsByClassName("name")[0].focus();
		}
	}
	return false;
}

Array.prototype.out = function(n){
	this[n] = this[this.length-1];
	--this.length;
};

function removeFunc(btn){
	btn.parentNode.className = "";
	var id = btn.parentNode.id;
	id = id.substr(1);
	
	var done = false;
	for(var i=0;i<funcs.length || !done;++i){
		if(funcs[i].id == id){
			funcs.out(i);
			done = true;
		}
	}
	
	setTimeout(function(){
		btn.parentNode.parentNode.removeChild(btn.parentNode);
	}, 500);
	draw();
}

function parsing(s){
	try{
		var add = /\+/gi;
		var rem = /-/gi;
		var mul = /\*/gi;
		var div = /\//gi;
		var pow = /\^/gi;
		var par = {
			o : /\(/gi,
			c : /\)/gi
		};
		var sqrt = /sqrt/gi;
		var exp = /exp/gi;
		var pi = /pi/gi;
		var abs = /|/gi;
		var trigo = {
			sin : /sin/gi,
			cos : /cos/gi,
			tan : /tan/gi
		};
		var x = /x/gi;
		var num = /[0-9]/gi;
		
		for(k in trigo){
			s = s.replace(trigo[k], "Math."+k);
		}
		s = s.replace(sqrt, "Math.sqrt");
		s = s.replace(exp, "Math.exp");
		s = s.replace(pi, "Math.PI");
		
		var f = s;
		
		var res = new Function("x", "return " + f);
		return res;
	}
	catch(e){
		console.log(e.message);
		return false;
	}
}

function color(sel){
	sel.style.backgroundColor = sel.options[sel.selectedIndex].value
}

function change(li){
	
}

function switchLandmark(swi){
	if(swi.classList.contains("on")){
		swi.classList.remove("on");
		swi.classList.add("off");
	}
	else if(swi.classList.contains("off")){
		swi.classList.remove("off");
		swi.classList.add("on");
	}
}