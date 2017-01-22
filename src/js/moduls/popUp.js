
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