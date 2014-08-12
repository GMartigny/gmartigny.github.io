
function GroundView(canvas){
    this.layer = canvas;
    this.data = 0;
    
    getDataFromImage("res/"+ViewManager.map+"/grd.png", this.catchData, this);
}
GroundView.prototype = Object.create(ViewManager.prototype);