var can = document.getElementById("can"),
    ctx = can.getContext("2d"),
    bubbles = [],
    stream = 0,
    PI2 = Math.PI * 2,
    r = Math.random;

function Bubble(x, y, z){
    this.pos = {
        x: x,
        y: y,
        z: z
    };
    this.vit = {
        x: 0,
        y: -rand(1, 1.2)
    };
    this.radius = rand(7, 20);
}
Bubble.prototype = {
    render: function(){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, PI2, 1);
        ctx.moveTo(this.pos.x, this.pos.y - this.radius * 0.7);
        ctx.arc(this.pos.x, this.pos.y, this.radius * 0.7, -1.4, 3.3, 1);
        ctx.stroke();
        ctx.closePath();
        return this.move();
    },
    move: function(){
        this.pos.x += this.vit.x * this.pos.z;
        this.pos.y += this.vit.y * this.pos.z;

        this.vit.x += -1 * stream;
        this.vit.x /= 1.08;

        var pop = 0;
        if(this.pos.y + this.radius + 2 < 0)
            pop = 1;
        else if(this.pos.x + this.radius + 100 < 0)
            pop = 1;
        else if(this.pos.x - this.radius - 100 > can.width)
            pop = 1;

        return pop;
    }
};

(function(){

    can.width = document.body.offsetWidth;
    can.height = document.body.offsetHeight;

    for(var i = 0; i < 30; ++i){
        bubbles.push(new Bubble(rand(0, can.width), rand(0, can.height), rand(0.1, 1)));
    }

    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 2;

    draw();
})();

function draw(){
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, can.width, can.height);

    var popped = 0;
    for(var i = 0; i < bubbles.length; ++i){
        if(bubbles[i].render()){
            bubbles.splice(i, 1);
            ++popped;
        }
    }
    for(var i = 0; i < popped; ++i){
        bubbles.push(new Bubble(rand(0, can.width), can.height + 20, rand(0.1, 1)));
    }
    stream /= 1.07;
}

function rand(f, t){
    return (r() * (t - f) + f);
}

window.onresize = function(){
    can.width = document.body.offsetWidth;
    can.height = document.body.offsetHeight;

    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 2;
};

