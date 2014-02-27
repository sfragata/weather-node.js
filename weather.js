var path = require('path');
var express = require('express');
var http = require('http');
var app = express();


//app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.use('/weather/', express.static(__dirname + '/public'));
// New call to compress content
app.use(express.compress());

// Serve static files
//app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/weather/home', function(req, res){
	res.render('home.ejs', null);
});


app.post('/weather/forecast', function(req, res){
	var data = req.body;
	var bodyResp = '';

	http.get("http://api.openweathermap.org/data/2.5/weather?mode=json&units=metric&q=" + data.city + "," + data.state, function(resp) {
		console.log("Got response: " + resp.statusCode);

		resp.on("data", function(chunk){
			console.log("got data...");
			bodyResp += chunk;
		});

		resp.on('end', function () {
			var weatherJson = JSON.parse(bodyResp);
			console.log(weatherJson);
			if( weatherJson.cod != 200 ){
				res.send(weatherJson.message);
			} else {
				res.render('weather.ejs', {weather: weatherJson});
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});	
});

// Route for everything else.
app.get('*', function(req, res){
  res.send('Hello World');
});

// Fire it up!
app.listen(3000);
console.log('Listening on port 3000');