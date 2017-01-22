
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

