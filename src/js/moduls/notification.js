
/*
 Object for creating the notifications

 Constructor: Notification(title, type)
 title - notification text
 type - notification type ('success', 'warning', 'info', 'error')
 */

function Notification(title, type) {

    var animationDuration = 1000; // The duration of the appearance / disappearance of the block
    var blockExistTime = 3000;    // Existence time for the block

    // Defining the class for a notification block
    switch (type) {
        case 'success':
            type = 'success-notify';
            break;
        case 'warning':
            type = 'warning-notify';
            break;
        case 'info':
            type = 'info-notify';
            break;
        default:
            type = 'error-notify';
    }

    // Creating a notification block
    var notifyBox = document.createElement('div');
    notifyBox.className = 'notify-box ' + type;
    notifyBox.innerHTML = '<h2 class="notify-title">' + title + '</h2>';
    document.body.insertBefore(notifyBox, null);

    // Animation appearance of the block
    try {
        $(notifyBox).fadeIn(animationDuration);
    } catch (e) {
        notifyBox.style.display = 'block';
    }

    var deleteElement = false;

    function closeElement() {
        if (!deleteElement) {
            deleteElement = true;
            try {
                $(notifyBox).fadeOut(animationDuration, function () {
                    document.body.removeChild(notifyBox);
                });
            } catch (e) {
                notifyBox.style.display = 'none';
                document.body.removeChild(notifyBox);
            }
        }
    }

    // Close the notification by clicking or after the specified time
    notifyBox.onclick = closeElement;
    setTimeout(closeElement, blockExistTime);
}