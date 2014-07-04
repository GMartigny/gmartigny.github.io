var g = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager),
	d = [2, 2, 1, 1, 2, 2, 3, 3],
	p = i = s = b = 0,
	r = false,
	f = GameManager.prototype.move+"";
eval("GameManager.prototype.move="+f.substr(0,f.length-1)+"g.actuate(); }");

$(".game-message").classList.remove("game-over");

function start(){
	if(g.isGameTerminated()) g.restart();
	i = setInterval(function(){
		var t = r? Math.floor(Math.random()*4) : d[p++];
		g.move(t);
		if(p>=d.length){
			p=0;
			if(s == g.score) g.move(0);
			s = g.score;
		}
		g.actuate();
		if(g.isGameTerminated()) pause.call(b);
	}, 100);
	this.innerHTML = "Pause";
	this.onclick = pause;
	return false;
}
function pause(){
	clearInterval(i);
	this.innerHTML = "Start";
	this.onclick = start;
	return false;
}
function toggleRandom(){
	if(this.checked) r = true;
	else r = false;
}

(function addControl(){
	var h = document.createElement("div");
	h.id = "automation";
	h.className = "game-container";
	h.style.position = "fixed";
	h.style.right = "50px";
	h.style.top = "40%";
	h.style.padding = "0";
	h.style.width = h.style.height = "auto";
		var m = document.createElement("div");
		m.className = "game-message";
		m.style.display = "block";
		m.style.position = "relative";
		m.style.padding = "15px";
			var tt = document.createElement("stong");
			tt.innerHTML = "Automatisation";
		m.appendChild(tt);
			b = document.createElement("a");
			b.innerHTML = "Start";
			b.className = "retry-button";
			b.onclick = start;
			b.style.margin = "5px 0";
			b.style.display = "block";
		m.appendChild(b);
			var lr = document.createElement("label");
			lr.innerHTML = "Random : ";
			lr.setAttribute("for", "rand");
		m.appendChild(lr);
			var cr = document.createElement("input");
			cr.type = "checkbox";
			cr.id = "rand";
			cr.onclick = toggleRandom;
		m.appendChild(cr);
	h.appendChild(m);
	document.body.appendChild(h);
})();