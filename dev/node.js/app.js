var http = require("./httpServer"),
	socket = require("./socketServer");

http.start(80);
socket.start(1337);