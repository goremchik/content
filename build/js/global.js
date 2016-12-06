/**
 * Created by Goremchik on 2016-12-06.
 */

function getBrowser() {
    var browser = {};
    var ua = navigator.userAgent;
    browser.name = function () {
        if (ua.search(/MSIE/) > -1 || ua.search(/rv:/) > -1) return "ie";
        if (ua.search(/Firefox/) > -1) return "firefox";
        if (ua.search(/Opera/) > -1) return "opera";
        if (ua.search(/Chrome/) > -1) return "chrome";
        if (ua.search(/Safari/) > -1) return "safari";
        if (ua.search(/Konqueror/) > -1) return "konqueror";
        if (ua.search(/Iceweasel/) > -1) return "iceweasel";
        if (ua.search(/SeaMonkey/) > -1) return "seamonkey";
    }();

    browser.version = function (name) {
        switch (name) {
            case "ie" :
                if (ua.split("MSIE ")[1]) {
                    return (ua.split("MSIE ")[1]).split(";")[0];
                } else {
                    return (ua.split("rv:")[1]).split(")")[0];
                }

            case "firefox" :
                return ua.split("Firefox/")[1];
            case "opera" :
                return ua.split("Version/")[1];
            case "chrome" :
                return (ua.split("Chrome/")[1]).split(" ")[0];
            case "safari" :
                return (ua.split("Version/")[1]).split(" ")[0];
            case "konqueror" :
                return (ua.split("KHTML/")[1]).split(" ")[0];
            case "iceweasel" :
                return (ua.split("Iceweasel/")[1]).split(" ")[0];
            case "seamonkey" :
                return ua.split("SeaMonkey/")[1];
                break;
        }
    }(browser.name);

    return browser;
}

var browser = getBrowser();


window.onload = function () {

};