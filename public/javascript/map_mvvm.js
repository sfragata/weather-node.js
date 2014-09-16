function drawmap(name, lat, lon) {
    this.name = name;
    this.lat = ko.observable(lat);
    this.long = ko.observable(lon);

    var myLatlng = new google.maps.LatLng(lat,lon);
    var mapOptions = {
        center: myLatlng,
        zoom: 8
    };
    var map = new google.maps.Map($("#map-canvas")[0], mapOptions);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: name
    });
}