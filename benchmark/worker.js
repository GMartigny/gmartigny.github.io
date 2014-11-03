var self = this;

onmessage = function(message){
    var startTime = Date.now();
    
    eval(message.data);
    
    postMessage(Date.now()-startTime);
};

// return an array with random values
function getTestArray(length){
    var arr = [];
    while(length--) arr.push(random());
    return arr;
}
// return a random string
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,.;:_-\"/\\?!(){}[]<>$*&%-+#";
function getTestString(length){
    var str = "",
        l = chars.length;
    while(length--) str += chars[random(0, l)];
    return str;
}
// return a random value
function random(from, to){
    from = from || 0;
    to = to || 100;
    return (Math.random()*(to-from)+from)<<0;
}