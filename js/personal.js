
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
    _armor: false
};

const kWeapons = "weapons";
const kChars = "chars";
const kArmors = "armors";

// Saves your personal units and settings locally in a cookie
saveMy = {
    get weapons() {
        return getCookies(kWeapons);
    },
    set weapons(val) {
        if (val === null) {
            setCookies(kWeapons, []);
        } else {
            setCookies(kWeapons, val);
        }
        resetWeps();
    },

    get chars() {
        return getCookies(kChars);
    },
    set chars(val) {
        if (val === null) {
            setCookies(kChars, []);
        } else {
            setCookies(kChars, val);
        }
        resetChars();
    },
    _charCount: 0,

    get armors() {
        return getCookies(kArmors);
    },
    set armors(val) {
        if (val === null) {
            setCookies(kArmors, []);
        } else {
            setCookies(kArmors, val);
        }
        resetArmors();
    }
}

function getCookies(id) {
    var array = [], i = 0;
    var tempArray = Cookies.getJSON(id + i.toString());
    while (tempArray) {
        i++;
        array = array.concat(tempArray);
        tempArray = Cookies.getJSON(id + i.toString());
    }
    return array;
}
function setCookies(id, val) {
    var i, count, temparray, chunk = 80;
    for (i = 0, count = 0; i < val.length; i += chunk, count++) {
        temparray = val.slice(i,i+chunk);
        Cookies.set(id + count.toString(), temparray);
    }

    var outOfBoundsCookie = Cookies.getJSON(id + count.toString());
    while (outOfBoundsCookie) {
        Cookies.remove(id + count.toString());
        count++;
        outOfBoundsCookie = Cookies.getJSON(id + count.toString());
    }
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
    if (removeIdFromArray(id, curWeapons)) {
        alertify.success("removed curWeapons: " + id);
    } else {
        alertify.error("Id not found to remove: " + id);
    }
}
function removeCharIdFromCurChars(id) {
    console.log("Try remove char from curChars");
    if (removeIdFromArray(id, curChars)) {
        alertify.success("removed curChars: " + id);
    } else {
        alertify.error("Id not found to remove: " + id);
    }
}

function resetWeps() {
    console.log("Reset Weps");
    curWeapons = saveMy.weapons;
}
function resetChars() {
    console.log("Reset Chars");
    curChars = saveMy.chars;
}
function resetArmors() {
    console.log("Reset Armors");
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
    resetArmors();
}

// MARK: inputText handling functions

function handlePersonalInput(inputText) {
    var inputs = inputText.toLowerCase().split(/\s+/);

    for (var i = 0; i < inputs.length - 1; i++) { // -1 at inputs.length to accommodate for double parameter formatting.
        
        if (inputs[i] === "clear") {
            if (clearCookieOfType(inputs[i+1])) {
                i++;
            }
            continue;
        }

        if (inputs[i] === "export") {
            if (exportItemOfType(inputs[i+1])) {
                i++;
            }
            continue;
        }

        if (inputs[i] === "remove") {
            if (tryRemoveFromSaveMy(inputs[i+1])) {
                i++;
            }
            continue;
        }

        if (inputs[i] === "armor") {
            if (tryAddingToArmors(inputs[i+1])) {
                i++;
            }
            continue;
        }

        if (tryAddingToChars(inputs[i], inputs[i + 1])) {
            i++;
            continue;
        }
        if (tryAddingToWeps(inputs[i], inputs[i+1])) {
            i++;
        }
    }
    refreshRanking();
}

function clearCookieOfType(type) {
    return forTypeDoMethod(type, function(typeId) {
        saveMy[typeId] = null;
        alertify.success("Removed Cookies: " + typeId);
    });
}
function exportItemOfType(type) {
    var exportString = "";
    var didMethod = forTypeDoMethod(type, function(typeId) {
        var output = JSON.stringify(saveMy[typeId]);
        var regex = /([a-z]|[0-9]|_)+/g;
        var strings = output.match(regex);
        for (var i in strings) {
            var sub = strings[i];
            if (sub === "id" || sub === "r" || sub === "lv") { // TODO: Suck less at regex to exclude this in the match above
                continue;
            }
            if (typeId === kArmors) {
                exportString += "armor" + " ";
            }

            exportString += sub + " ";
        }
    });
    if (didMethod) {
        alertify.minimalDialog("Export " + type, exportString);
    }
    return didMethod;
}

function forTypeDoMethod(type, method) {
    var doAll = type === "all";
    var didMethod = false;
    if (type === kChars || doAll) {
        method(kChars);
        didMethod = true;
    }
    if (type === kWeapons || type === "weps" || doAll) {
        method(kWeapons);
        didMethod = true;
    }
    if (type === kArmors || doAll) {
        method(kArmors);
        didMethod = true;
    }
    return didMethod;
}

function tryRemoveFromSaveMy(id) {
    var types = [kWeapons, kArmors, kChars];

    var hasRemoved = types.some(function (value) {
        return removeFromSaveMyWithType(id, value);
    });

    if (hasRemoved) {
        return true;
    }

    alertify.error("Id not found to remove in saveMy: " + id);
    return false;
}

function removeFromSaveMyWithType(id, type) {
    var array = saveMy[type];
    if (removeIdFromArray(id, array)) {
        saveMy[type] = array;
        alertify.success("removed id: " + id + " from saveMy: " + type);
        return true;
    }
    return false;
}

function tryAddingToChars(charId, lv) {
    var char = DC.getChar(charId);
    var lvArray = ["80", "90", "100"];
    var lvCheck = lvArray.indexOf(lv) > -1;
    if (char && lvCheck) {
        saveChar(charId, parseInt(lv));
        return true;
    }
    return false;
}

function tryAddingToWeps(wepId, rarity) {
    var weapon = DC.getWeapon(wepId);
    var rarityArray = ["4", "5"];
    var rarityCheck = rarityArray.indexOf(rarity) > -1;
    if (weapon && rarityCheck) {
        saveWep(wepId, parseInt(rarity));
        return true;
    }
    return false;
}

function tryAddingToArmors(armorId) {
    var armor = DC.getArmor(armorId);
    if (armor) {
        saveArmor(armorId);
        return true;
    }
    return false;
}

// Possible usecases when importing units with actual names instead of Id's.
// For now too much hassle to account for all edge cases with the regex.
/*
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
        if (myObject.name_en.toLowerCase() === dbArray[i].name_en.toLowerCase()) {
            return dbArray[i].id;
        }
    }
    console.log("Couldn't find matching id for:");
    console.log(myObject);
}
*/

// MARK: Add selected rankId to saveMy

function saveChar(charId, lv) {
    var newChar = { id: charId, lv: lv };
    saveItemToType(charId, kChars, newChar);
}

function saveWep(wepId, rarity) {
    var newWep = { id: wepId, r: rarity };
    saveItemToType(wepId, kWeapons, newWep);
}

function saveArmor(armorId) {
    var newArmor = { id: armorId };
    saveItemToType(armorId, kArmors, newArmor);
}

function saveItemToType(id, type, newItem) {
    var array = saveMy[type];
    if (idIsInArray(id, array)) {
        return;
    }
    array.push(newItem);
    saveMy[type] = array;
    alertify.success("Added " + type + " to saveMy: " + id);
}

function saveCharWithRankId(id) {
    var charId = getCharRank(id).charId;
    var lv = getCharRank(id).lv;
    saveChar(charId, lv);
}

function saveWepWithRankId(id) {
    var wepId = getCharRank(id).wepId;
    var rarity = getCharRank(id).rarity;
    saveWep(wepId, rarity);
}

function idIsInArray(id, array) {
    for (var i in array) {
        if (id === array[i].id) {
            alertify.message("Id: " + id + " already in array");
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
    if (removeIdFromArray(charId, charArray)) {
        alertify.success("removed savedChar: " + charId);
    } else {
        alertify.error("Id not found to remove: " + id);
    }
    saveMy.chars = charArray;
}

function removeWepWithRankId(id) {
    console.log("Try remove wep from saveMy");
    var wepArray = saveMy.weapons;
    var wepId = getCharRank(id).wepId;
    if (removeIdFromArray(wepId, wepArray)) {
        alertify.success("removed savedWep: " + wepId);
    } else {
        alertify.error("Id not found to remove: " + id);
    }
    saveMy.weapons = wepArray;
}

function removeIdFromArray(id, array) {
    for (var i in array) {
        if (id === array[i].id) {
            console.log("removed id: " + id);
            array.splice(i, 1);
            return true;
        }
    }
    console.log("Id not found to remove: " + id);
    return false;
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