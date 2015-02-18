require.config({
    shim: {
        "angular": {
            exports: 'angular'
        }
    }
});

require ([
	'jquery-1.10.2.min',
	'jquery-ui-1.10.4.custom.min',
	'angular.min',
	'weather-angular',
	'weather-controller',
	'forecast-controller',
	'forecast-directive',
	'city-autocomplete-directive',
	'ready'
]);