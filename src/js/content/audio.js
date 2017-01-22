
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