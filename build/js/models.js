
function aboutModel(param) {

    var myLatLng = {lat: 50.449527, lng: 30.460810};

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 15
    });

    var content = document.createElement('div');
    content.innerHTML = '<h2>Shofer content!</h2><p>mobile: +380636708594</p>';
    var infowindow = new google.maps.InfoWindow({
        content: content
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Our office'
    });

    google.maps.event.addListener(marker, 'click', function (event) {
        infowindow.open(map, marker);
    });
}
/**
 * Created by Goremchik on 2016-12-06.
 */

function audioModel(param) {
    console.log(param);
}
/**
 * Created by Goremchik on 2016-12-06.
 */

function imagesModel(param) {
    console.log(param);
}
/**
 * Created by Goremchik on 2016-12-06.
 */

function indexModel(param) {
    console.log(param);
}
/**
 * Created by Goremchik on 2016-12-07.
 */

function textModel(param) {
    console.log(param);
}
/**
 * Created by Goremchik on 2016-12-06.
 */

function videoModel(param) {
    console.log(param);
}