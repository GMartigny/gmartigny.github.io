function Keyboard(perso){

	this.perso = perso;
	this.listening = true;
	this.previous = 0;

	this.keydown = function(e){
		if(e.keyCode == 13){
			keys.listening = false;
			keys.perso.talk();
		}
		else if(keys.listening){
			if(e.keyCode != keys.previous) keys.perso.move(e.keyCode);
			else keys.previous = e.keyCode;
		}
	};
	window.addEvent("keydown", this.keydown);
	
	this.keyup = function(e){
		if(keys.listening) keys.perso.stop();
	};
	window.addEvent("keyup", this.keyup);
	
	this.setKey = function(name, val){
		Keyboard[name] = val;
	};
	
	this.toggle = function(){
		this.listening = !this.listening;
	};
}
Keyboard.UP = 90;
Keyboard.RIGHT = 68;
Keyboard.DOWN = 83;
Keyboard.LEFT = 81;