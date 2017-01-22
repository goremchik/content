
function aboutModel() {

    helper.setShareMeta('about', 'Shofer content', 'About us', 'img/logo.png');

    // Marker coordinates
    var myLatLng = {lat: 50.449527, lng: 30.460810};

    // Marker description on the map
    var content = document.createElement('div');
    content.innerHTML = '<h2>Shofer content!</h2><p>mobile: +380636708594</p>';

    try {
        map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 15
        });

        // Creates an info window
        var infowindow = new google.maps.InfoWindow({
            content: content
        });

        // Creates a marker
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Our office'
        });

        // Opens a marker when you click on it
        google.maps.event.addListener(marker, 'click', function (event) {
            infowindow.open(map, marker);
        });
    } catch (e) {
        console.error(e);
    }
}

function audioModel(page, parameters) {

    helper.setShareMeta(page, 'Shofer content', 'Audio page', 'img/logo.png');

    var title = document.querySelectorAll('h1.page-title')[0];
    title.innerHTML = 'Audio page';

    var contentBlock = document.getElementById('contentBlock');
    var contentPagesBlocks = document.querySelectorAll('.pages');

    // Inputs for sorting, searching and filtering
    var searchInput = document.querySelectorAll('.input-block input')[0];
    var searchButton = document.querySelectorAll('.input-block button')[0];
    var sortSelect = document.querySelectorAll('.select-block .sort-by')[0];
    var categorySelect = document.querySelectorAll('.select-block .categories')[0];
    var multiSelect = new Multiselect(categorySelect, 'Categories');

    // Depending on the input parameters, set default values for INPUT
    // and prepare the object for filtering and sorting content
    var contentParameters = {};
    if (parameters.sortType && parameters.sortBy) {
        contentParameters.sort = parameters.sortBy + ' ' + parameters.sortType;

        var option = sortSelect.querySelectorAll('option[value="' + contentParameters.sort + '"]')[0];
        if (option) {
            option.selected = true;
        }
    }

    if (parameters.categories) {
        try {
            contentParameters.categories = JSON.parse(parameters.categories);
        } catch (e) {

        }
    }
    if (parameters.search) {
        contentParameters.search = parameters.search;
        searchInput.value = contentParameters.search;
    }

    // Create the content object
    try {
        var contentObj = new Audio(contentBlock, contentPagesBlocks, contentParameters, function (content) {
            helper.forContentAction(content, createDataView, searchInput,
                sortSelect, multiSelect, searchButton, parameters);
        });

    } catch (e) {
        console.error(e);
    }

    // Actions when you click on the card content
    try {
        addEvent(contentBlock, 'click', function (event) {
            var target = getTarget(event);

            // Search for an element on which there was a click
            while (target !== contentBlock) {
                if (target.classList.contains('card-view-element')) {
                    var index = parseInt(target.getAttribute('data-index'));

                    // Creates popUp
                    var popupElement = new PopupBlock();
                    popupElement.onclose = function () {
                        // Clear the id parameter from the URL after closing popUp
                        delete parameters.id;
                        path.setParametersObj(parameters);
                        helper.setShareMeta(page, 'Shofer content', 'Audio page', 'img/logo.png');
                    };

                    // Create HTML to view the content
                    createDataView(popupElement, index, contentObj);
                    return;
                }
                target = target.parentNode;
            }
        });

    } catch (e) {
        console.error(e);
    }

    function createDataView(popupElement, index, contentObj) {

        if (!index && index !== 0 || !popupElement) {
            return;
        }

        var dataLength = contentObj.allItems.length;
        var item = contentObj.allItems[index];

        // Add an id to URL parameters
        var sort = sortSelect.value;
        var categories = multiSelect.value;
        parameters = {
            sortBy: sort.split(' ')[0],
            sortType: sort.split(' ')[1],
            categories: JSON.stringify(categories),
            search: searchInput.value,
            id: item.id
        };
        path.setParametersObj(parameters);
        helper.setShareMeta(page + '?' + path.getParametersString(parameters), item.title, item.description, 'img/logo.png');

        // Clear all from popUp, it is needed when you go to the next content element
        popupElement.deleteAllData();

        // Create the content view
        var infoContainer = document.createElement('div');
        infoContainer.className = 'view-container clearfix';
        infoContainer.innerHTML = '<p class="pages-info">' + (index + 1) + ' of ' + dataLength + '</p>';

        if (index > 0) {
            var prevButton = document.createElement('div');
            prevButton.className = 'prev-button';
            prevButton.innerHTML = '<i class="icon icon-left"></i>';
            prevButton.onclick = function () {
                createDataView(popupElement, index - 1, contentObj);
            };
            infoContainer.insertBefore(prevButton, null);
        }

        if (index < dataLength - 1) {
            var nextButton = document.createElement('div');
            nextButton.className = 'next-button';
            nextButton.innerHTML = '<i class="icon icon-right"></i>';
            nextButton.onclick = function () {
                createDataView(popupElement, index + 1, contentObj);
            };
            infoContainer.insertBefore(nextButton, null);
        }

        // Create a block containing the information about the content
        helper.createTitleViewBlock(infoContainer, item, contentObj);
        helper.createRatingViewBlock(infoContainer, item, contentObj);
        helper.createDescriptionViewBlock(infoContainer, item, contentObj,
            popupElement, createDataView, index);

        var dataContainer = contentObj.createAudioView(index);
        popupElement.addElement(dataContainer);
        popupElement.addElement(infoContainer);
    }

    // Create "add content window" after the click on the button Add content
    try {
        var addContent = document.getElementById('addContent');
        addEvent(addContent, 'click', function () {
            // Only authenticated users are able to add data, so
            // show log in window if the user is not logged
            if (!user.checkLogin) {
                userMenu.login();
            } else {
                var popupElement = new PopupBlock();
                contentObj.createAddContentView(popupElement);
            }
        });

    } catch (e) {
        console.log(e);
    }
}

function imagesModel(page, parameters) {

    helper.setShareMeta(page, 'Shofer content', 'Gallery page', 'img/logo.png');

    var title = document.querySelectorAll('h1.page-title')[0];
    title.innerHTML = 'Gallery page';

    var contentBlock = document.getElementById('contentBlock');
    var contentPagesBlocks = document.querySelectorAll('.pages');

    // Inputs for sorting, searching and filtering
    var searchInput = document.querySelectorAll('.input-block input')[0];
    var searchButton = document.querySelectorAll('.input-block button')[0];
    var sortSelect = document.querySelectorAll('.select-block .sort-by')[0];
    var categorySelect = document.querySelectorAll('.select-block .categories')[0];
    var multiSelect = new Multiselect(categorySelect, 'Categories');

    // Depending on the input parameters, set default values for INPUT
    // and prepare the object for filtering and sorting content
    var contentParameters = {};
    if (parameters.sortType && parameters.sortBy) {
        contentParameters.sort = parameters.sortBy + ' ' + parameters.sortType;

        var option = sortSelect.querySelectorAll('option[value="' + contentParameters.sort + '"]')[0];
        if (option) {
            option.selected = true;
        }
    }

    if (parameters.categories) {
        try {
            contentParameters.categories = JSON.parse(parameters.categories);
        } catch (e) {}

    }

    if (parameters.search) {
        contentParameters.search = parameters.search;
        searchInput.value = contentParameters.search;
    }

    // Create the content object
    try {
        var contentObj = new Images(contentBlock, contentPagesBlocks, contentParameters, function (content) {
            helper.forContentAction(content, createDataView, searchInput,
                sortSelect, multiSelect, searchButton, parameters);
        });

    } catch (e) {
        console.error(e);
    }

    // Actions when you click on the card content
    try {
        addEvent(contentBlock, 'click', function (event) {
            var target = getTarget(event).parentNode;

            // Search for an element on which there was a click
            if (target.classList.contains('image-element')) {
                var index = parseInt(target.getAttribute('data-index'));

                // Creates popUp
                var popupElement = new PopupBlock();
                popupElement.onclose = function () {
                    // Clear the id parameter from the URL after closing popUp
                    delete parameters.id;
                    path.setParametersObj(parameters);
                    helper.setShareMeta(page, 'Shofer content', 'Gallery page', 'img/logo.png');
                };

                // Create HTML to view the content
                createDataView(popupElement, index, contentObj);
            }
        });

    } catch (e) {
        console.error(e);
    }

    function createDataView(popupElement, index, contentObj) {

        if (!index && index !== 0 || !popupElement) {
            return;
        }

        var dataLength = contentObj.allItems.length;
        var item = contentObj.allItems[index];

        // Add an id to URL parameters
        var sort = sortSelect.value;
        var categories = multiSelect.value;
        parameters = {
            sortBy: sort.split(' ')[0],
            sortType: sort.split(' ')[1],
            categories: JSON.stringify(categories),
            search: searchInput.value,
            id: item.id
        };
        path.setParametersObj(parameters);
        helper.setShareMeta(page + '?' + path.getParametersString(parameters), item.title, item.description, contentObj.getElementSrc(item));

        // Clear all from popUp, it is needed when you go to the next content element
        popupElement.deleteAllData();

        // Create the content view
        var elementsObj = contentObj.createImgView(index);
        popupElement.addElement(elementsObj.container);

        if (elementsObj.prevButton) {
            addEvent(elementsObj.prevButton, 'click', function () {
                createDataView(popupElement, index - 1, contentObj);
            });
        }

        if (elementsObj.nextButton) {
            addEvent(elementsObj.nextButton, 'click', function () {
                createDataView(popupElement, index + 1, contentObj);
            });
        }

        var infoContainer = helper.createHtmlElement({
            tag: 'div',
            className: 'info-container clearfix',
            html: '<p class="pages-info">' + (index + 1) + ' of ' + dataLength + '</p>'
        });

        // Create a block containing the information about the content
        helper.createTitleViewBlock(infoContainer, item, contentObj);
        helper.createRatingViewBlock(infoContainer, item, contentObj);
        helper.createDescriptionViewBlock(infoContainer, item, contentObj,
            popupElement, createDataView, index);

        popupElement.addElement(infoContainer);
    }

    // Create "add content window" after the click on the button Add content
    try {
        var addContent = document.getElementById('addContent');

        addEvent(addContent, 'click', function () {
            // Only authenticated users are able to add data, so
            // show log in window if the user is not logged
            if (!user.checkLogin) {
                userMenu.login();
            } else {
                var popupElement = new PopupBlock();
                contentObj.createAddContentView(popupElement);
            }
        });

    } catch (e) {
        console.log(e);
    }
}

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

function textModel(page, parameters) {

    helper.setShareMeta(page, 'Shofer content', 'Text page', 'img/logo.png');

    var title = document.querySelectorAll('h1.page-title')[0];
    title.innerHTML = 'Text page';

    var contentBlock = document.getElementById('contentBlock');
    var contentPagesBlocks = document.querySelectorAll('.pages');

    // Inputs for sorting, searching and filtering
    var searchInput = document.querySelectorAll('.input-block input')[0];
    var searchButton = document.querySelectorAll('.input-block button')[0];
    var sortSelect = document.querySelectorAll('.select-block .sort-by')[0];
    var categorySelect = document.querySelectorAll('.select-block .categories')[0];
    var multiSelect = new Multiselect(categorySelect, 'Categories');

    // Depending on the input parameters, set default values for INPUT
    // and prepare the object for filtering and sorting content
    var contentParameters = {};
    if (parameters.sortType && parameters.sortBy) {
        contentParameters.sort = parameters.sortBy + ' ' + parameters.sortType;

        var option = sortSelect.querySelectorAll('option[value="' + contentParameters.sort + '"]')[0];
        if (option) {
            option.selected = true;
        }
    }
    if (parameters.categories) {
        try {
            contentParameters.categories = JSON.parse(parameters.categories);
        } catch (e) {

        }
    }
    if (parameters.search) {
        contentParameters.search = parameters.search;
        searchInput.value = contentParameters.search;
    }

    // Create the content object
    try {
        var contentObj = new Text(contentBlock, contentPagesBlocks, contentParameters, function (content) {
            helper.forContentAction(content, createDataView, searchInput,
                sortSelect, multiSelect, searchButton, parameters);
        });

    } catch (e) {
        console.error(e);
    }

    // Actions when you click on the card content
    try {
        addEvent(contentBlock, 'click', function (event) {
            var target = getTarget(event);

            // Search for an element on which there was a click
            while (target !== contentBlock) {
                if (target.classList.contains('card-view-element')) {
                    var index = parseInt(target.getAttribute('data-index'));

                    // Creates popUp
                    var popupElement = new PopupBlock();
                    popupElement.onclose = function () {
                        // Clear the id parameter from the URL after closing popUp
                        delete parameters.id;
                        path.setParametersObj(parameters);
                        helper.setShareMeta(page, 'Shofer content', 'Text page', 'img/logo.png');
                    };

                    // Create HTML to view the content
                    createDataView(popupElement, index, contentObj);
                    return;
                }
                target = target.parentNode;
            }

        });

    } catch (e) {
        console.error(e);
    }

    function createDataView(popupElement, index, contentObj) {

        if (!index && index !== 0 || !popupElement) {
            return;
        }

        var dataLength = contentObj.allItems.length;
        var item = contentObj.allItems[index];

        // Add an id to URL parameters
        var sort = sortSelect.value;
        var categories = multiSelect.value;
        parameters = {
            sortBy: sort.split(' ')[0],
            sortType: sort.split(' ')[1],
            categories: JSON.stringify(categories),
            search: searchInput.value,
            id: item.id
        };
        path.setParametersObj(parameters);
        helper.setShareMeta(page + '?' + path.getParametersString(parameters), item.title, item.description, 'img/logo.png');

        // Clear all from popUp, it is needed when you go to the next content element
        popupElement.deleteAllData();

        // Create the content view
        var infoContainer = document.createElement('div');
        infoContainer.className = 'view-container clearfix';

        if (index > 0) {
            var prevButton = document.createElement('div');
            prevButton.className = 'prev-button';
            prevButton.innerHTML = '<i class="icon icon-left"></i>';
            prevButton.onclick = function () {
                createDataView(popupElement, index - 1, contentObj);
            };
            infoContainer.insertBefore(prevButton, null);
        }

        if (index < dataLength - 1) {
            var nextButton = document.createElement('div');
            nextButton.className = 'next-button';
            nextButton.innerHTML = '<i class="icon icon-right"></i>';
            nextButton.onclick = function () {
                createDataView(popupElement, index + 1, contentObj);
            };
            infoContainer.insertBefore(nextButton, null);
        }

        // Create a block containing the information about the content
        helper.createTitleViewBlock(infoContainer, item, contentObj);
        helper.createRatingViewBlock(infoContainer, item, contentObj);
        helper.createDescriptionViewBlock(infoContainer, item, contentObj,
            popupElement, createDataView, index);

        var dataContainer = contentObj.createTextView(index);
        popupElement.addElement(infoContainer);
        popupElement.addElement(dataContainer);
    }

    // Create "add content window" after the click on the button Add content
    try {
        var addContent = document.getElementById('addContent');

        addEvent(addContent, 'click', function () {
            // Only authenticated users are able to add data, so
            // show log in window if the user is not logged
            if (!user.checkLogin) {
                userMenu.login();
            } else {
                var popupElement = new PopupBlock();
                contentObj.createAddContentView(popupElement);
            }
        });

    } catch (e) {
        console.log(e);
    }
}

function videoModel(page, parameters) {

    helper.setShareMeta(page, 'Shofer content', 'Video page', 'img/logo.png');

    var title = document.querySelectorAll('h1.page-title')[0];
    title.innerHTML = 'Video page';

    var contentBlock = document.getElementById('contentBlock');
    var contentPagesBlocks = document.querySelectorAll('.pages');

    // Inputs for sorting, searching and filtering
    var searchInput = document.querySelectorAll('.input-block input')[0];
    var searchButton = document.querySelectorAll('.input-block button')[0];
    var sortSelect = document.querySelectorAll('.select-block .sort-by')[0];
    var categorySelect = document.querySelectorAll('.select-block .categories')[0];
    var multiSelect = new Multiselect(categorySelect, 'Categories');

    // Depending on the input parameters, set default values for INPUT
    // and prepare the object for filtering and sorting content
    var contentParameters = {};
    if (parameters.sortType && parameters.sortBy) {
        contentParameters.sort = parameters.sortBy + ' ' + parameters.sortType;

        var option = sortSelect.querySelectorAll('option[value="' + contentParameters.sort + '"]')[0];
        if (option) {
            option.selected = true;
        }
    }
    if (parameters.categories) {
        try {
            contentParameters.categories = JSON.parse(parameters.categories);
        } catch (e) {

        }
    }
    if (parameters.search) {
        contentParameters.search = parameters.search;
        searchInput.value = contentParameters.search;
    }

    // Create the content object
    try {
        var contentObj = new Video(contentBlock, contentPagesBlocks, contentParameters, function (content) {
            helper.forContentAction(content, createDataView, searchInput,
                sortSelect, multiSelect, searchButton, parameters);
        });

    } catch (e) {
        console.error(e);
    }

    // Actions when you click on the card content
    try {
        addEvent(contentBlock, 'click', function (event) {
            var target = getTarget(event);

            // Search for an element on which there was a click
            while (target !== contentBlock) {
                if (target.classList.contains('card-video-element')) {
                    var index = parseInt(target.getAttribute('data-index'));

                    // Creates popUp
                    var popupElement = new PopupBlock();
                    popupElement.onclose = function () {
                        // Clear the id parameter from the URL after closing popUp
                        delete parameters.id;
                        path.setParametersObj(parameters);
                        helper.setShareMeta(page, 'Shofer content', 'Video page', 'img/logo.png');
                    };

                    // Create HTML to view the content
                    createDataView(popupElement, index, contentObj);
                    return;
                }
                target = target.parentNode;
            }

        });

    } catch (e) {
        console.error(e);
    }

    function createDataView(popupElement, index, contentObj) {

        if (!index && index !== 0 || !popupElement) {
            return;
        }

        var dataLength = contentObj.allItems.length;
        var item = contentObj.allItems[index];

        // Add an id to URL parameters
        var sort = sortSelect.value;
        var categories = multiSelect.value;
        parameters = {
            sortBy: sort.split(' ')[0],
            sortType: sort.split(' ')[1],
            categories: JSON.stringify(categories),
            search: searchInput.value,
            id: item.id
        };
        path.setParametersObj(parameters);
        helper.setShareMeta(page + '?' + path.getParametersString(parameters), item.title, item.description, contentObj.getPoster(item));

        // Clear all from popUp, it is needed when you go to the next content element
        popupElement.deleteAllData();

        // Create the content view
        var infoContainer = document.createElement('div');
        infoContainer.className = 'view-container clearfix';
        infoContainer.innerHTML = '<p class="pages-info">' + (index + 1) + ' of ' + dataLength + '</p>';

        if (index > 0) {
            var prevButton = document.createElement('div');
            prevButton.className = 'prev-button';
            prevButton.innerHTML = '<i class="icon icon-left"></i>';
            prevButton.onclick = function () {
                createDataView(popupElement, index - 1, contentObj);
            };
            infoContainer.insertBefore(prevButton, null);
        }

        if (index < dataLength - 1) {
            var nextButton = document.createElement('div');
            nextButton.className = 'next-button';
            nextButton.innerHTML = '<i class="icon icon-right"></i>';
            nextButton.onclick = function () {
                createDataView(popupElement, index + 1, contentObj);
            };
            infoContainer.insertBefore(nextButton, null);
        }

        // Create a block containing the information about the content
        helper.createTitleViewBlock(infoContainer, item, contentObj);
        helper.createRatingViewBlock(infoContainer, item, contentObj);
        helper.createDescriptionViewBlock(infoContainer, item, contentObj,
            popupElement, createDataView, index);

        var dataContainer = contentObj.createVideoView(index);
        popupElement.addElement(dataContainer);
        popupElement.addElement(infoContainer);

    }

    // Create "add content window" after the click on the button Add content
    try {
        var addContent = document.getElementById('addContent');

        addEvent(addContent, 'click', function () {
            // Only authenticated users are able to add data, so
            // show log in window if the user is not logged
            if (!user.checkLogin) {
                userMenu.login();
            } else {
                var popupElement = new PopupBlock();
                contentObj.createAddContentView(popupElement);
            }
        });

    } catch (e) {
        console.log(e);
    }
}