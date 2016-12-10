/**
 * Created by Goremchik on 2016-12-09.
 */

(function () {
    var users = [
        {
            id: 1,
            name: "Andrey",
            password: "12345",
            role: 1
        },
        {
            id: 2,
            name: "Admin",
            password: "12345",
            role: 1
        }
    ];

    var video = [
        {
            id: 1,
            title: "First name",
            fileName: "",
            description: "",
            ownerId: 1,
            rating: 0,
            comments: [{ownerId: 1, text: "msg"}],
            category: 1
        },
        {
            id: 2,
            title: "Second name",
            fileName: "",
            description: "",
            ownerId: 1,
            rating: 0,
            comments: [],
            category: 1
        }
    ];

    var images = [
        {
            id: 1,
            title: "view 1",
            fileName: "1.jpg",
            description: "ta ta ta",
            ownerId: 1,
            rating: 0,
            comments: [],
            category: 1
        },
        {
            id: 2,
            title: "view 2",
            fileName: "2.jpg",
            description: "ta ta ta",
            ownerId: 1,
            rating: 0,
            comments: [],
            category: 1
        }
    ];

    var audio = [
        {
            id: 1,
            title: "track 1",
            fileName: "",
            description: "lalala",
            ownerId: 1,
            rating: 0,
            comments: [],
            category: 1
        },
        {
            id: 2,
            title: "track 2",
            fileName: "",
            description: "bobobo",
            ownerId: 1,
            rating: 0,
            comments: [],
            category: 1
        }
    ];

    var text = [
        {
            id: 1,
            title: "view 1",
            fileName: "1.jpg",
            description: "ta ta ta",
            ownerId: 1,
            rating: 0,
            comments: [],
            category: 1
        },
        {
            id: 2,
            title: "view 2",
            fileName: "2.jpg",
            description: "ta ta ta",
            ownerId: 1,
            rating: 0,
            comments: [],
            category: 1
        }
    ];

    var videoCategories = [{id: 1, name: 'Video 1'}, {id: 2, name: 'Video 2'}];
    var audioCategories = [{id: 1, name: 'Audio 1'}, {id: 2, name: 'Audio 2'}];
    var textCategories = [{id: 1, name: 'Text 1'}, {id: 2, name: 'Text 2'}];
    var imagesCategories = [{id: 1, name: 'Images 1'}, {id: 2, name: 'Images 2'}];


    localStorage.setItem("video", JSON.stringify(video));
    localStorage.setItem("audio", JSON.stringify(audio));
    localStorage.setItem("text", JSON.stringify(text));
    localStorage.setItem("images", JSON.stringify(images));

    localStorage.setItem("videoCategories", JSON.stringify(videoCategories));
    localStorage.setItem("audioCategories", JSON.stringify(audioCategories));
    localStorage.setItem("textCategories", JSON.stringify(textCategories));
    localStorage.setItem("imagesCategories", JSON.stringify(imagesCategories));

    localStorage.setItem("users", JSON.stringify(users));

})();