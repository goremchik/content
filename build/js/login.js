/**
 * Created by Goremchik on 2016-12-09.
 */

var user = {
    checkLogin: false,
    id: 0,
    name: "Incognito",
    role: 0,

    register: function (userObj) {

        if (!userObj || typeof userObj !== 'object') {
            throw new TypeError('Parameter is not object!');
        }

        var users = data.get('users');
        var userInfo = data.getItemByKey(users, 'login', userObj.login);

        // If this user exist - stop registration
        if (userInfo) {
            throw new Error('This user exist!');
        }

        userObj.id = data.generateId();
        data.add('users', userObj);
    },

    initAuthorization: function () {
        var id = data.getElement('loginId');
        if (!id) {
            data.setElement('loginId', 0);
            return;
        }

        var users = data.get('users');

        if (!users) {
            data.setElement('loginId', 0);
            return;
        }

        var userInfo = data.getItemByKey(users, 'id', id);

        if (!userInfo) {
            data.setElement('loginId', 0);
            return;
        }

        this.id = userInfo.id;
        this.name = userInfo.name;
        this.role = userInfo.role;
        this.checkLogin = true;
    },

    login: function (login, password) {
        var users = data.get('users');

        if (!Array.isArray(users)) {
            throw new TypeError('Variable is not array!');
        }

        var userInfo = data.getItemByKey(users, 'login', login);
        if (!userInfo) {
            return false;
        }

        if (userInfo.password !== password) {
            return false;
        }

        if (!data.setElement('loginId', this.id)) {
            return false;
        }

        this.id = userInfo.id;
        this.name = userInfo.name;
        this.role = userInfo.role;
        this.checkLogin = true;

        return true;
    },

    logout: function () {
        data.setElement('loginId', 0);

        this.id = 0;
        this.name = 'Incognito';
        this.role = 0;
        this.checkLogin = true;

        return true;
    }
};

user.initAuthorization();