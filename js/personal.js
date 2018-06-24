
// Determines if filter uses your personal settings
useMy = {
    get weapons() {
        return this._weapon;
    },
    set weapons(val) {
        if (this._weapon === val) {
            return;
        }
        this._weapon = val;
        refreshRanking();
    },
    //change true -> false if you want to use all weapons by default
    _weapon: false,

    get chars() {
        return this._char;
    },
    set chars(val) {
        if (this._char === val) {
            return;
        }
        this._char = val;
        refreshRanking();
    },
    //change true -> false if you want to use all characters by default
    _char: false,

    get armors() {
        return this._armor;
    },
    set armors(val) {
        if (this._armor === val) {
            return;
        }
        this._armor = val;
        refreshRanking();
    },
    //change true -> false if you want to use default armors by default
    _armor: false,
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
        return Cookies.getJSON("weapons") || [];
    },
    set weapons(val) {
        Cookies.set("weapons", val);
        resetWeps(false);
    },
    _weapons: myWeapons,

    get chars() {
        return Cookies.getJSON("chars") || [];
    },
    set chars(val) {
        Cookies.set("chars", val);
        resetChars();
    },
    _char: true,

    get armors() {
        return Cookies.getJSON("armors") || [];
    },
    set armors(val) {
        Cookies.set("armors", val);
        resetArmors();
    },
    _armor: true,
}

var curChars;
var curWeapons;
var curArmors;

// MARK: useMy changes to calculations

function removeCurWepForRankId(id) {
    removeWepIdFromCurWeps(getCharRank(id).wepId);
}
function removeCurCharForRankId(id) {
    removeCharIdFromCurChars(getCharRank(id).charId);
}

function removeWepIdFromCurWeps(id) {
    console.log("Try remove wep from curWeapons");
    removeIdFromArray(id, curWeapons);
}
function removeCharIdFromCurChars(id) {
    console.log("Try remove char from curChars");
    removeIdFromArray(id, curChars);
}

function resetWeps() {
    console.log("resetWeps");
    curWeapons = saveMy.weapons;
}
function resetChars() {
    console.log("resetChars");
    curChars = saveMy.chars;
}
function resetArmors() {
    console.log("resetArmors");
    curArmors = saveMy.armors;
}

// MARK: Convenience functions

function refreshRanking() {
    calcRanking();
    showRanking();
}

// MARK: Console functions

function showCookies() {
    return Cookies.getJSON();
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

function saveCurChars() {
    saveMy.chars = curChars;
    refreshRanking();
}
function saveCurWeapons() {
    saveMy.weapons = curWeapons;
    refreshRanking();
}
function saveCurArmors() {
    saveMy.armors = curArmors;
    refreshRanking();
}

// MARK: Setup own database

function setupPersonal() {
    Cookies.defaults.expires = 1000;
    resetChars();
    resetWeps();
    fillMissingArmorIds();
    saveMy.armors = curArmors;
}

// MARK: import functions

function addItemsToPersonal(inputText) {
    var inputs = inputText.toLowerCase().split(/\s+/);
    for (var i in inputs) {
        tryAddingToChars(inputs[i]);
    }
}

function tryAddingToChars(input) {
    console.log(input);
}

function fillMissingCharIds() {
    for (var i in myChars) {
        var myUnit = myChars[i];

        if (myUnit.id !== "" && DC.getChar(myUnit.id)) {
            continue;
        }

        myUnit.id = findIdInArrayFromName(myUnit, cs);
    }
    curChars = jsonCopy(myChars);
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
    var charArray = saveMy.chars;
    var charId = getCharRank(id).charId;
    if (idIsInArray(charId, charArray)) {
        return;
    }
    var lv = getCharRank(id).lv;
    var newChar = { id: charId, lv: lv };
    charArray.push(newChar);
    saveMy.chars = charArray;
    console.log("Added char to saveMy: " + charId);
}

function saveWepWithRankId(id) {
    var wepArray = saveMy.weapons;
    var wepId = getCharRank(id).wepId;
    if (idIsInArray(wepId, wepArray)) {
        return;
    }
    var rarity = getCharRank(id).rarity;
    var newWep = { id: wepId, r: rarity };
    wepArray.push(newWep);
    saveMy.weapons = wepArray;
    console.log("Added weapon to saveMy: " + wepId);
}

function idIsInArray(id, array) {
    for (var i in array) {
        if (id === array[i].id) {
            return true;
        }
    }
    return false;
}

// MARK: Remove selected rankId from saveMy

function removeCharWithRankId(id) {
    console.log("Try remove char from saveMy");
    var charArray = saveMy.chars;
    var charId = getCharRank(id).charId;
    removeIdFromArray(charId, charArray);
    saveMy.chars = charArray;
}

function removeWepWithRankId(id) {
    console.log("Try remove wep from saveMy");
    var wepArray = saveMy.weapons;
    var wepId = getCharRank(id).wepId;
    removeIdFromArray(wepId, wepArray);
    saveMy.weapons = wepArray;
}

function removeIdFromArray(id, array) {
    for (var i in array) {
        if (id === array[i].id) {
            console.log("removed id: " + id);
            array.splice(i, 1);
            return;
        }
    }
    console.log("Id not found to remove: " + id);
}

// MARK: Char info from ranking list

getCharRank = (function(id) {

        var wepId = ranking[id].sv.c.eq_atk_wep.id;
        var charId = ranking[id].sv.c.id;
        var charName = ranking[id].sv.c.name_en;
        var lv = ranking[id].sv.lv;
        var rarity = ranking[id].sv.r;

        return {
            wepId: wepId,
            charId: charId,
            charName: charName,
            lv: lv,
            rarity: rarity
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