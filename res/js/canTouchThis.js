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

Touch.onGoingTouch = [];

Touch.swipeTreshold = 100;
Touch.swipeMaxTime = 200;

Touch.dblTapMaxDuration = 150;
Touch.holdTapDuration = 700;

Touch.get = function(id){
    for(var i=0;i<Touch.onGoingTouch.length;++i)
        if(Touch.onGoingTouch[i].identifier === id)
            return Touch.onGoingTouch[i];
    return null;
};
Touch.handleEvent = function(ev, each){
    var tchs = ev.changedTouches;
    for(var i=0;i<tchs.length;++i){
        each(tchs[i]);
    }
};
Touch.remove = function(t){
    clearTimeout(t.timer);
    Touch.onGoingTouch.out(t);
};

document.addEventListener("touchstart", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = new Touch(t);
        Touch.onGoingTouch.push(touch);
        
        var cev = new CustomEvent("grab", {bubbles: true, cancelable: true, detail: touch});
        touch.target.dispatchEvent(cev);
        
        touch.timer = setTimeout(function(){
            var touch = Touch.get(t.identifier);
            if(!touch.moved){
                ev.preventDefault();
                var cev = new CustomEvent("holdtap", {bubbles: true, cancelable: true, detail: touch});
                touch.target.dispatchEvent(cev);
            }
        }, Touch.holdTapDuration);
    });
}, 0);
document.addEventListener("touchmove", function(ev){
    var now = Date.now();
    Touch.handleEvent(ev, function(t){
        var touch = Touch.get(t.identifier);
        
        if(touch){
            touch.moved = true;
            touch.pageX = t.pageX;
            touch.pageY = t.pageY;
            
            var cev = new CustomEvent("drag", {bubbles: true, cancelable: true, detail: touch});
            touch.target.dispatchEvent(cev);

            if(now - touch.regTime < Touch.swipeMaxTime){
                touch.direction = 0;
                if(touch.pageX < touch.regX - Touch.swipeTreshold) touch.direction = Touch.LEFT;
                else if(touch.pageX > touch.regX + Touch.swipeTreshold) touch.direction = Touch.RIGHT;
                if(touch.pageY < touch.regY - Touch.swipeTreshold) touch.direction += Touch.UP;
                else if(touch.pageY > touch.regY + Touch.swipeTreshold) touch.direction += Touch.DOWN;

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
            if(!touch.moved && now < touch.startTime + Touch.holdTapDuration)
                cev = new CustomEvent("tap", {bubbles: true, cancelable: true, detail: touch});
            else
                cev = new CustomEvent("drop", {bubbles: true, cancelable: true, detail: touch});
            
            touch.target.dispatchEvent(cev);
            
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