
/*
 This file contains functions and polyfills for a normal work in an older browsers.

 Functions:
 addEvent(elem, type, handler) - elem.addEventListener(type, handler) replacement,
 removeEvent(elem, type, handler) - elem.removeEventListener(type, handler) replacement,
 getTarget(event) - event.target replacement,
 getElementHeight(element) - parseFloat(getComputedStyle(element).height) replacement,
 getElementWidth(element) - parseFloat(getComputedStyle(element).width) replacement,
 getStyle(element, style) - getComputedStyle(element)[style] replacement,
 isElement(htmlObject) - function for checking whether it is an HTML object or not

 Polyfills:
 - localStorage;
 - Object.create
 - Function.bind
 - JSON
 - classList
 - Array.isArray
 - Array.indexOf
 - Array.lastIndexOf
 - window (innerWidth, innerHeght)
 */


function addEvent(elem, type, handler){
    if (elem.addEventListener){
        elem.addEventListener(type, handler, false);
    } else {
        var evt = document.createEventObject();
        elem.attachEvent("on" + type, handler);
    }
}

function removeEvent(elem, type, handler) {
    if (elem.removeEventListener) {
        elem.removeEventListener(type, handler);
    } else {
        elem.detachEvent("on" + type, handler);
    }
}

function getTarget(e) {
    var evn = e || window.event;
    return evn.srcElement || e.target;
}

function getElementHeight(element) {
    if (window.getComputedStyle) {
        return parseFloat(getComputedStyle(element).height);
    } else {
        return parseFloat(element.clientHeight);
    }
}

function getElementWidth(element) {
    if (window.getComputedStyle) {
        return parseFloat(getComputedStyle(element).width);
    } else {
        return element.clientWidth;
    }
}

function getStyle(element, style) {
    if (window.getComputedStyle) {
        return getComputedStyle(element)[style];
    } else {
        return element.currentStyle[style];
    }
}

//Returns true if it is a DOM element
function isElement(o) {
    return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
}

if (!localStorage) {
    (function(window, document) {
        "use strict";
        var userData, attr, attributes;

        if (!window.localStorage && (userData = document.body) && userData.addBehavior) {
            if (userData.addBehavior("#default#userdata")) {
                userData.load((attr = "localStorage"));
                attributes = userData.XMLDocument.documentElement.attributes;

                window.localStorage = {
                    "length" : attributes.length,
                    "key" : function(idx) { return (idx >= this.length) ? null : attributes[idx].name; },
                    "getItem" : function(key) { return userData.getAttribute(key); },
                    "setItem" : function(key, value) {
                        userData.setAttribute(key, value);
                        userData.save(attr);
                        this.length += ((userData.getAttribute(key) === null) ? 1 : 0);
                    },
                    "removeItem" : function(key) {
                        if (userData.getAttribute(key) !== null) {
                            userData.removeAttribute(key);
                            userData.save(attr);
                            this.length = Math.max(0, this.length - 1);
                        }
                    },
                    "clear" : function() {
                        while (this.length) { userData.removeAttribute(attributes[--this.length].name); }
                        userData.save(attr);
                    }
                };
            }
        }
    })(this, this.document);
}

if (!Object.create) {
    Object.create = function (o, properties) {
        if (typeof o !== 'object' && typeof o !== 'function') throw new TypeError('Object prototype may only be an Object: ' + o);
        else if (o === null) throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");

        if (typeof properties != 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

        function F() {
        }

        F.prototype = o;

        return new F();
    };
}

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

if (!JSON) {
    var JSON = {};
    (function () {
        "use strict";

        var rx_one = /^[\],:{}\s]*$/;
        var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
        var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        function f(n) {
            return n < 10 ? "0" + n : n;
        }

        function this_value() {
            return this.valueOf();
        }

        if (typeof Date.prototype.toJSON !== "function") {
            Date.prototype.toJSON = function () {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" +
                f(this.getUTCMonth() + 1) + "-" +
                f(this.getUTCDate()) + "T" +
                f(this.getUTCHours()) + ":" +
                f(this.getUTCMinutes()) + ":" +
                f(this.getUTCSeconds()) + "Z" : null;
            };

            Boolean.prototype.toJSON = this_value;
            Number.prototype.toJSON = this_value;
            String.prototype.toJSON = this_value;
        }

        var gap, indent, meta, rep;

        function quote(string) {
            rx_escapable.lastIndex = 0;
            return rx_escapable.test(string)
                ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string" ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\"" : "\"" + string + "\"";
        }

        function str(key, holder) {

            var i, k, v, length, partial;
            var mind = gap;
            var value = holder[key];

            if (value && typeof value === "object" &&
                typeof value.toJSON === "function") {
                value = value.toJSON(key);
            }

            if (typeof rep === "function") {
                value = rep.call(holder, key, value);
            }

            switch (typeof value) {
                case "string":
                    return quote(value);
                case "number":
                    return isFinite(value) ? String(value) : "null";
                case "boolean":
                case "null":
                    return String(value);
                case "object":
                    if (!value) {
                        return "null";
                    }
                    gap += indent;
                    partial = [];

                    if (Object.prototype.toString.apply(value) === "[object Array]") {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || "null";
                        }

                        v = partial.length === 0 ? "[]" : gap
                            ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                            : "[" + partial.join(",") + "]";
                        gap = mind;
                        return v;
                    }

                    if (rep && typeof rep === "object") {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === "string") {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                                }
                            }
                        }
                    } else {

                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                                }
                            }
                        }
                    }

                    v = partial.length === 0 ? "{}" : gap
                        ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                    gap = mind;
                    return v;
            }
        }

        if (typeof JSON.stringify !== "function") {
            meta = {    // table of character substitutions
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                "\"": "\\\"",
                "\\": "\\\\"
            };
            JSON.stringify = function (value, replacer, space) {
                var i;
                gap = "";
                indent = "";

                if (typeof space === "number") {
                    for (i = 0; i < space; i += 1) {
                        indent += " ";
                    }
                } else if (typeof space === "string") {
                    indent = space;
                }

                rep = replacer;
                if (replacer && typeof replacer !== "function" &&
                    (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                    throw new Error("JSON.stringify");
                }

                return str("", {"": value});
            };
        }

        if (typeof JSON.parse !== "function") {
            JSON.parse = function (text, reviver) {
                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];

                    if (value && typeof value === "object") {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }

                text = String(text);
                rx_dangerous.lastIndex = 0;
                if (rx_dangerous.test(text)) {
                    text = text.replace(rx_dangerous, function (a) {
                        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

                if (
                    rx_one.test(
                        text.replace(rx_two, "@")
                            .replace(rx_three, "]")
                            .replace(rx_four, "")
                    )
                ) {
                    j = eval("(" + text + ")");
                    return (typeof reviver === "function") ? walk({"": j}, "") : j;
                }
                throw new SyntaxError("JSON.parse");
            };
        }
    }());
}

(function () {

    if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

    var prototype = Array.prototype,
        push = prototype.push,
        splice = prototype.splice,
        join = prototype.join;

    function DOMTokenList(el) {
        this.el = el;
        // The className needs to be trimmed and split on whitespace
        // to retrieve a list of classes.
        var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
        for (var i = 0; i < classes.length; i++) {
            push.call(this, classes[i]);
        }
    };

    DOMTokenList.prototype = {
        add: function(token) {
            if(this.contains(token)) return;
            push.call(this, token);
            this.el.className = this.toString();
        },
        contains: function(token) {
            return this.el.className.indexOf(token) != -1;
        },
        item: function(index) {
            return this[index] || null;
        },
        remove: function(token) {
            if (!this.contains(token)) return;
            for (var i = 0; i < this.length; i++) {
                if (this[i] == token) break;
            }
            splice.call(this, i, 1);
            this.el.className = this.toString();
        },
        toString: function() {
            return join.call(this, ' ');
        },
        toggle: function(token) {
            if (!this.contains(token)) {
                this.add(token);
            } else {
                this.remove(token);
            }

            return this.contains(token);
        }
    };

    window.DOMTokenList = DOMTokenList;

    function defineElementGetter (obj, prop, getter) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop,{
                get : getter
            });
        } else {
            obj.__defineGetter__(prop, getter);
        }
    }

    defineElementGetter(Element.prototype, 'classList', function () {
        return new DOMTokenList(this);
    });

})();

if(!window.innerHeight) {
    (function (window, document) {

        var html = document.documentElement;
        var body = document.body;

        var define = function (object, property, getter) {
            if (typeof object[property] === 'undefined') {
                Object.defineProperty(object, property, {get: getter});
            }
        };

        define(window, 'innerWidth', function () {
            return html.clientWidth
        });
        define(window, 'innerHeight', function () {
            return html.clientHeight
        });

        define(window, 'scrollX', function () {
            return window.pageXOffset || html.scrollLeft
        });
        define(window, 'scrollY', function () {
            return window.pageYOffset || html.scrollTop
        });

        define(document, 'width', function () {
            return Math.max(body.scrollWidth, html.scrollWidth, body.offsetWidth, html.offsetWidth, body.clientWidth, html.clientWidth)
        });
        define(document, 'height', function () {
            return Math.max(body.scrollHeight, html.scrollHeight, body.offsetHeight, html.offsetHeight, body.clientHeight, html.clientHeight)
        });

        return define;

    }(window, document));
}

if(!Array.isArray) {
    Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}

if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var n, k,
            t = Object(this),
            len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }

        n = len - 1;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) {
                n = 0;
            }
            else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }

        for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}