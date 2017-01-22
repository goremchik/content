
/*
 The object with additional buttons in the main menu (Login, Registration, Login, Info)

 Constructor: UserMenu(menuBlock, menu)
 menu - Menu object
 menuBlock - (HTML block) container for the user menu, in desktop version
 */

function UserMenu(menuBlock, menu) {
    if (typeof addEvent !== 'function') {
        throw new Error("Cant add event listener!");
    }

    if (typeof isElement !== 'function') {
        throw new Error("Cant find  isElement function!");
    }

    if (!menuBlock || !isElement(menuBlock)) {
        throw new Error("Need user menu block!");
    }

    if (typeof PopupBlock !== 'function') {
        throw new Error("Need PopupBlock function!");
    }

    // The buttons for the desktop version
    this.desktopButtons = {
        login: 'Login',
        registration: 'Registration',
        info: 'User',
        logout: 'Logout'
    };

    // The buttons for the mobile version
    this.mobileButtons = {};

    // If the Menu object not exist, buttons for mobile version won't work
    var haveMenu = !!menu;
    var oldMobile = sizeInfo.isMobile;

    // Additional function for creation an input element with a label
    function createInput(block, type, text, placeholder) {
        var input = document.createElement('input');
        input.type = type;
        input.className = 'input-field';
        input.setAttribute('placeholder', placeholder);

        var label = document.createElement('label');
        label.className = 'label-field';
        label.innerHTML = text;

        block.insertBefore(label, null);
        block.insertBefore(input, null);

        return input;
    }

    // Change visibility of the login, registration, logout and info buttons and vice versa
    var changeButton = function (type, isLogin) {
        var buttonObj = this[type];

        try {
            buttonObj['login'].style.display = isLogin ? 'none' : 'block';
            buttonObj['registration'].style.display = isLogin ? 'none' : 'block';
            buttonObj['info'].style.display = isLogin ? 'block' : 'none';
            buttonObj['logout'].style.display = isLogin ? 'block' : 'none';
        } catch (e) {
            console.error(e)
        }
    }.bind(this);

    // Change the desktop buttons to the menu elements in the mobile version
    var changeButtons = function () {
        if (sizeInfo.isMobile) {
            for (var i in this.desktopButtons) {
                this.desktopButtons[i].style.display = 'none';
            }

            changeButton('mobileButtons', user.checkLogin);
        } else {
            for (var i in this.mobileButtons) {
                this.mobileButtons[i].style.display = 'none';
            }

            changeButton('desktopButtons', user.checkLogin);
        }
    }.bind(this);

    // Call the login window
    this.login = function () {
        var popupElement = new PopupBlock();

        var data = document.createElement('div');
        data.className = 'view-container clearfix';

        var loginInput = createInput(data, 'text', 'Login:', 'Login');
        var passInput = createInput(data, 'password', 'Password:', 'Password');

        var saveButton = document.createElement('button');
        saveButton.className = 'btn light';
        saveButton.innerHTML = 'Login';

        data.insertBefore(saveButton, null);
        popupElement.addElement(data);

        // When the confirm button is pressed
        function onSubmit() {
            var loginVal = loginInput.value;
            var passVal = passInput.value;

            if (!loginVal) { // An empty login is not allowed
                try {
                    new Notification('Empty login', 'error');
                } catch (e) {}
                return;
            }

            // To log in
            user.login(loginVal, passVal, function (userObj) {
                if (userObj.checkLogin) {
                    changeButtons();
                    popupElement.closeElement();
                    try {
                        new Notification('Login success', 'success');
                    } catch (e) {}
                } else {
                    try{
                        new Notification('Wrong login or password', 'error');
                    } catch (e) {}
                }
            });
        }

        // Call onClick by clicking on the submit button, or by pressing the enter button
        addEvent(saveButton, 'click', onSubmit);
        addEvent(data, 'keydown', function (event) {
            if (event.keyCode == 13) { //если нажали Enter, то true
                onSubmit();
            }
        });
    };

    // Call the registration window
    this.registration = function () {
        var popupElement = new PopupBlock();

        var data = document.createElement('div');
        data.className = 'view-container clearfix';

        var loginInput = createInput(data, 'text', 'Login:', 'Login');
        var passInput = createInput(data, 'password', 'Password:', 'Password');
        var passConfirmInput = createInput(data, 'password', 'Confirm password:', 'Confirm assword');

        var regButton = document.createElement('button');
        regButton.className = 'btn light';
        regButton.innerHTML = 'Register';

        data.insertBefore(regButton, null);
        popupElement.addElement(data);

        function onSubmit() {
            var loginVal = loginInput.value;
            var passVal = passInput.value;
            var passConfirmVal = passConfirmInput.value;

            if (!loginVal) {
                new Notification('Empty login', 'error');
                return;
            }

            if (!passVal || passVal.length < 6) {
                new Notification('Short password', 'error');
                return;
            }

            if (passVal !== passConfirmVal) {
                new Notification('Passwords are not equal', 'error');
                return;
            }

            user.register(loginVal, passVal, function (status) {
                if (status === 'Ok') {
                    popupElement.closeElement();
                    new Notification('User registered', 'success');
                } else {
                    new Notification(status, 'error');
                }
            });
        }

        // Call onSubmit by clicking on the submit button, or by pressing the enter button
        addEvent(regButton, 'click', onSubmit);
        addEvent(data, 'keydown', function (event) {
            if (event.keyCode == 13) { //если нажали Enter, то true
                onSubmit();
            }
        });

    };

    // Call the info window (about the user)
    this.info = function () {
        // todo
        console.log("info");
    };

    // To log out
    this.logout = function (callback) {
        user.logout(function () {
            changeButtons();
            if (typeof callback === 'function') {
                callback();
                location.reload();
            }
        });
    };

    // Additional function to create a button
    function addButton(func, name, color) {
        var button = document.createElement('button');
        button.className = 'btn ' + (color ? 'dark' : 'light');
        button.onclick = func;
        button.innerHTML = name;
        button.style.display = 'none';

        menuBlock.insertBefore(button, null);
        return button;
    }

    // Creating buttons for the mobile and desktop versions
    var iter = 0;
    for (var i in this.desktopButtons) {
        if (haveMenu) {
            this.mobileButtons[i] = menu.addMenuElement(this[i], this.desktopButtons[i]);
        }
        this.desktopButtons[i] = addButton(this[i],
            this.desktopButtons[i], iter % 2);
        iter++;
    }

    changeButtons();

    // Changing button size, taking into account the window size
    addEvent(window, 'resize', function () {
        if (oldMobile !== sizeInfo.isMobile) {
            oldMobile = sizeInfo.isMobile;
            changeButtons();
        }
    });
}