var http = require("http"),
	websocketServer = require('websocket').server;

var url = "10.4.0.56",
	players = [],
	links = require("./res/links.json");

module.exports = {
	start : function(socketPort){
		var socketServer = http.createServer(function(request,response){ // http server for socket
		}).listen(socketPort);
		console.log("IO Server's Running on "+socketPort);

		wsServer = new websocketServer({
			httpServer: socketServer
		});
		wsServer.on('request', function(request) {
			console.log("connection from " + request.origin);
			var connection = request.accept(null, request.origin),
				player = new Player(connection);

			connection.on('message', function(message){
				if (message.type === 'utf8'){
					var infos = JSON.parse(message.utf8Data);
					if(!player.pseudo){ // joueur inconnu
						if(unUsed(infos.pseudo)){ // pseudo demander non-utiliser
							player.details.globalPos = {x : 0, y : 0}
							player.details.map = links[0][0];
							player.details.pos = {x : 4, y : 29};
							player.pseudo = infos.pseudo;
							connection.sendUTF(JSON.stringify({hello:player.details}));
							
							players.push(player);
							
							player.inter = setInterval(function(){ // interval
								player.getOthers();
							}, 20);
							
							console.log(player.pseudo+" just connecte");
						}
						else connection.sendUTF(JSON.stringify({error:"pseudo taken"}));
					}
					else{ // mise à jour des infos
						player.details = infos.details;
					}
				}
			});

			connection.on('close', function(connection){
				if(player.pseudo){
					clearInterval(player.inter);
					players.out(player);
					console.log("bye bye "+player.pseudo);
				}
			});
		});
	}
};

function Player(con){
	this.con = con;
	this.pseudo = false;
	this.details = {anim : 1, dir : 0, pos : {}, map : "", mess:[], globalPos:{}};
	
	this.getOthers = function(){
		var arr = [],
			one = {};
		for(var i=0;i<players.length;++i){
			one = players[i];
			if(one.pseudo && one.pseudo !== this.pseudo && this.inRange(one)){
				arr.push({pseudo:one.pseudo, d:one.details});
			}
		}
		this.con.sendUTF(JSON.stringify({
			t : Date.now(),
			oth : arr
		}));
	};
	
	this.inRange = function(other){
		if(other.details.map == this.details.map && 
			other.details.pos.x-13 < this.details.pos.x && other.details.pos.x+13 > this.details.pos.x &&
			other.details.pos.y-10 < this.details.pos.y && other.details.pos.y+10 > this.details.pos.y) return true;
		else return false;
	};

	this.teleport = function(dir){
		switch(dir){
			case 0: // north
				this.details.globalPos.y--;
				break;
			case 1: // south
				this.details.globalPos.y++;
				break;
			case 2: // east
				this.details.globalPos.x--;
				break;
			case 3: // west
				this.details.globalPos.x++;
		}
		player.details.map = links[0][0];
	};
}

Array.prototype.out = function(o){
	var index = this.indexOf(o);
	if(0 <= index) this.splice(index, 1);
	else{
		throw o+" not find in this array";
	}
}

function unUsed(p){
	var free = true;
	players.forEach(function(one){
		if(one.pseudo == p) free = false;
	});
	return free;
}