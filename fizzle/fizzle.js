var _PI2 = Math.PI * 2,
    _R = Math.random;

function Fizzle(ctx){
    this.ctx = ctx;
    this.dots = [];
    this.animation = 0;
}
Fizzle.prototype.init = function(){
    this.dots = [];
    var imgData = this.getData();

    var space = 3,
        rng = 10;
    for(var i = 0; i < imgData.length; i += 4){
        if(imgData[i] == 0)
            --space;
        if(space < 0){
            this.dots.push(new Dot((i / 4) % can.width, (i / 4) / can.width));
            var spc = 70 - 60 * Fizzle.density;
            if(spc < 10) spc = 10;
            space = rand(spc, spc + rng);
        }
    }
    if(this.animation) cancelAnimationFrame(this.animation);
    this.render();
};
Fizzle.prototype.getData = function(){
    var line = 100 + 200 * Fizzle.size;
    this.ctx.fillStyle = "#010101";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "#000";
    this.ctx.font = line + 'px sans-serif';
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.wrapText(Fizzle.text, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, line);
    return this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height).data;
};
Fizzle.prototype.render = function(){
    var c = this.ctx,
        self = this;

    this.animation = requestAnimationFrame(function(){
        self.render();
    });
    c.fillStyle = "#000";
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);

    this.dots.forEach(function(d){
        d.render(c);
    });
};

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
}
Dot.prototype.render = function(ctx){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.pos.x, this.pos.y, 1 + this.size * Dot.fat*1.5, 0, _PI2);
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

CanvasRenderingContext2D.prototype.wrapText = function(txt, x, y, lineH){
    var words = txt.split(" "),
        lines = [""],
        point = 0;
    while(words.length){
        var w = words.shift();
        if(this.measureText(lines[point] + " " + w).width < this.canvas.width)
            lines[point] += " " + w;
        else
            lines[++point] = w;
    }
    var l = lines.length;
    while(lines.length)
        this.fillText(lines.shift(), x, y-lineH*(lines.length-(l/2-0.5)));
};

function rand(f, t){
    return _R() * (t - f) + f;
}