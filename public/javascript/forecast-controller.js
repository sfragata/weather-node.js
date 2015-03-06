(function() {
  var app = angular.module('forecastController', []);
  app.controller('ForecastController', ['$http', '$scope',function($http, $scope) {
    this.city = "";
    this.getForecast = function(cityForecast) {
      var data = {};
      data.city = this.city;
      $http.post('/weather/forecast', JSON.stringify(data)).
        success(function(data, status, headers, config) {
          console.log(data);
          //copy all data to the cityForecast
          angular.copy(data, cityForecast);

          //Get google map
          var myLatlng = new google.maps.LatLng(cityForecast.coord.lat, cityForecast.coord.lon);
          var mapOptions = {
              center: myLatlng,
              zoom: 8
          };

          var contentString = cityForecast.main.temp + '°C ' + cityForecast.weather[0].description + 
          ' ('+ cityForecast.weather[0].main + ')';

          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          
          var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
          var marker = new google.maps.Marker({
              position: myLatlng,
              map: map,
              title: cityForecast.name
          });           

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });
          //

        }).
        error(function(data, status, headers, config) {
          console.error('data:' + data);
          cityForecast.coord = "";
          cityForecast.error = data;
          // console.error('headers:' + headers);
          // console.error('config:' + config);
          console.error('Error: status [%d]', status);
          document.getElementById('map-canvas').innerHTML = "";
          document.getElementById('map-canvas').style.backgroundColor="#FFFFFF";
        });
      this.city = "";
    };
  }]);
})();