if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

const DO = {
    _template: document.createElement('template'),
    onLoad: function (callback, option) {
        return document.addEventListener('DOMContentLoaded', callback, option);
    },
    new: function (html) {
        this._template.innerHTML = html;
        return this._template.content;//document.createRange().createContextualFragment(html);
    },
    qid: function (id) {
        return document.getElementById(id);
    },
    q: function (q) {
        return document.querySelector(q);
    },
    qa: function (q) {
        return document.querySelectorAll(q);
    }
};
Element.prototype.qid = function (id) { return this.getElementById(id); };
Element.prototype.q = function (q) { return this.querySelector(q); };
Element.prototype.qa = function (q) { return this.querySelectorAll(q); };
Element.prototype.html = function (html) {
    this.innerHTML = html;
    return this;
};
Element.prototype.parents = function (q) {
    if (this.matches) {
        if (this.matches(q)) {
            return this;
        } else {
            if (this.parentNode.parents) {
                return this.parentNode.parents(q);
            }
        }
    }
    return null;
};
//event_type, callback, option
//selector, event_type, callback, option
Element.prototype.on = function (a, b, c, d) {
    if (typeof (b) == "function") {
        return this.addEventListener(a, b, c);
    } else {
        return this.addEventListener(b, function (ev) {
            var parent = ev.target.parents(a);
            if (parent !== null) {
                c.call(parent, ev);
            }
        }, d);
    }
};
Element.prototype.css = function (css) {
    for (var i in css) {
        this.style[i] = css[i];
    }
};

function TextEscaper(codeSet) {
    this.codeSet = [];
    for (var i in codeSet) {
        var code = codeSet[i];
        var escaped = '\\' + code.keyword;
        this.codeSet.push({
            keyword: code.keyword,
            replace: code.replace,
            reEscaped: new RegExp(escapeRegExpString(escaped), 'g'),
            reReplace: new RegExp(escapeRegExpString(code.replace), 'g')
        });
    }
}
TextEscaper.prototype = {
    encode: function (text) {
        var r = text;
        for (var i in this.codeSet) {
            var code = this.codeSet[i];
            r = r.replace(code.reEscaped, code.replace);
        }
        return r;
    },
    decode: function (text) {
        var r = text;
        for (var i in this.codeSet) {
            var code = this.codeSet[i];
            r = r.replace(code.reReplace, code.keyword);
        }
        return r;
    }
}
function escapeRegExpString(str) {
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
};


// map object to html from template
// %key% in template mapped to value of map
function Mapper(template) {
    this.init(template);
}
Mapper.prototype = {
    encoder: new TextEscaper([
        { keyword: '%', replace: '@esc@p@' },
        { keyword: '$', replace: '@esc@d@' }
    ]),
    init: function (template) {
        var src = this.encoder.encode(template);
        var array = src.split('%');
        if (array.length % 2 > 0) {
            this.first = this.encoder.decode(array[0]);
            this.texts = [];
            this.keys = [];
            for (var i = 1; i < array.length; i += 2) {
                this.keys.push(array[i]);
                var text = this.encoder.decode(array[i + 1]);
                this.texts.push(text);
            }
        } else {
            console.log('error at Mapper.init():', array);
        }
    },
    map: function (obj) {
        var html = this.first;
        for (var i = 0; i < this.texts.length; i++) {
            html += getValueFrom(obj, this.keys[i]);
            html += this.texts[i];
        }
        return html;
    }
}

//zero padding
function zero(src, length) {
    var z = '';
    for (var i = 0; i < length; i++) {
        z += '0'
    }
    z += src;
    return z.slice(-length);
}
//get value from object by dot separated key string
function getValueFrom(object, key) {
    var keys = key.split('.');
    var value = object;
    for (var i = 0; i < keys.length; i++) {
        var v = value[keys[i]];
        if (v !== undefined) {
            value = v;
        } else {
            return undefined;
        }
    }
    return value;
}

function flipAllZero(array) {
    var frg = false;
    for (var i in array) {
        if (array[i]) {
            frg = true;
            break;
        }
    }
    if (!frg) {
        for (var i in array) {
            array[i] = true;
        }
    }
}

function match(src, keywords) {
    var r = true;
    for (var i in keywords) {
        r &= src.indexOf(keywords[i]) >= 0;
        if (!r) { return r };
    }
    return r;
}

//handle logical expression string in given data object
var Expression = (function () {
    var opl = {
        '&': function (a, b) { return a & b; },
        '|': function (a, b) { return a | b; }
    };
    var opc = {
        '=': function (a, b) { return a === b; },
        '!=': function (a, b) { return a !== b; },
        '>=': function (a, b) { return a >= b; },
        '<=': function (a, b) { return a <= b; },
        '>': function (a, b) { return a > b; },
        '<': function (a, b) { return a < b; }
    };
    var opls = '(\\||&)'
    var rel = new RegExp('(.*?)' + opls + '(.*)', 'im');
    var opcs = '(' + Object.keys(opc).join('|') + ')';
    var rec = new RegExp('(.*?)' + opcs + '(.*)', 'im');
    function eval(exp, data) {
        var ml = rel.exec(exp);
        if (ml === null) {
            var mc = rec.exec(exp);
            if (mc === null) {
                return false;
            } else {
                var a = mc[1].trim();
                var b = mc[3].trim();
                var va = getValueFromKeyString(data, a);
                var vb = getValueFromKeyString(data, b);
                if (va === undefined) { va = a; }
                if (vb === undefined) { vb = b; }
                return opc[mc[2]](parse(va), parse(vb));
            }
        } else {
            return opl[ml[2]](eval(ml[1].trim(), data), eval(ml[3].trim(), data));
        }
    }
    function getValueFromKeyString(object, key) {
        var keys = key.split('.');
        var value = object[keys[0]];
        if (value) {
            if (keys.length > 1) {
                keys.shift();
                return getValueFromKeyString(value, keys.join('.'));
            } else {
                return value;
            }
        } else {
            return undefined;
        }
    }
    return {
        eval: eval
    };
})();

function parse(value) {
    var n = Number(value);
    if (n !== n) {
        return value;
    } else {
        return n;
    }
}
