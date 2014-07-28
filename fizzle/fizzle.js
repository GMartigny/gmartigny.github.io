var animFrame = 0,
    PI2 = Math.PI * 2,
    rdm = Math.random,
    abs = Math.abs;

function start(ctx){
    var fizz = new Fizzle(ctx),
        imgData = fizz.getData();

    var space = 3,
        rng = 10;
    for(var i = 0; i < imgData.length; i += 4){
        if(imgData[i] == 0)
            --space;
        if(space < 0){
            fizz.dots.push(new Dot((i / 4) % can.width, (i / 4) / can.width));
            var spc = 70 - 60 * Fizzle.density;
            if(spc < 10) spc = 10;
            space = rand(spc, spc + rng);
        }
    }
    if(animFrame) cancelAnimationFrame(animFrame);
    fizz.render();
}

function Fizzle(ctx){
    this.ctx = ctx;
    this.dots = [];

    this.getData = function(){
        this.ctx.fillStyle = "#010101";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "#000";
        this.ctx.font = 100 + 200 * Fizzle.size + 'px sans-serif';
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(Fizzle.text, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        return this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height).data;
    };
    this.render = function(){
        var c = this.ctx,
            self = this;
        
        animFrame = requestAnimationFrame(function(){
            self.render();
        });
        c.fillStyle = "#000";
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);
        
        this.dots.forEach(function(d){
            d.render(c);
        });
        
    };
}
function Dot(x, y){
    this.bound = {
        x: rand(20 * Dot.freedom, 10 + 30 * Dot.freedom),
        y: rand(20 * Dot.freedom, 10 + 30 * Dot.freedom)
    };
    this.origin = {
        x: x - 10,
        y: y - 10
    };
    this.pos = {
        x: rand(this.origin.x, this.origin.x + this.bound.x),
        y: rand(this.origin.y, this.origin.y + this.bound.y)
    };
    this.vit = {
        x: rand(1, 3) * (rand(0, 2) << 0 ? 1 : -1),
        y: rand(1, 3) * (rand(0, 2) << 0 ? 1 : -1)
    };
    this.size = rand(3, 7);
    this.color = Fizzle.colors[rand(0, Fizzle.colors.length) << 0];

    this.render = function(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.pos.x, this.pos.y, 1 + this.size * Dot.fat*1.5, 0, PI2);
        ctx.fill();

        this.pos.x += this.vit.x * (Dot.speed) / 5;
        this.pos.y += this.vit.y * (Dot.speed) / 5;

        if(this.pos.x < this.origin.x && this.vit.x < 0)
            this.vit.x *= -1;
        else if(this.pos.x > this.origin.x + this.bound.x * Dot.freedom && this.vit.x > 0)
            this.vit.x *= -1;
        if(this.pos.y < this.origin.y && this.vit.y < 0)
            this.vit.y *= -1;
        else if(this.pos.y > this.origin.y + this.bound.y * Dot.freedom && this.vit.y > 0)
            this.vit.y *= -1;
    };
}

function rand(f, t){
    return rdm() * (t - f) + f;
}