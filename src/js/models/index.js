
function indexModel() {

    helper.setShareMeta('index', 'Shofer Content', 'Main Page', 'img/logo.png');

    var page = document.getElementById('page');
    var imageBlock = page.querySelectorAll('.best-images')[0];
    var videoBlock = page.querySelectorAll('.best-video')[0];
    var textBlock = page.querySelectorAll('.best-text')[0];
    var audioBlock = page.querySelectorAll('.best-audio')[0];

    new Slider(page.querySelectorAll('.slider')[0]);

    // Sort content by popularity and show 3 elements
    var bestParam = {sort: 'popularity -1'};
    var images = new Images(imageBlock, null, bestParam, function (content) {
        content.setBest();
    });

    var video = new Video(videoBlock, null, bestParam, function (content) {
        content.setBest();
    });

    var text = new Text(textBlock, null, bestParam, function (content) {
        content.setBest();
    });

    var audio = new Audio(audioBlock, null, bestParam, function (content) {
        content.setBest();
    });

    // Go to the appropriate page when it is clicked on a content card
    addClickEvent(imageBlock, 'image-element');
    addClickEvent(videoBlock, 'card-video-element');
    addClickEvent(textBlock, 'card-view-element');
    addClickEvent(audioBlock, 'card-view-element');

    function addClickEvent(block, className) {
        try {
            addEvent(block, 'click', onEvent);
        } catch (e) {
            block.onclick = onEvent;
        }

        function onEvent(event) {
            var target = getTarget(event);
            while (target !== block) {
                if (target.classList.contains(className)) {
                    var id = parseInt(target.getAttribute('data-id'));
                    var page = block.getAttribute('data-page');
                    path.setPath(page, 'sortBy=popularity&sortType=-1&id=' + id);
                    return;
                }
                target = target.parentNode;
            }
        }
    }

}