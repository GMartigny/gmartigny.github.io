function GameInput(){
}

GameInput.binded = {};

GameInput.CLIC = 0;
GameInput.UP = 38;
GameInput.DOWN = 40;
GameInput.LEFT = 37;
GameInput.RIGHT = 39;

window.onkeydown = function(e){
	//console.log(e.keyCode);
	switch(e.keyCode){
		
	}
};

GameInput.link = function(l){
	if(l.length){
		for(var i=0;i<l.length;++i){
			GameInput.binded[l[i][0]] = l[i][1];
		}
	}
	else{
		
	}
	window.onkeydown = function(ev){
		try{
			GameInput.binded[ev.keyCode]();
		}
		catch(e){}
	};
};