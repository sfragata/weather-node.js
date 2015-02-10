(function() {
  var app = angular.module('weatherController', []);
  //http://jsfiddle.net/sebmade/swfjT/light/
  app.controller('WeatherController', ['$http',function($http){
    this.cityForecast = {};
  }]);
})();