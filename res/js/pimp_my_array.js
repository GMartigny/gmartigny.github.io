/**
 * Append any set of value at the end of the array
 * @argument {...*} value A value to append
 * @returns {Array} Itself once edited
 */
Array.prototype.append = function(value){
    for(var k in arguments){
        if(arguments.hasOwnProperty(k))
            this[this.length] = arguments[k];
    }
    return this;
};
/**
 * Prepend any set of value at the beginning of the array
 * @argument {...*} value A value to prepend
 * @returns {Array} Itself once edited
 * @todo
 */
Array.prototype.prepend = function(value){
    
    return this;
};
/**
 * Remove the tail of the array
 * @param {Number} [n=1] Number of item to remove
 * @returns {Array} Itself once edited
 */
Array.prototype.pop = function(n){
    n = n || 1;
    this.length -= n>this.length? this.length: n;
    return this;
};
/**
 * Remove the head of the array
 * @param {Number} [n=1] Number of item to remove
 * @returns {Array} Itself once edited
 * @todo
 */
Array.prototype.shift = function(n){
    n = n || 1;
    
    return this;
};
/**
 * Return the head of the array
 * @param {Number} [n=1] Number of item to get
 * @returns {Array} The n first values of the array
 * @todo
 */
Array.prototype.head = function(n){
    n = n || 1;
    
};
/**
 * Return the tail of the array
 * @param {Number} [n=1] Number of item to get
 * @returns {Array} The n last values of the array
 * @todo
 */
Array.prototype.tail = function(n){
    n = n || 1;
    
};

/**
 * Merge with any set of arrays
 * @argument {...Array} another An array to merge with
 * @returns {Array} Itself once edited
 */
Array.prototype.merge = function(another){
    var self = this;
    for(var i in arguments){
        if(arguments.hasOwnProperty(i)){
            var arg = arguments[i];
            if(arg.isArray()){
                arg.each(function(v, k){
                    if(isNaN(k))
                        self[k] = v;
                    else
                        self.append(v);
                });
            }
            else
                self.append(arg);
        }
    }
    return this;
};

/**
 * Return all keys of the array
 * @returns {Array} An array of the keys
 */
Array.prototype.keys = function(){
    var keys = [];
    this.each(function(v, k){
        keys.append(k);
    });
    return keys;
};
/**
 * Return all values of the array
 * @returns {Array} An array of the values
 */
Array.prototype.values = function(){
    var val = [];
    this.each(function(v){
        val.append(v);
    });
    return val;
};

/**
 * Return the values that match thoses in another array
 * @param {Array} another An array to compare with
 * @throws {TypeError} if the parameter is not an array
 * @returns {Array} The result of the intersection
 */
Array.prototype.intersect = function(another){
    if(!(another instanceof Array))
        throw new TypeError("parameter 1 is not an Array");
    
    var inter = [];
    this.each(function(v, k){
        another.each(function(av){
            if(v === av)
                inter[k] = v;
        });
    });
    return inter;
};
/**
 * Return the keys that match thoses in another array
 * @param {Array} another An array to compare with
 * @throws {TypeError} if the parameter is not an array
 * @returns {Array} The result of the key's intersection
 */
Array.prototype.intersectKeys = function(another){
    if(!(another instanceof Array))
        throw new TypeError("parameter 1 is not an Array");
    
    var inter = [];
    this.keys().each(function(k){
        if(another[k] !== undefined)
            inter[k] = this[k];
    });
    return inter;
};


/**
 * Browse each item on the array
 * @param {Function} func A function to execute on each item
 * @returns {Array} Itself once edited
 */
Array.prototype.each = function(func){
    for(var k in this){
        if(this.hasOwnProperty(k))
            func.call(this, this[k], k);
    }
    return this;
};

/**
 * Search for a specific value in the array
 * @param {*} needle The value to find
 * @returns {Number} Number of occurence of the needle
 */
Array.prototype.contains = function(needle){
    var found = 0;
    this.each(function(v){
        if(needle === v)
            ++found;
    });
    return found;
};
/**
 * Search for a specific key in the array
 * @param {*} needle The key to find
 * @returns {Number} Number of occurence of the needle
 */
Array.prototype.containsKey = function(needle){
    var found = 0;
    this.keys().each(function(k){
        if(k === needle)
            ++found;
    });
    return found;
}

// Filter
Array.prototype.filter = function(func){
    var res = [];
    this.each(function(v){
        if(func.call(this, v))
            res.append(v);
    });
    return res;
};
Array.prototype.filterKeys = function(func){
    var res = [],
        self = this;
    this.keys().filter(func).each(function(k){
        res[k] = self[k];
    });
    return res;
};

/**
 * Randomize the values of the array
 * @returns {Array} Itself once edited
 * @todo
 */
Array.prototype.shuffle = function(){
    var res = [];
    
    return res;
};

/**
 * Put all the values in a single string
 * @param {String} [glue=","] The separator of each value
 * @returns {String} A string containing all values of the array
 */
Array.prototype.implode = function(glue){
    glue = glue.toString() || ",";
    var str = "";
    this.each(function(v){
        str += glue+v;
    });
    str = str.substr(glue.length);
    return str;
};

/**
 * Check if this is an array
 * @returns {Boolean} Return true if it's and array, false otherwise
 */
Object.prototype.isArray = function(){
    return this instanceof Array;
};