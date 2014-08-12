weather-node.js
===============
Simple node.js web application that extract json's information from http://www.geobytes.com/free-ajax-cities-jsonp-api.htm
to retrieve the cities list (autocomplete) and from http://openweathermap.org to show the forecast.

Technologies

- Node.js (express, ejs, http)
- jQuery
- Moment
- Google maps api
- Log4js


Important: To use google maps api, you must export the environment key [GOOGLE_API_KEY]
Example:
	export GOOGLE_API_KEY= [your google api key]