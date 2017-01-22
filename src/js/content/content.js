
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
