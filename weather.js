var path = require('path');
var express = require('express');
var http = require('http');
var app = express();
var log4js = require('log4js');
var bodyParser = require('body-parser');
var compression = require('compression')

//config
log4js.configure({
	appenders: [
		{ 
			type: "console",
			"layout": {
			  "type": "pattern",
			  "pattern": "%[%d{ISO8601} [%p] %c -%] %m%n"
			},
			"category" : ["/weather/forecast", "/weather/city/list", "default"]			
		}
	]
});
//define logger
var defaultLogger = log4js.getLogger("default");
var forecastLogger = log4js.getLogger("/weather/forecast");
var cityListLogger = log4js.getLogger("/weather/city/list");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.use('/weather/', express.static(__dirname + '/public'));
app.use(compression());

if( process.env.GOOGLE_API_KEY = "" ){
	defaultLogger.warn("There is no GOOGLE_API_KEY configured, so the map integration won't work");
}

app.post('/weather/forecast', function(req, res){
	var data = req.body;
	forecastLogger.info("request city: %s", data.city);
	var bodyResp = '';
	http.get("http://api.openweathermap.org/data/2.5/weather?mode=json&units=metric&q=" + data.city, function(resp) {

		if( resp.statusCode != 200 ){
			forecastLogger.error("status code %s", resp.statusCode);
			res.send(resp.statusCode);
			return;
		}

		resp.on("data", function(chunk){
			bodyResp += chunk;
		});

		resp.on('end', function () {
			var weatherJson = JSON.parse(bodyResp);
			//{ message: 'Error: Not found city', cod: '404' }
			if( weatherJson.cod != 200 ){
				//add city to the json's response error
				weatherJson.city = data.city;
				forecastLogger.error('response: %s', JSON.stringify(weatherJson));
				res.status(weatherJson.cod).send(weatherJson.message);
			} else {
				forecastLogger.info('response: %s', bodyResp);
				res.render('weather.ejs', { weather: weatherJson });
			}
		});
	}).on('error', function(e) {
		forecastLogger.error("got error: ", e);
	});	
});

app.post('/weather/city/list',function(req, res){
	var bodyResp = '';
	var data = req.body;
	cityListLogger.info("request query: %s", data.city);
	http.get("http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + data.city, function(resp) {
		resp.setEncoding('utf8');

		if( resp.statusCode != 200 ){
			cityListLogger.error("status code %s", resp.statusCode);
			res.send(resp.statusCode);
			return;
		}

		resp.on("data", function(chunk){
			bodyResp += chunk;
			//console.log("%s:got data...", req.path);
		});

		resp.on('end', function () {
			bodyResp = bodyResp.replace("?", "");
			bodyResp = bodyResp.replace("(", "");
			bodyResp = bodyResp.replace(");", "");
			bodyResp = "{\"cities\":" + bodyResp + "}";
			//console.log("resp: %s", bodyResp);
			var respJson = JSON.parse(bodyResp);

			res.status(200).send(respJson);
		});
	}).on('error', function(e) {
		cityListLogger.error("got error: ", e);
		res.send(500, e.message);
	});
});

//route to google maps api
app.get('/weather/googlemaps', function(req, res){
	res.set('Content-Type', 'application/javascript');
	res.redirect('https://maps.googleapis.com/maps/api/js?key=' + process.env.GOOGLE_API_KEY +  '&sensor=false');
});

// Route for everything else.
app.get('*', function(req, res){
  res.redirect('/weather/index.html');
});

// Fire it up!
app.listen(3000);
defaultLogger.info('Listening on port 3000');