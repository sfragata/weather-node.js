'use strict';

var React = require('react');
var useState = React.useState;
var ForecastForm = require('./components/ForecastForm.jsx');
var ForecastGrid = require('./components/ForecastGrid.jsx');

function App() {
  var forecastState = useState(null);
  var forecast = forecastState[0];
  var setForecast = forecastState[1];

  var errorState = useState(null);
  var error = errorState[0];
  var setError = errorState[1];

  return React.createElement('div', null,
    React.createElement(ForecastForm, {
      onForecast: setForecast,
      onError: setError
    }),
    error ? React.createElement('div', { style: { color: 'red' } }, error) : null,
    React.createElement(ForecastGrid, { forecast: forecast })
  );
}

module.exports = App;
