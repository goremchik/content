
/*
 The helper object with functions to interact with the meta tags
 that contain information about the page

 Methods:
 get(param) - get a param property value
 param - property

 set(param, value) - set the value for the parameter property
 param - property
 value - value

 createMetaTag(param) - creating a meta tag with the param property
 param - property
 */

var shareInfo = {
    get: function (param) {
        var meta = document.querySelectorAll('meta[property="og:' + param + '"]')[0];
        if (!meta) {
            meta = createMetaTag(param);
        }
        return meta.getAttribute('content');
    },

    set: function (param, value) {
        var meta = document.querySelectorAll('meta[property="og:' + param + '"]')[0];
        if (!meta) {
            meta = createMetaTag(param);
        }
        meta.setAttribute('content', value);
    },

    createMetaTag: function (param) {
        var meta = document.createElement('meta');
        meta.setAttribute('property', "og:" + param);
        document.head.insertBefore(meta, null);
        return meta;
    }
};

/*
 A sharing object

 Constructor: Share(element)
 element - HTML share element
 Example:
 <button class="social" data-site="vk">
    <i class="icon vk"></i>
 </button>
 */

function Share(element) {

    if (typeof isElement !== 'function') {
        throw new Error("Cant find  isElement function!");
    }

    if (!shareInfo || typeof shareInfo !== 'object') {
        throw new Error("Cant find shareInfo object!");
    }

    if (!element || !isElement(element)) {
        throw new Error("Cant find share element!");
    }

    try {
        addEvent(element, 'click', onClick);
    } catch (e) {
        element.onclick = onClick;
    }

    // It opens a sharing window when clicking on an element
    function onClick () {
        var sharingSite = element.getAttribute('data-site');

        // Получить информацию про страницу
        var url = shareInfo.get('url');
        var title = shareInfo.get('title');
        var desc = shareInfo.get('description');
        var image = shareInfo.get('image');

        // Set different URLs for different sharing sites
        var sharingUrl = '';
        switch (sharingSite) {
            case 'vk':
                sharingUrl = 'https://vk.com/share.php?&title=' + title + '&description=' + desc + '&image=' + image + '&noparse=true&url=' + url;
                break;
            case 'twitter':
                sharingUrl = 'https://twitter.com/share?text=' + title + '&url=' + url;
                break;
            case 'facebook':
                sharingUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
                break;
            case 'odnoklassniki':
                sharingUrl = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=' + url + '&st.comments=' + title + '';
                break;
            case 'mail.ru':
                sharingUrl = 'http://connect.mail.ru/share?url=' + url + '&title=' + title + '&description=' + desc + '&imageurl=' + image + '';
                break;
            case 'google+':
                sharingUrl = 'https://plus.google.com/share?url=' + url;
                break;
            case 'tumblr':
                sharingUrl = 'http://www.tumblr.com/share?v=3&t=' + title + '&u=' + url;
                break;
            case 'pinterest':
                sharingUrl = 'http://pinterest.com/pin/create/button/?media=' + image + '&description=' + desc + '&url=' + url;
                break;
            default:
                sharingUrl = sharingSite;
        }
        window.open(sharingUrl, '_blank', "width=" + 500 + ", height=" + 500);
    }
}
