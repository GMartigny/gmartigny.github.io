function AirPadReceiver(serverURL, qr, controllerURL){
    this.socket = new WebSocket("ws://"+serverURL);
    
    this.id = 0;
    this.url = controllerURL;
    this.qr = (function(o){
        var qr;
        if(o.jquery){ // is a jquery object
            qr = o[0];
        }
        else if(o.length){ // is a string
            qr = document.getElementById(o);
            if(!qr) throw "Undefined id "+o+" for QrCode image";
        }
        else if(o.nodeName){ // is really a elem
            qr = o;
            if(o.nodeName != "IMG") throw "This's not an image";
        }
        else throw "WTF is this shit ?";
        return qr;
    })(qr);
    this.qr.onload = this.onload;
    
    this.verbose = true;
    
    this.socket.onopen = this.onopen;
    this.socket.onmessage = this.onmessage;
    this.socket.onerror = this.onerror;
    this.socket.onclose = this.onclose;
    
    this.onopen = function(){
        this.log("Connection established");
    };
    this.onmessage = function(txt){
        this.log("Received : "+txt);
        try{
            var mess = JSON.parse(txt);
            switch (mess.type){
                case "id":
                    this.id = mess.data;
                    this.qr = this.getQR();
                    break;
                case "cmd":
                    this.oncommand(mess.data);
                    break;
            }
        }
        catch(e){
            throw "Invalid JSON";
        }
    };
    this.oncommand = function(data){
        this.log((data.press? "Press": "Release")+" the button "+data.button);
    };
    this.onload = function(){
        this.log("Ready for scanning");
    };
    this.onerror = function(err){
        this.log("An error occured");
        this.log(err);
    };
    this.onclose = function(){
        this.log("Connection closed");
    };
    this.onconnect = function(){
        this.log("A new controller is connected");
    };
    this.ondisconnect = function(){
        this.log("The controller disconnect");
    };
    
    this.getQR = function(){
        if(this.id){
            if(!this.qr.src){
                url = encodeURIComponent(this.url+"?apid="+this.id);
                this.qr.src = "http://qrickit.com/api/qr?qrsize=150&d="+url;
            }
            return this.qr;
        }
        else throw "Not ready";
    };
    
    this.send = function(data){
        this.socket.send(data);
    };
    this.close = function(){
        this.socket.close();
    };
    
    this.log = function(m){
        if(this.verbose) console.log(m);
    };
}