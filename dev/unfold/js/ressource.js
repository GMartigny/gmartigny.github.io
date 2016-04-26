
function Ressource(game, name, count){
    console.log(name);
    this.game = game;

    this.name = name;
    this.count = count;

    this.html = this.toHTML();
}
Ressource.prototype = {
    toHTML: function(){
        var html = document.createElement("div");
        html.className = "ressource " + this.name.toLowerCase().replace(" ", "_");
        html.innerHTML = this.count<<0;
        return html;
    },
    refresh: function(){
        this.html.innerHTML = this.count<<0;
    },
    update: function(amount){
        this.count += amount;
        this.refresh();
    },
    has: function(amount){
        return this.count > amount;
    }
};
Ressource.LST_ID = "ressourceList";