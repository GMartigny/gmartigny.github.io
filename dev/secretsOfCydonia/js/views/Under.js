
function UnderView(canvas){
    this.layer = canvas;
    this.data = 0;
    
    getDataFromImage("res/"+ViewManager.map+"/und.png", this.catchData, this);
}
UnderView.prototype = Object.create(ViewManager.prototype);