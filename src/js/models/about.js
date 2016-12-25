
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