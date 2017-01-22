
// Thats an additional file which initiales local database
// Musn't be used in production!!!
(function () {
    var users = [
        {
            id: 1,
            name: "Andrey",
            password: "123456",
            role: 1,
            content: {
                video: {},
                audio: {},
                text: {},
                images: {1:3}
            }
        },
        {
            id: 2,
            name: "Admin",
            password: "123456",
            role: 1,
            content: {
                video: {},
                audio: {},
                text: {},
                images: {}
            }
        }
    ];


    var video = [];
    for (var i = 1; i <= 4; i++) {
        var D = new Date();
        D.setDate(D.getDate() - Math.ceil(Math.random() * 30));
        video.push({
            id: i,
            title: "Video " + i,
            fileName: i + ".mp4",
            description: "Video description " + i,
            poster: 'poster/' + i + '.jpg',
            ownerId: 1,
            created: D,
            votesCount: Math.ceil(Math.random() * 30),
            rating: parseFloat((Math.random() * 5).toFixed(2)),
            comments: [],
            category: i % 2 + 1
        });
    }

    var images = [];
    for (var i = 1; i <= 23; i++) {
        var D = new Date();
        D.setDate(D.getDate() - Math.ceil(Math.random() * 30));
        images.push({
            id: i,
            title: "Img " + i,
            fileName: i + ".jpg",
            description: "Image description " + i,
            ownerId: 1,
            created: D,
            votesCount: Math.ceil(Math.random() * 30),
            rating: parseFloat((Math.random() * 5).toFixed(2)),
            comments: [],
            category: i % 2 + 1
        });
    }



    var audio = [];
    for (var i = 1; i <= 12; i++) {
        var D = new Date();
        D.setDate(D.getDate() - Math.ceil(Math.random() * 30));
        audio.push({
            id: i,
            title: "Music " + i,
            fileName: i + ".mp3",
            description: "Music description " + i,
            ownerId: 1,
            created: D,
            votesCount: Math.ceil(Math.random() * 30),
            rating: parseFloat((Math.random() * 5).toFixed(2)),
            comments: [],
            category: i % 2 + 1
        });
    }

    var text = [];
    for (var i = 1; i <= 78; i++) {
        var D = new Date();
        D.setDate(D.getDate() - Math.ceil(Math.random() * 30));
        text.push({
            id: i,
            title: "Text " + i,
            text: createText(),
            description: "Text description " + i,
            ownerId: 1,
            created: D,
            votesCount: Math.ceil(Math.random() * 30),
            rating: parseFloat((Math.random() * 5).toFixed(2)),
            comments: [],
            category: i % 2 + 1
        });
    }

    function createText() {
        var text = 'Text ';

        for (var i = 0; i < 100; i++) {
            text += 'text '
        }
        return text;
    }


    var videoCategories = [{id: 1, name: 'Video 1'}, {id: 2, name: 'Video 2'}];
    var audioCategories = [{id: 1, name: 'Audio 1'}, {id: 2, name: 'Audio 2'}];
    var textCategories = [{id: 1, name: 'Text 1'}, {id: 2, name: 'Text 2'}];
    var imagesCategories = [{id: 1, name: 'Images 1'}, {id: 2, name: 'Images 2'}];


    if (!localStorage.getItem("users")) {
        localStorage.setItem("video", JSON.stringify(video));
        localStorage.setItem("audio", JSON.stringify(audio));
        localStorage.setItem("images", JSON.stringify(images));
        localStorage.setItem("text", JSON.stringify(text));


        localStorage.setItem("videoCategories", JSON.stringify(videoCategories));
        localStorage.setItem("audioCategories", JSON.stringify(audioCategories));
        localStorage.setItem("textCategories", JSON.stringify(textCategories));
        localStorage.setItem("imagesCategories", JSON.stringify(imagesCategories));

        localStorage.setItem("users", JSON.stringify(users));
    }

})();