(function() {
  var app = angular.module('forecastDirective', []);
  app.directive("forecastGrid", function() {
    return {
      restrict:"E",
      templateUrl: "html/forecast-grid.html"
    };
  });
})();