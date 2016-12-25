/**
 * Created by Goremchik on 2016-12-24.
 */


addEvent(window, 'load', function () {

    var contentPage = document.getElementById('page');
    contentPage.computedHeight = parseFloat(getElementHeight(contentPage));

    if (contentPage.computedHeight < window.innerHeight) {
        contentPage.style.height = (window.innerHeight - 115) + 'px';
    }
});

addEvent(window, 'resize', function () {
    var contentPage = document.getElementById('page');

    if (contentPage.computedHeight < window.innerHeight) {
        contentPage.style.height = (window.innerHeight - 115) + 'px';
    }
});

