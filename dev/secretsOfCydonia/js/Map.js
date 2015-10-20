
function MapManager(links){
    this.links = JSON.parse(links);
    
    (localStorage.SoC_M && localStorage.SoC_M.hashCode() == localStorage.SoC_HM)?
        this.pos = localStorage.SoC_M.split(";") : this.pos = [0, 0];
}
MapManager.prototype = {
    getMap: function(){
        return this.links[this.pos[0]][this.pos[1]];
    },
    changeMap: function(dir){
        switch (dir){
            case Player.DIR_DOWN:
                if(++this.pos[0] > this.links[0].length)
                    this.pos[0] = this.links[0].length;
                break;
            case Player.DIR_UP:
                if(--this.pos[0] < 0)
                    this.pos[0] = 0;
                break;
            case Player.DIR_RIGHT:
                if(++this.pos[1] > this.links.length)
                    this.pos[1] = this.links.length;
                break;
            case Player.DIR_LEFT:
                if(--this.pos[1] < 0)
                    this.pos[1] = 0;
                break;
        }
    
        var s = this.pos[0]+";"+this.pos[1];
        localStorage.SoC_M = s;
        localStorage.SoC_HM = s.hashCode();
    }
};
