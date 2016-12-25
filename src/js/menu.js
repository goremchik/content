/**
 * Created by Goremchik on 2016-12-15.
 */

function Menu(elementId) {

    elementId = elementId || 'menu';
    var menuBlock = null;
    var smallDisplay = 960;
    var isMobile = false;

    this.checkMobile = function () {
        isMobile = window.innerWidth <= smallDisplay ? true : false;
        return isMobile;
    };

    this.checkMobile();

    this.initMenu = function () {
        menuBlock = document.getElementById(elementId);

        var submenu = menuBlock.querySelectorAll('.submenu');

        for (var i = 0; i < submenu.length; i++) {
            var submenuParent = submenu[i].parentNode;

            addEvent(submenu[i], 'click', function (event) {
                this.style.display = 'none';
            });

            addEvent(submenuParent, 'click', function (event) {

                var submenuElement = getTarget(event).parentNode;
                var element = submenuElement.querySelectorAll('.submenu')[0];

                if (element.length < 1 || submenuElement.classList.contains('submenu-element')) {
                    return;
                }

                element.style.display = 'block';
                var a = submenuElement.getElementsByTagName('a')[0];
                a.style.color = '#6da3bd';
            });

            addEvent(submenuParent, 'focusout', function (event) {

                var parentElement = getTarget(event).parentNode;

                var element = parentElement.querySelectorAll('.submenu')[0];

                if (event.relatedTarget) {
                    var clickElement = event.relatedTarget.parentNode;
                    if (clickElement.classList.contains('submenu-element')) {
                        return;
                    }
                }

                if (element.length < 1) {
                    return;
                }

                element.style.display = 'none';
                var a = parentElement.getElementsByTagName('a')[0];
                a.style.color = '';
            });
        }
    };

    function changeMenu () {
      console.log("Change menu");
    };

    function getScreenChange () {
        var boolAns = window.innerWidth > smallDisplay && isMobile ||
            window.innerWidth <= smallDisplay && !isMobile;
        isMobile = window.innerWidth <= smallDisplay ? true : false;
        return boolAns;
    };

    addEvent(window, 'load', this.initMenu);

    addEvent(window, 'resize', function () {
        if (getScreenChange()) {
            changeMenu();
        }
    });

}

var menu = new Menu('menu');