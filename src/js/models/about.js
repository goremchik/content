
function aboutModel() {

    helper.setShareMeta('about', 'Shofer content', 'About us', 'img/logo.png');

    // Marker coordinates
    var myLatLng = {lat: 50.449527, lng: 30.460810};

    // Marker description on the map
    var content = document.createElement('div');
    content.innerHTML = '<h2>Shofer content!</h2><p>mobile: +380636708594</p>';

    try {
        map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 15
        });

        // Creates an info window
        var infowindow = new google.maps.InfoWindow({
            content: content
        });

        // Creates a marker
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Our office'
        });

        // Opens a marker when you click on it
        google.maps.event.addListener(marker, 'click', function (event) {
            infowindow.open(map, marker);
        });
    } catch (e) {
        console.error(e);
    }
}