
/*
 The object for working with database.

 get(type, callback) - to get an array with a defined type of data
 type - type of content ('images', 'video', 'audio', 'text')
 callback(dataArray) - an array of objects is passed to the callback

 set(type, obj, callback) - set an array with a specific type of data
 type - type of content ('images', 'video', 'audio', 'text')
 obj - array of objects
 callback(boolean) - execution status is transmitted to the callback

 add(type, obj, callback) - adding an element into the array with specified type
 type - type of content ('images', 'video', 'audio', 'text')
 obj - an object element

 deleteItem: function (type, obj, callback) - deletes an element from the array with specified type
 type - type of content ('images', 'video', 'audio', 'text')
 obj - an object element
 callback(boolean) - execution status is transmitted to the callback

 getItemIndex: function (arr, param) - get the position of the element in the array by id
 arr - an object array (with id field)
 param - an object (with id field)/ element id
 return = (int) index - If the element is found / -1 if there are no elements with such id

 getItemByKey(arr, key, value) - get the position of the element in the array by key
 arr - an object array (with key attribute)
 key - object property name
 value - object property value
 return = (int) index - If the element is found / false if there are no elements with such key

 changeItem(type, id, key, value, callback) - changes an object field of an array of a specific data type
 type - type of content ('images', 'video', 'audio', 'text')
 id - object id
 key - the name of the changing field
 value - field value
 callback(boolean) - execution status is transmitted to the callback

 getElement: function (key, callback) - get the element from the database
 key - field name in the database
 callback(data) - data from the database is transmitted to the callback

 setElement: function (key, value, callback) - set an element to the database
 key - field name in the database
 value - field value
 callback(true/false) - execution status is transmitted to the callback

 generateId() - generates a random Id
 return (int)id
 */

var data = {
    get: function (type, callback) {
        var str = localStorage.getItem(type);
        if (typeof callback === 'function') {
            callback(JSON.parse(str));
        }
    },

    set: function(type, obj, callback) {
        localStorage.setItem(type, JSON.stringify(obj));
        if (typeof callback === 'function') {
            callback(true);
        }
    },

    add: function (type, obj, callback) {
        if (typeof callback !== 'function') {
            callback = function () {};
        }

        if (!obj || typeof obj !== 'object') {
            callback(false);
            return;
        }

        this.get(type, function (objArray) {
            if (!Array.isArray(objArray)) {
                callback(false);
                return;
            }

            objArray.push(obj);
            this.set(type, objArray, callback);
        }.bind(this));
    },

    deleteItem: function (type, obj, callback) {
        if (typeof callback !== 'function') {
            callback = function () {};
        }

        if (!obj || typeof obj !== 'object') {
            callback(false);
            return;
        }

        this.get(type, function (objArray) {
            if (!Array.isArray(objArray)) {
                callback(false);
                return;
            }


            var index = this.getItemIndex(objArray, obj);
            if (index === -1) {
                callback(false);
                return;
            }

            objArray.splice(index, 1);
            this.set(type, objArray, callback);
        }.bind(this));
    },

    getItemIndex: function (arr, param) {
        if (!Array.isArray(arr) || !param) {
            return -1;
        }

        if (typeof param !== 'object') {
            var obj = {id: param};
        } else {
            obj = param;
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
            return false;
        }

        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] === value) {
                return arr[i];
            }
        }
        return false;
    },

    changeItem: function (type, id, key, value, callback) {

        if (typeof callback !== 'function') {
            callback = function () {};
        }
        if (!id || !key) {
            callback(false);
            return;
        }

        this.get(type, function (objArray) {
            if (!Array.isArray(objArray)) {
                callback(false);
                return;
            }

            var index = this.getItemIndex(objArray, id);
            if (index === -1) {
                callback(false);
                return;
            }

            objArray[index][key] = value;
            this.set(type, objArray, callback);
        }.bind(this));
    },

    getElement: function (key, callback) {
        if (typeof callback === 'function') {
            callback(localStorage.getItem(key));
        }
    },

    setElement: function (key, value, callback) {
        localStorage.setItem(key, value);

        if (typeof callback === 'function') {
            callback(true);
        }
    },

    generateId: function () {
        return Math.ceil(Math.random() * 1000000000);
    }
};