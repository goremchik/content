
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
