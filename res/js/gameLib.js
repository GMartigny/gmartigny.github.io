var gamelib_loading_progress = 0;
/**
 * load all media in a array and do a function with weight as parameter for each
 * @example [<br/>
 * &nbsp;&nbsp;{src:"images/tileset.png", type:"image", weight:42},<br/>
 * &nbsp;&nbsp;"images/tileset2.png",<br/>
 * &nbsp;&nbsp;{src:"images/j_e6a6aca6.png", name:"tileset3"}<br/>]
 * @param {Array} arr List of file to load.<br/>src: the source url<br/>type: the type of ressource<br/>weight: weight of the file<br/>name: a name for the ressource
 * @param {Function} act A function executed for each file with the percentage as parameter
 * @returns {Object} Each file
 */
function loadMedia(arr, act){
    gamelib_loading_progress = 0;
    act = act || function(){};
    var weight = 0,
        sum = 0,
        src = "",
        type = "",
        name = "",
        output = {};

    for(var i = 0; i < arr.length; ++i){
        weight = arr[i].weight || 1;
        sum += weight;
        src = arr[i].src || arr[i];
        name = arr[i].name || src;
        type = arr[i].type || defineFormat(src);

        var tmp;
        switch(type){
            case "image":
                tmp = new Image(src);
                break;
            case "audio":
                tmp = new Audio([src]);
                break;
            case "video":
                tmp = new Video(src);
                break;
            case "script":
                tmp = new Script(src);
                break;
            case "json":
                tmp = {};
                break;
            case "text":
                tmp = {};
                break;
        }

        tmp.name = name;
        tmp.weight = weight;
        var callback = function(){
            gamelib_loading_progress += this.weight;
            act(gamelib_loading_progress / sum * 100, this.name);
        };
        if(type == "audio"){
            tmp.addEvent("canplaythrough", callback, false);
        }
        else if(type == "text"){
            get(src, function(){
                output[tmp.name] = this.response;
                callback.call(tmp);
            });
        }
        else if(type == "json"){
            get(src, function(){
                output[tmp.name] = JSON.parse(this.response);
                callback.call(tmp);
            });
        }
        else{
            try{
                tmp.addEvent("load", callback, false);
            }
            catch(e){}
        }

        output[name] = tmp;
    }
    return output;
}

// *private*
// return the format of a filename
function defineFormat(name){
    var type = false;
    if(0 < name.lastIndexOf('.')){
        var ext = name.substring(name.lastIndexOf('.') + 1);
        switch(ext){
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "tif":
            case "bmp":
                type = "image";
                break;
            case "mp3":
            case "ogg":
            case "m4a":
            case "wma":
            case "raw":
            case "wav":
                type = "audio";
                break;
            case "mp4":
            case "avi":
            case "wmv":
            case "mov":
            case "flv":
            case "mkv":
            case "mpg":
            case "ogv":
            case "webm":
                type = "video";
                break;
            case "js":
                type = "script";
                break;
            case "json":
                type = "json";
                break;
            default :
                type = "text";
        }
    }
    return type;
}

function prepareCanvas(holder, width, height){
    var cs = getById(holder).getElementsByTagName("canvas"),
        l = cs.length,
        objs = {};
    
    while(l--){
        if(width && height){
            cs[l].width = width;
            cs[l].height = height;
        }
        var o = {
            can: cs[l],
            ctx: cs[l].getContext("2d")
        };
        objs[o.can.id] = o;
    }
    return objs;
}

// enhance HTML element
HTMLElement.prototype.addEvent = HTMLElement.prototype.addEventListener;
window.addEvent = window.addEventListener;

// use good socket
window.WebSocket = window.WebSocket || window.MozWebSocket;

// cross-browser Request Animation Frame
window.raf = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(f){
        setTimeout(f, 16);
    };

// cross-browser getUserMedia
navigator.gUM = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

function Image(url){
    url = url || "";
    var elm = document.createElement("img");
    elm.src = url;
    return elm;
}
HTMLImageElement.prototype.getData = function(){
    var can = document.createElement("canvas"),
        ctx = can.getContext("2d");
    
    if(this.width && this.height){
        can.width = this.width;
        can.height = this.height;
        ctx.drawImage(this, 0, 0);
        var data = ctx.getImageData(0, 0, can.width, can.height);
        return data;
    }
    else
        return false;
};

var Video = Video || function(src){
    var elm = document.createElement("video");
    elm.preload = "auto";
    elm.src = src;
    return elm;
};

function Audio(srcs){
    var elm = document.createElement("Audio");
    elm.preload = "auto";
    if(srcs instanceof Array){
        for(var i = 0; i < srcs.length; ++i){
            var s = document.createElement("source");
            s.src = srcs[i];
            elm.appendChild(s);
        }
    }
    return elm;
}

function Script(src){
    var elm = document.createElement("script");
    elm.src = src;
    document.head.appendChild(elm);
    return elm;
}

function Pixel(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}
Pixel.prototype.equals = function(o){
    return this.r === o.r && this.g === o.g && this.b === o.b && this.a === o.a;
};
Pixel.prototype.getHexa = function(){
    return "#" + hexa(this.r) + hexa(this.g) + hexa(this.b);
};
Pixel.prototype.isOpac = function(){
    return (this.a == 255);
};
function hexa(n){
    var h = n.toString(16);
    return (h.length < 2) ? "0" + h : h;
}

ImageData.prototype.get = function(x, y){
    if(x < 0 || this.width <= x || y < 0 || this.height <= y){ // out of bound
        return false;
    }
    else{
        var i = 4 * (x + y * this.width);
        return new Pixel(this.data[i], this.data[++i], this.data[++i], this.data[++i]);
    }
};
ImageData.prototype.put = function(x, y, P){
    if(x < 0 || this.width <= x || y < 0 || this.height <= y){ // out of bound
        return false;
    }
    else{
        var i = 4 * (x + y * this.width);
        this.data[i++] = P.r;
        this.data[i++] = P.g;
        this.data[i++] = P.b;
        this.data[i] = P.a;
        return true;
    }
};

// clear whole context
CanvasRenderingContext2D.prototype.clear = function(){
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

// generic function for drawing path
CanvasRenderingContext2D.prototype.makePath = function(act, fill, stroke){
    this.beginPath();
    act.call(this);
    if(stroke)
        this.stroke();
    if(fill)
        this.fill();
    else
        this.closePath();
};

// return the element matching id
function getById(id){
    return document.getElementById(id);
}

// return all elements matching classname (cross-browser)
function getByClass(c, elm){
    elm = elm || document;
    if(!elm.getElementsByClassName){
        var elements = elm.getElementsByTagName('*'),
            i = 0,
            nodeList = [],
            reg = new RegExp('(^|\\s)' + c + '(\\s|$)');

        for(i = 0; i < elements.length; ++i){
            if(elements[i].className.match(reg) !== null){
                nodeList.push(elements[i]);
            }
        }
        return nodeList;
    }
    else{
        return elm.getElementsByClassName(c);
    }
}
function distance(one, two){
    return sqrt(sq(two.x - one.x) + sq(two.y - one.y));
}
var sqrt = Math.sqrt,
    pow = Math.pow,
    sq = function(x){
        return pow(x, 2);
    },
    floor = function(x){
        if(x > 0)
            return x << 0;
        else
            return x - 1 << 0;
    },
    round = function(x){
        if(x > 0)
            return x + 0.5 << 0;
        else
            return x - 0.5 << 0;
    },
    ceil = function(x){
        if(x > 0)
            return x + 1 << 0;
        else
            return x << 0;
    },
    sin = Math.sin,
    asin = Math.asin,
    cos = Math.cos,
    r = Math.random,
    PI = Math.PI,
    PI2 = PI * 2,
    SQRT2 = sqrt(2) / 2;

function random(from, to){
    from = from || 0;
    if(to === undefined){
        to = from;
        from = 0;
    }
    return r()*(to - from)+from;
}

function size(array){
    if(array instanceof Array)
        return array.length;
    else{
        var sum = 0;
        for(var k in array)
            if(array.hasOwnProperty(k))
                ++sum;
        return sum;
    }
}

Array.prototype.out = function(o){
    var index = this.indexOf(o);
    if(index >= 0)
        this.splice(index, 1);
    else
        throw o + " not find in this array";
};

String.prototype.hashCode = function(){
    var hash = 0, i, chr, len;
    if(this.length == 0)
        return hash;
    for(i = 0, len = this.length; i < len; i++){
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function get(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.onload = callback;
    xhr.send();
    return xhr;
}

function log(mess){
    console.log(mess);
}
