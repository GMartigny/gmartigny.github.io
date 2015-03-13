
$.extend({
    tutorize: function(arr){
        if(arr.length){
            
            var l = arr.length,
                one, prev;
            
            while(l--){
                one = arr[l];
                prev = new Tuto(one.title, one.content, one.hook, prev);
            }
            
            setTimeout(function(){
                prev.show();
            }, 100);
        }
    }
});

function Tuto(title, content, hook, next){
    this.title = title;
    this.content = content;
    this.next = next || false;
    this.html = $(this.render()).appendTo("#"+hook);
}
Tuto.restart = function(){
    localStorage.removeItem("tuto");
};
Tuto.prototype = {
    render: function(){
        var html = $("<div class='tuto'></div>"),
            content = $("<div class='content'></div>");
        
        content.append("<h1>"+this.title+"</h1>");
        content.append("<p>"+this.content+"</p>");
        
        var self = this;
        if(this.next){
            content.append($("<a href='#' class='skip'>Passer</a>").on("click", function(e){
                e.preventDefault();
                e.stopPropagation();
                self.skip();
                return false;
            }));
            content.append($("<button class='next btn'>Suivant</button>").on("click", function(e){
                e.preventDefault();
                e.stopPropagation();
                self.goNext();
                return false;
            }));
        }
        else{
            content.append($("<button class='next btn'>Ok</button>").on("click", function(e){
                e.preventDefault();
                e.stopPropagation();
                self.hide();
                return false;
            }));
        }
        html.append(content);
        return html;
    },
    show: function(){
        this.html.addClass("shown");
    },
    
    hide: function(){
        this.html.removeClass("shown");
    },
    
    goNext: function(){
        this.hide();
        this.next.show();
    },
    
    skip: function(){
        this.hide();
        if(this.next)
            this.next.skip();
    }
};