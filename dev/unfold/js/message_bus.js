
function MessageBus(){
    this.observers = [];
}
MessageBus.prototype = {
    observe: function(observer, type){
        if(!this.observers[type])
            this.observers[type] = [];
        this.observers[type].push(observer);
    },
    notifyAll: function(type, message){
        if(this.observers[type]){
            for(var i=0, l=this.observers[type].length;i<l;++i){
                this.observers[type][i].notify(message);
            }
        }
    }
};

MessageBus.instance = false;
MessageBus.getInstance = function(){
    if(!MessageBus.instance)
        MessageBus.instance = new MessageBus();
    return MessageBus.instance;
};
MessageBus.MSG_TYPES = {
    CLICK: 1,
    REFRESH: 2,
    GIVE: 3,
    UNLOCK: 4,
    LOCK: 5,
    BUILD: 6
};