useMy = {
    get weapons() {
        return this._weapon;
    },
    set weapons(val) {
        this._weapon = val;
        calcRanking();
        showRanking();
    },
    //change true -> false if you want to use all weapons by default
    _weapon: true,

    get chars() {
        return this._char;
    },
    set chars(val) {
        this._char = val;
        calcRanking();
        showRanking();
    },
    //change true -> false if you want to use all characters by default
    _char: true,

    get armors() {
        return this._armor;
    },
    set armors(val) {
        this._armor = val;
        calcRanking();
        showRanking();
    },
    //change true -> false if you want to use default armors by default
    _armor: true,
};

// Use id or name_en for weapon identification. id is slightly quicker at startup.
// Use: showAllWeps() in console to get a list of all weapon id's
myWeapons = [
    { id: "bride_sword1", name_en: "", r: 4},
    { id: "bonds_sword", name_en: "", r: 4},
    { id: "c_sword", name_en: "", r: 4},
    { id: "jr_dual", name_en: "", r: 4},
    { id: "moonlight_sword", name_en: "", r: 4},
    { id: "moonlight_sword1", name_en: "", r: 4},
    { id: "ninja_rapier", name_en: "", r: 4},
    { id: "princess_sword", name_en: "", r: 4},
    { id: "ps_mace", name_en: "", r: 4},
    { id: "sao_dagger1", name_en: "", r: 4},
    { id: "sao_gun", name_en: "", r: 4},
    { id: "sports_dagger", name_en: "", r: 4},
    { id: "sports_sword", name_en: "Glorious Blade", r: 4},
    { id: "steamy_dagger", name_en: "", r: 4},
    { id: "trump_dual", name_en: "", r: 4},
    { id: "cosplay_lance", name_en: "", r: 4},
    { id: "hatsu_mace", name_en: "", r: 4},
];
// Use id or name_en for character identification. id is slightly quicker at startup.
// Use: showAllChars() in console to get a list of all char id's
myUnits = [
    { id: "", name_en: "Kirito [Black Wing]", lv: 80}, // works ala name_en is correct
    { id: "ShitTestingId's", name_en: "Leafa [The Blade - facing the feelings]", lv: 80}, // works ala name_en is correct
    { id: "sports_leafa", name_en: "", lv: 80}, // Preferred example
    { id: "pns_yuuki", name_en: "", lv: 80},
    { id: "jr_asuna", name_en: "", lv: 80},
    { id: "princess_asuna", name_en: "", lv: 80},
    { id: "bride_asuna", name_en: "", lv: 80},
    { id: "groom_kirito", name_en: "", lv: 80},
    { id: "swim_alice", name_en: "", lv: 80},
    { id: "steamyr_strea", name_en: "", lv: 90},
    { id: "swim_kirito", name_en: "", lv: 80},
    { id: "summer_sinon", name_en: "", lv: 80},
    { id: "os_silica", name_en: "", lv: 80},
    { id: "moonlight_asuna", name_en: "", lv: 80},
    { id: "sao_kirito", name_en: "", lv: 80},
    { id: "moonlightr_lisbeth", name_en: "", lv: 90},
    { id: "bonds_asuna", name_en: "", lv: 80},
    { id: "os_asuna", name_en: "", lv: 80},
    { id: "sao_silica", name_en: "", lv: 80},
    { id: "sao_klein", name_en: "", lv: 80},
    { id: "cm_eugeo", name_en: "", lv: 80},
    { id: "cm_kirito", name_en: "", lv: 80},
    { id: "festa_lisbeth", name_en: "", lv: 80},
    //{ id: "bondsr_heathcliff", name_en: "", lv: 80},
    { id: "yukata_suguha", name_en: "", lv: 80},
    { id: "rainy_sakuya", name_en: "", lv: 80},
    { id: "e16_asuna", name_en: "", lv: 80},
    { id: "e16_kirito", name_en: "", lv: 100},
    { id: "g17_yuna", name_en: "", lv: 80},
    { id: "summer_silica", name_en: "", lv: 80},
    { id: "x17r_rain", name_en: "", lv: 100},
    { id: "x17r_seven", name_en: "", lv: 80},
    { id: "friends_asuna", name_en: "Asuna [Heartful Water fairy]", lv: 80},
    { id: "cheer_sinon", name_en: "", lv: 80},
    { id: "e16_sachi", name_en: "", lv: 80},
    { id: "dog_asuna", name_en: "", lv: 80},
    { id: "steamy_asuna", name_en: "", lv: 80},
    { id: "g1_silica", name_en: "", lv: 80},
    { id: "ggo1_sinon", name_en: "", lv: 80},
];
// NOTE: Not all armors are available in the database.
// Use: showAllArmors() in console to check which ones are possible.
myArmors = [
    { id: "mf_dark1", name_en: "Wolf Coat"},
    { id: "f_dark2", name_en: "Pumpkun Dress"}, //Yes pumpk'u'n, I didn't choose that either
    { id: "", name_en: "Gym Clothes in Youth"},
    { id: "", name_en: "Hot Spring Bathtowel"},
    { id: "", name_en: "Heart Dress"},
    { id: "", name_en: "Fiery Wind Cape"},
    { id: "", name_en: "Captain Coat"},
    { id: "", name_en: "Scale Chainmail"},
    { id: "", name_en: "Holy Night Cape"},
    { id: "", name_en: "Snow Fairy Cape"},
    { id: "", name_en: "Scarlet Party Dress"},
    { id: "", name_en: "Celebratory Furisode"},
];

function removeWepId(id, refresh = true) {
    for (var i in curWeapons) {
        var wep = DC.getWeapon(curWeapons[i].id);
        if (wep.id === id) {
            console.log("removed wep: " + id);
            curWeapons.splice(i, 1);
            break;
        }
    }
    if (refresh) {
        calcRanking();
        showRanking();
    }
}
function removeCharId(id, refresh = true) {
    for (var i in curUnits) {
        var char = curUnits[i];
        if (char.id === id) {
            console.log("removed Char: " + id);
            curUnits.splice(i, 1);
            break;
        }
    }
    if (refresh) {
        calcRanking();
        showRanking();
    }
}

function resetWeps(refresh = true) {
    console.log("resetWeps");
    curWeapons = JSON.parse(JSON.stringify(myWeapons));

    if (refresh) {
        calcRanking();
        showRanking();
    }
}
function resetChars(refresh = true) {
    console.log("resetChars");
    curUnits = JSON.parse(JSON.stringify(myUnits));

    if (refresh) {
        calcRanking();
        showRanking();
    }
}

function showAllWeps() {
    console.log(DC.getWeapon());
}
function showAllChars() {
    console.log(cs);
}
function showAllArmors() {
    console.log(DC.getArmor());
}

function fillMissingCharIds() {
    for (var i in myUnits) {
        var myUnit = myUnits[i];

        if (myUnit.id !== "" && DC.getChar(myUnit.id)) {
            continue;
        }

        myUnit.id = findIdInArray(myUnit, cs);
    }
    curUnits = JSON.parse(JSON.stringify(myUnits));
}
function fillMissingWepIds() {
    var allWeps = DC.getWeapon();
    for (var i in myWeapons) {
        var myWeapon = myWeapons[i];

        if (myWeapon.id !== "" && DC.getWeapon(myWeapon.id)) {
            continue;
        }

        myWeapon.id = findIdInArray(myWeapon, allWeps);
    }
    curWeapons = JSON.parse(JSON.stringify(myWeapons));
}
function fillMissingArmorIds() {
    var allArmors = DC.getArmor();
    for (var i in myArmors) {
        var myArmor = myArmors[i];

        if (myArmor.id !== "" && DC.getArmor(myArmor.id)) {
            continue;
        }

        myArmor.id = findIdInArray(myArmor, allArmors);
    }
    curArmors = JSON.parse(JSON.stringify(myArmors));
}

function findIdInArray(myObject, dbArray) {
    for (var j in dbArray) {
        if (myObject.name_en.toLowerCase() == dbArray[j].name_en.toLowerCase()) {
            return dbArray[j].id;
        }
    }
    console.log("Couldn't find matching id for:");
    console.log(myObject);
}

function getCharRankWepId(id) {
    return ranking[id].sv.c.eq_atk_wep.id;
}
function getCharRankCharId(id) {
    return ranking[id].sv.c.id;
}

function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
}