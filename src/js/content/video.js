
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
