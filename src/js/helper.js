
/*
 This object contains some useful functions which help to avoid duplicating the code.

 createHtmlElement({ - creates an HTML object
 tag - tag name
 className - class
 parent - parent node
 child - child node
 attributes: {key:value, ...}
 })

 createElement(parent, tag, className, html) - a stripped-down version of createHtmlElement
 createLabel(parent, text) - creates label
 createInput(parent, type, placeholder, name) - creates input
 createTextarea(parent, name) - creates textarea
 createButton(parent, type, text) - creates button

 createSelect(parent, options) - creates select;
 options = [{value:value, text:text}, ...]

 editInstruments(parent, element, item, field, contentObj) - makes an element editable
 item - content element
 field - editable content field
 contentObj - content object (Image, Video, Text, Audio)

 createTitleViewBlock(parent, item, contentObj) -  creates a title to view the content
 createRatingViewBlock(parent, item, contentObj) - creates a rating block to view the content
 createDescriptionViewBlock(parent, item, contentObj, popUp, nextFunction, index) -  creates a description block to view the content

 createVideo(parent, file, poster) - creates video element
 file - file name (video.mp4)
 poster - poster name (default.png)

 createAudio(parent, file)  - creates audio element
 file - file name (audio.mp3)

 createViewNavButton(buttonClass, index, iconClass) - creates navigation buttons for the Image content
 buttonClass - class for the navigation buttons
 index - current element position in the array
 iconClass - class for the icon in button

 Describes the actions for content when the page loads
 forContentAction(content, createDataView, searchInput, sortSelect, multiSelect, searchButton, parameters)

 setShareMeta(url, title, description, image) - sets the parameters for the sharing in meta tag
 url - link on page (image?id=20)
 title - page name
 description - page description
 image - path to image on the page ('img/logo.png')

 */

var helper = {
    createHtmlElement: function (param) {

        if (typeof param !== 'object' || !param) {
            return;
        }

        var tag = param.tag,
            className = param.className || '',
            html = param.html || '',
            parent = param.parent || null,
            attributes = param.attributes || {},
            child = param.child || null;

        var element = document.createElement(tag);

        if (className || className === 0) {
            element.className = className;
        }

        if (html || html === 0) {
            element.innerHTML = html;
        }

        for (var i in attributes) {
            element.setAttribute(i, attributes[i]);
        }

        if (child) {
            try {
                element.insertBefore(child, null);
            } catch (e) {
            }
        }

        if (parent) {
            try {
                parent.insertBefore(element, null);
            } catch (e) {
            }
        }

        return element;
    },

    createElement: function (parent, tag, className, html) {
        return this.createHtmlElement({
            tag: tag,
            className: className,
            html: html,
            parent: parent
        });
    },

    createLabel: function (parent, text) {
        return this.createElement(parent, 'label', 'label-field', text);
    },

    createInput: function (parent, type, placeholder, name) {
        type = type || 'text';
        placeholder = placeholder || '';
        name = name || '';

        return this.createHtmlElement({
            tag: 'input',
            className: 'input-field',
            attributes: {'type': type, 'placeholder': placeholder, 'name': name},
            parent: parent
        });
    },

    createTextarea: function (parent, name) {
        return this.createHtmlElement({
            tag: 'textarea',
            parent: parent,
            className: 'textarea-field',
            attributes: {'name': name}
        });
    },

    createButton: function (parent, type, text) {
        return this.createElement(parent, 'button', 'btn ' + type, text);
    },

    createSelect: function (parent, options) {
        var select = this.createElement(parent, 'select', 'input-field');
        var html = '';
        for (var i = 0; i < options.length; i++) {
            var option = this.createElement(select, 'option', '', options[i].name || options[i].text);
            option.value = options[i].id || options[i].value;
        }
        return select;
    },

    editInstruments: function (parent, element, item, field, contentObj) {
        element.className += ' content-owner';
        var iconEdit = helper.createElement(parent, 'i', 'icon pencil edit-icon');
        var iconCancel = helper.createElement(parent, 'i', 'icon cancel cancel-icon');
        var iconOk = helper.createElement(parent, 'i', 'icon check confirm-icon');
        var isEdit = false;
        var oldHtml = '';

        addEvent(element, 'mouseover', function () {
            if (!isEdit) {
                iconEdit.style.display = 'block';
            }
        });

        addEvent(element, 'mouseout', function () {
            iconEdit.style.display = '';
        });

        addEvent(element, 'click', function () {
            oldHtml = element.innerHTML;

            iconEdit.style.display = '';
            isEdit = true;
            iconCancel.style.display = 'block';
            iconOk.style.display = 'block';

            element.setAttribute('contenteditable', 'true');
        });

        addEvent(iconOk, 'click', function () {
            contentObj.changeItemField(item, field, element.innerHTML, function () {
                closeEdit();
                item[field] = element.innerHTML;
            });
        });

        addEvent(iconCancel, 'click', function () {
            closeEdit();
            element.innerHTML = oldHtml;
        });

        function closeEdit() {
            iconCancel.style.display = '';
            iconOk.style.display = '';
            isEdit = false;
            element.setAttribute('contenteditable', 'false');
        }
    },

    createTitleViewBlock: function (parent, item, contentObj) {

        var column = helper.createElement(parent, 'div', 'column-2-3');
        var title = helper.createElement(column, 'h2', 'content-view-title', item.title);

        if (item.ownerId === user.id) {
            this.editInstruments(column, title, item, 'title', contentObj);
        }
        return column
    },

    createDescriptionViewBlock: function (parent, item, contentObj, popUp, nextFunction, index) {
        var column = helper.createElement(parent, 'div', 'column-2-3');

        var description = helper.createHtmlElement({
            tag: 'pre',
            className: 'content-view-text content-view-description',
            html: item.description,
            parent: column
        });

        if (item.ownerId === user.id) {

            this.editInstruments(column, description, item, 'description', contentObj);

            var block = helper.createElement(column, 'div', 'center');
            var remove = helper.createElement(block, 'span', 'text-btn', 'Remove');

            addEvent(remove, 'click', function () {
                new Modal({
                    text: 'You are going to delete an item. Are you sure?',
                    onConfirm: function () {
                        contentObj.deleteItem(item, function () {
                            contentObj.init(contentObj.params, function () {
                                contentObj.setContent();
                                setTimeout(function () {
                                    nextFunction(popUp, index, contentObj);
                                }, 200);
                            });
                        });
                    }
                });
            });
        }
        return column;
    },

    createRatingViewBlock: function (parent, item, contentObj) {
        var column = helper.createElement(parent, 'div', 'column-1-3');

        if (user.checkLogin) {
            var rating = new Rating(user.checkRating(contentObj.type, item.id));
            var ratingEl = rating.getElement();
            ratingEl.className += ' content-rating';

            rating.onchange = function (rating) {
                var value = rating.getValue();
                contentObj.changeRating(value, item, function (status) {
                    if (status) {
                        user.setRatingId(contentObj.type, item.id, value, function () {
                            curRating.innerHTML = '<i class="icon star-full"></i> Rating: ' + item.rating.toFixed(2);
                            votes.innerHTML = '<i class="icon user"></i> Votes: ' + item.votesCount;
                        });
                    }
                });
            };
            column.insertBefore(ratingEl, null);
        }

        var curRating = helper.createHtmlElement({
            tag: 'p',
            className: 'content-view-text current-rating',
            html: '<i class="icon star-full"></i> Rating: ' + item.rating.toFixed(2),
            parent: column
        });

        var votes = helper.createHtmlElement({
            tag: 'p',
            className: 'content-view-text current-votes-count',
            html: '<i class="icon user"></i> Votes: ' + item.votesCount,
            parent: column
        });

        var social = [{site: 'vk', text: '<i class="icon vk"></i>'},
            {site: 'twitter', text: '<i class="icon tvit"></i>'},
            {site: 'facebook', text: '<i class="icon fb"></i>'}];

        for (var i = 0; i < social.length; i++) {
            new Share(helper.createHtmlElement({
                tag: 'button',
                className: 'social share-view',
                html: social[i].text,
                attributes: {'data-site': social[i].site},
                parent: column
            }));
        }

        return column;
    },

    createVideo: function (parent, file, poster) {
        if (!poster) {
            poster = '/files/video/poster/default.png'
        }

        return this.createHtmlElement({
            tag: 'video',
            className: 'video-item',
            attributes: {'controls': '', 'preload': 'auto'},
            parent: parent,
            html: '<source src="' + file + '" type="video/mp4">' +
                '<object class="video-item" type="application/x-shockwave-flash" data="/flashPlayer/flowplayer-3.2.18.swf">' +
                    '<param name="movie" value="/flashPlayer/flowplayer-3.2.18.swf"/>' +
                    '<param name="allowFullScreen" value="true"/>' +
                    '<param name="wmode" value="transparent"/>' +
                    '<param name="flashVars" value="config={\'playlist\':[\'/' + poster + '\', {\'url\':\'' + file + '\',\'autoPlay\':false}]}"/>' +
                '</object>'
        });
    },

    createAudio: function (parent, file) {
        return this.createHtmlElement({
            tag: 'audio',
            className: 'audio-item',
            attributes: {'controls': '', 'preload': 'auto'},
            parent: parent,
            html: '<source src="' + file + '">' +
                '<object class="audio-item" type="application/x-shockwave-flash" data="player_mp3_maxi.swf">' +
                    '<param name="movie" value="flashPlayer/player_mp3_maxi.swf"/>' +
                    '<param name="FlashVars" value="mp3=' + file + '&showstop=1&showvolume=1"/>' +
                '</object>'
        });
    },

    createViewNavButton: function (buttonClass, index, iconClass) {
        return this.createHtmlElement({
            tag: 'div',
            className: buttonClass,
            html: '<i class="icon ' + iconClass + '"></i>',
            attributes: {'data-index': index}
        });
    },

    forContentAction: function (content, createDataView, searchInput, sortSelect, multiSelect, searchButton, parameters) {
        data.get(content.type + 'Categories', function (data) {
            for (var i = 0; i < data.length; i++) {
                var checked = false;

                if (parameters.categories && parameters.categories.indexOf(data[i].id) > -1) {
                    checked = true;
                }

                multiSelect.addOptions({text: data[i].name, value: data[i].id, checked: checked});
            }
        });

        content.setContent();

        function newData() {
            var search = searchInput.value;
            var sort = sortSelect.value;
            var categories = multiSelect.value;

            parameters = {
                sortBy: sort.split(' ')[0],
                categories: JSON.stringify(categories),
                search: search,
                sortType: sort.split(' ')[1],
            };

            path.setParametersObj(parameters);
            helper.setShareMeta(location.hash.substr(1));


            content.init({
                search: search,
                sort: sort,
                categories: categories
            }, function () {
                content.setContent();
            });
        }


        multiSelect.onblur = newData;
        searchButton.onclick = newData;
        sortSelect.onchange = newData;

        if (parameters.id) {
            var index = content.getIndexById(parameters.id);
            if (index > -1) {
                setTimeout(function () {
                    var popupElement = new PopupBlock();
                    popupElement.onclose = function () {
                        delete parameters.id;
                        path.setParametersObj(parameters);
                    };
                    createDataView(popupElement, index, content);
                }, 200);
            }
        }

    },

    setShareMeta: function (url, title, description, image) {
        if (url) {
            shareInfo.set('url', location.origin + '/%23' + url);
        }

        if (title) {
            shareInfo.set('title', title);
        }

        if (description) {
            shareInfo.set('description', description);
        }

        if (image) {
            shareInfo.set('image', location.origin + '/' + image);
        }
    }
};

