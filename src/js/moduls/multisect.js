
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