
function KeyboardManager(){
	this.listening = true;
    this.keys = [];

    var self = this;
	window.addEvent("keydown", function(e){
        self.keydown.call(self, e);
    });
	window.addEvent("keyup", function(e){
        self.keyup.call(self, e);
    });

	this.toggleListen = function(){
		this.listening = !this.listening;
	};
}
KeyboardManager.UP = 90;
KeyboardManager.RIGHT = 68;
KeyboardManager.DOWN = 83;
KeyboardManager.LEFT = 81;
KeyboardManager.ENTER = 13;
KeyboardManager.SPACE = 32;

KeyboardManager.prototype.keydown = function(e){
    if(this.listening){
        if(!this.isPressed(e.keyCode)) this.keys.push(e.keyCode);
    }
};
KeyboardManager.prototype.keyup = function(e){
    if(this.listening){
        this.keys.out(e.keyCode);
    }
};
KeyboardManager.prototype.isPressed = function(key){
    return (this.keys.indexOf(key) === -1)? false : true;
};