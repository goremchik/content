
/*
 The object for creating a loader file.
 Connect the library: Jquery FileUpload.

 Constructor:
 FileUploader(container, acceptFiles, typePath, buttonText, onSuccess)
 container - block, in which the file upload facility will be created
 acceptFiles - MIME-type files permissible (video/*)
 typePath - subfolder for downloaded files (video)
 buttonText - The text on the loader button
 onSuccess - callback

 Methods:
 reinit() - recreate the file loader object for new loading
 */

function FileUploader(container, acceptFiles, typePath, buttonText, onSuccess) {

    var uploader = document.createElement('div'); // HTML uploader block
    container.classList.add('file-uploader');
    var loading = document.createElement('div'); // HTML loading block
    loading.className = 'loader-block';
    loading.innerHTML = '<div class="loader"><i class="icon load"></i></div>';
    loading.style.display = 'none';
    container.insertBefore(uploader, null);
    container.insertBefore(loading, null);

    var onError = function () {
        closeLoader();
        this.reinit();
        try {
            new Notification("Can't load data on server", 'error');
        } catch (e) {
            console.error("Need Notification constractor");
        }
    }.bind(this);


    var loaderIntervalId = 0;

    // Hide an uploader block and open a loading block
    function openLoader() {
        uploader.style.display = 'none';
        loading.style.display = 'block';

        var deg = 0;
        loaderIntervalId = setInterval(function () {
            try {
                $(loading.querySelectorAll('.loader')[0]).rotate(deg);
                deg += 3;
            } catch (e) {
                console.error("Need rotate library");
            }
        }, 30);
    }

    // Hide a loading block
    function closeLoader() {
        loading.style.display = 'none';
        clearInterval(loaderIntervalId);
    }

    this.reinit = function () {
        uploader.style.display = 'block';
        loading.style.display = 'none';
        uploader.innerHTML = '';

        try {
            $(uploader).uploadFile({
                url: "/php/upload.php?type=" + typePath,
                multiple: false,
                dragDrop: true,
                maxFileCount: 1,
                fileName: "myfile",
                acceptFiles: acceptFiles,
                dragdropWidth: "",
                uploadStr: buttonText,
                onSubmit: function () {
                    openLoader();
                },

                onSuccess: function (files, data) {
                    // Parse the response, if it fails, that means a server error
                    try {
                        JSON.parse(data);
                    } catch (e) {
                        onError();
                        return;
                    }

                    // Simulating a load time
                    setTimeout(function () {
                        if (files[0].lastIndexOf('\\') > -1) {
                            files[0] = files[0].substr(files[0].lastIndexOf('\\') + 1);
                        }
                        onSuccess(files[0]);
                        closeLoader();
                        new Notification("File uploaded", 'success');
                    }, 1000);
                },

                onError: onError
            });
        } catch (e) {
            try {
                new Notification("Can't load data on server", 'error');
            } catch (e) {}
            console.error("Need library: Jquery FileUpload");
        }
    };

    this.reinit();
}


/*
 The object for creating main menu.

 Constructor Menu(menuBlock)
 menuBlock - HTML block with the menu items in it
 For example:
 <nav id="menu" class="icon">
     <ul>
         <li class="menu-element"><a href="#index">Main</a></li>
         <li class="menu-element"><a>Content</a>
             <ul class="submenu">
                <li class="submenu-element"><a href="#images">Images</a></li>
             </ul>
         </li>
     </ul>
 </nav>

 Methods:
 addMenuElement(func, name, vis) - add an item to the menu (not "a" tag)
 func - function which describes an action on click on the element
 name - element text
 vis - (boolean) visible / invisible
 return li (li HTML element)
 */

function Menu(menuBlock) {

    if (typeof addEvent !== 'function') {
        throw new Error("Cant add event listener!");
    }

    if (typeof getTarget !== 'function') {
        throw new Error("Cant find target!");
    }

    if (typeof isElement !== 'function') {
        throw new Error("Cant find  isElement function!");
    }

    if (!menuBlock || !isElement(menuBlock)) {
        throw new Error("Cant find menu block!");
    }

    if (!sizeInfo || typeof sizeInfo !== 'object') {
        throw new Error("Cant find sizeInfo object!");
    }

    var openMobile = false; // Whether the menu is opened in a mobile version
    var isOpen = false; // Whether the submenu is opened
    var openBlock = null; // Open submenu block

    // An old value for the IsMobile.
    // It is needed to determine whether the size of the display was changed or not
    var oldMobile = sizeInfo.isMobile;

    var submenu = menuBlock.querySelectorAll('.submenu'); // All submenu blocks
    var menuElementsBlock = menuBlock.querySelectorAll('ul')[0];

    this.addMenuElement = function (func, name, vis) {
        var li = document.createElement('li');
        li.className = 'menu-element';
        var a = document.createElement('a');
        a.innerHTML = name;
        a.onclick = func;
        li.insertBefore(a, null);
        li.style.display = vis ? 'block' : 'none';

        menuElementsBlock.insertBefore(li, null);
        return li;
    };

    // Action for clicking on the block menu
    addEvent(menuBlock, 'click', function (event) {

        var target = getTarget(event).parentNode;

        // Open a submenu when clicking on a sub-menu button
        var submenuTemp = target.children[1];
        if (submenuTemp) {
            if (submenuTemp.classList.contains('submenu')) {
                openSubmenu(submenuTemp);
                changeSizeMobileMenu();
                return;
            }
        }

        // Close the sub-menu and, if necessary, the mobile menu when clicking on the menu items
        if (target.classList.contains('menu-element') || target.classList.contains('submenu-element')) {
            closeSubmenu();
            if (sizeInfo.isMobile) {
                closeMobileMenu();
            }
            return;
        }

        // Open a mobile version menu when clicking on a mobile icon
        if (getTarget(event) === menuBlock && sizeInfo.isMobile) {
            if (!openMobile) {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        }
    });

    // Menu defocusing
    addEvent(document, 'click', function (event) {
        var target = getTarget(event).parentNode;

        try {
            if (target.classList.contains('menu-element') || target.classList.contains('submenu-element')) {
                return;
            }
        } catch (e) {
            closeSubmenu();
        }

        // Close the menu when clicking wherever else but not on the menu
        if (getTarget(event) !== menuBlock && sizeInfo.isMobile) {
            closeMobileMenu();
        }

        closeSubmenu();
    });

    function openSubmenu(submenuTemp) {
        if (openBlock === submenuTemp) {
            submenuTemp.style.display = '';
            openBlock = null;
            isOpen = false;
        } else if (!openBlock) {
            submenuTemp.style.display = 'block';
            openBlock = submenuTemp;
            isOpen = true;
        } else if (openBlock !== submenuTemp) {
            openBlock.style.display = '';
            openBlock = submenuTemp;
            submenuTemp.style.display = 'block';
            isOpen = true;

        }
    }

    function closeSubmenu() {
        for (var i = 0; i < submenu.length; i++) {
            submenu[i].style.display = '';
        }
        openBlock = null;
        isOpen = false;
    }

    // Change the height of the mobile menu block
    function changeSizeMobileMenu() {
        var menuElements = menuElementsBlock.querySelectorAll(".menu-element");

        // It counts the number of menu items and open submenu elements
        var iter = 0;
        for (var i = 0; i < menuElements.length; i++) {
            if (getStyle(menuElements[i], 'display') !== 'none') {
                iter++;
            }
        }

        for (i = 0; i < submenu.length; i++) {
            if (getStyle(submenu[i], 'display') !== 'none') {
                iter += submenu[i].querySelectorAll('.submenu-element').length;
            }
        }

        // Change the height, only for a mobile version
        if (sizeInfo.isMobile) {
            var headerHeight = 50;
            var menuItemHeight = 60;
            if (iter * menuItemHeight <= window.innerHeight - headerHeight) {
                menuElementsBlock.style.height = (iter * menuItemHeight) + 'px';
            } else {
                menuElementsBlock.style.height = (window.innerHeight - headerHeight) + 'px';
            }
        }
    }

    function openMobileMenu() {
        openMobile = true;
        document.body.style.overflow = 'hidden';
        changeSizeMobileMenu();
        $(menuElementsBlock).fadeIn(500);
    }

    function closeMobileMenu() {
        openMobile = false;
        document.body.style.overflow = '';
        $(menuElementsBlock).fadeOut(500);
    }

    // Change the menu status: from open to closed and vice versa
    var changeMenu = function () {
        if (openMobile) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }.bind(this);

    // Checks what type of menu should be displayed for the current window size:
    // mobile menu or desktop menu
    addEvent(window, 'resize', function () {
        if (oldMobile !== sizeInfo.isMobile) {

            oldMobile = sizeInfo.isMobile;
            // If there is an open submenu for the normal version, then going to the mobile
            // version automatically open the mobile version of the menu
            if (sizeInfo.isMobile && isOpen) {
                openMobile = true;
            }

            // On switching to the desktop menu, the mobile one should be closed
            if (!sizeInfo.isMobile) {
                openMobile = false;
                menuElementsBlock.style.display = '';
                menuElementsBlock.style.height = '';
                document.body.style.overflow = '';
            } else {
                changeMenu();
            }
        }

        if (openMobile) {
            changeSizeMobileMenu();
        }
    });
}


/*
 The object to create a modal window

 Constructor: Modal(param)
 param = {
 width - the width of the modal window
 text - text within the window
 confirmText - text on the confirmation button
 cancelText - text on the cancel button
 onCancel - callback when canceling
 onConfirm - callback on confirmation
 }
 */

function Modal(param) {
    if (!param || typeof param !== 'object') {
        param = {};
    }

    // To set the standard settings
    var width = param.width || '';
    var text = param.text || 'You sure?';
    var confirmText = param.confirmText || 'Ok';
    var cancelText = param.cancelText || 'Cancel';

    var onCancel = (typeof param.onCancel === 'function') ? param.onCancel : function () {};
    var onConfirm = (typeof param.onConfirm === 'function') ? param.onConfirm : function () {};

    // Creates a container for window
    var modalBlock = document.createElement('div');
    modalBlock.className = 'modal-block';
    document.body.insertBefore(modalBlock, null);

    // Creates a block for window
    var modalWindow = document.createElement('div');
    modalWindow.className = 'modal-window';
    modalWindow.innerHTML = '<div class="modal-text">' + text + '</div>';
    modalWindow.style.width = width;
    modalBlock.insertBefore(modalWindow, null);

    // Creates buttons
    var modalButtons = document.createElement('div');
    modalButtons.className = 'modal-buttons';
    modalWindow.insertBefore(modalButtons, null);

    createButton(modalButtons, confirmText, onConfirm);
    createButton(modalButtons, cancelText, onCancel);

    function closeModal() {
        document.body.removeChild(modalBlock);
    }

    function createButton(parent, text, callback) {
        var button = document.createElement('button');
        button.className = 'modal-button';
        button.innerHTML = text;
        parent.insertBefore(button, null);

        try {
            addEvent(button, 'click', function () {
                closeModal();
                callback();
            });
        } catch (e) {
            button.onclick = function () {
                closeModal();
                callback();
            };
        }
        return button;
    }
}

/*
 HTML object for a multiple choice

 Constructor: Multiselect(element, title)
 element - HTML container for an element
 title - text on the object

 addOptions(optionsObj) - to add an option
 optionsObj = {
 text - the text displayed to the user
 value - field value
 }

 clearAllOptions() - delete all options
 onchange() - callback, when changes value
 onblur() - callback, when element defocuses

 checkOptions(optionsId) - select an option
 optionsId - option id
 */

function Multiselect(element, title) {

    if (typeof addEvent !== 'function') {
        throw new Error("Cant find addEvent!");
    }

    if (typeof getTarget !== 'function') {
        throw new Error("Cant find target!");
    }

    if (typeof isElement !== 'function') {
        throw new Error("Cant find  isElement function!");
    }

    if (!element || !isElement(element)) {
        throw new Error("Cant find select element!");
    }

    this.optionsArray = []; // An array of HTML elements that will be as options
    this.value = [];        // An array of chosen elements
    this.isOpen = false;    // Checks whether the block is open to select items

    // Creates an option block
    var createOption = function (text, value, checked) {
        var optionBlock = document.createElement('div');
        optionBlock.innerHTML = text;
        optionBlock.className = 'option';
        optionBlock.setAttribute('value', value);
        optionBlock.setAttribute('checked', !!checked);

        this.optionsArray.push(optionBlock);
        optionsBlock.insertBefore(optionBlock, null);
    }.bind(this);

    this.addOptions = function (optionsObj) {
        if (!optionsObj) {
            return;
        }

        if (!Array.isArray(optionsObj)) {
            optionsObj = [optionsObj];
        }

        for (var i = 0; i < optionsObj.length; i++) {
            if (typeof optionsObj[i] !== 'object') {
                var text = optionsObj[i];
                optionsObj[i].text = optionsObj[i].value = text;
            }

            createOption(optionsObj[i].text, optionsObj[i].value, optionsObj[i].checked);
        }
    };

    this.clearAllOptions = function () {
        this.optionsArray = [];
        optionsBlock.innerHTML = '';
    };

    this.onchange = function () {};
    this.onblur = function () {};

    // Closes the multiselect by default
    element.style.display =  'none';
    var options = element.querySelectorAll('option');
    
    var select = document.createElement('div');
    select.className = 'multiselect-block ' + element.className;
    select.innerHTML = title;
    
    var optionsBlock = document.createElement('div');
    optionsBlock.className = 'options-block';

    // Creates all options
    for (var i = 0; i < options.length; i++) {
        createOption(options[i].innerHTML, options[i].getAttribute('value'));
    }
    
    select.insertBefore(optionsBlock, null);
    element.parentNode.insertBefore(select, null);

    // Changing chosen elements
    var changeSelect = function () {
        var valuesArray = [];
        var optionsArray = optionsBlock.querySelectorAll('.option[checked=true]');
        for (var i = 0; i < optionsArray.length; i++) {
            valuesArray.push(optionsArray[i].getAttribute('value'));
        }

        this.value = valuesArray;
        element.valueArray = valuesArray;
        this.onchange(this);
    }.bind(this);

    // Closes the options window
    var closeOptions = function () {
        if (this.isOpen) {
            optionsBlock.style.display = '';
            this.isOpen = false;
            select.setAttribute('open', 'false');
            changeSelect();
            this.onblur(this);
            if (typeof element.onchange === 'function') {
                element.onchange();
            }
        }
    }.bind(this);

    this.checkOptions = function(optionsId) {
        for (var i = 0; i < this.optionsArray.length; i++) {
            console.log(optionsId, this.optionsArray[i].getAttribute('value'));
            if (optionsId.indexOf(this.optionsArray[i].getAttribute('value')) > -1) {
                target.setAttribute('checked', 'false');
            }
        }
        changeSelect();
    };

    addEvent(select, 'click', function (event) {
        var target = getTarget(event);

        // Click on the multiselect block
        if (target === select) {
            if (optionsBlock.style.display === '') {
                optionsBlock.style.display = 'block';
                select.setAttribute('open', 'true');
                this.isOpen = true;
            } else {
                closeOptions();
            }
        }

        // Click on option
        if (target.parentNode === optionsBlock) {
            var isChecked = target.getAttribute('checked');
            if (isChecked === 'true') {
                target.setAttribute('checked', 'false');
            } else {
                target.setAttribute('checked', 'true');
            }
            changeSelect();
        }
    }.bind(this));

    // Element defocusing
    addEvent(document, 'click', function (event) {
        var target = getTarget(event);

        if (target === select || target.parentNode === optionsBlock) {
            return;
        }
        closeOptions();
    });

}

/*
 Object for creating the notifications

 Constructor: Notification(title, type)
 title - notification text
 type - notification type ('success', 'warning', 'info', 'error')
 */

function Notification(title, type) {

    var animationDuration = 1000; // The duration of the appearance / disappearance of the block
    var blockExistTime = 3000;    // Existence time for the block

    // Defining the class for a notification block
    switch (type) {
        case 'success':
            type = 'success-notify';
            break;
        case 'warning':
            type = 'warning-notify';
            break;
        case 'info':
            type = 'info-notify';
            break;
        default:
            type = 'error-notify';
    }

    // Creating a notification block
    var notifyBox = document.createElement('div');
    notifyBox.className = 'notify-box ' + type;
    notifyBox.innerHTML = '<h2 class="notify-title">' + title + '</h2>';
    document.body.insertBefore(notifyBox, null);

    // Animation appearance of the block
    try {
        $(notifyBox).fadeIn(animationDuration);
    } catch (e) {
        notifyBox.style.display = 'block';
    }

    var deleteElement = false;

    function closeElement() {
        if (!deleteElement) {
            deleteElement = true;
            try {
                $(notifyBox).fadeOut(animationDuration, function () {
                    document.body.removeChild(notifyBox);
                });
            } catch (e) {
                notifyBox.style.display = 'none';
                document.body.removeChild(notifyBox);
            }
        }
    }

    // Close the notification by clicking or after the specified time
    notifyBox.onclick = closeElement;
    setTimeout(closeElement, blockExistTime);
}

/*
 The object to create a popUp window

 Constructor: PopupBlock()

 Methods:
 closeElement() - closing a popUp block
 addElement(element) - Add an HTML element in a popUp block
 element - HTML element

 deleteElement(element) - Delete an HTML element from a popUp block
 element - HTML element

 deleteAllData() - Clear the HTML for the popUp block

 addHtml(html) Add an HTML text to popUp block
 html - HTML string

 onclose() - callback when closing a popUp block
 */

function PopupBlock() {

    if (typeof addEvent !== 'function') {
        throw new Error("Cant find addEvent!");
    }

    if (typeof getTarget !== 'function') {
        throw new Error("Cant find target!");
    }

    if (typeof isElement !== 'function') {
        throw new Error("Cant find  isElement function!");
    }

    var animationDuration = 500; // Duration of appearance / disappearance of an object

    // Creating a container for the popUp unit
    var popupShadow = document.createElement('div');
    popupShadow.className = 'popup-shadow';
    var scroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
    popupShadow.style.top = scroll + 'px';

    // Creating a popUp block
    var popupBox = document.createElement('div');
    popupBox.className = 'popup-box';

    //  Creating a button closure
    var closeButton = document.createElement('button');
    closeButton.className = 'popup-close';
    closeButton.innerHTML = '<i class="icon close-button"></i>';
    popupShadow.insertBefore(closeButton, null);

    popupShadow.insertBefore(popupBox, null);
    document.body.insertBefore(popupShadow, null);
    document.body.setAttribute('data-popup', 'open');

    // Animation appearance popUp block
    try {
        $(popupShadow).fadeIn(animationDuration);
    } catch (e) {
        popupShadow.style.display = 'block';
    }

    // Closing the popUp block
    this.closeElement = function () {
        try {
            $(popupShadow).fadeOut(animationDuration, function () {
                document.body.removeChild(popupShadow);
            });
        } catch (e) {
            popupShadow.style.display = 'none';
            document.body.removeChild(popupShadow);
        }
        document.body.setAttribute('data-popup', '');

        if (typeof this.onclose === "function") {
            this.onclose();
        }
    };

    this.addElement = function (element) {
        if (element && isElement(element)) {
            popupBox.insertBefore(element, null);
        }
    };

    this.deleteElement = function (element) {
        if (element && isElement(element)) {
            popupBox.removeChild(element);
        }
    };

    this.deleteAllData = function () {
        popupBox.innerHTML = '';
    };

    this.addHtml = function (html) {
        popupBox.innerHTML += html;
    };

    try {
        // Close the popUp when clicking on the shadow
        addEvent(popupShadow, 'click', function (event) {
            var target = getTarget(event);
            if (target === popupShadow) {
                this.closeElement();
            }
        }.bind(this));

        // Highlight the closing button, when moving on the shadow
        addEvent(popupShadow, 'mouseover', function (event) {
            var target = getTarget(event);
            if (target === popupShadow) {
                closeButton.style.color = '#fff';
            } else {
                if (closeButton.style.color !== '') {
                    closeButton.style.color = '';
                }
            }
        }.bind(this));

    } catch (e) {}

    try {
        addEvent(closeButton, 'click', this.closeElement);
    } catch (e) {
        closeButton.onclick = this.closeElement;
    }
}

/*
 The rating object

 Constructor: Rating(rating)
 rating (int) - rating

 Methods:
 onchange() - 'this' for current object will be transmitted to this callback
 getValue() - get the set rating

 setValue (rating) - set the rating
 rating (int) - rating

 changable(type) - set the type of item: changeable / unchangeable
 type (boolean) - type of element

 getElement() - get the HTML rating block
 */

function Rating(rating) {

    if (typeof addEvent !== 'function') {
        throw new Error("Cant find addEvent!");
    }

    if (typeof getTarget !== 'function') {
        throw new Error("Cant find target!");
    }

    var MAX_RATING = 5;         // Maximum rating
    var value = rating || 0;    // Rating value
    var defaultVal = value;     // The default rating value
    value = (value <= MAX_RATING) ? parseInt(value) : MAX_RATING;
    var chancheble = !rating;   //
    this.onchange = function () {};

    // Rating block
    var starsBlock = document.createElement('div');
    starsBlock.className = 'rating-block';
    var stars = []; // массив элементов звезд

    // Create a MAX_RATING stars
    for (var i = 0; i < MAX_RATING; i++) {
        createStar(i);
    }

    // Creating a star block
    function createStar(index, starClass) {
        var star = document.createElement('i');
        star.className = 'rating-star';
        star.setAttribute('data-index', index);
        star.setAttribute('data-type', (index < value) ? 'full' : 'empty');

        stars.push(star);
        starsBlock.insertBefore(star, null);
    }

    // Changing the rating value
    var changeStars = function (rating) {
        starsBlock.setAttribute('value', value);
        if (typeof this.onchange === 'function') {
            this.onchange(this);
        }
    }.bind(this);

    this.getValue = function () {
        return value;
    };

    this.setValue = function (rating) {
        if (chancheble) {
            value = rating || 0;
            value = (value <= MAX_RATING) ? value : MAX_RATING;
            changeStars(value);
        }
    };

    this.changable = function(type) {
        chancheble = type;
    };

    this.getElement = function () {
        return starsBlock;
    };

    // Changing the stars occupancy depending on clicking or pointing on the stars
    function onChange(max) {
        for (var i = 0; i < MAX_RATING; i++) {
            if (i <= max) {
                stars[i].setAttribute('data-type', 'full');
            } else {
                stars[i].setAttribute('data-type', 'empty');
            }
        }
    }

    // Set the rating value on click
    addEvent(starsBlock, 'click', function (event) {
        if (chancheble) {
            var target = getTarget(event);
            var index = parseInt(target.getAttribute('data-index'));
            this.setValue(index + 1);
            chancheble = false;
            defaultVal = value;
        }
    }.bind(this));

    // Change the stars occupancy when pointing at them
    addEvent(starsBlock, 'mouseover', function (event) {
        if (chancheble) {
            var target = getTarget(event);
            var index = parseInt(target.getAttribute('data-index'));
            onChange(index);
        }
    });

    // Change the stars occupancy when they are not pointed
    addEvent(starsBlock, 'mouseout', function (event) {
        if (chancheble) {
            onChange(defaultVal - 1);
        }
    });

    this.setValue(value);
}

/*
 The helper object with functions to interact with the meta tags
 that contain information about the page

 Methods:
 get(param) - get a param property value
 param - property

 set(param, value) - set the value for the parameter property
 param - property
 value - value

 createMetaTag(param) - creating a meta tag with the param property
 param - property
 */

var shareInfo = {
    get: function (param) {
        var meta = document.querySelectorAll('meta[property="og:' + param + '"]')[0];
        if (!meta) {
            meta = createMetaTag(param);
        }
        return meta.getAttribute('content');
    },

    set: function (param, value) {
        var meta = document.querySelectorAll('meta[property="og:' + param + '"]')[0];
        if (!meta) {
            meta = createMetaTag(param);
        }
        meta.setAttribute('content', value);
    },

    createMetaTag: function (param) {
        var meta = document.createElement('meta');
        meta.setAttribute('property', "og:" + param);
        document.head.insertBefore(meta, null);
        return meta;
    }
};

/*
 A sharing object

 Constructor: Share(element)
 element - HTML share element
 Example:
 <button class="social" data-site="vk">
    <i class="icon vk"></i>
 </button>
 */

function Share(element) {

    if (typeof isElement !== 'function') {
        throw new Error("Cant find  isElement function!");
    }

    if (!shareInfo || typeof shareInfo !== 'object') {
        throw new Error("Cant find shareInfo object!");
    }

    if (!element || !isElement(element)) {
        throw new Error("Cant find share element!");
    }

    try {
        addEvent(element, 'click', onClick);
    } catch (e) {
        element.onclick = onClick;
    }

    // It opens a sharing window when clicking on an element
    function onClick () {
        var sharingSite = element.getAttribute('data-site');

        // Получить информацию про страницу
        var url = shareInfo.get('url');
        var title = shareInfo.get('title');
        var desc = shareInfo.get('description');
        var image = shareInfo.get('image');

        // Set different URLs for different sharing sites
        var sharingUrl = '';
        switch (sharingSite) {
            case 'vk':
                sharingUrl = 'https://vk.com/share.php?&title=' + title + '&description=' + desc + '&image=' + image + '&noparse=true&url=' + url;
                break;
            case 'twitter':
                sharingUrl = 'https://twitter.com/share?text=' + title + '&url=' + url;
                break;
            case 'facebook':
                sharingUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
                break;
            case 'odnoklassniki':
                sharingUrl = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=' + url + '&st.comments=' + title + '';
                break;
            case 'mail.ru':
                sharingUrl = 'http://connect.mail.ru/share?url=' + url + '&title=' + title + '&description=' + desc + '&imageurl=' + image + '';
                break;
            case 'google+':
                sharingUrl = 'https://plus.google.com/share?url=' + url;
                break;
            case 'tumblr':
                sharingUrl = 'http://www.tumblr.com/share?v=3&t=' + title + '&u=' + url;
                break;
            case 'pinterest':
                sharingUrl = 'http://pinterest.com/pin/create/button/?media=' + image + '&description=' + desc + '&url=' + url;
                break;
            default:
                sharingUrl = sharingSite;
        }
        window.open(sharingUrl, '_blank', "width=" + 500 + ", height=" + 500);
    }
}


/*
 A slider object

 Constructor: Slider(element)
 element - HTML block that contains set slides

 For example:
 <div class="slider">
     <div class="slide-container">
         <div class="slide">
             <img src="img/slide1.jpg" alt="Img">
             <div class="info-block">
                 <h2 class="slider-title">Title 1</h2>
                 <p class="slider-text">Info 1</p>
             </div>
         </div>
     </div>

     <i class="icon slider-next slider-btn"></i>
     <i class="icon slider-prev slider-btn"></i>
 </div>

 setSlide(number) - set the slide
 number (int) - slide number

 next() - previous slide
 prev() - next slide
 */

function Slider(element) {

    if (!addEvent) {
        throw new Error("Cant add event listener!");
    }

    var container = element.querySelectorAll('.slide-container')[0];
    if (!container) {
        throw new Error("Need container!");
    }

    var slides = element.querySelectorAll('.slide');
    if (slides.length === 0) {
        throw new Error("Not slides!");
    }

    var currentIndex = 0;           // The current slide position
    var shift = 0;                  // Slide offset
    var delay = 5000;               // Delay between slide changes
    var showInfoDuration = 500;     // The duration of the animation
    var changeSlideDuration = 1000; // The duration of the slide changes

    this.setSlide = function (number) {
        hideInfo(function () {
            if (number < 0) {
                currentIndex = slides.length - 1;
            } else if (number >= slides.length) {
                currentIndex = 0;
            } else {
                currentIndex = number;
            }
            chancheSlide();
        });
    };

    this.next = function() {
        hideInfo(function () {
            currentIndex++;
            if (currentIndex >= slides.length) {
                currentIndex = 0;
            }

            chancheSlide();
        });
    };

    this.prev = function () {
        hideInfo(function () {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            }

            chancheSlide();
        });
    };

    var privateNext = this.next;

    // Setting buttons: previous/next
    var nextBut = element.querySelectorAll('.slider-next')[0];
    try {
        addEvent(nextBut, 'click', this.next);
    } catch (e) {
    }

    var prevBut = element.querySelectorAll('.slider-prev')[0];
    try {
        addEvent(prevBut, 'click', this.prev);
    } catch (e) {
    }

    var intervalId = 0;

    // Check the size of the slider container
    function getSlideWidth() {
        return getElementWidth(element);
    }

    // Set the size of the images in the slide
    function setSlideWidth() {
        var width = getSlideWidth();

        for (var i = 0; i < slides.length; i++) {
            slides[i].style.width = width + 'px';
            var img = slides[i].querySelectorAll('img')[0];

            if (!img) {
                continue;
            }

            img.style.width = '';
            img.style.height = '';
            var imgHeight = getElementHeight(img);
            var slideBlockHeight = getElementHeight(slides[i]);

            // Image alignment
            if (imgHeight >= slideBlockHeight) {
                var topImage = (slideBlockHeight - imgHeight) / 2;
                img.style.top = topImage + 'px';
                img.style.left = '';
            } else {
                img.style.width = 'auto';
                img.style.height = '100%';
                var leftImage = (getElementWidth(slides[i]) - getElementWidth(img)) / 2;
                img.style.top = '0px';
                img.style.left = leftImage + 'px';
            }
        }

        // Shift change, taking into account the size of the current slide
        shift = -(currentIndex * getSlideWidth());
        container.style.left = shift + 'px';
    }

    // Switch to the next slide
    function chancheSlide() {
        clearInterval(intervalId);
        shift = -(currentIndex * getSlideWidth());

        try {
            $(container).animate({
                left: shift + "px"
            }, changeSlideDuration, showInfo);
        } catch (e) {
            container.style.left = shift + "px";
        }
    }

    // Display the slide title
    function showInfo(callback) {
        var info = slides[currentIndex].querySelectorAll('.info-block')[0];
        if (!info) {
            return;
        }

        try {
            $(info).fadeIn(showInfoDuration, callback);
        } catch (e) {
            info.style.display = 'block';
        }

        clearInterval(intervalId);
        intervalId = setInterval(privateNext, delay);
    }

    // Hide the slide title
    function hideInfo(callback) {
        var info = slides[currentIndex].querySelectorAll('.info-block')[0];
        if (!info) {
            return;
        }

        try {
            $(info).fadeOut(showInfoDuration, callback);
        } catch (e) {
            info.style.display = 'none';
        }
    }

    setSlideWidth();
    showInfo();

    // Adapt the slider to the display size
    try {
        addEvent(window, 'resize', setSlideWidth);
        addEvent(slides[0].querySelectorAll('img')[0], 'load', setSlideWidth);
    } catch (e) {
    }
}



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