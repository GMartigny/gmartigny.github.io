
function Action(owner, data){
    this.locked = true;
    this.running = false;
    
    this.owner = owner;
    this.data = data;
    
    this.html = this.toHTML();
}
Action.prototype = {
    refresh: function(ressource){
        if(!this.running){
            this.locked = false;
            if(this.data.consume){
                for(var name in this.data.consume){
                    if(this.data.consume.hasOwnProperty(name) && (!ressource[name] || !ressource[name].has(this.data.consume[name]))){
                        this.locked = true;
                        break;
                    }
                }
            }

            if(this.locked)
                this.html.classList.add("disabled");
            else
                this.html.classList.remove("disabled");
        }
    },
    click: function(){
        
        var duration = this.data.time * Game.time.hourToMs;
        this.html.classList.add("cooldown");
        this.html.style.animationDuration = duration+"ms";
        
        var self = this;
        setTimeout(function(){
            self.html.classList.remove("cooldown");
            
            if(self.data.give){
                var give = self.data.give();
                MessageBus.getInstance().notifyAll(MessageBus.MSG_TYPES.GIVE, give);
            }
            if(self.data.unlock){
                var unlock = self.data.unlock();
                MessageBus.getInstance().notifyAll(MessageBus.MSG_TYPES.UNLOCK, unlock);
            }
            if(self.data.lock){
                var lock = self.data.lock();
                MessageBus.getInstance().notifyAll(MessageBus.MSG_TYPES.LOCK, lock);
            }
            
            self.owner.busy = false;
        }, duration);
    },
    toHTML: function(){
        var html = document.createElement("div"),
            self = this;
        
        html.className = "action clickable disabled " + this.data.name.toLowerCase().replace(" ", "_");
        html.innerHTML = this.data.name;
        if(this.data.desc)
            html.title = this.data.desc;
        
        html.onclick = function(){
            if(!self.locked && !self.running && !self.owner.busy)
                self.click.call(self);
        };
        return html;
    }
};