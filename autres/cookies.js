// Game.LoadMod("http://gmartigny.github.com/autres/cookies.js?"+Date.now());

l("support").remove();

C = {
    simu: {
        saveAchievements: function(){
            this.achs = Game.Achievements;
        },
        restoreAchievements: function(){
            Game.Achievements = this.achs;
        },
        buyBuilding: function(bui){
            if(bui){
                return this.buy(bui);
            }
            return false;
        },
        buyUpgrade: function(up){
            if(up && !up.bought){
                return this.buy(up);
            }
            return false;
        },
        buy: function(what){
            this.saveAchievements();
            var cps = Game.cookiesPs,
                nCps = 0;
            what.amount+=1;
            what.bought+=1;
            if (what.buyFunction) what.buyFunction();
            Game.CalculateGains();
            nCps = Game.cookiesPs;

            what.amount-=1;
            what.bought-=1;
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
    // All buildings
    for (var o in Game.Objects){
        o = Game.Objects[o];
        if(!o.locked){
            val = C.simu.buyBuilding(o) / o.getPrice();
            if(worst.val === null || worst.val > val){
                worst.object = o;
                worst.val = val;
            }
            if(best.val === null || best.val < val){
                best.object = o;
                best.val = val;
            }
        }
    }
    if(worst.object) worst.object.l.classList.add("worst");
    worst.object = null; worst.val = null;
    if(best.object) best.object.l.classList.add("best");
    best.object = null; best.val = null;
    
    // All upgrades
//    for(var u in Game.Upgrades){
//        val = C.simu.buyUpgrade(u) / u.getPrice();
//        if(worst.val === null || worst.val > val){
//            worst.object = u;
//            worst.val = val;
//        }
//        if(best.val === null || best.val < val){
//            best.object = u;
//            best.val = val;
//        }
//    }
//    if(worst.object) worst.object.l.classList.add("worst"); worst.val = null;
//    if(best.object) best.object.l.classList.add("best"); best.val = null;
});
Game.customInit = function(){
    var s = document.createElement("style");
    s.type = "text/css";
    s.innerHTML =   ".product .title.worst{ color: #EDC0C0 } " +
                    ".product .title.best{ color: #F5EA5A } " +
                    "#upgrades .upgrade:after{ content: ''; position: absolute; width: 100%; height: 100%; border: 2px solid #BBB} " +
                    ".upgrade.worst:after{ border-color: #EDC0C0; } " +
                    ".upgrade.best:after{ border-color: #F5EA5A; }";
    document.head.appendChild(s);
};