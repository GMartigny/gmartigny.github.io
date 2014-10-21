HTMLElement.prototype.contextMenu = function(options){
    this.contextMenu = new ContextMenu(options);
    this.addEventListener("contextmenu", function(e){
        e.preventDefault();
        this.contextMenu.show(e.clientX, e.clientY);
    });
};
function ContextMenu(options){
    this.setOptions(options);
}
ContextMenu.Split = "_split";

ContextMenu.createMenu = function(groups){
    var m = document.createElement("div");
    m.id = "_cm";
    groups.forEach(function(g){
        var d = document.createElement("div");
        for(var o in g){
            var i = document.createElement("button");
            i.innerHTML = o;
            if(g[o])
                i.addEventListener("click", g[o]);
            else
                i.classList.add("no-action");
            d.appendChild(i);
        }
        m.appendChild(d);
    });
    m.addEventListener("contextmenu", function(e){
        e.preventDefault();
        e.target.click();
    });
    return m;
};
ContextMenu.prototype.refreshHTML = function(){
    if(this.menu) this.menu.remove();
    this.menu = ContextMenu.createMenu(this.options);
};
ContextMenu.prototype.setOptions = function(options){
    this.options = options;
    this.refreshHTML();
};
ContextMenu.prototype.show = function(x, y){
    this.menu.style.left = x;
    this.menu.style.top = y;
    document.body.appendChild(this.menu);
    var cm = this;
    window.addEventListener("click", function(){
        cm.hide.call(cm);
    });
};
ContextMenu.prototype.hide = function(){
    this.menu.remove();
    window.removeEventListener("click", this.hide);
};