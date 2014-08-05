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

//console.log("GOOGLE_API_KEY: " + process.env.GOOGLE_API_KEY);
if( process.env.GOOGLE_API_KEY = "" ){
	console.log("There is no GOOGLE_API_KEY configured, so the map integration won't work");
}

app.post('/weather/forecast', function(req, res){
	//console.log("%s:host: %s", req.path, req.ip);
	var data = req.body;
	console.log("%s[%s]:request:city: %s", req.path, req.ip, data.city);
	var bodyResp = '';
	//console.log("data: " + data.city);
	http.get("http://api.openweathermap.org/data/2.5/weather?mode=json&units=metric&q=" + data.city, function(resp) {
		//console.log("%s:got response: %d" ,req.path,resp.statusCode);

		if( resp.statusCode != 200 ){
			console.error("%s[%s]:status code %s", req.path, req.ip, resp.statusCode);
			res.send(resp.statusCode);
			return;
		}

		resp.on("data", function(chunk){
			bodyResp += chunk;
			//console.log("%s:got data...", req.path);
		});

		resp.on('end', function () {
			console.log('%s[%s]:reponse: %s', req.path, req.ip, bodyResp);
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
		console.log("%s[%s]:got error: %s", req.path, req.ip, e.message);
	});	
});

app.post('/weather/city/list',function(req, res){
	//console.log("%s:host: %s[%s]", req.path,req.host, req.ip);
	var bodyResp = '';
	var data = req.body;
	console.log("%s[%s]:request query: %s", req.path, req.ip, data.city);
	http.get("http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + data.city, function(resp) {
		resp.setEncoding('utf8');
		//console.log("%s:got response: %d" ,req.path,resp.statusCode);

		if( resp.statusCode != 200 ){
			console.error("%s[%s]:status code %s", req.path, req.ip, resp.statusCode);
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

			res.send(200, respJson);
		});
	}).on('error', function(e) {
		console.log("%s[%s]:got error: %s", req.path, req.ip, e.message);
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