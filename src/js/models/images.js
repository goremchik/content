
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