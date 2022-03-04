var version = "dev 0.24";
var fps_time = 0;
var fps_wait = 0;
var loop_time = 0;
var debug = false;
var PI = Math.PI;

var map;

var keys = {
	up : false,
	right : false,
	down : false,
	left : false
};

var me = false;
var others = [];

var STEP = 0.1;

var clockRatio = 6000;
var clock = 0*clockRatio;
var color = [
	{r:160,g:80,b:160}, // rougeoiment
	{r:0,g:0,b:0}, // nuit noire
	{r:0,g:0,b:100} // crepuscule
];

var weather = 0;

var tickUpdate = 0;

function start(){
	clock = localStorage.h || 0;
	media.piano.volume = localStorage.v || 0.5;
	try{
		setVolumePos(slider.piano, media.piano.volume);
	}
	catch(e){
		log("fail");
	}

	getById("load").innerHTML = loadingTime;
	getById("version").innerHTML = version;
	if(debug){
		getById("debug").style.display = "";
	}

	canvas.entities.ctx.font = "12px Calibri,Geneva,Arial";


	if(localStorage.me){ // on connait déjà
		initPerso(localStorage.me);
	}
	else{ // ouvre la dialog d'entré pseudo
		getById("dialog").style.display = "";
		getById("cache").style.display = "";
		getById("entreePseudo").focus();
	}
}

// knowPseudo : [false | personne connue]
function initPerso(user){

	// si la personne existe déjà
	if(user){
		// getinfos //
		// utilisation des données
		me = JSON.parse(user);
		setMap(me.mapx, me.mapy);
		me.img = media[me.sexe];
		me.ani = 1;
		me.mov = false;
		me.mess = [];
	}
	else{
		var pseudo = getById("entreePseudo").value;
		if(2 <= pseudo.length && pseudo.length <= 20){
			getById("dialog").style.display = "none";
			getById("entreePseudo").value = "";
			var sexe = (getById("fille").checked) ? "fille" : "gars";
			if(getById("remem").checked) localStorage["pseudo"] = pseudo; // si on demande à être enregistré
			// me par defaut
			me = {
				pseudo : pseudo,
				x : 5,
				y : 8,
				mapx : 0,
				mapy : 0,
				sexe : sexe,
				img : media[sexe],
				dir : 0,
				ani : 1,
				mov : false,
				mess : []
			};
			setMap(0,0);
			// setinfos //
		}
		else{
			return false;
		}
	}

	window.onkeydown = keyDown;
	window.onkeyup = keyUp;

	getById("infos").style.display = "";
	getById("cache").style.display = "none";
	getById("loader").style.display = "none";
	getById("pseudo").innerHTML = me.pseudo;

	// lancement des récupérationet enregistrement des données
	tickUpdate = setInterval(update, 300);
}

// gestion des touches
function keyDown(ev){
//log(ev.keyCode);
	switch(ev.keyCode){
		case 38:
		case 90:
			keys.up = true;
			keys.down = (keys.down || keys.down === "") ? "" : false;
			break;
		case 39:
		case 68:
			keys.right = true;
			keys.left = (keys.left || keys.left === "") ? "" : false;
			break;
		case 40:
		case 83:
			keys.down = true;
			keys.up = (keys.up || keys.up === "") ? "" : false;
			break;
		case 37:
		case 81:
			keys.left = true;
			keys.right = (keys.right || keys.right === "") ? "" : false;
			break;
		case 13:
			window.onkeydown = null;
			window.onkeyup = null;
			writeMessage();
	}
}
function keyUp(ev){
	// log(ev.keyCode);
	switch(ev.keyCode){
		case 38:
		case 90:
			keys.up = false;
			keys.down = (keys.down === "") ? true : false;
			break;
		case 39:
		case 68:
			keys.right = false;
			keys.left = (keys.left === "") ? true : false;
			break;
		case 40:
		case 83:
			keys.down = false;
			keys.up = (keys.up === "") ? true : false;
			break;
		case 37:
		case 81:
			keys.left = false;
			keys.right = (keys.right === "") ? true : false;
			break;
		case 49:
			//help
			break;
		case 50:
			// print screen
			//var s = can.toDataURL("image/png");
			break;
		case 51:
			// debug
			debug = !debug;
			getById("debug").style.display = (debug) ? "" : "none";
	}
}

// gestion de la barre de chat
function writeMessage(){
	keys.up = false; keys.right = false; keys.down = false; keys.left = false;
	getById("chat").style.display = "";
	setTimeout(function(){
		getById("in").focus();
	}, 50);
}
function sendMessage(){
	var inp = getById("in");
	getById("chat").style.display = "none";
	var message = inp.value;
	inp.value = "";
	inp.blur()
	window.onkeydown = keyDown;
	window.onkeyup = keyUp;
	if(message != "" && message.length <= 100){
		// send message //
		openBubble(me, message);
	}
}

// création XHR
function getXHR() {
	var xhr = null;
	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} else {
			xhr = new XMLHttpRequest();
		}
	} else {
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}
	return xhr;
}

// retourne le json de la carte
function setMap(){
	var xhr = getXHR();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			currentMap = JSON.parse(xhr.responseText);
			// dessin du sol
			for(var i=0;i<19;i++){
				for(var j=0;j<25;j++){
					canvas.back.ctx.drawImage(media.tiles, (currentMap.data[i][j]%4)*32, ((currentMap.data[i][j]/4)<<0)*32, 32, 32, j*32, i*32, 32, 32);
				}
			}
		}
	};
	if(me) xhr.open("GET", "maps/"+maps[me.mapx][me.mapy]+".json", false);
	else xhr.open("GET", "maps/"+maps[0][0]+".json", false);
	xhr.send(null);
}

function makeExchange(action){
	var xhr = getXHR();

	var url;
	var callback;
	switch(action){
		case "":
			url = "";
			callback = callBackNews;
			break;
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			callback(xhr.responseText); // C'est bon \o/
		}
	};

	xhr.open("GET", url, true);
	xhr.send(null);
}

// All callbacks //

function callBackNews(jsonResponse){
	// create, move or destroy player //
	for(var i=0;i<others.length;i++){
		others[i]
		if(jsonResponse[others[i].pseudo].mess){

		}
	}
	// load new message //
}

function move(){
	me.mov = true;

	// calcul de la direction
	if(keys.down){
		me.y += STEP;
		me.dir = 0;
		if(keys.left){
			me.x -= STEP;
			me.dir = 7;
		}
		else if(keys.right){
			me.x += STEP;
			me.dir = 1;
		}
	}
	else if(keys.up){
		me.y -= STEP;
		me.dir = 4;
		if(keys.left){
			me.x -= STEP;
			me.dir = 5;
		}
		else if(keys.right){
			me.x += STEP;
			me.dir = 3;
		}
	}
	else if(keys.right){
		me.x += STEP;
		me.dir = 2;
	}
	else if(keys.left){
		me.x -= STEP;
		me.dir = 6;
	}
	else{
		me.ani = 1;
		me.mov = false;
	}

	if(me.mov){
		animate(me);
	}
}

function animate(perso){
	// incrément de l'animation
	perso.ani += STEP/2;

	// détection des bords
	perso.x = (perso.x < 0) ? 0 : ((perso.x > 24) ? 24 : perso.x);
	perso.y = (perso.y < 0) ? 0 : ((perso.y > 18) ? 18 : perso.y);
}

function teleport(){
	var cell = currentMap.data[Math.round(me.y)][Math.round(me.x)];
	if(cell >= 16){
		if(cell == 16){ // down
			++me.mapx;
			me.y = 0.6;
		}
		else if(cell == 17){ // right
			++me.mapy;
			me.x = 0.6;
		}
		else if(cell == 18){ // up
			--me.mapx;
			me.y = 17.4;
		}
		else if(cell == 19){ // left
			--me.mapy;
			me.x = 23.4;
		}
		setMap();
	}
}

function draw(){
	if(debug) loop_time = Date.now();

	if(1 < Math.random()+0.001){
		media.piano.play();
		log("play");
	}

	canvas.entities.ctx.clearRect(0, 0, 800, 608);
	canvas.bubbles.ctx.clearRect(0, 0, 800, 608);
	raf(draw);

	canvas.entities.ctx.font = "12px Calibri,Geneva,Arial";
	// dessin des autres joueurs
	// for(var i=0;i<others.length;i++){
		// var one = others[i];
		// if(one.mov) animate(one);

		// drawPlayer(one);
	// }

	// dessin du joueur
	if(me){
		move();
		drawPlayer(me);
		teleport();
		//bubble(me.x, me.y, "coucou");
	}

	// calcul et dessin de l'horloge
	canvas.entities.ctx.save();
	canvas.entities.ctx.translate(799, 607);
	canvas.entities.ctx.rotate(-(clock*PI)/(12*clockRatio));
	canvas.entities.ctx.drawImage(media.horloge, -120, -120);
	canvas.entities.ctx.restore();

	canvas.entities.ctx.drawImage(media.contour, 615, 482);

	var h = (clock/clockRatio)<<0;
	h = (h < 10) ? "0"+h : h;
	var m = Math.round(((clock - h*clockRatio)/clockRatio)*60);
	m = (m < 10) ? "0"+m : m;
	canvas.entities.ctx.font = "16px Calibri,Geneva,Arial";
	writeText(633, 601, h + ":" + m);

	// gestion de l'heure (coloration et alpha)
	if(24*clockRatio <= ++clock){
		clock = 0;
	}
	var alpha = Math.round((Math.sin(PI*(clock+(4.5*clockRatio))/(clockRatio*12))*1.5-0.25)*1000)/1000;
	if(alpha < 0) alpha = 0;
	else if(0.5 < alpha) alpha = 0.5;
	var colorIndex = Math.round((Math.cos(PI*(clock+(2.5*clockRatio))/(clockRatio*12))+1)*1000)/1000;
	if(colorIndex < 0) colorIndex = 0;
	else if(2 < colorIndex) colorIndex = 2;

	var f = colorIndex << 0;
	var c = (colorIndex == f) ? f : f+1;
	var part = colorIndex-f;
	var r = (color[f].r*(1-part))+(color[c].r*part);
	var g = (color[f].g*(1-part))+(color[c].g*part);
	var b = (color[f].b*(1-part))+(color[c].b*part);

	// dessin de l'ombre
	canvas.entities.ctx.fillStyle = "rgba("+Math.round(r)+","+Math.round(g)+","+Math.round(b)+", "+ alpha +")";
	canvas.entities.ctx.fillRect(0, 0, 800, 608);

	if(debug){ // affichge du mode debug
		if((Date.now() - fps_wait) > 1000){
			getById("loop").innerHTML = Date.now() - loop_time;
			getById("fps").innerHTML = Math.round(1000 / (Date.now() - fps_time));
			fps_wait = Date.now();
		}
		fps_time = Date.now();
	}
}

function drawPlayer(one){

	// calcul et dessin du pseudo
	var x = one.x * 32 + 16 - (one.pseudo.length/2)*5;
	var y = one.y * 32 - 3;
	if(y < 12){
		y = (one.y+1) * 32 + 12;
	}
	if(x < 0){
		x = 0;
	}
	else if(x + one.pseudo.length*6 > canvas.entities.can.offsetWidth){
		x = canvas.entities.can.offsetWidth - one.pseudo.length*6;
	}
	writeText(x, y, one.pseudo);

	// dessin et gestion des bulles
	for(var i=one.mess.length-1;i>=0;i--){
		if(one.mess[i].classList.contains("finished")){ // destruction du mess si finit afficher
			for(var j=i;j<one.mess.length-1;j++){
				one.mess[j] = one.mess[j+1];
			}
			one.mess.length--;
		}
		else{
			placeBubble(one, i);
		}
	}

	// dessin du perso
	ani = Math.round(Math.sin(one.ani*PI))+1;
	canvas.entities.ctx.drawImage(one.img, one.dir*32, ani*32, 32, 32, one.x*32, one.y*32, 32, 32);
}

function bubble(startX, startY, text){

	var crn = 8;
	var que = 5;
	var pre = 0;
	var messHeight = 2*crn;
	var messWidth = 2*crn + 2*que + 10;
	var x = startX * 32 + 16;
	var y = startY * 32 - 12;
	var mW = messWidth - 2*crn - 2*que - pre;
	var mH = messHeight - 2*crn;
	canvas.bubbles.ctx.beginPath();
	canvas.bubbles.ctx.moveTo(x, y);
	canvas.bubbles.ctx.bezierCurveTo(x, y-que/2, x+que/2, y-que, x+que, y-que);
	x+=que; y-=que;
	canvas.bubbles.ctx.lineTo(x+mW, y);
	x+=mW;
	canvas.bubbles.ctx.bezierCurveTo(x+crn/2, y, x+crn, y-crn/2, x+crn, y-crn);
	x+=crn; y-=crn;
	canvas.bubbles.ctx.lineTo(x, y-mH);
	y-=mH;
	canvas.bubbles.ctx.bezierCurveTo(x, y-crn/2, x-crn/2, y-crn, x-crn, y-crn);
	x-=crn; y-=crn;
	canvas.bubbles.ctx.lineTo(x-mW-2*que-pre, y);
	x-=mW+2*que+pre;
	canvas.bubbles.ctx.bezierCurveTo(x-crn/2, y, x-crn, y+crn/2, x-crn, y+crn);
	x-=crn; y+=crn;
	canvas.bubbles.ctx.lineTo(x, y+mH);
	y+=mH;
	canvas.bubbles.ctx.bezierCurveTo(x, y+crn/2, x+crn/2, y+crn, x+crn, y+crn);
	x+=crn; y+=crn;
	canvas.bubbles.ctx.lineTo(x+pre, y);
	x+=pre;
	canvas.bubbles.ctx.bezierCurveTo(x+que/2, y, x+que, y+que/2, x+que, y+que);

	canvas.bubbles.ctx.strokeStyle = "rgba(0,0,100,0.9)";
	canvas.bubbles.ctx.fillStyle = "rgba(100,100,240,0.8)";
	canvas.bubbles.ctx.stroke();
	canvas.bubbles.ctx.fill();
	writeText(startX*32-5, startY*32-30, "coucou");
}

function openBubble(owner, mess){
	var newBubble = getById("bulle").cloneNode(true);
	document.body.appendChild(newBubble);
	var text = newBubble.getElementsByClassName("text")[0];
	text.innerHTML = mess;
	newBubble.style.display = "";
	owner.mess[owner.mess.length] = newBubble;
	placeBubble(owner, owner.mess.length-1);
	setTimeout(function(){
		text.style.height = text.scrollHeight - 10;
	}, 10);
	setTimeout(function(){
		newBubble.style.opacity = "0";
		setTimeout(function(){
			newBubble.classList.add("finished");
			document.body.removeChild(newBubble);
		}, 300);
	}, mess.length * 50 + 2000);
}
function placeBubble(one, i){
	var previous = (one.mess[i+1] == undefined) ? one.y*32 + canvas.entities.can.offsetTop - 8 : one.mess[i+1].offsetTop;
	one.mess[i].style.top = previous - one.mess[i].offsetHeight - 5;
	if(one.mess[i].offsetTop < canvas.entities.can.offsetTop) one.mess[i].style.top = canvas.entities.can.offsetTop;
	one.mess[i].style.left = one.x*32 + canvas.entities.can.offsetLeft + 8;
	if(one.mess[i].offsetLeft + one.mess[i].offsetWidth > canvas.entities.can.offsetWidth + canvas.entities.can.offsetLeft)
		one.mess[i].style.left = canvas.entities.can.offsetWidth + canvas.entities.can.offsetLeft - one.mess[i].offsetWidth;

	var point = one.mess[i].getElementsByClassName("point")[0];
	point.style.left = one.x*32 + canvas.entities.can.offsetLeft - one.mess[i].offsetLeft + 14;
}

function writeText(x, y, text){
	var ctx = canvas.entities.ctx;
	ctx.fillStyle = "#fff";
	ctx.fillText(text, x, y+1);
	ctx.fillText(text, x, y-1);
	ctx.fillText(text, x+1, y);
	ctx.fillText(text, x-1, y);
	ctx.fillStyle = "#000";
	ctx.fillText(text, x, y);
}

function disconect(){
	keys.up = false;keys.right = false;keys.down = false;keys.left = false;
	window.onkeydown = null;
	window.onkeyup = null;
	getById("infos").style.display = "none";
	clearInterval(tickUpdate);
	localStorage.removeItem("me");
	me = false;
	start();
}

function update(){
	localStorage.me = JSON.stringify({
		pseudo : me.pseudo,
		sexe : me.sexe,
		x : me.x,
		y : me.y,
		dir : me.dir,
		mapx : me.mapx,
		mapy : me.mapy
	});
	localStorage.h = clock;
	localStorage.v = media.piano.volume;
}
function cbUpdate(reponse){

}
