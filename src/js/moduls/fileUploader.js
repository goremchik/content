
/*
 The object for creating a loader file.
 Connect the library: Jquery FileUpload.

 Constructor:
 FileUploader(container, acceptFiles, typePath, buttonText, onSuccess)
 container - block, in which the file upload facility will be created
 acceptFiles - MIME-type files permissible (video/*)
 typePath - subfolder for downloaded files (video)
 buttonText - The text on the loader button
 onSuccess - callback

 Methods:
 reinit() - recreate the file loader object for new loading
 */

function FileUploader(container, acceptFiles, typePath, buttonText, onSuccess) {

    var uploader = document.createElement('div'); // HTML uploader block
    container.classList.add('file-uploader');
    var loading = document.createElement('div'); // HTML loading block
    loading.className = 'loader-block';
    loading.innerHTML = '<div class="loader"><i class="icon load"></i></div>';
    loading.style.display = 'none';
    container.insertBefore(uploader, null);
    container.insertBefore(loading, null);

    var onError = function () {
        closeLoader();
        this.reinit();
        try {
            new Notification("Can't load data on server", 'error');
        } catch (e) {
            console.error("Need Notification constractor");
        }
    }.bind(this);


    var loaderIntervalId = 0;

    // Hide an uploader block and open a loading block
    function openLoader() {
        uploader.style.display = 'none';
        loading.style.display = 'block';

        var deg = 0;
        loaderIntervalId = setInterval(function () {
            try {
                $(loading.querySelectorAll('.loader')[0]).rotate(deg);
                deg += 3;
            } catch (e) {
                console.error("Need rotate library");
            }
        }, 30);
    }

    // Hide a loading block
    function closeLoader() {
        loading.style.display = 'none';
        clearInterval(loaderIntervalId);
    }

    this.reinit = function () {
        uploader.style.display = 'block';
        loading.style.display = 'none';
        uploader.innerHTML = '';

        try {
            $(uploader).uploadFile({
                url: "/php/upload.php?type=" + typePath,
                multiple: false,
                dragDrop: true,
                maxFileCount: 1,
                fileName: "myfile",
                acceptFiles: acceptFiles,
                dragdropWidth: "",
                uploadStr: buttonText,
                onSubmit: function () {
                    openLoader();
                },

                onSuccess: function (files, data) {
                    // Parse the response, if it fails, that means a server error
                    try {
                        JSON.parse(data);
                    } catch (e) {
                        onError();
                        return;
                    }

                    // Simulating a load time
                    setTimeout(function () {
                        if (files[0].lastIndexOf('\\') > -1) {
                            files[0] = files[0].substr(files[0].lastIndexOf('\\') + 1);
                        }
                        onSuccess(files[0]);
                        closeLoader();
                        new Notification("File uploaded", 'success');
                    }, 1000);
                },

                onError: onError
            });
        } catch (e) {
            try {
                new Notification("Can't load data on server", 'error');
            } catch (e) {}
            console.error("Need library: Jquery FileUpload");
        }
    };

    this.reinit();
}
