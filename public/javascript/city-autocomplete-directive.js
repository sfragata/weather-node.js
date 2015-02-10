(function() {
	var app = angular.module('autoCompleteDirective', []);

	app.directive('autoComplete', function ($http, $interpolate, $parse) {
		return {
		    restrict: 'A',
		    require: 'ngModel',
		    compile: function (elem, attrs) {
		    	//get the model
		        var modelAccessor = $parse(attrs.ngModel);

		        return function (scope, element, attrs, controller) {
		            elem.autocomplete({
		                source: function (request, response) {
		                	// console.log('request.term: ', request.term);
		                	dataCity = {};
							dataCity.city = request.term;
							// console.log('JSON.stringify(dataCity): ' + JSON.stringify(dataCity));
		                    $http({
		                        url: '/weather/city/list',
		                        method: 'POST',
		                        data: JSON.stringify(dataCity)
		                    })
		                    .success(function (data) {
								response( $.map( data.cities, function( item ) {
								  // console.log("item: " + item);
								  return {
								    label: item,
								    value: item
								  }
								}));	                    	
		                    });
		                },

		                select: function (event, ui) {
		                    scope.$apply(function (scope) {
		                    	//applying new value to the model
		                        modelAccessor.assign(scope, ui.item.value);
		                    });
		                    //applying new value to de UI (input)
		                    elem.val(ui.item.label);

		                    event.preventDefault();
		                },

						minLength:3
		            });
		        }
		    }
		}
	});

})();