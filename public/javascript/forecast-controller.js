(function() {
  var app = angular.module('forecastController', []);
  app.controller('ForecastController', ['$http', '$scope',function($http, $scope) {
    this.city = '';
    this.getForecast = function(cityForecast) {
      var data = {};
      data.city = this.city;
      $http.post('/weather/forecast', JSON.stringify(data)).then(
        function(response) {
          console.log(response.data);
          //copy all data to the cityForecast
          angular.copy(response.data, cityForecast);

          //Get google map
          var myLatlng = new google.maps.LatLng(cityForecast.coord.lat, cityForecast.coord.lon);
          var mapOptions = {
              center: myLatlng,
              zoom: 8,
              mapId: 'DEMO_MAP_ID'
          };

          var contentString = cityForecast.main.temp + '°C ' + cityForecast.weather[0].description +
          ' ('+ cityForecast.weather[0].main + ')';

          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
          var marker = new google.maps.marker.AdvancedMarkerElement({
              position: myLatlng,
              map: map,
              title: cityForecast.name
          });

          marker.addListener('click', function() {
            infowindow.open({anchor: marker, map});
          });
        },
        function(response) {
          console.error('data:' + response.data);
          cityForecast.coord = null;
          cityForecast.error = response.data;
          console.error('Error: status [%d]', response.status);
          document.getElementById('map-canvas').innerHTML = '';
          document.getElementById('map-canvas').style.backgroundColor = '#FFFFFF';
        }
      );
      this.city = '';
    };
  }]);
})();