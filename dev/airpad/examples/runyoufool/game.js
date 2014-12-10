
var PI = Math.PI,
    rand = Math.random,
    round = Math.round,
    sqrt = Math.sqrt,
    pow = Math.pow;

function Game(){
}
Game.start = function(ctx){
    this.can = ctx.canvas;
    this.ctx = ctx;
    this.ply = new Game.Player(this.can.width/2<<0, this.can.height/2<<0);
    this.flash = new Image("img/flash.png");
    this.blade = new Image("img/blade.png");
    this.blood = new Image("img/blood.png");
    this.blades = [];
    Game.draw();
};
Game.draw = function(){
    window.requestAnimationFrame(Game.draw);
    Game.ctx.clearRect(0, 0, Game.can.width, Game.can.height);

    Game.ply.render();

    if(!roll(30) && Game.ply.live){
        Game.blades.push(new Game.Blade({
            x:roll(can.width), y:-25
        },{
            x:roll(4)-2, y:roll(4)+1
        }));
    }
    var b;
    for(var i=0;i<Game.blades.length;++i){
        b = Game.blades[i];
        b.render();
        if(dist(b.pos, Game.ply.pos) <= 35) Game.ply.live = false;
        if(b.pos.y > can.height) Game.blades.splice(i--, 1);
    }

    Game.ctx.drawImage(Game.flash, 0, Game.can.height-40);
    Game.ctx.globalAlpha = 0.9;
    Game.ctx.beginPath();
    Game.ctx.moveTo(20, Game.can.height-20);
    Game.ctx.lineTo(20, Game.can.height-40);
    Game.ctx.arc(20, Game.can.height-20, 20, -PI/2, ((PI*2)*(Game.ply.cldw/Game.ply.clmx))-PI/2, false);
    Game.ctx.lineTo(20, Game.can.height-20);
    Game.ctx.closePath();
    Game.ctx.fill();
    Game.ctx.globalAlpha = 1;
};

Game.key = function(code, down){
    switch(code){
        case 32: // space
            if(this.ply.live){
                if(down) this.ply.flash();
            }
            else this.restart();
            break;
        case 38: // up
            if(down){
                this.ply.mv = true;
                this.ply.dir = 0;
            }
            else if(this.ply.dir == 0){
                this.ply.mv = false;
                this.ply.anim = 0;
            }
            break;
        case 39: // right
            if(down){
                this.ply.mv = true;
                this.ply.dir = 1;
            }
            else if(this.ply.dir == 1){
                this.ply.mv = false;
                this.ply.anim = 0;
            }
            break;
        case 40: // down
            if(down){
                this.ply.mv = true;
                this.ply.dir = 2;
            }
            else if(this.ply.dir == 2){
                this.ply.mv = false;
                this.ply.anim = 0;
            }
            break;
        case 37: // left
            if(down){
                this.ply.mv = true;
                this.ply.dir = 3;
            }
            else if(this.ply.dir == 3){
                this.ply.mv = false;
                this.ply.anim = 0;
            }
            break;
    }
};

Game.restart = function(){
    this.ply = new Game.Player(this.can.width/2<<0, this.can.height/2<<0);
};

Game.Player = function(x, y){
    this.pos = {x: x, y: y};
    this.vit = 2;
    this.live = true;
    this.dir = 2;
    this.anim = 1;
    this.mv = false;
    this.cldw = 0;
    this.clmx = 300;
    this.img = new Image("img/perso.png");

    this.render = function(){
        if(this.cldw > 0) --this.cldw;
        if(this.mv && this.live) this.move(this.vit);
        if(this.live) Game.ctx.drawImage(Game.ply.img, this.getAnim()*32, this.dir*32, 32, 32, this.pos.x-16, this.pos.y-16, 32, 32);
        else Game.ctx.drawImage(Game.blood, this.pos.x-32, this.pos.y-32);
    };
    this.getAnim = function(){
        return 1;
    };
    this.move = function(v){
        this.anim++;
        switch(this.dir){
            case 0:
                this.pos.y-=v;
                break;
            case 1:
                this.pos.x+=v;
                break;
            case 2:
                this.pos.y+=v;
                break;
            case 3:
                this.pos.x-=v;
                break;
        }
        if(this.pos.x < 0) this.pos.x = 0;
        else if(this.pos.x > can.width-32) this.pos.x = can.width-32;
        else if(this.pos.y < 0) this.pos.y = 0;
        else if(this.pos.y > can.height-32) this.pos.y = can.height-32;
    };
    this.flash = function(){
        if(this.cldw <= 0 && this.live){
            this.anim = 0;
            this.cldw = this.clmx;
            this.move(60);
        }
    };
};
Game.Blade = function(pos, vit){
    this.pos = pos;
    this.vit = vit;
    this.rot = 0;

    this.render = function(){
        this.move();
        Game.ctx.save();
        Game.ctx.translate(this.pos.x, this.pos.y);
        Game.ctx.rotate(this.rot);
        Game.ctx.drawImage(Game.blade, -25, -25);
        Game.ctx.restore();
    };
    this.move = function(){
        this.pos.x += this.vit.x;
        this.pos.y += this.vit.y;
        this.rot+=(this.vit.y/10);
    };
};

function Image(src){
    var i = document.createElement("img");
    i.src = src || "";
    return i;
}
function dist(from, to){
    return sqrt(sq(to.x-from.x)+sq(to.y-from.y));
}
function sq(x){
    return pow(x, 2);
}

function roll(max){
    return rand()*(max+1)<<0;
}

window.onkeydown = function(ev){
    Game.key(ev.keyCode, 1);
};
window.onkeyup = function(ev){
    Game.key(ev.keyCode, 0);
};