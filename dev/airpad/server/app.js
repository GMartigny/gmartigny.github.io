var http = require('http'),
           websocketServer = require('websocket').server;

var port = 1337,
    domain = "localhost",
    clients = [];

// empty http server
var HTTPServer = http.createServer(function(){});
HTTPServer.listen(socketPort);

// socket server based on the http server
wsServer = new websocketServer({
    httpServer: HTTPServer
});

// receive a request
wsServer.on('request', function(request){
    
    console.log("connection from " + request.origin);
    
    var connection = request.accept(null, request.origin),
        id = getId();
    clients[id] = connection;

    // send its id
    connection.sendUTF(JSON.stringify({
        error: "pseudo taken"
    }));

    connection.on("message", function(data){
        if(data.type === 'utf8'){
            connection.sendUTF(data.utf8Data);
        }
    });
});

function getId(){
    var id = Math.random().toString(36).substr(2);
    if(!clients[id])
        return id;
    else return getId();
}