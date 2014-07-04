var fond = new Image();
var patern;
var canvas;
var ctx;
var planets = null;
var inter = null;
var traine = 0;
var temps = false;
var alege = 0;
var origine = {x:0,y:0};
var nbPlanet = 50;
var G = 0.1;
var imgScreen;

window.onload = function(){

	// l'image qui accueil le screen
	imgScreen = document.getElementById("imgScreen");
	imgScreen.onclick = function(){
		location.href = this.src;
	};

	// la div menu d'option
	var change = document.getElementById("change");
	change.style.top = (document.body.clientHeight - 15) + "px";
	change.onmouseover = function(){
		this.style.top = (document.body.clientHeight - this.clientHeight) + "px";
	};
	change.onmouseout = function(){
		this.style.top = (document.body.clientHeight - 15) + "px";
	};
	
	// la div pour le screen
	var screen = document.getElementById("screen");
	screen.style.top = document.body.clientHeight + "px";
	screen.onmouseover = function(){
		this.style.top = (document.body.clientHeight - this.clientHeight) + "px";
	};
	screen.onmouseout = function(){
		this.style.top = (document.body.clientHeight - 15) + "px";
	};
	
	// champ pour le nombre de planet générée
	nbPlanet = document.getElementById("nb").value;
	document.getElementById("nb").onkeyup = function(){
		if(this.value > 100){
			this.value = 100;
		}
		else if(this.value < 0){
			this.value = 0;
		}
		else if(!(this.value >= 0)){
			this.value = (parseInt(this.value)>0) ? parseInt(this.value) : "";
		}
		nbPlanet = this.value;
	};
	
	// champs de modification de gravité
	G = document.getElementById("grav").value;
	document.getElementById("grav").onkeyup = function(){
		if(this.value < 0){
			this.value = 0;
		}
		else if(!(this.value >= 0)){
			this.value = (parseInt(this.value)>0) ? parseInt(this.value) : "";
		}
		G = this.value;
	}
	
	// slider pour le niveau de trainée
	var drag = false;
	var depart;
	var slider = document.getElementById("trSlider");
	slider.onmousedown = function(event){
		drag = true;
		depart = event.clientX - parseInt(this.style.marginLeft);
		event.preventDefault();
	};
	document.getElementById("trContainer").onmousemove = function(event){
		if(drag){
			var diff = event.clientX - depart;
			if(0 <= diff && diff <= 124){
				slider.style.marginLeft = diff + "px";
			}
		}
		event.preventDefault();
	};
	document.body.onmouseup = function(){
		traine = Math.round(parseInt(slider.style.marginLeft)/41.3);
		slider.style.marginLeft = (traine*41.3) + "px";
		drag = false;
	}

	// le fond d'écran trés moche !
	fond.src = "espace.png";
	inter = setInterval(troll, 7000);
	fond.onload = function(){
	
		clearInterval(inter);
		inter = null;
		document.getElementById("loading").style.display = "none";
		
		canvas = document.getElementById("can");
		canvas.style.display = "";
		
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
		
		// Gestionnaire de clic
		canvas.onmousedown = function(ev){
			var rclic;
			if (!ev) var ev = window.event;
			if (ev.which) rclic = (ev.which == 3);
			else if (ev.button) rclic = (ev.button == 2);
			
			if(rclic){
				prtscreen();
			}
			else{
				genere(ev.clientX, ev.clientY);
			}
		};
		canvas.oncontextmenu = function(){
			return false;
		};
		
		ctx = canvas.getContext("2d");
		
		window.onresize = function(){
			canvas.height = document.body.clientHeight;
			canvas.width = document.body.clientWidth;
			if(traine === 3){
				efface(1);
			}
			change.style.top = (canvas.height - 15) + "px";
			screen.style.top = (canvas.height - 15) + "px";
		};
		
		patern = ctx.createPattern(fond,'repeat');
		
		// lance l'animation
		genere(canvas.width/2,canvas.height/2);
	};
	
}

// affiche un message à la con aléatoire
function troll(){
	var mess = "";
	var tirage = rand(5);
	
	switch(tirage){
		case 0:
			mess = "56K powaa";
			break;
		case 1:
			mess = "Et t'arrives à naviguer avec ça ?";
			break;
		case 2:
			mess = "Ca va pas tarder.";
			break;
		case 3:
			mess = "Ca y est presque !!";
			break;
		case 4:
			mess = "Quand ce sera fini, tu vas adorer.";
			break;
		case 5:
			mess = "Heureusement que ça vaut le coup d'attendre.";
			break;
	}
	document.getElementById("mess").innerHTML = mess;
}

function efface(alpha){
	if(alpha !== 0){
		if(alege < 2){
			ctx.fillStyle = patern;
		}
		else{
			ctx.fillStyle = "black";
		}
		ctx.globalAlpha = alpha;
		ctx.fillRect(origine.x,origine.y,canvas.width,canvas.height);
		ctx.globalAlpha = 1;
	}
}

function genere(x, y){
	
	if(planets !== null){
		if(alege < 2 && traine > 2){
			prtscreen();
		}
	}
	
	efface(1);
	
	clearInterval(inter);
	inter = null;
	
	planets = new Array();
	var tirx;
	var tiry;
	for(var i=0;i<nbPlanet;i++){
		tirx = (Math.random()*26-13);
		tiry = (Math.random()*26-13);
		planets[i] = {id:i, masse:6, posx:x+tirx*nbPlanet/2.5, posy:y+tiry*nbPlanet/2.5, vitx:tirx, vity:tiry, color:getColor()};
	}
	
	// cercle d'explosion
	var radius = 2 * nbPlanet;
	var nuke = ctx.createRadialGradient(x, y, radius/3, x, y, radius);
	nuke.addColorStop(0, "rgb(" + 255 + "," + 230 + "," + 51 + ")");
	nuke.addColorStop(0.9, "rgb(" + 255 + "," + 111 + "," + 4 + ")");
	nuke.addColorStop(1, "rgba(" + 255 + "," + 111 + "," + 4 + ", 0)");
	ctx.fillStyle = nuke;
	ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
	
	inter = setInterval(dessin, 40);
}

// retourne une couleur aléatoire
function getColor(){
	var color = {r:rand(255), g:rand(255), b:rand(255)};
	if(color.r + color.g + color.b < 200){
		return getColor();
	}
	else{
		return color;
	}
}

function dessin(){

	// alege : 0 = fond + degradé + prtscrn; 1 = fond + prtscrn; >1 = nothing
	if(temps){
		var fps = Math.round(1000 / ((new Date()).getTime() - temps));
		document.getElementById("fps").innerHTML = fps;
		if(alege < 2 && fps < 10){
			alege++;
		}
		else if(alege > 0 && fps > 12){
			alege--;
		}
		
	}
	temps = (new Date()).getTime();
		
	if(traine != 3){
		efface((traine) ? (1 - 0.2 * (traine+2)) : 1);
	}
	
	/*var bary = {x:0, y:0};
	var sommeMasse = 0;*/
	var radius;
	for(var i=0;i<planets.length;i++){
		
		/*bary.x += planets[i].posx * carre(planets[i].masse);
		bary.y += planets[i].posy * carre(planets[i].masse);
		sommeMasse += carre(planets[i].masse);*/
		
		planets[i].posx += planets[i].vitx;
		planets[i].posy += planets[i].vity;
		
		radius = Math.round(planets[i].masse); // Arc radius
		
		if(alege == 0){
			// Create gradients
			var grad = ctx.createRadialGradient(
				origine.x + planets[i].posx - radius/3,
				origine.y + planets[i].posy - radius/3,
				radius/3,
				origine.x + planets[i].posx,
				origine.y + planets[i].posy,
				radius);
			grad.addColorStop(0, "rgb(" + (planets[i].color.r+40) + "," + (planets[i].color.g+40) + "," + (planets[i].color.b+40) + ")");
			grad.addColorStop(0.9, "rgb(" + planets[i].color.r + "," + planets[i].color.g + "," + planets[i].color.b + ")");
			grad.addColorStop(1, "rgba(" + planets[i].color.r + "," + planets[i].color.g + "," + planets[i].color.b + ", 0)");
			ctx.fillStyle = grad;
			ctx.fillRect(origine.x + planets[i].posx-radius,  origine.y + planets[i].posy-radius,radius*2,radius*2);
		}
		else{
			ctx.beginPath();
			
			ctx.fillStyle = "rgb(" + (planets[i].color.r+20) + "," + (planets[i].color.g+20) + "," + (planets[i].color.b+20) + ")";
			ctx.arc(origine.x + planets[i].posx, origine.y + planets[i].posy, radius, 0, 2*Math.PI, true);
			ctx.fill();
			
			ctx.closePath();
		}
	}
	
	for(var i=0;i<planets.length;i++){
		rebond(planets[i]);
		gravite(planets[i]);
	}
	
	//origine.x = Math.sqrt(bary.x / sommeMasse);
	//origine.y = Math.sqrt(bary.y / sommeMasse);

}

// calcul des rebond
function rebond(planet){
	if(planet.posx <= 0 + planet.masse){
		planet.posx = planet.masse;
		planet.vitx = -planet.vitx;
		
	}
	else if(planet.posx >= canvas.width - planet.masse){
		planet.posx = canvas.width - planet.masse;
		planet.vitx = -planet.vitx;
	}
	
	if(planet.posy <= 0 + planet.masse){
		planet.posy = planet.masse;
		planet.vity = -planet.vity;
	}
	else if(planet.posy >= canvas.height - planet.masse){
		planet.posy = canvas.height - planet.masse;
		planet.vity = -planet.vity;
		
	}
}

// calcul de gravité
function gravite(planet){
	var dist = 0;
	var accel = {x:0, y:0};
	for(var g=0;g<planets.length;g++){
		if(g != planet.id){
			dist = distance(planet, planets[g]);
			if(dist > planet.masse + planets[g].masse){
				accel.x += ((planets[g].posx - planet.posx) / dist) * carre(planets[g].masse) / dist;
				accel.y += ((planets[g].posy - planet.posy) / dist) * carre(planets[g].masse) / dist;
			}
			else{
				if(planet != null && planets[g] != null){
					collide(planet, planets[g]);
					break;
				}
			}
		}
	}
	planet.vitx += accel.x * G;
	planet.vity += accel.y * G;
}

// calcul de collision
function collide(one, two){
	getOut(one.id,two.id);
	
	planets.push({
		id:planets.length,
		masse:Math.sqrt(carre(one.masse) + carre(two.masse)),
		posx:moy(one.posx,carre(one.masse),two.posx,carre(two.masse)),
		posy:moy(one.posy,carre(one.masse),two.posy,carre(two.masse)),
		vitx:moy(one.vitx,one.masse,two.vitx,two.masse),
		vity:moy(one.vity,one.masse,two.vity,two.masse),
		color:{
			r:Math.round(moy(one.color.r,one.masse,two.color.r,two.masse)),
			g:Math.round(moy(one.color.g,one.masse,two.color.g,two.masse)),
			b:Math.round(moy(one.color.b,one.masse,two.color.b,two.masse))
		}
	});
	
	if(planets.length == 1){
		genere(planets[0].posx, planets[0].posy);
	}
}

// Enléve deux planètes à la collection
function getOut(p1, p2){
	var decal = 0;
	for(var i=0;i<planets.length;i++){
		if(i == p1 || i == p2){
			decal++;
		}
		else if(decal > 0){
			//planets[i].id = i-decal;
			planets[i-decal] = planets[i];
		}
	}
	planets[planets.length-1] = null;
	planets.length--;
	planets[planets.length-1] = null;
	planets.length--;
	for(var i=0;i<planets.length;i++){
		planets[i].id = i;
	}
}

// calcul la distance entre deux planetes
function distance(one, two){
	return Math.sqrt(carre(one.posx - two.posx) + carre(one.posy - two.posy));
}

function moy(x, nx, y, ny){
	var tmp = (x * nx + y * ny) / (nx + ny);
	return tmp;
}

function carre(one){
	return Math.pow(one, 2);
}

function rand(n){
	return Math.round(Math.random() * n);
}

function prtscreen(){
	if(imgScreen.alt === "vide"){
		document.getElementById("screen").style.top = (canvas.height - 15) + "px";
	}
	var data = canvas.toDataURL("image/png");
	imgScreen.src = data;
	imgScreen.width = Math.round(canvas.width / 10);
	imgScreen.height = Math.round(canvas.height / 10);
}