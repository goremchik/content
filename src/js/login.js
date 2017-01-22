
// An object for authentication or user registration
var user = {
    checkLogin: false,  // Checks whether user is logged
    id: 0,              // User id
    name: "Incognito",  // User login ("Incognito" - for not logged one)
    role: 0,            // User role (is not used right now, but can be used in future)
    content: {
        video: {},      // A set of content IDs, for which a user has voted
        audio: {},
        text: {},
        images: {}
    },

    // User registration.
    // A string which contains a performance status is passed to the callback
    // ('Short password' / 'User exist' / 'Ok')
    register: function (login, pass, callback) {

        if (typeof callback !== 'function') {
            callback = function () {};
        }

        if (!login || pass.length < 6) {
            callback('Short password');
            return;
        }

        data.get('users', function (users) {
            var userInfo = data.getItemByKey(users, 'name', login);

            // If this user exist - stop registration
            if (userInfo) {
                callback('User exist');
                return;
            }

            var userObj = {
                name: login,
                password: pass,
                id: data.generateId(), // generates random id
                role: 0,
                content: {
                    video: {},
                    audio: {},
                    text: {},
                    images: {}
                }
            };

            // Adding a user to the database
            data.add('users', userObj, function () {
                callback('Ok');
            });
        });

    },

    // Checks whether the user has been authenticated when the site starts
    // "session/user id" is stored in LocalStorage
    // this of the current object is passed to the callback
    initAuthorization: function (callback) {
        if (typeof callback !== 'function') {
            callback = function () {};
        }

        // Get the "session/user id" from the database
        data.getElement('loginId', function (id) {
            id = parseInt(id);
            if (!id) {
                callback(this);
                return;
            }

            // Looks for the user with the corresponding id
            data.get('users', function (users) {
                if (!users) {
                    callback(this);
                    return;
                }

                var userInfo = data.getItemByKey(users, 'id', id);
                if (!userInfo) {
                    callback(this);
                    return;
                }

                this.id = parseInt(userInfo.id);
                this.name = userInfo.name;
                this.role = parseInt(userInfo.role);
                this.content = userInfo.content;
                this.checkLogin = true;
                callback(this);

            }.bind(this));
        }.bind(this));
    },

    // User authentication
    // Regardless of the status of an implementation, the the current object is passed to the callback
    login: function (login, password, callback) {
        if (typeof callback !== 'function') {
            callback = function () {};
        }

        // Gets all users from the database
        data.get('users', function (users) {
            if (!Array.isArray(users)) {
                callback(this);
                return;
            }

            // Looks for the user with corresponding login
            var userInfo = data.getItemByKey(users, 'name', login);
            if (!userInfo) { // Если пользователь не существует
                callback(this);
                return;
            }


            if (userInfo.password !== password) { // If the password is wrong
                callback(this);
                return;
            }

            // If all is OK, it writes "session/user id" to the database
            // and changes the 'this' object
            data.setElement('loginId', userInfo.id, function () {
                this.id = userInfo.id;
                this.name = userInfo.name;
                this.role = userInfo.role;
                this.content = userInfo.content;
                this.checkLogin = true;
                callback(this);
            }.bind(this));
        }.bind(this));
    },

    logout: function (callback) {
        // Set the "session/user id" to 0
        data.setElement('loginId', 0, function () {

            // Creates default parameters for unlogged user
            this.id = 0;
            this.name = 'Incognito';
            this.role = 0;
            this.checkLogin = false;
            this.content = {
                video: {},
                audio: {},
                text: {},
                images: {}
            };

            if (typeof callback === 'function') {
                callback();
            }
        }.bind(this));
    },

    // Checks whether the user has already voted for this content
    // type - content type
    // dataId - content element id
    checkRating: function(type, dataId) {
        if (this.content[type][dataId]) {
            return this.content[type][dataId];
        }
        return false;
    },

    // Adding/changing the ID in the content object
    // type - content type
    // dataId - content element id
    // value - rating value
    setRatingId: function(type, dataId, value, callback) {

        // Changes the data for the current user in database
        data.changeItem('users', this.id, 'content', this.content, function () {
            this.content[type][dataId] = value;

            if (typeof callback === 'function') {
                callback();
            }
        }.bind(this));

    }
};