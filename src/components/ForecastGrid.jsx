'use strict';

var React = require('react');

function formatDate(timestamp, format) {
  var date = new Date(timestamp * 1000);
  if (format === 'datetime') {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0') + ' ' +
      String(date.getHours()).padStart(2, '0') + ':' +
      String(date.getMinutes()).padStart(2, '0') + ':' +
      String(date.getSeconds()).padStart(2, '0');
  }
  return String(date.getHours()).padStart(2, '0') + ':' +
    String(date.getMinutes()).padStart(2, '0') + ':' +
    String(date.getSeconds()).padStart(2, '0');
}

function ForecastGrid(props) {
  var forecast = props.forecast;

  if (!forecast || !forecast.coord) {
    return null;
  }

  return React.createElement('div', null,
    React.createElement('h3', null,
      React.createElement('span', null, forecast.name),
      ', ',
      React.createElement('span', null, forecast.sys.country)
    ),
    React.createElement('img', {
      src: 'https://openweathermap.org/img/w/' + forecast.weather[0].icon + '.png',
      alt: forecast.weather[0].description
    }),
    React.createElement('span', null, forecast.main.temp + '\u00B0C'),
    ' ',
    React.createElement('span', null, forecast.weather[0].description),
    ' (',
    React.createElement('span', null, forecast.weather[0].main),
    ')',
    React.createElement('p', null),
    'last update at ',
    React.createElement('span', null, formatDate(forecast.dt, 'datetime')),
    React.createElement('p', null),
    React.createElement('section', null,
      React.createElement('div', { className: 'span4 div-left' },
        React.createElement('table', { className: 'table table-striped table-bordered table-condensed' },
          React.createElement('tbody', null,
            React.createElement('tr', null,
              React.createElement('td', null, 'Wind'),
              React.createElement('td', null, forecast.wind.speed + ' m/s')
            ),
            React.createElement('tr', null,
              React.createElement('td', null, 'Cloudiness'),
              React.createElement('td', null, forecast.clouds.all + ' %')
            ),
            React.createElement('tr', null,
              React.createElement('td', null, 'Pressure'),
              React.createElement('td', null, forecast.main.pressure + ' hpa')
            ),
            forecast.main.sea_level ? React.createElement('tr', null,
              React.createElement('td', null, 'Sea Level'),
              React.createElement('td', null, forecast.main.sea_level + ' hpa')
            ) : null,
            forecast.main.grnd_level ? React.createElement('tr', null,
              React.createElement('td', null, 'Ground Level'),
              React.createElement('td', null, forecast.main.grnd_level + ' hpa')
            ) : null,
            React.createElement('tr', null,
              React.createElement('td', null, 'Humidity'),
              React.createElement('td', null, forecast.main.humidity + ' %')
            ),
            React.createElement('tr', null,
              React.createElement('td', null, 'Minimum Temp'),
              React.createElement('td', null, forecast.main.temp_min + ' \u00B0C')
            ),
            React.createElement('tr', null,
              React.createElement('td', null, 'Maximum Temp'),
              React.createElement('td', null, forecast.main.temp_max + ' \u00B0C')
            ),
            React.createElement('tr', null,
              React.createElement('td', null, 'Sunrise'),
              React.createElement('td', null, formatDate(forecast.sys.sunrise, 'time'))
            ),
            React.createElement('tr', null,
              React.createElement('td', null, 'Sunset'),
              React.createElement('td', null, formatDate(forecast.sys.sunset, 'time'))
            ),
            forecast.rain ? React.createElement('tr', null,
              React.createElement('td', null, 'Rain'),
              React.createElement('td', null, forecast.rain['3h'] + ' (mm/3 hour)')
            ) : null,
            forecast.snow ? React.createElement('tr', null,
              React.createElement('td', null, 'Snow'),
              React.createElement('td', null, forecast.snow['3h'] + ' (mm/3 hour)')
            ) : null
          )
        )
      ),
      React.createElement('div', {
        id: 'map-canvas',
        style: { width: '400px', height: '350px' },
        className: 'div-right'
      })
    )
  );
}

module.exports = ForecastGrid;
