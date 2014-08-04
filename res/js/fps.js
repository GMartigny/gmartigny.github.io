
function FPS(tick, delay){
    this.previous = 0;
    this.count = 0;
    
    
    this.delay = delay || 300;
    this.tick = tick;
}

FPS.prototype.update = function(){
    var now = Date.now();
    if(this.count > this.delay){
        this.tick(1000 / (now - this.previous) << 0);
        this.count = 0;
    }
    else
        this.count += now - this.previous;
    this.previous = now;
};