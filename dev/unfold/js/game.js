
function Game(holder, media){
    this.holder = holder;

    this.ressources = {};
    this.people = [];

    this.firstTick = performance.now();
    this.lastTick = performance.now();
    this.init();

    var self = this;
    this.loop = setInterval(function(){
        self.refresh();
    }, Game.tickLength);
}
Game.tickLength = 2000;
Game.prototype = {
    init: function(){

        this.ressources.People = new Ressource(this, Game.data.ressources.people.name, 1);

        var ressourceList = document.createElement("div");
        ressourceList.id = Ressource.LST_ID;
        for(var name in this.ressources){
            if(this.ressources.hasOwnProperty(name))
                ressourceList.appendChild(this.ressources[name].html);
        }
        this.holder.appendChild(ressourceList);

        var peopleList = document.createElement("div");
        peopleList.id = People.LST_ID;

        var p = new People("Droid 1");
        p.addAction(Game.data.actions.settle);
        peopleList.appendChild(p.html);
        this.people.push(p);

        this.holder.appendChild(peopleList);

    },
    refresh: function(){
        var now = performance.now(),
            ellapse = (now - this.lastTick)/Game.tickLength;
        this.lastTick = now;

        for(var name in this.ressources){
            if(this.ressources.hasOwnProperty(name))
                this.ressources[name].refresh();
        }

        var res = this.ressources;
        this.people.forEach(function(p){
            p.refresh(ellapse, res);
        });
        if(Game.settled){
            this.ressources.Water.update(- Game.data.ressources.people.consume.water * this.people.length);
            this.ressources.Food.update(- Game.data.ressources.people.consume.food * this.people.length);
        }
    },
    earn: function(amount, ressource){
        if(this.ressources[ressource])
            this.ressources[ressource].update(amount);
        else{
            var r = new Ressource(ressource, amount);
            this.ressources[ressource] = r;
            document.getElementById(Ressource.LST_ID).appendChild(r.html);
        }

        if(ressource === Game.data.ressources.people.name){
            for(var i=0;i<amount;++i){
                var p = new People("Wanderer");
                this.people.push(p);
                document.getElementById(People.LST_ID).appendChild(p.html);
            }
        }
    }
};
Game.time = {
    day: 24,
    week: 7*24,
    month: 4*7*24,
    year: 12*4*7*24,
    hourToMs: 2000
};
Game.data = {
    ressources: {
        /* GATHERABLE */
        gatherable: {
            common: {
                water: {
                    name: "Water",
                    desc: "Water is important to survive in this harsh environement."
                },
                food: {
                    name: "Food",
                    desc: "Everyone need food to keep his strength."
                },
                rock: {
                    name: "Rock",
                    desc: "\"There's rocks everywhere ! Why do you bring this back ?\""
                },
                metal: {
                    name: "Metal scrap",
                    desc: "A rusty metal piece."
                }
            },
            uncommon: {
                oil: {
                    name: "Oil",
                    desc: ""
                },
                plastic: {
                    name: "Plastic",
                    desc: ""
                }
            },
            rare: {
                medication: {
                    name: "Medication",
                    desc: ""
                }
            }
        },
        ruins: {
            name: "Ruins"
        },
        /* CRAFTABLE */
        craftable: {
            component: {
                name: "Component",
                consume: {
                    metal: 2,
                    plastic: 2
                }
            },
            engine: {
                name: "Engine",
                consume: {
                    metal: 10,
                    component: 20,
                    tool: 5,
                    oil: 10
                }
            },
            tool: {
                name: "Tool",
                desc: "",
                consume: {
                    metal: 2,
                    component: 2,
                    rock: 1
                }
            },
            stone: {
                name: "Smooth stone",
                consume: {
                    rock: 3,
                    tool: 1
                }
            }
        },
        people: {
            name: "People",
            desc: "",
            consume: {
                food: 3/Game.time.day,
                water: 1/Game.time.day
            }
        }
    },
    /* BUILDINGS */
    buildings: {
        small: {
            tent: {
                name: "Tent",
                desc: "Allow someone to rejoin your colony.",
                time: 3,
                consume: {
                    rock: 3,
                    metal: 5,
                    component: 2
                },
                give: function(){
                    return [1, Game.data.ressources.people];
                }
            },
            well: {
                name: "Well",
                desc: "Just a large hole into the groud",
                time: 12,
                unlock: function(){
                    return [Game.data.actions.draw];
                },
                consume: {
                    rock: 4,
                    metal: 4
                },
                give: function(){
                    return [8, Game.data.ressources.gatherable.common.water];
                }
            }
        },
        big: {
            pump: {
                name: "Water pump",
                desc: "A buried contraption that collect water from the earth moisture.",
                time: 3*Game.time.day,
                consume: {
                    rock: 100,
                    plastic: 10,
                    component: 10,
                    engine: 1,
                    tool: 3,
                    water: 15
                },
                give: function(){
                    return [40, Game.data.ressources.gatherable.common.water];
                },
                collect: {
                    water: 2/Game.time.day
                }
            },
            workshop: {
                name: "Workshop",
                desc: "Organizing your workforce make them more efficient at crafting.",
                time: 3*Game.time.day,
                consume: {
                    rock: 20,
                    metal: 20,
                    component: 15,
                    tool: 8
                }
            }
        }
    },
    /* ACTIONS */
    actions: {
        settle: {
            name: "Settle",
            desc: "Ok let's settle right there !",
            time: 1,
            unlock: function(){
                return [
                    Game.data.actions.gather,
                    Game.data.actions.roam
                ];
            },
            lock: function(){
                return [Game.data.actions.settle];
            },
            give: function(){
                Game.settled = true;
                return [
                    [10, Game.data.ressources.gatherable.common.water],
                    [5, Game.data.ressources.gatherable.common.food],
                    [2, Game.data.ressources.people]
                ];
            }
        },
        gather: {
            name: "Gather ressources",
            desc: "",
            time: 4,
            consume: {
                water: 1
            },
            unlock: function(){
                return [Game.data.actions.roam];
            },
            give: function(){
                var res = [];
                for(var i=0, l=random(1, 4)<<0;i<l;++i)
                    res.push(Game.randomize(Game.data.ressources.gatherable, "1-"+(5/l)));
                return res;
            }
        },
        roam: {
            name: "Roam",
            time: 8,
            consume: {
                water: 3,
                tool: 1
            },
            unlock: function(){
                return [Game.data.actions.explore];
            },
            give: function(){
                return [
                    Game.randomize(Game.data.ressources.gatherable, "0-2"),
                    [random(0, 2)<<0, Game.data.ressources.ruins]
                ];
            }
        },
        explore: {
            name: "Explore a ruin",
            time: Game.time.day*2,
            consume: {
                water: 6,
                food: 1,
                tool: 2,
                ruin: 1
            },
            give: function(){
                return [
                    Game.randomize(Game.data.ressources.gatherable, "0-2"),
                    Game.randomize(Game.data.ressources.craftable, "3-7")
                ];
            }
        },
        craft: {
            name: "Craft something",
            time: 8,
            unlock: function(){
                return [Game.data.actions.plan];
            },
            consume: {
                water: 2
            },
            give: function(){
                return [Game.randomize(Game.data.ressources.craftable, "1-2")];
            }
        },
        plan: {
            name: "Plan a building",
            time: 12,
            unlock: function(){
                return [Game.data.actions.build];
            },
            consume: {
                water: 3,
                food: 1
            },
            give: function(){
                var list = random()<0.2? Game.data.buildings.big: Game.data.buildings.small,
                    selected = Game.randomize(list, "1");
                return selected[1];
            }
        },
        build: {
            name: "Build",
            desc: "",
            consume: {
                water: 2,
                food: 1
            }
        },
        draw: {
            name: "Draw water",
            time: 4,
            consume: {
                food: 1
            },
            give: function(){
                return [[random(1, 3), Game.data.ressources.gatherable.common.water]];
            }
        }
    }
};
Game.randomize = function(list, amout){
    while(!list.name){
        var keys = Object.keys(list);
        list = list[keys[keys.length * Math.random() << 0]];
    }
    return [random.apply(null, amout.split("-")), list];
};