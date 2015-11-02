
function EntityManager(ctx, img){
    this.entities = [];
}
EntityManager.prototype = {
    renderAll: function(view, player){
        this.entities.forEach(function(ent){
            ent.render();
            ent.move(view, player);
        });
    }
};

function Entity(pos, dir){
    this.isAnimated = 0;
    this.animSpeed = 0;
    this.anim = 0;
    this.isMoving = 0;
    this.moveSpeed = 0;
    this.pos = pos;
    this.dir = dir || Player.DIR_DOWN;
}
Entity.prototype = {
    render: function(){
        var step = round(2/PI*asin(sin(this.anim))+1),
            cell = GameController.cell;
        this.layer.drawImage(this.img,
            cell*step, cell*this.dir, cell, cell,
            this.display.x, this.display.y, cell, cell);
    },
    move: function(){
        if(this.isMoving-- > 0){
            switch(this.dir){
                case Player.DIR_UP:
                    this.pos.y -= this.moveSpeed;
                    break;
                case Player.DIR_RIGHT:
                    this.pos.x += this.moveSpeed;
                    break;
                case Player.DIR_DOWN:
                    this.pos.y += this.moveSpeed;
                    break;
                case Player.DIR_LEFT:
                    this.pos.x -= this.moveSpeed;
            }
        }
        else
            this.isMoving = 0;
        
        if(this.isAnimated-- > 0){
            this.anim += this.animSpeed;
        }
    }
};


function FireFly(img, pos){
    Entity.call(this, pos);
    this.img = img;
    this.animSpeed = 0.1;
}
FireFly.prototype = Object.create(Entity.prototype);
