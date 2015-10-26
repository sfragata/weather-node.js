var http = require('http');
var log4js = require('log4js');

var forecastLogger = log4js.getLogger("/weather/forecast");

var url = "http://api.openweathermap.org/data/2.5/weather?mode=json&units=metric";
if( process.env.OPEN_WEATHER_API_KEY != undefined ){
	url+="&appid=" + process.env.OPEN_WEATHER_API_KEY;
} else {
	forecastLogger.error("key 'OPEN_WEATHER_API_KEY' undefined");
}
url += "&q=";

exports.retrieve = function(req, res){
	var data = req.body;
	forecastLogger.info("request city: %s", data.city);
	var bodyResp = '';
	http.get(url + data.city, function(httpResponse) {

		if( httpResponse.statusCode != 200 ){
			forecastLogger.error("status code %s", httpResponse.statusCode);
			res.sendStatus(httpResponse.statusCode);
			return;
		}

		httpResponse.on("data", function(chunk){
			bodyResp += chunk;
		});

		httpResponse.on('end', function () {
			var weatherJson = JSON.parse(bodyResp);
			//{ message: 'Error: Not found city', cod: '404' }
			if( weatherJson.cod != 200 ){
				//add city to the json's response error
				weatherJson.city = data.city;
				forecastLogger.error('response: %s', JSON.stringify(weatherJson));
				res.status(weatherJson.cod).send(weatherJson.message);
			} else {
				forecastLogger.info('response: %s', bodyResp);
				//res.render('weather.ejs', { weather: weatherJson });
				res.status(200).send(weatherJson);
			}
		});
	}).on('error', function(e) {
		forecastLogger.error("got error: ", e);
	});	
};