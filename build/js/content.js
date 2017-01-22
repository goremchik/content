
/*
 An object to work with an audio content

 Constructor: Audio(contentBlock, pagesBlocks, params, callback)
 contentBlock - HTML block for the content
 pagesBlocks - HTML navigation block
 params = {
     sort - sort type (string)
     categories - an array of an id categories
     search - a substring for content filtering
 }
 callback - 'this' from current object is transmitted to the callback

 Methods:
 createElement(item, index) - creates an item for the content block
 item - content element
 index - content element position

 setContent() - fills in the content page
 createAudioView(index)- creates ablock to display the content element
 index - content element position

 createAddContentElement() - creates a block to add content
 checkAddContentFiles(title, description, category, audioBlock, callback) - checks the added content
 category - an array of the category IDs
 audioBlock - a block for displaying the downloaded content

 addElement(title, description, category, file, callback)
 category - an array of the category IDs
 file - file name
 */

function Audio(contentBlock, pagesBlocks, params, callback) {

    if (!contentBlock || !isElement(contentBlock)) {
        throw new Error("Cant find content block!");
    }

    if (isElement(pagesBlocks)) {
        pagesBlocks = [pagesBlocks];
    }

    Content.call(this, 'audio', params, contentBlock);

    this.createElement = function (item, index) {
        return helper.createHtmlElement({
            tag: 'div',
            className: 'card-view-element',
            attributes: {'data-id': item.id, 'data-index': index},
            html: '<h2 class="card-title">' + item.title + '</h2>' +
                '<div class="centered card-icon"><i class="icon music"></i></div>' +
                '<p class="card-description">' + item.description + '</p>' +
                '<p class="card-rating"><i class="icon star-full"></i> ' + item.rating.toFixed(2) + '</p>' +
                '<p class="card-votes"><i class="icon user"></i> ' + item.votesCount + '</p>'
        });
    };

    this.setContent = function () {

        contentBlock.innerHTML = '';

        for (var i = 0; i < this.itemsOnPage.length; i++) {
            var element = this.createElement(this.itemsOnPage[i], i + (this.currentPage - 1) * this.numberItemsOnPage);
            contentBlock.insertBefore(element, null);
        }

        if (pagesBlocks) {
            for (i = 0; i < pagesBlocks.length; i++) {
                this.createPageButtons(pagesBlocks[i]);
            }
        }

        try {
            if (document.body.scrollTop !== 0) {
                $("body").animate({scrollTop: 0}, "fast");
            }
        } catch (e) {
            document.body.scrollTop = 0;
        }
    };

    this.createAudioView = function (index) {
        var item = this.allItems[index];
        if (!item) {
            return;
        }

        var element = helper.createElement(null, 'div', 'view-container clearfix', '');
        var file = this.getElementSrc(item);
        helper.createAudio(element, file);
        return element;
    };


    this.createAddContentElement = function () {
        var container = document.createElement('div');
        var uploaderBlock = helper.createElement(container, 'div');
        var fileInput = helper.createInput(container, 'hidden', '', 'audio-name');

        var uploder = new FileUploader(uploaderBlock, "audio/*", "audio", "Upload audio", function (fileName) {
            uploaderBlock.style.display = 'none';
            fileInput.value = fileName;

            var audioBlock = helper.createElement(container, 'div', 'audio-preview', '');
            helper.createAudio(audioBlock, '/files/audio/' + fileName);

            var deleteButton = helper.createButton(audioBlock, 'dark delete', 'Delete file');
            addEvent(deleteButton, 'click', function () {
                container.removeChild(audioBlock);
                uploaderBlock.style.display = 'block';
                fileInput.value = '';
                uploder.reinit();
            });
        });

        return container;
    };

    this.checkAddContentFiles = function (title, description, category, audioBlock, callback) {
        var input = audioBlock.querySelectorAll('input[name=audio-name]')[0];

        if (!input || !input.value) {
            try {
                new Notification('Audio is not uploaded', 'error');
            } catch (e) {}
            return;
        }

        this.addElement(title, description, category,input.value, callback);
    };

    this.addElement = function (title, description, category, file, callback) {
        if (!file || !title) {
            try {
                new Notification('Not all data', 'error');
            } catch (e) {
            }
            return;
        }

        var item = {
            id: data.generateId(),
            title: title,
            fileName: file,
            description: description,
            ownerId: user.id,
            created: new Date(),
            votesCount: 0,
            rating: 0,
            comments: [],
            category: category
        };

        this.addContentItem(item, callback);
    };

    this.pathToFiles = '/files/audio/';
    this.init(this.params, callback);
}

Audio.prototype = Object.create(Content.prototype);
Audio.prototype.constructor = Audio;

/*
 An object to work with a content

 Constructor: Content(type, params, contentBlock)
 type - content type ("images", "audio", "video", "text")
 params = {
     sort - sort type (string)
     categories - an array of id categories
     search - a substring for content filtering
 }
 contentBlock - HTML block for the content

 Methods:
 search(keyWord) - searches the content with a pointed substring in the title or description
 keyWord - needed substring

 filter(categories) - Content filtering on specified categories
 categories = ["1", "2"] - an array of id categories

 sort(sortString) - content sorting
 sortString = "popularity -1"
 (popularity - field by which to sort, -1 - desc)

 changeItemField(item, field, value, callback) - changes an element field
 item - content element
 field - editable field
 value - field value

 deleteItem(obj, callback) - deletes the content element
 obj - content element

 getIndexById(id) - looks for the content element by it's id
 id - element id
 return item(content element)

 addContentItem(item, callback) - to add content element
 item - content element

 getItemsOnPage(page) - prepares the content for a specified page
 page - page number

 nextPage() - prepares the content for a next page
 previousPage() - prepares the content for a previous page

 getElementSrc(element) - gets the name of the content element file
 element - content element

 init(params, callback) - init all conyent data
 params = {
     sort - sort type (string)
     categories - an array of id categories
     search - a substring for content filtering
 }

 changeRating(newRating, item, callback) - change the rating with the new voices specified
 newRating - new rating
 item - content element

 createAddContentView(popupElement) - creates a block for adding content
 popupElement - popUp item

 setBest() - Display 3 first content item
 createElement(item, index) -  create a content card (It is necessary to announce to the child constructor)
 createAddContentElement() - creates a block for adding content (It is necessary to announce to the child constructor)
 checkAddContentFiles(title, description, category, audioBlock, callback) - checks the added content (It is necessary to announce to the child constructor)
 */

function Content(type, params, contentBlock) {

    if (!data && typeof data !== 'object') {
        throw new Error("Cant can't find data object!");
    }

    // Parameters for content filtering and sorting
    this.params = {};
    this.params.sort = params.sort || 'created -1';
    this.params.search = params.search || '';
    this.params.categories = params.categories || [];

    this.type = type || 'text';   // Content type
    this.itemsOnPage = [];        // An array of elements on the current page
    this.numberItemsOnPage = 10;
    this.currentPage = 1;
    this.numberOfPages = 1;       // Number of pages with a content

    // The maximum number of votes for the content (it is needed to sort by popularity correctly)
    this.maxVoteCount = 1;
    this.categories = [];
    this.createElement = function () {};
    this.checkAddContentFiles = function () {};

    this.search = function (keyWord) {
        // Do not filter if you don't have the required substring or content elements
        if (!keyWord || !this.allItems.length) {
            return;
        }

        var elements = this.allItems;
        var seachContent = [];

        for (var i = 0; i < elements.length; i++) {
            var title = elements[i].title || '';
            var description = elements[i].description || '';
            // It adds content, which has the same title or description
            if (title.indexOf(keyWord) > -1 || description.indexOf(keyWord) > -1) {
                seachContent.push(elements[i]);
            }
        }

        this.allItems = seachContent;
    };

    this.filter = function (categories) {
        // Do nothing if the categories are not specified
        if (categories.length === 0 || !this.allItems.length) {
            return;
        }

        for (var i = 0; i < categories.length; i++) {
            categories[i] = parseInt(categories[i]);
        }

        var items = this.allItems;
        this.allItems = [];
        for (i = 0; i < items.length; i++) {
            if (categories.indexOf(items[i]['category']) > -1) {
                this.allItems.push(items[i]);
            }
        }
    };

    this.sort = function (sortString) {
        //  Do nothing if there is no sorting string
        if (!this.allItems.length || !sortString) {
            return;
        }

        var elements = sortString.split(' ');
        var field = elements[0];

        if (this.allItems[0][field] === undefined) {
            return;
        }

        var order = parseInt(elements[1]);
        order = order === -1 ? -1 : 1;

        this.allItems = this.allItems.sort(function (element1, element2) {
            if (element1[field] > element2[field]) {
                return order;
            } else if (element1[field] < element2[field]) {
                return -1 * order;
            } else {
                return 0;
            }
        });
    };
    
    this.changeItemField = function (item, field, value, callback) {
        data.changeItem(this.type, item.id, field, value, callback);
    };

    this.deleteItem = function (obj, callback) {
        data.deleteItem(this.type, obj, callback);
    };

    this.getIndexById = function (id) {
        id = parseInt(id);
        console.log(this);
        for (var i = 0; i < this.allItems.length; i++) {
            if (this.allItems[i].id === id) {
                return i;
            }
        }
        return -1;
    };

    // Calculates the maximum value of the votes of all content items
    var getMaxVotesCount = function () {
        for (var i = 0; i < this.allItems.length; i++) {
            if (this.allItems[i].votesCount > this.maxVoteCount) {
                this.maxVoteCount = this.allItems[i].votesCount;
            }
        }
    }.bind(this);

    // Calculates the popularity of the content item
    var countPopularity = function (rating, votesCount) {
        function log(base, value) {
            return Math.log(value) / Math.log(base);
        }
        var base = Math.pow(this.maxVoteCount, 0.1);

        return (log(base, votesCount) + 2 * rating) / 4;
    }.bind(this);

    // Creates the popularity field for the content elements
    var createPopularity = function () {
        getMaxVotesCount();

        for (var i = 0; i < this.allItems.length; i++) {
            this.allItems[i].popularity = countPopularity(this.allItems[i].rating, this.allItems[i].votesCount);
        }
    }.bind(this);

    this.addContentItem = function (item, callback) {
        data.add(type, item, function () {
            this.init(this.params);
            this.setContent();

            if (typeof callback === 'function') {
                callback();
            }
        }.bind(this));
    };

    this.getItemsOnPage = function (page) {
        this.currentPage = this.numberOfPages < page ? this.numberOfPages : page;
        this.currentPage = 1 > page ? 1 : page;

        if (this.currentPage === this.numberOfPages) {
            this.itemsOnPage = this.allItems.slice((this.currentPage - 1) * this.numberItemsOnPage);
        } else {
            this.itemsOnPage = this.allItems.slice((this.currentPage - 1) * this.numberItemsOnPage, this.currentPage * this.numberItemsOnPage);
        }

        this.setContent();
    };

    this.nextPage = function () {
        if (this.currentPage < this.numberOfPages) {
            this.getItemsOnPage(this.currentPage + 1);
        }
    };

    this.previousPage = function () {
        if (this.currentPage > 1) {
            this.getItemsOnPage(this.currentPage - 1);
        }
    };

    // Create navigation buttons for the content
    var createNavButton = function (type, icon, limit, func, block) {
        var button = helper.createElement(block, 'div', 'page-button ' + type);

        if (this.currentPage !== limit) {
            button.onclick = func.bind(this);
            button.innerHTML = '<i class="icon ' + icon + '"></i>';
        } else {
            button.style.cursor = 'default';
        }

    }.bind(this);

    // Create a button for page switching
    var createPageNumber = function (number, block) {
        if (number > this.numberOfPages || number < 1) {
            return;
        }

        var element = helper.createElement(block, 'span', 'page-button', number);
        if (number !== this.currentPage) {
            element.onclick = this.getItemsOnPage.bind(this, number);
        } else {
            element.className += ' current-page';
        }
    }.bind(this);

    this.createPageButtons = function (block) {
        block.innerHTML = '';

        if (this.numberOfPages <= 1) {
            return;
        }

        createNavButton('next', 'icon-right', this.numberOfPages, this.nextPage, block);
        createNavButton('prev', 'icon-left', 1, this.previousPage, block);

        // If the page number is less than 8 then display all pages for the navigation
        if (this.numberOfPages <= 7) {
            for (var i = 1; i <= this.numberOfPages; i++) {
                createPageNumber(i, block);
            }
        } else {
            var dots = helper.createElement(null, 'span', '', '...');

            if (this.currentPage > 2) {
                createPageNumber(1, block);
                if (this.currentPage > 3) {
                    block.insertBefore(dots.cloneNode(true), null);

                }
            }

            if (this.currentPage >= this.numberOfPages - 1) {
                if (this.currentPage === this.numberOfPages) {
                    createPageNumber(this.currentPage - 3, block);
                }
                createPageNumber(this.currentPage - 2, block);
            }

            if (this.currentPage - 1 >= 1) {
                createPageNumber(this.currentPage - 1, block);
            }
            createPageNumber(this.currentPage, block);
            if (this.currentPage + 1 <= this.numberOfPages) {
                createPageNumber(this.currentPage + 1, block);
            }

            if (this.currentPage <= 2) {
                createPageNumber(this.currentPage + 2, block);
                if (this.currentPage === 1) {
                    createPageNumber(this.currentPage + 3, block);
                }
            }

            if (this.currentPage < this.numberOfPages - 1) {

                if (this.currentPage < this.numberOfPages - 2) {
                    block.insertBefore(dots.cloneNode(true), null);
                }
                createPageNumber(this.numberOfPages, block);
            }
        }
    };

    this.getElementSrc = function (element) {
        return this.pathToFiles + element.fileName;
    };

    this.init = function (params, callback) {

        this.params = params;
        data.get(this.type, function (elements) {

            this.allItems = elements;
            createPopularity();

            // Content filtering and sorting
            this.filter(params.categories);
            this.search(params.search);
            this.sort(params.sort);

            this.numberOfPages = Math.ceil(this.allItems.length / this.numberItemsOnPage);
            this.currentPage = 1;
            this.getItemsOnPage(this.currentPage);

            if (typeof callback === 'function') {
                callback(this);
            }
        }.bind(this));

        data.get(type + 'Categories', function (data) {
            this.categories = data;
        }.bind(this));
    };

    this.changeRating = function (newRating, item, callback) {
        if (typeof callback !== 'function') {
            callback = function () {
            }
        }

        // If there are no votes, match the new rating as current one
        if (item.votesCount > 0) {
            var votes = item.votesCount + 1;
            var rating = newRating / item.votesCount + item.rating - item.rating / item.votesCount;
        } else {
            votes = 1;
            rating = newRating;
        }

        // Update an element in database
        data.changeItem(type, item.id, 'rating', rating, function () {
            data.changeItem(type, item.id, 'votesCount', votes, function () {
                item.votesCount = votes;
                item.rating = rating;

                if (typeof callback === 'function') {
                    callback();
                }
            }.bind(this));
        }.bind(this));

        callback(true);
    };

    this.createAddContentView = function (popupElement) {
        var block = helper.createElement(null, 'div','view-container clearfix');

        helper.createLabel(block, 'Title:');
        var title = helper.createInput(block, 'text', 'Title');

        helper.createLabel(block, 'Description:');
        var description = helper.createTextarea(block);

        helper.createLabel(block, 'Category:');
        var category = helper.createSelect(block, this.categories);

        var uploadElement = this.createAddContentElement();
        block.insertBefore(uploadElement, null);

        var confirm = helper.createButton(block, 'light', 'Add data');

        // Actions on click 'Add data' button
        addEvent(confirm, 'click', function () {
            if(!title.value) {
                new Notification('Title is empty!', 'error');
                return;
            }

            this.checkAddContentFiles(title.value, description.value, category.value, uploadElement, function () {
                popupElement.closeElement();
            });
        }.bind(this));

        popupElement.addElement(block);
    };

    this.setBest = function () {
        var countOfBestContent = 3;
        contentBlock.innerHTML = '';
        for (var i = 0; i < countOfBestContent; i++) {
            contentBlock.insertBefore(this.createElement(this.allItems[i], i), null);
        }


    };
}


/*
 An object to work with an audio content

 Constructor: Images(contentBlock, pagesBlocks, params, callback)
 contentBlock - HTML block for the content
 pagesBlocks - HTML navigation block
 params = {
 sort - sort type (string)
 categories - an array of an id categories
 search - a substring for content filtering
 }
 callback - 'this' from current object is transmitted to the callback

 Methods:
 createElement(item, index) - creates an item for the content block
 item - content element
 index - content element position

 setContent() - fills in the content page
 createAudioView(index)- creates ablock to display the content element
 index - content element position

 createAddContentElement() - creates a block to add content
 checkAddContentFiles(title, description, category, imageBlock, callback) - checks the added content
 category - an array of the category IDs
 imageBlock - a block for displaying the downloaded content

 addElement(title, description, category, file, callback)
 category - an array of the category IDs
 file - file name
 */

function Images(contentBlock, pagesBlocks, params, callback) {

    if (!contentBlock || !isElement(contentBlock)) {
        throw new Error("Cant find content block!");
    }

    if (isElement(pagesBlocks)) {
        pagesBlocks = [pagesBlocks];
    }

    Content.call(this, 'images', params, contentBlock);

    this.createElement = function (item, index) {
        var element = document.createElement('div');
        element.className = 'image-element';
        element.setAttribute('data-id', item.id);
        element.setAttribute('data-index', index);

        var img = document.createElement('img');
        img.src = this.getElementSrc(item);
        img.alt = item.title;

        if (typeof getElementHeight === 'function' && typeof getElementWidth === 'function') {
            img.onload = function () {
                var height = getElementHeight(img);
                var width = getElementWidth(img);

                if (width > height) {
                    img.style.height = '100%';
                    img.style.width = 'auto';
                    img.style.marginLeft = (height - width) / 2 + 'px';
                } else if (width < height) {
                    img.style.height = 'auto';
                    img.style.width = '100%';
                    img.style.marginTop = (width - height) / 2 + 'px';
                }
            };
        }

        element.insertBefore(img, null);
        return element;
    };

    this.setContent = function () {
        contentBlock.innerHTML = '';

        for (var i = 0; i < this.itemsOnPage.length; i++) {
            var element = this.createElement(this.itemsOnPage[i], i + (this.currentPage - 1) * this.numberItemsOnPage);

            contentBlock.insertBefore(element, null);
        }

        if (pagesBlocks) {
            for (var i = 0; i < pagesBlocks.length; i++) {
                this.createPageButtons(pagesBlocks[i]);
            }
        }

        try {
            if (document.body.scrollTop !== 0) {
                $("body").animate({scrollTop: 0}, "fast");
            }
        } catch (e) {
            document.body.scrollTop = 0;
        }
    };

    this.createImgView = function (index) {

        var item = this.allItems[index];
        if (!item) {
            return;
        }

        var elementsObj = {};

        elementsObj.container = document.createElement('div');
        elementsObj.container.className = 'content-view';

        if (index > 0) {
            elementsObj.prevButton = createViewNavButton('prev-button', index, 'icon-left');
            elementsObj.container.insertBefore(elementsObj.prevButton, null);
        }
        if (index < this.allItems.length - 1) {
            elementsObj.nextButton = createViewNavButton('next-button', index, 'icon-right');
            elementsObj.container.insertBefore(elementsObj.nextButton, null);
        }

        var img = document.createElement('img');
        img.className = 'image-view-element';
        img.src = this.getElementSrc(item);
        img.alt = item.title;
        elementsObj.container.insertBefore(img, null);

        return elementsObj;
    };

    this.createAddContentElement = function () {
        var container = document.createElement('div');
        var uploaderBlock = document.createElement('div');
        container.insertBefore(uploaderBlock, null);

        var fileInput = document.createElement('input');
        fileInput.type = 'hidden';
        fileInput.name = 'image-name';
        container.insertBefore(fileInput, null);

        var uploder = new FileUploader(uploaderBlock, "image/*", "images", "Upload image",function (fileName) {
            uploaderBlock.style.display = 'none';
            fileInput.value = fileName;

            var imgBlock = document.createElement('div');
            imgBlock.className = 'image-preview';
            imgBlock.innerHTML = '<img src="' + '/files/images/' + fileName + '">';

            var deleteButton = document.createElement('button');
            deleteButton.className = 'btn dark delete';
            deleteButton.innerHTML = 'Delete file';

            addEvent(deleteButton, 'click', function () {
                container.removeChild(imgBlock);
                uploaderBlock.style.display = 'block';
                fileInput.value = '';
                uploder.reinit();
            });

            imgBlock.insertBefore(deleteButton, null);
            container.insertBefore(imgBlock, null);

        });

        return container;
    };

    this.checkAddContentFiles = function (title, description, category, imageBlock, callback) {
        var input = imageBlock.querySelectorAll('input[name=image-name]')[0];

        if (!input || !input.value) {
            try {
                new Notification('File is not uploaded', 'error');
            } catch (e) {}
            return;
        }

        this.addElement(title, description, category,input.value, callback);
    };

    this.addElement = function (title, description, category, file, callback) {
        if (!file || !title) {
            try {
                new Notification('Not all data', 'error');
            } catch (e) {
            }
            return;
        }

        var item = {
            id: data.generateId(),
            title: title,
            fileName: file,
            description: description,
            ownerId: user.id,
            created: new Date(),
            votesCount: 0,
            rating: 0,
            comments: [],
            category: category
        };

        this.addContentItem(item, callback);
    };

    function createViewNavButton(buttonClass, index, iconClass) {
        return helper.createHtmlElement({
            tag: 'div',
            className: buttonClass,
            html: '<i class="icon ' + iconClass + '"></i>',
            attributes: {'data-index': index}
        });
    }

    this.pathToFiles = '/files/images/';
    this.init(this.params, callback);

}

Images.prototype = Object.create(Content.prototype);
Images.prototype.constructor = Images;

/*
 An object to work with an audio content

 Constructor: Text(contentBlock, pagesBlocks, params, callback)
 contentBlock - HTML block for the content
 pagesBlocks - HTML navigation block
 params = {
 sort - sort type (string)
 categories - an array of an id categories
 search - a substring for content filtering
 }
 callback - 'this' from current object is transmitted to the callback

 Methods:
 createElement(item, index) - creates an item for the content block
 item - content element
 index - content element position

 setContent() - fills in the content page
 createAudioView(index)- creates ablock to display the content element
 index - content element position

 createAddContentElement() - creates a block to add content
 checkAddContentFiles(title, description, category, textBlock, callback) - checks the added content
 category - an array of the category IDs
 textBlock - a block for displaying the downloaded content

 addElement(title, description, category, text, callback)
 category - an array of the category IDs
 text - added text
 */

function Text(contentBlock, pagesBlocks, params, callback) {
    if (!contentBlock || !isElement(contentBlock)) {
        throw new Error("Cant find content block!");
    }

    if (isElement(pagesBlocks)) {
        pagesBlocks = [pagesBlocks];
    }

    Content.call(this, 'text', params, contentBlock);

    this.createElement = function (item, index) {
        return helper.createHtmlElement({
            tag: 'div',
            className: 'card-view-element',
            attributes: {'data-id': item.id, 'data-index': index},
            html: '<h2 class="card-title">' + item.title + '</h2>' +
                '<div class="centered card-icon"><i class="icon newspaper"></i></div>' +
                '<p class="card-description">' + item.description + '</p>' +
                '<p class="card-rating"><i class="icon star-full"></i> ' + item.rating.toFixed(2) + '</p>' +
                '<p class="card-votes"><i class="icon user"></i> ' + item.votesCount + '</p>'
        });
    };

    this.setContent = function () {
        contentBlock.innerHTML = '';

        for (var i = 0; i < this.itemsOnPage.length; i++) {
            var element = this.createElement(this.itemsOnPage[i], i + (this.currentPage - 1) * this.numberItemsOnPage);

            contentBlock.insertBefore(element, null);
        }

        if (pagesBlocks) {
            for (var i = 0; i < pagesBlocks.length; i++) {
                this.createPageButtons(pagesBlocks[i]);
            }
        }

        try {
            if (document.body.scrollTop !== 0) {
                $("body").animate({scrollTop: 0}, "fast");
            }
        } catch (e) {
            document.body.scrollTop = 0;
        }
    };

    this.createTextView = function (index) {
        var item = this.allItems[index];
        if (!item) {
            return;
        }

        return helper.createHtmlElement({
            tag: 'div',
            className: 'view-container clearfix',
            html: '<p class="pages-info">' + (index + 1) + ' of ' + this.allItems.length + '</p>' +
                '<pre class="text-content">' + item.text + '</pre>'
        });
    };

    this.createAddContentElement = function () {
        var container = document.createElement('div');
        var uploaderBlock = helper.createElement(container, 'div');

        helper.createLabel(container, 'Text:');
        var textInput = helper.createTextarea(container, 'text-block');
        textInput.className += ' text-block';

        return container;
    };

    this.checkAddContentFiles = function (title, description, category, textBlock, callback) {
        var input = textBlock.querySelectorAll('textarea[name=text-block]')[0];
        if (!input || !input.value) {
            try {
                new Notification('Text field is empty', 'error');
            } catch (e) {}
            return;
        }

        this.addElement(title, description, category, input.value, callback);
    };

    this.addElement = function (title, description, category, text, callback) {
        if (!text || !title) {
            try {
                new Notification('Not all data', 'error');
            } catch (e) {
            }
            return;
        }

        var item = {
            id: data.generateId(),
            title: title,
            text: text,
            description: description,
            ownerId: user.id,
            created: new Date(),
            votesCount: 0,
            rating: 0,
            comments: [],
            category: category
        };

        this.addContentItem(item, callback);
    };

    this.init(this.params, callback);
}

Text.prototype = Object.create(Content.prototype);
Text.prototype.constructor = Text;

/*
 An object to work with an audio content

 Constructor: Audio(contentBlock, pagesBlocks, params, callback)
 contentBlock - HTML block for the content
 pagesBlocks - HTML navigation block
 params = {
 sort - sort type (string)
 categories - an array of an id categories
 search - a substring for content filtering
 }
 callback - 'this' from current object is transmitted to the callback

 Methods:
 createElement(item, index) - creates an item for the content block
 item - content element
 index - content element position

 setContent() - fills in the content page
 createAudioView(index)- creates ablock to display the content element
 index - content element position

 createAddContentElement() - creates a block to add content
 checkAddContentFiles(title, description, category, inputsBlock, callback) - checks the added content
 category - an array of the category IDs
 inputsBlock - a block for displaying the downloaded content (video and poster)

 addElement(title, description, category, file, poster, callback)
 category - an array of the category IDs
 file - file name
 poster - poster name
 */

function Video(contentBlock, pagesBlocks, params, callback) {

    if (!contentBlock || !isElement(contentBlock)) {
        throw new Error("Cant find content block!");
    }

    if (isElement(pagesBlocks)) {
        pagesBlocks = [pagesBlocks];
    }

    var defaultPoster = 'default.png';

    Content.call(this, 'video', params, contentBlock);

    this.getPoster = function (element) {
        return this.pathToFiles + element.poster;
    };

    this.createElement = function (item, index) {
        return helper.createHtmlElement({
            tag: 'div',
            className: 'card-video-element',
            attributes: {'data-index': index, 'data-id': item.id},
            html: '<div class="card-poster"><img src="' + this.getPoster(item) + '" alt="' + item.title + '">' +
                '<i class="icon play-circle card-icon"></i></div>' +
                '<h2 class="card-title">' + item.title + '</h2>'
        });
    };

    this.setContent = function () {
        contentBlock.innerHTML = '';

        for (var i = 0; i < this.itemsOnPage.length; i++) {
            var element = this.createElement(this.itemsOnPage[i], i + (this.currentPage - 1) * this.numberItemsOnPage);

            contentBlock.insertBefore(element, null);
        }

        if (pagesBlocks) {
            for (i = 0; i < pagesBlocks.length; i++) {
                this.createPageButtons(pagesBlocks[i]);
            }
        }

        try {
            if (document.body.scrollTop !== 0) {
                $("body").animate({scrollTop: 0}, "fast");
            }
        } catch (e) {
            document.body.scrollTop = 0;
        }
    };

    this.createVideoView = function (index) {

        var item = this.allItems[index];
        if (!item) {
            return;
        }

        var element = helper.createElement(null, 'div', 'view-video-container clearfix');
        var file = this.getElementSrc(item);
        var poster = this.getPoster(item);
        helper.createVideo(element, file, poster);
        return element;
    };

    this.createAddContentElement = function () {
        var container = document.createElement('div');
        var posterUploadBlock = helper.createElement(container, 'div');
        var uploaderBlock = helper.createElement(container, 'div');

        var fileInput = helper.createInput(container, 'hidden', '', 'video-name');
        var posterInput = helper.createInput(container, 'hidden', '', 'poster-name');

        var uploder = new FileUploader(uploaderBlock, "video/*", "video", "Upload video",function (fileName) {
            uploaderBlock.style.display = 'none';
            fileInput.value = fileName;

            var videoBlock = helper.createElement(container, 'div', 'video-preview');
            helper.createVideo(videoBlock, '/files/video/' + fileName, '');

            var deleteButton = helper.createButton(videoBlock, 'dark delete', 'Delete file');
            addEvent(deleteButton, 'click', function () {
                container.removeChild(videoBlock);
                uploaderBlock.style.display = 'block';
                fileInput.value = '';
                uploder.reinit();
            });

            videoBlock.insertBefore(deleteButton, null);
        });

        var posterUploder = new FileUploader(posterUploadBlock, "image/*", "video/poster", "Upload poster", function (fileName) {
            posterUploadBlock.style.display = 'none';
            posterInput.value = fileName;

            var imgBlock = helper.createElement(container, 'div', 'poster-preview');
            imgBlock.innerHTML = '<img src="' + '/files/video/poster/' + fileName + '">';

            var deleteButton = helper.createButton(imgBlock, 'dark delete', 'Delete file');
            addEvent(deleteButton, 'click', function () {
                container.removeChild(imgBlock);
                posterUploadBlock.style.display = 'block';
                fileInput.value = '';
                posterUploder.reinit();
            });

            imgBlock.insertBefore(deleteButton, null);
            container.insertBefore(imgBlock, posterUploadBlock);

        });

        return container;
    };

    this.checkAddContentFiles = function (title, description, category, inputsBlock, callback) {
        var input = inputsBlock.querySelectorAll('input[name=video-name]')[0];
        var poster =  inputsBlock.querySelectorAll('input[name=poster-name]')[0];

        if (!input || !input.value) {
            try {
                new Notification('Video is not uploaded', 'error');
            } catch (e) {}
            return;
        }

        if (!poster || !poster.value) {
            poster.value = defaultPoster;
        }

        this.addElement(title, description, category, input.value, poster.value, callback);
    };

    this.addElement = function (title, description, category, file, poster, callback) {
        if (!file || !title) {
            try {
                new Notification('Not all data', 'error');
            } catch (e) {
            }
            return;
        }

        var item = {
            id: data.generateId(),
            title: title,
            fileName: file,
            description: description,
            poster: 'poster/' + poster,
            ownerId: user.id,
            created: new Date(),
            votesCount: 0,
            rating: 0,
            comments: [],
            category: category
        };

        this.addContentItem(item, callback);
    };

    this.pathToFiles = '/files/video/';
    this.init(this.params, callback);
}

Video.prototype = Object.create(Content.prototype);
Video.prototype.constructor = Video;
