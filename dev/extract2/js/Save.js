
function SaveManager(){

}
SaveManager.prototype = {
    put: function(o){
        localStorage.setItem("extract2", this.serialize(o));
    },

    serialize: function(o){
        return JSON.stringify(o);
    },

    get: function(){
        return this.unserialize(localStorage.getItem("extract2"));
    },

    unserialize: function(s){
        return JSON.parse(s);
    }
};