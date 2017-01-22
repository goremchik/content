
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