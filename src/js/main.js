
// An object which defines a display size
function SizeInfo() {
    this.smallDisplay = 960; // property that defines the boundary of the mobile version
    this.isMobile = false; // checks whether the display size is mobile

    // Checks whether the display size is mobile
    this.checkMobile = function () {
        this.isMobile = window.innerWidth <= this.smallDisplay;

    }.bind(this);

    // Recalculates the size of the display, when the page loads or when the window is resized
    try {
        addEvent(window, 'load', this.checkMobile);
        addEvent(window, 'resize', this.checkMobile);
    } catch (e) {}
    this.checkMobile();
}

// Creates all work object
try {
    var path = new Controller();
    var sizeInfo = new SizeInfo();
    addEvent(window, 'load', function () {
        prepareModuls();
    });
} catch (e) {
    console.error(e);
    alert("Change your browser!!!");
}

var menu = null;
var userMenu = null;

function prepareModuls() {
    try {
        menu = new Menu(document.getElementById('menu'));
        user.initAuthorization(function () {
            userMenu = new UserMenu(document.querySelectorAll('.user-menu')[0], menu);
        });
    } catch (e) {
        console.error(e);
        alert("Change your browser!!!");
    }

    var sites = document.querySelectorAll('.social');
    for (var i = 0; i < sites.length; i++) {
        try {
            new Share(sites[i]);
        } catch (e) {
            console.error(e);
        }
    }
}

if (document.all && document.querySelector && !document.addEventListener) {
    document.body.setAttribute('browser', 'ie-8');
}
