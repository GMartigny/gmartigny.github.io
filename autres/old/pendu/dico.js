var dico1 = new Array(
    "enfant",   "vite",     "drible",   "femme",    "faune",    "grosse",
    "garcon",   "animal",   "choix",    "chien",    "chat",     "cactus",
    "maison",   "plante",   "dormir",   "rein",     "fleuve",   "epine",
    "soleil",   "zebre",    "pompe",    "fraise",   "poivre",   "poire",
    "pomme",    "pendu",    "astuce",   "armure",   "faim",     "lettre",
    "prix",     "code",     "jeux",     "video",    "manger",   "frite",
    "glace",    "boire",    "regime",   "ennui",    "langue",   "bruit",
    "ballon",   "boite",    "bisou",    "rigolo",   "choux",    "gnou",
    "mamie",    "grand",    "genou",    "japon",    "vitre",    "ecran",
    "souris",   "resolu",   "romain",   "retour",   "boite",    "cable",
    "sapin",    "bouton",   "meuble",   "store",    "papier",   "route",
    "aigue",    "eau",      "oiseau",   "idee",     "image",    "base"
);

var dico2 = new Array(
    "courrir",      "extreme",      "bonjour",      "concour",      "artefact",
    "ordinateur",   "exemplaire",   "atmosphere",   "immeuble",     "tramway",
    "fenetre",      "pyromane",     "eclipse",      "solaire",      "lunaire",
    "republique",   "president",    "esclave",      "kangourou",    "direction",
    "hydrogene",    "molecule",     "atomique",     "culture",      "vitesse",
    "mariage",      "support",      "lampadaire",   "autoroute",    "injection",
    "aeroport",     "expression",   "legendaire",   "indienne",     "objectif",
    "electrique",   "cerveau",      "telephone",    "parapluie",    "legende",
    "ecouteur",     "vraiment",     "alphabet",     "suspension",   "monstre",
    "cablage",      "mecanique",    "superieur",    "editeuse",     "etrange"
);

var dico3 = new Array(
    "informatique",     "temperature",      "structuration",    "departementale",
    "communication",    "dictionnaire",     "extremement",      "implementation",
    "entierement",      "fonctionnaire",    "mathematique",     "elementaire",
    "departement",      "pisciculture",     "alternative",      "bibliotheque",
    "superiorite",      "etrangement"
);

function getMot(diff){
    switch (diff){
        case 1:{
            return dico1[Math.floor(Math.random()*dico1.length)];
            break;
        }
        case 2:{
            return dico2[Math.floor(Math.random()*dico2.length)];
            break;
        }
        case 3:{
            return dico3[Math.floor(Math.random()*dico3.length)];
            break;
        }
    }
}