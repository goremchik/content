
/*
 The object to create a modal window

 Constructor: Modal(param)
 param = {
 width - the width of the modal window
 text - text within the window
 confirmText - text on the confirmation button
 cancelText - text on the cancel button
 onCancel - callback when canceling
 onConfirm - callback on confirmation
 }
 */

function Modal(param) {
    if (!param || typeof param !== 'object') {
        param = {};
    }

    // To set the standard settings
    var width = param.width || '';
    var text = param.text || 'You sure?';
    var confirmText = param.confirmText || 'Ok';
    var cancelText = param.cancelText || 'Cancel';

    var onCancel = (typeof param.onCancel === 'function') ? param.onCancel : function () {};
    var onConfirm = (typeof param.onConfirm === 'function') ? param.onConfirm : function () {};

    // Creates a container for window
    var modalBlock = document.createElement('div');
    modalBlock.className = 'modal-block';
    document.body.insertBefore(modalBlock, null);

    // Creates a block for window
    var modalWindow = document.createElement('div');
    modalWindow.className = 'modal-window';
    modalWindow.innerHTML = '<div class="modal-text">' + text + '</div>';
    modalWindow.style.width = width;
    modalBlock.insertBefore(modalWindow, null);

    // Creates buttons
    var modalButtons = document.createElement('div');
    modalButtons.className = 'modal-buttons';
    modalWindow.insertBefore(modalButtons, null);

    createButton(modalButtons, confirmText, onConfirm);
    createButton(modalButtons, cancelText, onCancel);

    function closeModal() {
        document.body.removeChild(modalBlock);
    }

    function createButton(parent, text, callback) {
        var button = document.createElement('button');
        button.className = 'modal-button';
        button.innerHTML = text;
        parent.insertBefore(button, null);

        try {
            addEvent(button, 'click', function () {
                closeModal();
                callback();
            });
        } catch (e) {
            button.onclick = function () {
                closeModal();
                callback();
            };
        }
        return button;
    }
}