var self = this;

onmessage = function(message){
    var startTime = Date.now();
    
    var timeout = setTimeout(function(){
        throw new TimeoutError();
    }, 10000);
    
    eval(message.data);
    
    postMessage(Date.now()-startTime);
};

function TimeoutError(){
    this.message = "It's taking too long";
}

// return an array with random values
function getTestArray(length){
    var arr = [];
    while(length--) arr.push(random());
    return arr;
}
// return a random value
function random(from, to){
    from = from || 0;
    to = to || 100;
    return (Math.random()*(to-from)+from)<<0;
}