
// The object for the hash (#) URL
function Controller() {

    // Need to avoid updating a web page if the URL changes on the same page
    var oldPath = false;

    // Run an appropriate model for the page on the current URL
    var renderView = function () {

        var urlObj = this.getUrlByHash(); // To get an URL after the hash (#)
        var path = urlObj.page;
        var params = urlObj.params;

        // Updates the model if the URL points to another web page
        if (oldPath !== path) {
            oldPath = path;

            // Default values
            var url = 'pages/index.html';
            var model = indexModel;

            switch (path) {
                case "video":
                    url = 'pages/content.html';
                    model = videoModel;
                    break;
                case "audio":
                    url = 'pages/content.html';
                    model = audioModel;
                    break;
                case "images":
                    url = 'pages/content.html';
                    model = imagesModel;
                    break;
                case "about":
                    url = 'pages/about.html';
                    model = aboutModel;
                    break;
                case "text":
                    url = 'pages/content.html';
                    model = textModel;
                    break;
            }

            // Load the needed page, for a specified URL
            try {
                $.get(url, function (html) {
                    var container = document.getElementById("page");
                    container.innerHTML = html;
                    model(path, params);
                }).fail(function () {
                    showError();
                });
            } catch (error) {
                console.log(error);
                showError();
            }
        }
    }.bind(this);

    function showError() {
        var container = document.getElementById("page");
        try {
            container.innerHTML = "Cant load the page";
        } catch (e) {}
    }

    // To get an URL after the hash (#)
    this.getUrlByHash = function() {
        var url = location.hash.substr(1);
        var page = url;
        var paramString = '';
        var paramArray = [];
        var paramsObj = {};

        var indexParam = page.indexOf('?');
        if (indexParam > -1) { // If the path contains some transferred parameters

            paramString = url.substr(indexParam + 1);
            if (paramString.length > 0) {
                paramArray = paramString.split('&');

                for (var i = 0; i < paramArray.length; i++) {
                    var param = paramArray[i].split('=');
                    // To create an object that stores all the transferred parameters
                    paramsObj[param[0]] = param[1] ? param[1] : "";
                }
            }
            page = page.substr(0, indexParam);
        }

        var indexSlash = page.indexOf('/');

        // To consider only the following URL: images, note that images/data will turn into the images,
        // this means to ignore everything that is after '/'
        if (indexSlash > -1) {
            page = url.substr(0, indexSlash);
            this.setPath(page, paramString);
        }

        return {
            page: page, // Entered web page
            params: paramsObj // Object with parameters
        };
    };

    // Record a string with parameters into the URL
    // parameters - request parameters ("id=1&data=2")
    this.setParameters = function (parameters) {
        this.setPath(oldPath, parameters);
    };

    // Get the parameters from the object and write them to the string with parameters for the URL
    // parametersObj = {id = 1, data = 2}
    this.setParametersObj = function (parametersObj) {
        this.setParameters(this.getParametersString(parametersObj));
    };

    // To get the string with parameters from the object with parameters
    // parametersObj = {id = 1, data = 2}
    this.getParametersString = function (parametersObj) {
        var parameters = '';

        for (var i in parametersObj) {
            parameters += i + '=' + parametersObj[i] + '&';
        }

        if (parameters) {
            parameters = parameters.substr(0, parameters.length - 1)
        }

        return parameters;
    };

    // Set the path with the parameters,
    // path - URL of a page ("images")
    // parameters - request parameters ("id=1&data=2")
    this.setPath = function (path, parameters) {
        location.hash = path + (parameters ? "?" : "") + parameters;
    };

    addEvent(window, 'hashchange', renderView);
    addEvent(window, 'load', renderView);
}