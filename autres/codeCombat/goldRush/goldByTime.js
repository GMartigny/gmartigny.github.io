var items = this.getItems();

if(items.length){
    var shiny = items[0];
    var bestRatio = shiny.bountyGold/this.distance(shiny);
    for(var i=1;i<items.length;++i){
        var ratio = items[i].bountyGold/this.distance(items[i]);
        if(ratio > bestRatio){
            bestRatio = ratio;
            shiny = items[i];
        }
    }
    if(shiny) this.move(shiny.pos);
}
else this.moveXY(61, 38);
