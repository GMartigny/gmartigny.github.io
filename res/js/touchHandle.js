Array.prototype.out = function(o){
    var p = this.indexOf(o);
    if(p !== -1)
        return this.splice(p, 1);
    else
        return false;
};

function Touch(t){
    var now = Date.now();
    this.identifier = t.identifier;
    this.target = t.target;
    
    this.startX = t.pageX;
    this.startY = t.pageY;
    this.pageX = t.pageX;
    this.pageY = t.pageY;
    
    this.swipe = false;
    this.swipeDirection = 0;
    
    this.startTime = now;
    
    this.regTime = now;
    this.regX = t.pageX;
    this.regY = t.pageY;
}
Touch.UP = 1;
Touch.RIGHT = 2;
Touch.DOWN = 4;
Touch.LEFT = 8;

Touch.onGoingTouch = [];
Touch.swipeTreshold = 150;
Touch.swipeMaxTime = 150;

Touch.get = function(id){
    for(var i=0;i<Touch.onGoingTouch.length;++i)
        if(Touch.onGoingTouch[i].identifier == id)
            return Touch.onGoingTouch[i];
    return null;
};
Touch.handleEvent = function(ev, each){
    var tchs = ev.changedTouches;
    for(var i=0;i<tchs.length;++i){
        each(tchs[i]);
    }
};

document.addEventListener("touchstart", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = new Touch(t);
        Touch.onGoingTouch.push(touch);
        
        if(touch.target.ongrab)
            touch.target.ongrab(touch);
        
    });
}, 0);
document.addEventListener("touchmove", function(ev){
    var now = Date.now();
    Touch.handleEvent(ev, function(t){
        var touch = Touch.get(t.identifier);
        
        if(touch){
            touch.pageX = t.pageX;
            touch.pageY = t.pageY;

            if(touch.target.ondrag)
                touch.target.ondrag(touch);

            if(now - touch.regTime < Touch.swipeMaxTime){
                touch.direction = 0;
                if(touch.pageX < touch.regX - Touch.swipeTreshold) touch.direction = Touch.LEFT;
                else if(touch.pageX > touch.regX + Touch.swipeTreshold) touch.direction = Touch.RIGHT;
                if(touch.pageY < touch.regY - Touch.swipeTreshold) touch.direction += Touch.UP;
                else if(touch.pageY > touch.regY + Touch.swipeTreshold) touch.direction += Touch.DOWN;

                if(touch.direction && touch.target.onswipe){
                    touch.target.onswipe(touch);
                }
            }
            else{
                touch.regTime = now;
                touch.regX = touch.pageX;
                touch.regY = touch.pageY;
            }
        }
    });
}, 0);

document.addEventListener("touchend", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = Touch.get(t.identifier);
        if(touch){
            if(touch.target.ondrop)
                touch.target.ondrop(touch);
            Touch.onGoingTouch.out(touch);
        }
    });
}, 0);
document.addEventListener("touchcancel", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = Touch.get(t.identifier);
        
        if(touch){
            if(touch.target.ondrop)
                touch.target.ondrop(touch);
            Touch.onGoingTouch.out(touch);
        }
    });
}, 0);
document.addEventListener("touchleave", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = Touch.get(t.identifier);
        
        if(touch){
            if(touch.target.ondrop)
                touch.target.ondrop(touch);
            Touch.onGoingTouch.out(touch);
        }
    });
}, 0);

function _handleTouch(ev, each){
    var tchs = ev.changedTouches;
    for(var i=0;i<tchs.length;++i){
        each(tchs[i]);
    }
}
function _getTouch(id){
    for(var i=0;i<Touch.onGoingTouch.length;++i)
        if(Touch.onGoingTouch[i].identifier == id)
            return Touch.onGoingTouch[i];
    return false;
}