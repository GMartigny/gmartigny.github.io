/**
 * The object to connect a command receiver
 * @param {HTMLElement, String, JQuery} QRcode The image showing the QRcode
 * @param {String} controllerURL the URL to controller
 * @returns {AirPadReceiver} 
 * @throws {String} Error if something happend
 */
function AirPadReceiver(QRcode, controllerURL){
    this.socket = new WebSocket("ws://heroku.com");
    
    this.url = controllerURL;
    this.qr = (function(o){
        var qr;
        if(o.jquery){ // is a jquery object
            qr = o[0];
        }
        else if(o.length){ // is a string
            qr = document.getElementById(o);
            if(!qr) throw "Undefined id \""+o+"\" for QrCode image";
        }
        else if(o.nodeName){ // is really a elem
            if(o.nodeName != "IMG") throw "This's not an image";
            qr = o;
        }
        else throw "WTF is this shit ?";
        return qr;
    })(QRcode);
    this.qr.onload = this.onload;
    
    this.verbose = true;
    
    this.socket.onopen = this.onopen;
    this.socket.onmessage = this.onmessage;
    this.socket.onerror = this.onerror;
    this.socket.onclose = this.onclose;
};
AirPadReceiver.prototype = {
    onopen: function(){
        this.log("Connection established");
    },
    onmessage: function(txt){
        this.log("Received : "+txt);
        try{
            var mess = JSON.parse(txt);
            switch (mess.type){
                case "id":
                    this.id = mess.value;
                    this.qr = this.getQR();
                    break;
                case "command":
                    this.oncommand(mess.data);
                    break;
            }
        }
        catch(e){
            throw "Invalid JSON";
        }
    },
    oncommand: function(data){
        this.log((data.press? "Press": "Release")+" the button "+data.button);
    },
    onload: function(){
        this.log("Ready for scanning");
    },
    onerror: function(err){
        this.log("An error occured");
        this.log(err);
    },
    onclose: function(){
        this.log("Connection closed");
    },
    onconnect: function(){
        this.log("A new controller is connected");
    },
    ondisconnect: function(){
        this.log("The controller disconnect");
    },
    
    getQR: function(){
        if(this.id){
            if(!this.qr.src){
                url = encodeURIComponent(this.url+"#apid="+this.id);
                this.qr.src = "http://qrickit.com/api/qr?qrsize=150&d="+url;
            }
            return this.qr;
        }
        else throw "Not ready";
    },
    
    send: function(data){
        this.socket.send(data);
    },
    close: function(){
        this.socket.close();
    },
    
    log: function(m){
        if(this.verbose) console.log(m);
    }
};