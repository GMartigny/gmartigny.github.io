function AirPad(serverURL, port){
    port = port || 1337;
    this.socket = new WebSocket("ws://"+serverURL+":"+port);
    
    this.verbose = false;
    
    this.socket.onopen = this.onopen;
    this.socket.onmessage = this.onmessage;
    this.socket.onerror = this.onerror;
    this.socket.onclose = this.onclose;
    
    window.AP = this;
    window.onload = function(){
        window.buttons = document.getElementsByTagName("button");
        for(var i=0;i<buttons.length;++i){
            buttons[i].addEventListener("touchstart", function(){
                window.AP.send("cmd", {button: this.value, press: true});
            }, false);
            buttons[i].addEventListener("touchend", function(){
                window.AP.send("cmd", {button: this.value, press: false});
            }, false);
        }
    };
    
    this.send = function(t, d){
        var message = JSON.stringify({
            type: t,
            data: d
        });
        this.socket.send(message);
    };
}