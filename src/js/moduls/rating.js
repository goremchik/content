
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