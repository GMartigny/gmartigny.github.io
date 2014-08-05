
var _goingTouch = [],
    _swipeTreshold = 150,
    _swipeMaxTime = 150;

Array.prototype.out = function(o){
    var p = this.indexOf(o);
    if(p !== -1)
        return this.splice(p, 1);
    else
        return false;
};

document.addEventListener("touchstart", function(ev){
    var now = Date.now();
    _handleTouch(ev, function(t){
        var touch = {
            identifier: t.identifier,
            target: t.target,
            startX: t.pageX,
            startY: t.pageY,
            startTime: now,
            pageX: t.pageX,
            pageY: t.pageY
        };
        _goingTouch.push(touch);
        
        if(touch.target.ongrab) touch.target.ongrab(touch);
        
    });
}, 0);
document.addEventListener("touchmove", function(ev){
    var now = Date.now();
    _handleTouch(ev, function(t){
        var touch = _getTouch(t.identifier);
        
        if(touch){
            touch.pageX = t.pageX;
            touch.pageY = t.pageY;

            if(touch.target.ondrag) touch.target.ondrag(touch);

            if(now < touch.startTime + _swipeMaxTime){
                if(t.pageX < touch.startX - _swipeTreshold) touch.direction = "left";
                else if(t.pageX > touch.startX + _swipeTreshold) touch.direction = "right";
                if(t.pageY < touch.startY - _swipeTreshold) touch.direction = "up";
                else if(t.pageY > touch.startY + _swipeTreshold) touch.direction = "down";

                if(touch.direction && touch.target.onswipe){
                    console.log("swipe");
                    touch.target.onswipe(touch);
                    _goingTouch.out(touch);
                }
            }
        }
    });
}, 0);

document.addEventListener("touchend", function(ev){
    _handleTouch(ev, function(t){
        var touch = _getTouch(t.identifier);
        if(touch){
            if(touch.target.ondrop) touch.target.ondrop(touch);
            _goingTouch.out(touch);
        }
    });
}, 0);
document.addEventListener("touchcancel", function(ev){
    _handleTouch(ev, function(t){
        var touch = _getTouch(t.identifier);
        
        if(touch){
            if(touch.target.ondrop) touch.target.ondrop(touch);
            _goingTouch.out(touch);
        }
    });
}, 0);
document.addEventListener("touchleave", function(ev){
    _handleTouch(ev, function(t){
        var touch = _getTouch(t.identifier);
        
        if(touch){
            if(touch.target.ondrop) touch.target.ondrop(touch);
            _goingTouch.out(touch);
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
    for(var i=0;i<_goingTouch.length;++i)
        if(_goingTouch[i].identifier == id)
            return _goingTouch[i];
    return false;
}