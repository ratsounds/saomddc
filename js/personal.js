
useMy = {
    get weapons() {
        return this._weapon;
    },
    set weapons(val) {
        this._weapon = val;
        shouldRefreshRanking();
    },
    //change true -> false if you want to use all weapons by default
    _weapon: true,

    get chars() {
        return this._char;
    },
    set chars(val) {
        this._char = val;
        shouldRefreshRanking();
    },
    //change true -> false if you want to use all characters by default
    _char: true,

    get armors() {
        return this._armor;
    },
    set armors(val) {
        this._armor = val;
        shouldRefreshRanking();
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
myChars = [
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

// Saves your personal units and settings locally in a cookie
saveMy = {
    get weapons() {
        return Cookies.get("weapons");
    },
    set weapons(val) {
        Cookies.set("weapons", val);
        resetWeps();
    },
    _weapons: myWeapons,

    get chars() {
        return Cookies.get("chars");
    },
    set chars(val) {
        Cookies.set("chars", val);
        resetChars();
    },
    _char: true,

    get armors() {
        return Cookies.get("armors");
    },
    set armors(val) {
        Cookies.set("armors", val);
        shouldRefreshRanking();
    },
    _armor: true,
}

// MARK: useMy changes to calculations

function removeWepId(id, refresh = true) {
    for (var i in curWeapons) {
        var wep = DC.getWeapon(curWeapons[i].id);
        if (wep.id === id) {
            console.log("removed wep: " + id);
            curWeapons.splice(i, 1);
            break;
        }
    }
    shouldRefreshRanking(refresh);
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
    shouldRefreshRanking(refresh);
}

function resetWeps(refresh = true) {
    console.log("resetWeps");
    curWeapons = jsonCopy(saveMy.weapons);

    shouldRefreshRanking(refresh);
}
function resetChars(refresh = true) {
    console.log("resetChars");
    curUnits = jsonCopy(saveMy.chars);

    shouldRefreshRanking(refresh);
}

// MARK: Convenience functions

function shouldRefreshRanking(refresh = true) {
    if (refresh) {
        calcRanking();
        showRanking();
    }
}

// MARK: Console functions

function showCookies() {
    return Cookies.get();
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

// MARK: Setup own database

function fillMissingIds() {
    // fillMissingCharIds();
    fillMissingWepIds();
    fillMissingArmorIds();

    // saveMy.chars = myChars;
    saveMy.weapons = myWeapons;
    saveMy.armors = myArmors;
}

function fillMissingCharIds() {
    for (var i in myChars) {
        var myUnit = myChars[i];

        if (myUnit.id !== "" && DC.getChar(myUnit.id)) {
            continue;
        }

        myUnit.id = findIdInArrayFromName(myUnit, cs);
    }
    curUnits = jsonCopy(myUnits);
}
function fillMissingWepIds() {
    var allWeps = DC.getWeapon();
    for (var i in myWeapons) {
        var myWeapon = myWeapons[i];

        if (myWeapon.id !== "" && DC.getWeapon(myWeapon.id)) {
            continue;
        }

        myWeapon.id = findIdInArrayFromName(myWeapon, allWeps);
    }
    curWeapons = jsonCopy(myWeapons);
}
function fillMissingArmorIds() {
    var allArmors = DC.getArmor();
    for (var i in myArmors) {
        var myArmor = myArmors[i];

        if (myArmor.id !== "" && DC.getArmor(myArmor.id)) {
            continue;
        }

        myArmor.id = findIdInArrayFromName(myArmor, allArmors);
    }
    curArmors = jsonCopy(myArmors);
}

function findIdInArrayFromName(myObject, dbArray) {
    for (var i in dbArray) {
        if (myObject.name_en.toLowerCase() == dbArray[i].name_en.toLowerCase()) {
            return dbArray[i].id;
        }
    }
    console.log("Couldn't find matching id for:");
    console.log(myObject);
}

// MARK: Add selected rankId to saveMy

function saveCharWithRankId(id) {
    var charId = getCharRank(id).charId();
    var name = getCharRank(id).charName();
    var lv = getCharRank(id).charLv();
    var newChar = { id: charId, name_en: name, lv: lv};
    saveMy.chars = saveMy.chars.append(newChar);
}

// MARK: Char info from ranking list

getCharRank = (function(id) {

        function wepId() {
            return ranking[id].sv.c.eq_atk_wep.id;
        }
        function charId() {
            return ranking[id].sv.c.id;
        }
        function charLv() {
            return ranking[id].sv.lv;
        }
        function charName() {
            return ranking[id].sv.c.name_en;
        }

        return {
            wepId: wepId,
            charId: charId,
            charLv: charLv,
            charName: charName,
        }
    }
);

// MARK: Low level helper functions
function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
}

function jsonCopy(o) {
    return JSON.parse(JSON.stringify(o));
}