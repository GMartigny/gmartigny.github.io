var items = this.getItems();

if(items.length){
    var closest = items[0];
    var mindist = this.distance(closest);
    for(var i=1;i<items.length;++i){
        if(items[i].bountyGold > 4 && !this.getCooldown("jump") && this.distance(items[i].pos) > 50){
            this.jumpTo(items[i].pos);
            closest = false;
        }
        else if(this.distance(items[i]) < mindist){
            closest = items[i];
            mindist = this.distance(closest);
        }
    }
    if(closest) this.move(closest.pos);
}
else this.moveXY(61, 38);
