ForecastMVVM = function(){
	var self = this;
	self.city = ko.observable();
	self.forecast = ko.observable();

	self.getForecast = function(){

		loading();
		
		var data = {};
		data.city = this.city();
		//console.info("city: " + this.city());
		
		$.ajax({ 
		   url: '/weather/forecast',
		   type: 'POST',
		   cache: false, 
		   data: JSON.stringify(data), 
		   contentType: "application/json",
		   success: function(forecastData){
		   	  loaded();
		   	  var date = moment.unix(forecastData.dt);
		   	  forecastData.dt = date.format("YYYY-MM-DD HH:mm:ss");

			  var time = moment.unix(forecastData.sys.sunrise);
			  forecastData.sys.sunrise = time.format("HH:mm:ss");
			  time = moment.unix(forecastData.sys.sunset);
			  forecastData.sys.sunset = time.format("HH:mm:ss")
		      //console.log(forecastData);
		      self.forecast(forecastData);
		      var viewModel = {
    			  map: ko.observable(new drawmap(forecastData.name, forecastData.coord.lat, forecastData.coord.lon))
			  };
		   }, 
		   error: function(jqXHR, textStatus, err){
		   	   loaded();
		   	   console.error('Error: status [%d], message [%s]', jqXHR.status, jqXHR.responseText);
		   	   $('#response').html(jqXHR.responseText);
		   	   $('#map-canvas').html('');
			   $('#map-canvas').css("background-color", "");
		   }
		})

    };
};
ko.applyBindings(new ForecastMVVM());

