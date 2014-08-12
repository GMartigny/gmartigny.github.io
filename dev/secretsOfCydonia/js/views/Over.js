
function OverView(canvas){
    this.layer = canvas;
    this.data = 0;
    
    getDataFromImage("res/"+ViewManager.map+"/blk.png", this.catchData, this);
}
OverView.prototype = Object.create(ViewManager.prototype);