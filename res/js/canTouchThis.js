/*
 * Javascript lightweight library for mobile touch event
 * Made by Guillaume Martigny
 * 
 * Possible events
 *  - grab : a moving touch occurs on the element
 *  - drag : the element is moved around
 *  - drop : the touch end
 *  - swipe : the element is quickly drag to a direction
 *  - tap : a tap occurs on the element
 *  - dbltap : a double-tap occurs on the element
 *  - taphold : a long pressed touch occurs on the element
 *  - pinch : two moving touch in a same element
 */
/*
 * example :
 *  document.addEventListener("swipe", function(ev){
 *      if(e.detail.direction == Touch.RIGHT){
 *          goToPrevious();
 *      }
 *      else if(e.detail.direction == Touch.RIGHT){
 *          goToNext();
 *      }
 *  };
 */

function Touch(t){
    var now = Date.now();
    this.identifier = t.identifier;
    this.target = t.target;
    
    this.moved = false;
    this.startX = t.pageX;
    this.startY = t.pageY;
    this.pageX = t.pageX;
    this.pageY = t.pageY;
    
    this.sibling = Touch.getSibling(this);
    this.distanceFromSibling = this.sibling ? Touch.distance(this.pageX, this.pageY, this.sibling.pageX, this.sibling.pageY) : undefined;
    
    this.swipe = false;
    this.swipeDirection = 0;
    
    this.startTime = now;
    
    this.regTime = now;
    this.regX = t.pageX;
    this.regY = t.pageY;
}
// Read only
Touch.UP = 1;
Touch.RIGHT = 2;
Touch.DOWN = 4;
Touch.LEFT = 8;

// Can be modify but it's dangerous
Touch._onGoingTouch_ = [];
Touch._lastTap_ = {
    x: 0, y: 0,
    t: 0
};

// Read and write as will
Touch.swipeMinDistance = 50;
Touch.swipeMaxTime = 250;

Touch.tapMaxDistance = 10;
Touch.dblTapMaxDuration = 300;
Touch.holdTapDuration = 700;

Touch.preventZoom = true;

Touch.distance = function(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1), 2));
};
Touch.getById = function(id){
    for(var i=0;i<Touch._onGoingTouch_.length;++i)
        if(Touch._onGoingTouch_[i].identifier === id)
            return Touch._onGoingTouch_[i];
    return null;
};
Touch.getSibling = function(t){
    for(var i=Touch._onGoingTouch_.length-1;i>=0;--i){
        if(Touch._onGoingTouch_[i].target === t.target){
            Touch._onGoingTouch_[i].sibling = t;
            return Touch._onGoingTouch_[i];
        }
    }
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
    
    var p = Touch._onGoingTouch_.indexOf(t);
    if(p !== -1)
        Touch._onGoingTouch_.splice(p, 1);
    
    return Touch._onGoingTouch_.length;
};

document.addEventListener("touchstart", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = Touch.add(t);
        
        touch.timer = setTimeout(function(){
            var touch = Touch.getById(t.identifier);
            if(!touch.moved){
                var cev = new CustomEvent("holdtap", {bubbles: true, cancelable: true, detail: touch});
                touch.target.dispatchEvent(cev);
            }
        }, Touch.holdTapDuration);
    });
    
    if(Touch.preventZoom) ev.preventDefault();
}, 0);
document.addEventListener("touchmove", function(ev){
    var now = Date.now();
    Touch.handleEvent(ev, function(t){
        var touch = Touch.getById(t.identifier);
        
        if(touch){
            touch.pageX = t.pageX;
            touch.pageY = t.pageY;
            
            if(!touch.moved && Touch.distance(touch.pageX, touch.pageY, touch.startX, touch.startY) > Touch.tapMaxDistance){
                touch.moved = true;
                
                var cev = new CustomEvent("grab", {bubbles: true, cancelable: true, detail: touch});
                touch.target.dispatchEvent(cev);
            }
            if(touch.moved){
                if(touch.sibling){
                    touch.distanceFromSibling = Touch.distance(touch.pageX, touch.pageY, touch.sibling.pageX, touch.sibling.pageY);
                    
                    var cev = new CustomEvent("pinch", {cancelable: true, detail: touch});
                    touch.target.dispatchEvent(cev);
                }
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
        var touch = Touch.getById(t.identifier);
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
        var touch = Touch.getById(t.identifier);
        if(touch){
            var cev = new CustomEvent("drop", {bubbles: true, cancelable: true, detail: touch});
            touch.target.dispatchEvent(cev);
            
            Touch.remove(touch);
        }
    });
}, 0);
document.addEventListener("touchleave", function(ev){
    Touch.handleEvent(ev, function(t){
        var touch = Touch.getById(t.identifier);
        if(touch){
            Touch.remove(touch);
        }
    });
}, 0);