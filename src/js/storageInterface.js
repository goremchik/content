/**
 * Created by Goremchik on 2016-12-09.
 */

var data = {
    get: function (type) {
        var str = localStorage.getItem(type);

        return JSON.parse(str);
    },

    set: function(type, obj) {
        localStorage.setItem(type, JSON.stringify(obj));
    },

    add: function (type, obj) {

        if (!obj || typeof obj !== 'object') {
            throw new TypeError('Parameter is not object!');
        }

        var objArray = this.get(type);
        if (!Array.isArray(objArray)) {
            throw new TypeError('Variable is not array!');
        }

        objArray.push(obj);
        localStorage.setItem(type, JSON.stringify(objArray));
    },

    deleteItem: function (type, obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError('Parameter is not object!');
        }

        var objArray = this.get(type);
        if (!Array.isArray(objArray)) {
            throw new TypeError('Variable is not array!');
        }

        var index = this.getItemIndex(objArray, obj);
        if (index === -1) {
            return true;
        }

        objArray.splice(index, 1);
        localStorage.setItem(type, JSON.stringify(objArray));

        return true;
    },

    getItemIndex: function (arr, param) {

        if (!Array.isArray(arr) || !param) {
            throw new TypeError('Wrong parameters!');
        }

        if (typeof param !== 'object') {
            var obj = {id: param};
        }

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id === obj.id) {
                return i;
            }
        }
        return -1;
    },

    getItemByKey: function (arr, key, value) {
        if (!Array.isArray(arr) || !key) {
            throw new TypeError('Wrong parameters!');
        }

        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] === value) {
                return arr[i];
            }
        }
        return false;
    },

    changeItem: function (type, id, key, value) {

        if (!id || !key) {
            throw new TypeError('Wrong parameters!');
        }

        var objArray = this.get(type);
        if (!Array.isArray(objArray)) {
            throw new TypeError('Variable is not array!');
        }

        var index = this.getItemIndex(objArray, id);
        if (index === -1) {
            return false;
        }

        objArray[index][key] = value;
        localStorage.setItem(type, JSON.stringify(objArray));

        return true;
    },

    getElement: function (key) {
        return localStorage.getItem(key);
    },

    setElement: function (key, value) {
        localStorage.setItem(key, value);
    },

    generateId: function () {
        return Math.ceil(Math.random() * 1000000000);
    }
};