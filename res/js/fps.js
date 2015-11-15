
function FPS(tick, delay){
    this.previous = 0;
    this.count = 0;
    
    this.tick = tick;
    this.delay = delay || 300;
}

FPS.prototype.update = function(){
    var now = performance.now();
    if(this.count > this.delay){
        this.tick(1000 / (now - this.previous) << 0);
        this.count = 0;
    }
    else
        this.count += now - this.previous;
    this.previous = now;
};
