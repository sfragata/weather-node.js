(function() {
  var app = angular.module('forecastController', []);
  app.controller('ForecastController', ['$http', '$scope',function($http, $scope) {
    this.city = "";
    this.getForecast = function(cityForecast) {
      var data = {};
      data.city = this.city;
      $http.post('/weather/forecast', JSON.stringify(data)).
        success(function(data, status, headers, config) {
          var date = moment.unix(data.dt);
          data.dt = date.format("YYYY-MM-DD HH:mm:ss");

          var time = moment.unix(data.sys.sunrise);
          data.sys.sunrise = time.format("HH:mm:ss");
          time = moment.unix(data.sys.sunset);
          data.sys.sunset = time.format("HH:mm:ss")
          console.log(data);

          cityForecast.name = data.name;
          cityForecast.sys = {};
          cityForecast.sys.country = data.sys.country;
          cityForecast.sys.sunrise = data.sys.sunrise;
          cityForecast.sys.sunset = data.sys.sunset;

          cityForecast.main = {};
          cityForecast.main.temp = data.main.temp;
          cityForecast.main.pressure = data.main.pressure;
          cityForecast.main.humidity = data.main.humidity;
          cityForecast.main.temp_min = data.main.temp_min;
          cityForecast.main.temp_max = data.main.temp_max;

          cityForecast.weather = [];
          cityForecast.weather[0] = {};
          cityForecast.weather[0].main = data.weather[0].main;
          cityForecast.weather[0].icon="http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";   
          cityForecast.weather[0].description = data.weather[0].description;

          cityForecast.dt = data.dt;
          cityForecast.wind = {};
          cityForecast.wind.speed = data.wind.speed;
          cityForecast.clouds ={};
          cityForecast.clouds.all = data.clouds.all;

          cityForecast.error = "";

          cityForecast.coord = {};
          cityForecast.coord.lat = data.coord.lat;
          cityForecast.coord.lon = data.coord.lon;

          //Get google map
          var myLatlng = new google.maps.LatLng(cityForecast.coord.lat, cityForecast.coord.lon);
          var mapOptions = {
              center: myLatlng,
              zoom: 8
          };
          var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
          var marker = new google.maps.Marker({
              position: myLatlng,
              map: map,
              title: cityForecast.name
          });           
          //

        }).
        error(function(data, status, headers, config) {
          console.error('data:' + data);
          cityForecast.name = "";
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