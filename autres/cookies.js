// Game.LoadMod("http://gmartigny.github.com/autres/cookies.js");

$("#support").remove();

C = {
    simu: {
        saveAchievements: function(){
            this.achs = Game.Achievements;
        },
        restoreAchievements: function(){
            Game.Achievements = this.achs;
        },
        buyBuilding: function(name){
            var bui = Game.Objects[name];
            if(bui){
                return this.buy(bui);
            }
            return 0;
        },
        buyUpgrade: function(name){
            var up = Game.Upgrades[name];
            if(up && !up.bought){
                return this.buy(up);
            }
            return 0;
        },
        buy: function(what){
            this.saveAchievements();
            var cps = Game.cookiesPs,
                nCps = 0;
            what.bought++;
            if (what.buyFunction) what.buyFunction();
            Game.CalculateGains();
            nCps = Game.cookiesPs;

            what.bought--;
            this.restoreAchievements();
            Game.CalculateGains();
            
            return nCps - cps;
        }
    }
};
Game.customLogic.push(function(){
    var worst = {
            object: null,
            val: null
        },
        best = {
            object: null,
            val: null
        },
        val = 0;
    for (var o in Game.Objects){
        val = C.simu.buyBuilding(o);
        if(worst.val === null || worst.val > val){
            worst.object = o;
            worst.val = val;
        }
        if(best.val === null || best.val < val){
            best.object = o;
            best.val = val;
        }
    }
    if(worst.object) worst.object.l.classList.add("worst"); worst.val = null;
    if(best.object) best.object.l.classList.add("best"); best.val = null;

    for(var u in Game.Upgrades){
        val = C.simu.buyUpgrade(u);
        if(worst.val === null || worst.val > val){
            worst.object = u;
            worst.val = val;
        }
        if(best.val === null || best.val < val){
            best.object = u;
            best.val = val;
        }
    }
});
Game.customInit = function(){
    var s = document.createElement("style");
    s.type = "text/css";
    s.innerHTML =   ".product .title.worst{ color: #EDC0C0 } " +
                    ".product .title.best{ color: #F5EA5A }";
};