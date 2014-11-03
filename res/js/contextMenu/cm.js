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
ContextMenu.createMenu = function(groups){
    var m = document.createElement("div"),
        s = document.createElement("div");
    m.id = "_cm";
    s.classList.add("holder");
    groups.forEach(function(g){
        s.appendChild(ContextMenu.createMenu.group(g));
    });

    m.addEventListener("contextmenu", function(e){
        e.preventDefault();
    });
    m.addEventListener("click", function(e){
        e.stopPropagation();
    });
    m.appendChild(s);
    return m;
};
ContextMenu.createMenu.group = function(g){
    var d = document.createElement("div");
    d.classList.add("group");
    for(var o in g){
        if(g[o]){
            if(g[o].length)
                d.appendChild(ContextMenu.createMenu.dropdown(o, g[o]));
            else
                d.appendChild(ContextMenu.createMenu.option(o, g[o]));
        }
        else
            d.appendChild(ContextMenu.createMenu.noaction(o));
    }
    return d;
};
ContextMenu.createMenu.option = function(n, f){
    var i = document.createElement("button");
    i.innerHTML = n;
    i.addEventListener("click", f);
    i.addEventListener("click", ContextMenu.callHide);
    return i;
};
ContextMenu.createMenu.noaction = function(n){
    var i = document.createElement("div");
    i.innerHTML = n;
    i.classList.add("no-action");
    return i;
};
ContextMenu.createMenu.dropdown = function(n, o){
    var i = document.createElement("div"),
        s = document.createElement("div");
    i.innerHTML = n;
    i.classList.add("parent");
    s.classList.add("holder");
    o.forEach(function(u){
        s.appendChild(ContextMenu.createMenu.group(u));
    });
    i.appendChild(s);
    return i;
};
ContextMenu.prototype.refreshHTML = function(){
    if(this.menu)
        this.menu.remove();
    this.menu = ContextMenu.createMenu(this.options);
};
ContextMenu.prototype.setOptions = function(options){
    this.options = options;
    this.refreshHTML();
};
ContextMenu.opened = false;
ContextMenu.prototype.show = function(x, y){
    this.menu.style.left = x;
    this.menu.style.top = y;
    document.body.appendChild(this.menu);

    if(y + this.menu.offsetHeight > document.body.offsetHeight)
        this.menu.style.top = y - this.menu.offsetHeight;
    if(x + this.menu.offsetWidth > document.body.offsetWidth)
        this.menu.style.left = document.body.offsetWidth - this.menu.offsetWidth;

    ContextMenu.opened = this;
    window.addEventListener("click", ContextMenu.callHide);
};
ContextMenu.callHide = function(){
    ContextMenu.opened.hide.call(ContextMenu.opened);
};
ContextMenu.prototype.hide = function(){
    this.menu.remove();
    window.removeEventListener("click", ContextMenu.callHide);
};