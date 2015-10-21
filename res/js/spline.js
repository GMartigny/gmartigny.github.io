/**
 * Code copied and adapted from http://scaledinnovation.com/analytics/splines/aboutSplines.html
 * By Rob Spencer (thanks dude)
 */

var sqrt = Math.sqrt,
    pow = Math.pow,
    sq = function(x){ return pow(x, 2); };

CanvasRenderingContext2D.prototype.splineThrought = function(dots, tension, closed){
    tension = tension==undefined? 0.5: tension;
    
    if(dots.length >= 6){
        this.save();
        var cp = [],   // array of control points, as x0,y0,x1,y1,...
            n = dots.length;

        if(closed){
            //   Append and prepend knots and control points to close the curve
            dots.push(dots[0],dots[1],dots[2],dots[3]);
            dots.unshift(dots[n-1]);
            dots.unshift(dots[n-1]);
            for(var i=0;i<n;i+=2){
                cp=cp.concat(getControlPoints(dots[i],dots[i+1],dots[i+2],dots[i+3],dots[i+4],dots[i+5],tension));
            }
            cp=cp.concat(cp[0],cp[1]);   
            for(var i=2;i<n+2;i+=2){
                this.moveTo(dots[i],dots[i+1]);
                this.bezierCurveTo(cp[2*i-2],cp[2*i-1],cp[2*i],cp[2*i+1],dots[i+2],dots[i+3]);
            }
        }else{
            // Draw an open curve, not connected at the ends
            for(var i=0;i<n-4;i+=2){
                cp=cp.concat(getControlPoints(dots[i],dots[i+1],dots[i+2],dots[i+3],dots[i+4],dots[i+5],tension));
            }
            for(var i=2;i<dots.length-5;i+=2){
                this.moveTo(dots[i],dots[i+1]);
                this.bezierCurveTo(cp[2*i-2],cp[2*i-1],cp[2*i],cp[2*i+1],dots[i+2],dots[i+3]);
            }
            //  For open curves the first and last arcs are simple quadratics.
            this.moveTo(dots[0],dots[1]);
            this.quadraticCurveTo(cp[0],cp[1],dots[2],dots[3]);
            this.moveTo(dots[n-2],dots[n-1]);
            this.quadraticCurveTo(cp[2*n-10],cp[2*n-9],dots[n-4],dots[n-3]);
        }
        this.restore();
    }
    else if(dots.length >= 4){
        this.moveTo(dots[0], dots[1]);
        this.lineTo(dots[2], dots[3]);
    }
};
function getControlPoints(x0,y0,x1,y1,x2,y2,t){
    var d01=sqrt(sq(x1-x0)+sq(y1-y0));
    var d12=sqrt(sq(x2-x1)+sq(y2-y1));
   
    var fa=t*d01/(d01+d12);
    var fb=t-fa;
  
    var p1x=x1+fa*(x0-x2);
    var p1y=y1+fa*(y0-y2);

    var p2x=x1-fb*(x0-x2);
    var p2y=y1-fb*(y0-y2);  
    
    return [p1x,p1y,p2x,p2y];
}
