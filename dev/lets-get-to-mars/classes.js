function Game(_media){
    this.media = _media;
    this.grid = new Grid();
    
    this.init();
}
Game.prototype = {
    init: function(){
        console.log("all set");
        
        
    }
};

function Grid(){
    this.all = {};
}
Grid.prototype = {
    render: function(){
        for(var each in this.all){
            console.log(each);
        }
    }
};

function Cell(){
    
}
Cell.size = 40;
Cell.prototype = {
    
};

function Ressources(){
    
}
Ressources.FOOD = 2;
Ressources.prototype = {
    
};