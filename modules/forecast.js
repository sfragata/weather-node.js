var https = require('https');
var log4js = require('log4js');

var forecastLogger = log4js.getLogger('forecast');

var baseUrl = 'https://api.openweathermap.org/data/2.5/weather?mode=json&units=metric';

if (process.env.OPEN_WEATHER_API_KEY === undefined) {
  forecastLogger.error('key \'OPEN_WEATHER_API_KEY\' is undefined');
} else {
  baseUrl += '&appid=' + process.env.OPEN_WEATHER_API_KEY;
}

exports.retrieve = function (req, res) {
  var data = req.body;
  forecastLogger.info('request city: %s', data.city);
  var bodyResp = '';
  var url = baseUrl + '&q=' + encodeURIComponent(data.city);
  https.get(url, function (httpResponse) {

    if (httpResponse.statusCode !== 200) {
      forecastLogger.error('status code %s', httpResponse.statusCode);
      res.sendStatus(httpResponse.statusCode);
      return;
    }

    httpResponse.setEncoding('utf8');
    httpResponse.on('data', function (chunk) {
      bodyResp += chunk;
    });

    httpResponse.on('end', function () {
      var weatherJson = JSON.parse(bodyResp);
      if (weatherJson.cod !== 200) {
        weatherJson.city = data.city;
        forecastLogger.error('response: %s', JSON.stringify(weatherJson));
        res.status(weatherJson.cod).send(weatherJson.message);
      } else {
        forecastLogger.info('response: %s', bodyResp);
        res.status(200).send(weatherJson);
      }
    });
  }).on('error', function (e) {
    forecastLogger.error('got error: ', e);
    res.status(500).send({ error: 'Internal server error' });
  });
};
