/*********
// app configuration
var websocket = require("websocket").server;
var http = require("http");
var port = process.env.PORT || 5000;

var httpServer = http.createServer(function(request, response){
    response.end();
});
httpServer.listen(port);

var websocketServer = new websocket({
    httpServer: httpServer
});

websocketServer.on("request", function(request){
    if(request.origin == "")
        new SocketManager(request.accept(null, request.origin), {});
});
// end conf
/*********/

/**
 * 
 * @param {Connection} connection A connection object from the websocket request.
 * @param {Object} protocol A list of functions for handling message type.
 * @example new SocketManager(req.accept(null, request.origin), {<br/>
 * &nbsp;handshake: function(){<br/>
 * &nbsp;&nbsp;this.send("welcome", this.id);<br/>
 * &nbsp;},<br/>
 * &nbsp;send: function(mess){<br/>
 * &nbsp;&nbsp;this.broadcast("new_message", mess);<br/>
 * &nbsp;}<br/>
 * });
 * @returns {SocketManager}
 */
function SocketManager(connection, protocol){
    this.socket = connection;
    this.protocol = protocol;
    
    var self = this;
    this.connection.on("error", function(e){
        self.onerror.call(self, e);
    });
    this.connection.on("message", function(e){
        self.message.call(self, e);
    });
    this.connection.on("close", function(e){
        self.onclose.call(self, e);
    });
    
    this.id = SocketManager.uniqid();
    SocketManager.list[this.id] = this;
}
SocketManager.list = {};
SocketManager.uniqid = function(){
    return Date.now().toString(36);
};
SocketManager.prototype = {
    onsend: null,
    onmessage: null,
    onerror: null,
    onclose: null,
    
    message: function(event){
        var data = JSON.parse(event.data);
        
        if(this.onmessage)
            this.onmessage(data);
        
        if(this.protocol[data.type])
            this.protocol[data.type](data.message);
        else
            this.onerror({message: "Message type "+data.type+" unknown in this protocol"});
    },
    send: function(type, message){
        var object = {
            type: type,
            message: message,
            _timestamp: Date.now()
        };
        this.socket.sendUTF(JSON.stringify(object));
        
        if(this.onsend)
            this.onsend(object);
    },
    broadcast: function(type, message){
        var list = SocketManager.list;
        for(var id in list){
            if(list.hasOwnProperty(id) && list[id].id != this.id)
                list[id].send(type, message);
        }
    },
    close: function(){
        delete SocketManager.list[this.id];
        
        if(this.onclose)
            this.onclose();
    }
};