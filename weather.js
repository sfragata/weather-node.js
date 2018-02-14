var path = require('path');
var express = require('express');
var http = require('http');
var app = express();
var log4js = require('log4js');
var bodyParser = require('body-parser');
var compression = require('compression');

var cities = require('./modules/cities');
var forecast = require('./modules/forecast');

module.exports = app;

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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.use('/weather/', express.static(__dirname + '/public'));
app.use(compression());

if( process.env.GOOGLE_API_KEY == undefined ){
 	defaultLogger.warn("There is no GOOGLE_API_KEY configured, so the map integration won't work");
}

//route to autocomplete list city
app.post('/weather/city/list', cities.list);

//route to retrieve forecast
app.post('/weather/forecast', forecast.retrieve);


//route to google maps api
app.get('/weather/googlemaps', function(req, res){
	res.set('Content-Type', 'application/javascript');
	res.redirect('https://maps.googleapis.com/maps/api/js?key=' + process.env.GOOGLE_API_KEY +  '&callback=$');
});

// Route for everything else.
app.get('*', function(req, res){
  res.redirect('/weather/index.html');
});

// Fire it up!
app.listen(process.env.PORT || 3000);
defaultLogger.info('Listening on port 3000');
