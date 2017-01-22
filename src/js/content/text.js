
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