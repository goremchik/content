/**
 * Created by Goremchik on 2016-12-07.
 */

function Content(type, numberItemsOnPage, currentPage) {

    this.type = type || 'text';
    this.allItems = data.get(this.type) || [];
    this.itemsOnPage = [];
    this.numberItemsOnPage = numberItemsOnPage || 10;
    this.currentPage = currentPage || 1;
    this.numberOfPages = Math.ceil(this.allItems.length / this.numberItemsOnPage);

    this.search = function (keyWord) {
        var elements = this.allItems;
        if (!keyWord || !elements) {
            return elements;
        }

        var seachContent = [];
        for (var i = 0; i < elements.length; i++) {
            var title = elements[i].title || '';
            var description = elements[i].description || '';
            if (title.indexOf(keyWord) > -1 || description.indexOf(keyWord) > -1) {
                seachContent.push(data[i]);
            }
        }

        return seachContent;
    };

    this.filter = function(categoryId) {
        var items = data.get(this.type) || [];

        if (!categoryId) {
            this.allItems = items;
            return;
        }

        this.allItems = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i]['category'] === categoryId) {
                this.allItems.push(items[i]);
            }
        }
    };

    this.getItemsOnPage = function (page) {
        this.currentPage = this.numberOfPages < page ? this.numberOfPages : page;
        this.currentPage = 1 > page ? 1 : page;

        if (this.currentPage === this.numberOfPages) {
            this.itemsOnPage = this.allItems.slice((this.currentPage - 1) * this.numberItemsOnPage);
        } else {
            this.itemsOnPage = this.allItems.slice((this.currentPage - 1) * this.numberItemsOnPage, this.currentPage * this.numberItemsOnPage);
        }
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

    this.sort = function (field) {
        this.allItems.sort(function (element1, element2) {
            if (element1[field] > element2[field]) {
                return 1;
            } else if (element1[field] < element2[field]) {
                return -1;
            } else {
                return 0;
            }
        });
    };

    this.changeItemField = function (field, index, key, value) {

    };

    this.getItemsOnPage(this.currentPage);
}

function Audio() {
    Content.call(this, 'audio');
}

Audio.prototype = Object.create(Content.prototype);
Audio.prototype.constructor = Audio;

var test = new Audio();

function Text() {
    Content.call(this, 'text');
}

Text.prototype = Object.create(Content.prototype);
Text.prototype.constructor = Text;

function Video() {
    Content.call(this, 'video');
}

Video.prototype = Object.create(Content.prototype);
Video.prototype.constructor = Video;

function Images() {
    Content.call(this, 'images');
}

Images.prototype = Object.create(Content.prototype);
Images.prototype.constructor = Images;