// Data
Array.prototype.push = function(){
    for(var k in arguments){
        this[this.length] = arguments[k];
    }
    return this;
};
Array.prototype.pop = function(n){
    n = n || 1;
    this.length -= n>this.length? this.length: n;
    return this;
};
Array.prototype.shift = function(n){
    n = n || 1;
    
    return this;
};

Array.prototype.merge = function(){
    for(var k in arguments){
        var a = arguments[k];
        if(a instanceof Array){
            for(var k in a){
                if(a.hasOwnProperty(k)){
                    if(isNaN(k))
                        this[k] = a[k];
                    else
                        this.push(a[k]);
                }
            }
        }
        else
            this.push(a);
    }
    return this;
};

Array.prototype.keys = function(){
    var keys = [];
    for(var k in this){
        if(this.hasOwnProperty(k))
            keys.push(k);
    }
    return keys;
};
Array.prototype.values = function(){
    var val = [];
    for(var k in this){
        if(this.hasOwnProperty(k))
            val.push(this[k]);
    }
    return val;
};

// Comparison
Array.prototype.intersect = function(another){
    if(!(another instanceof Array))
        throw new TypeError("parameter 1 is not an Array");
    
    var inter = [];
    this.each(function(v){
        another.each(function(av){
            if(v === av)
                inter.push(v);
        });
    });
    return inter;
};
Array.prototype.intersect_key = function(another){
    if(!(another instanceof Array))
        throw new TypeError("parameter 1 is not an Array");
    
    var inter = [];
    this.keys().each(function(k){
        another.keys().filter(function(ak){
            return k === ak;
        });
    });
    return inter;
};

// Browse
Array.prototype.each = function(func){
    var self = this;
    this.forEach(function(e){
        func.call(self, e);
    });
    return this;
};

// Filter
Array.prototype.filter = function(func){
    var res = [];
    this.each(function(v){
        if(func.call(this, v))
            res.push(v);
    });
    return res;
};
Array.prototype.filter_keys = function(func){
    var res = [],
        self = this;
    this.keys().filter(func).each(function(k){
        res[k] = self[k];
    });
    return res;
};

Array.prototype.sort = function(func){
    
};