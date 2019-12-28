var http = require('http');
var log4js = require('log4js');

var cityListLogger = log4js.getLogger("cities");

var url = "http://gd.geobytes.com/AutoCompleteCity?callback=?&q=";

exports.list = function(req, res){
	var bodyResp = '';
	var data = req.body;
	cityListLogger.info("request query: %s", data.city);
	http.get(url + data.city, function(httpResponse) {
		httpResponse.setEncoding('utf8');

		if( httpResponse.statusCode != 200 ){
			cityListLogger.error("status code %s", httpResponse.statusCode);
			res.sendStatus(httpResponse.statusCode);
			return;
		}

		httpResponse.on("data", function(chunk){
			bodyResp += chunk;
			//console.log("%s:got data...", req.path);
		});

		httpResponse.on('end', function () {
			bodyResp = bodyResp.replace("?", "");
			bodyResp = bodyResp.replace("(", "");
			bodyResp = bodyResp.replace(");", "");
			bodyResp = "{\"cities\":" + bodyResp + "}";
			//console.log("httpResponse: %s", bodyResp);
			var respJson = JSON.parse(bodyResp);

			res.status(200).send(respJson);
		});
	}).on('error', function(e) {
		cityListLogger.error("got error: ", e);
		res.sendStatus(500, e.message);
	});
};
