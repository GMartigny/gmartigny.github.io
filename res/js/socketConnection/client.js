/**
 * 
 * @param {String} url The URL to the websocket server.
 * @param {Object} protocol A list of functions for handling message type.
 * @example new SocketManager("ws://app.socket.js", {<br/>
 * &nbsp;welcome: function(id){<br/>
 * &nbsp;&nbsp;alert("your id is "+id);<br/>
 * &nbsp;},<br/>
 * &nbsp;new_message: function(mess){<br/>
 * &nbsp;&nbsp;alert("you receive a message :\n"+mess);<br/>
 * &nbsp;}<br/>
 * });
 * @returns {SocketManager}
 */
function SocketManager(url, protocol){
    var self = this;
    
    this.socket = new WebSocket(url);
    this.protocol = protocol;
    
    this.socket.onopen = function(e){
        if(self.onopen)
            self.onopen.call(self, e);
    };
    this.socket.onerror = function(e){
        if(self.onerror)
            self.onerror.call(self, e);
    };
    this.socket.onmessage = function(e){
        self.onmessage.call(self, e);
    };
    this.socket.onclose = function(e){
        if(self.onclose)
            self.onclose.call(self, e);
    };
}
SocketManager.prototype = {
    onopen: null,
    onsend: null,
    onmessage: function(event){
        var data = JSON.parse(event.data);
        
        if(this.protocol[data.type])
            this.protocol[data.type](data.message);
    },
    onerror: null,
    onclose: null,
    
    send: function(object){
        object._timestamp = Date.now();
        this.socket.send(JSON.stringify(object));
        if(this.onsend)
            this.onsend(object);
    }
};
