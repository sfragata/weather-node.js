$script('javascript/jquery-1.10.2.min.js');
$script('javascript/jquery-ui-1.10.4.custom.min.js');
$script('javascript/angular.min.js', 'angular');

$script.ready('angular', function(){

	$script(['javascript/weather-angular.js','javascript/weather-controller.js',
		'javascript/forecast-controller.js','javascript/forecast-directive.js',
		'javascript/city-autocomplete-directive.js'], 'weather-bundle');	

	$script.ready('weather-bundle', function() {
		angular.bootstrap(document, ['weatherApp']); 
		$script.get('/weather/googlemaps', function(){ 
		//$script.get('https://maps.googleapis.com/maps/api/js?v=3.exp&callback=$', function(){ 
			alert('google');
		});
	});
});