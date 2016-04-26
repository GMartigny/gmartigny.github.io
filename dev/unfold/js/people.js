
function People(name){
    this.name = name;
    this.actions = [];
    
    this.busy = false;
    this.life = 100;
    
    this.html = this.toHTML();
}
People.prototype = {
    toHTML: function(){
        var html = document.createElement("div");
        html.innerHTML = this.name;
        html.className = "people";
        return html;
    },
    refresh: function(ellapse, res){
        
        this.actions.forEach(function(a){
            a.refresh(res);
        });
        
    },
    addAction: function(data){
        var action = new Action(this, data);
        this.html.appendChild(action.html);
        this.actions.push(action);
    }
};
People.LST_ID = "peopleList";