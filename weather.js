var path = require('path');
var express = require('express');
var http = require('http');
var app = express();


app.use(express.json());
app.use(express.urlencoded());

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.use('/weather/', express.static(__dirname + '/public'));
// New call to compress content
app.use(express.compress());

console.info("GOOGLE_API_KEY: " + process.env.GOOGLE_API_KEY);

app.post('/weather/forecast', function(req, res){
	var data = req.body;
	var bodyResp = '';
	//console.log("data: " + data.city);
	http.get("http://api.openweathermap.org/data/2.5/weather?mode=json&units=metric&q=" + data.city, function(resp) {
		console.log("Got response: " + resp.statusCode);

		if( resp.statusCode != 200 ){
			console.log("logging error code %s", resp.statusCode);
			res.send(resp.statusCode);
			return;
		}

		resp.on("data", function(chunk){
			bodyResp += chunk;
			console.log("got data...");
		});

		resp.on('end', function () {
			console.log('bodyResp: ' + bodyResp);
			var weatherJson = JSON.parse(bodyResp);
			//console.log(weatherJson);
			//{ message: 'Error: Not found city', cod: '404' }
			if( weatherJson.cod != 200 ){
				res.send(weatherJson.cod, weatherJson.message);
			} else {
				res.render('weather.ejs', {weather: weatherJson});
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});	
});

app.post('/weather/city/list',function(req, res){
	var bodyResp = '';
	var data = req.body;
	console.log(data);
	http.get("http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + data.city, function(resp) {
		resp.setEncoding('utf8');
		console.log("Got response: " + resp.statusCode);

		resp.on("data", function(chunk){
			bodyResp += chunk;
			console.log("got data...");
		});

		resp.on('end', function () {
			bodyResp = bodyResp.replace("?", "");
			bodyResp = bodyResp.replace("(", "");
			bodyResp = bodyResp.replace(");", "");
			bodyResp = "{\"cities\":" + bodyResp + "}";
			//console.log("resp: %s", bodyResp);
			var respJson = JSON.parse(bodyResp);

			res.send(200,respJson);
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
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
console.log('Listening on port 3000');