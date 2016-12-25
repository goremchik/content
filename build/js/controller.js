/**
 * Created by Goremchik on 2016-12-06.
 */

addEvent(window, 'hashchange', renderView);
addEvent(window, 'load', renderView);

function renderView() {

    var urlObj = getUrlByHash();
    var path = urlObj.page;
    var param = urlObj.param;

    var url = 'pages/index.html';
    var model = indexModel;

    switch (path) {
        case "video":
            url = 'pages/video.html';
            model = videoModel;
            break;
        case "audio":
            url = 'pages/audio.html';
            model = audioModel;
            break;
        case "images":
            url = 'pages/images.html';
            model = imagesModel;
            break;
        case "about":
            url = 'pages/about.html';
            model = aboutModel;
            break;
        case "text":
            url = 'pages/text.html';
            model = textModel;
            break;
    }

    try {
        $.get(url, function (html) {
            var container = document.getElementById("page");
            container.innerHTML = html;
            model(param);
        }).fail(function() {
            showError();
        });
    } catch (error) {
        console.log(error);
        showError();
    }

    function showError() {
        var container = document.getElementById("page");
        container.innerHTML = "Cant load the page";
    }

    function getUrlByHash() {
        var url = location.hash.substr(1);
        var page = url;
        var param = '';

        var indexSlash = page.indexOf('/');
        if (indexSlash > -1) {
            page = url.substr(0, indexSlash);
            param = url.substr(indexSlash + 1);
        }

        return {
            page: page,
            param: param
        };
    }
}