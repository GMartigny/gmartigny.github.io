/**
 * Possible events
 *  - grab : a touch occurs on the element
 *  - drag : the element is moved around
 *  - drop : the touch end
 *  - swipe : the element is quickly drag to a direction
 *  - tap : a tap occurs on the element
 *  - dbltap : a double-tap occurs on the element
 *  - taphold : a long pressed touch occurs on the element
 */

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
    
    this.moved = false;
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

Touch._onGoingTouch_ = [];
Touch._lastTap_ = {
    x: 0, y: 0,
    t: 0
};

Touch.swipeMinDistance = 60;
Touch.swipeMaxTime = 300;

Touch.tapMaxDistance = 10;
Touch.dblTapMaxDuration = 250;
Touch.holdTapDuration = 700;

Touch.distance = function(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1), 2));
};
Touch.get = function(id){
    for(var i=0;i<Touch._onGoingTouch_.length;++i)
        if(Touch._onGoingTouch_[i].identifier === id)
            return Touch._onGoingTouch_[i];
    return null;
};
Touch.handleEvent = function(ev, each){
    var tchs = ev.changedTouches;
    for(var i=0;i<tchs.length;++i){
        each(tchs[i]);
    }
};
Touch.add = function(t){
    var touch = new Touch(t);
    Touch._onGoingTouch_.push(touch);
    return touch;
};
Touch.remove = function(t){
    clearTimeout(t.timer);
    Touch._onGoingTouch_.out(t);
    return Touch._onGoingTouch_.length;
};

document.addEventListener("touchstart", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = Touch.add(t);
        
        touch.timer = setTimeout(function(){
            var touch = Touch.get(t.identifier);
            if(!touch.moved){
                var cev = new CustomEvent("holdtap", {bubbles: true, cancelable: true, detail: touch});
                touch.target.dispatchEvent(cev);
            }
        }, Touch.holdTapDuration);
    });
    
//    ev.preventDefault();
}, 0);
document.addEventListener("touchmove", function(ev){
    var now = Date.now();
    Touch.handleEvent(ev, function(t){
        var touch = Touch.get(t.identifier);
        
        if(touch){
            touch.pageX = t.pageX;
            touch.pageY = t.pageY;
            if(!touch.moved && Touch.distance(touch.pageX, touch.pageY, touch.startX, touch.startY) > Touch.tapMaxDistance){
                touch.moved = true;
                
                var cev = new CustomEvent("grab", {bubbles: true, cancelable: true, detail: touch});
                touch.target.dispatchEvent(cev);
            }
            if(touch.moved){
                var cev = new CustomEvent("drag", {bubbles: true, cancelable: true, detail: touch});
                touch.target.dispatchEvent(cev);
            }
            
            if(now - touch.regTime < Touch.swipeMaxTime){
                touch.direction = 0;
                if(touch.pageX < touch.regX - Touch.swipeMinDistance) touch.direction = Touch.LEFT;
                else if(touch.pageX > touch.regX + Touch.swipeMinDistance) touch.direction = Touch.RIGHT;
                if(touch.pageY < touch.regY - Touch.swipeMinDistance) touch.direction += Touch.UP;
                else if(touch.pageY > touch.regY + Touch.swipeMinDistance) touch.direction += Touch.DOWN;

                if(touch.direction){
                    var cev = new CustomEvent("swipe", {bubbles: true, cancelable: true, detail: touch});
                    touch.target.dispatchEvent(cev);
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
    var now = Date.now();
    Touch.handleEvent(ev, function(t){
        var touch = Touch.get(t.identifier);
        if(touch){
            var cev;
            if(!touch.moved && now < touch.startTime + Touch.holdTapDuration){
                
                cev = new CustomEvent("tap", {bubbles: true, cancelable: true, detail: touch});
                touch.target.dispatchEvent(cev);
                
                if(now < Touch._lastTap_.t+Touch.dblTapMaxDuration &&
                Touch.distance(touch.pageX, touch.pageY, Touch._lastTap_.x, Touch._lastTap_.y) < Touch.tapMaxDistance){
                    cev = new CustomEvent("dbltap", {bubbles: true, cancelable: true, detail: touch});
                    touch.target.dispatchEvent(cev);
                }
                   
                Touch._lastTap_ = {
                    x: touch.pageX, y: touch.pageY,
                    t: now
                };
            }
            else{
                cev = new CustomEvent("drop", {bubbles: true, cancelable: true, detail: touch});
                touch.target.dispatchEvent(cev);
            }
            Touch.remove(touch);
        }
    });
}, 0);
document.addEventListener("touchcancel", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = Touch.get(t.identifier);
        if(touch){
            var cev = new CustomEvent("drop", {bubbles: true, cancelable: true, detail: touch});
            touch.target.dispatchEvent(cev);
            
            Touch.remove(touch);
        }
    });
}, 0);

document.addEventListener("touchleave", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = Touch.get(t.identifier);
        if(touch){
            Touch.remove(touch);
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