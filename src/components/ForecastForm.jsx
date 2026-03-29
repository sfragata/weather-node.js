'use strict';

var React = require('react');
var useState = React.useState;
var useRef = React.useRef;
var useEffect = React.useEffect;
var useCallback = React.useCallback;

var AUTOCOMPLETE_DEBOUNCE_MS = 300;
var MAP_RENDER_DELAY_MS = 100;

function ForecastForm(props) {
  var cityState = useState('');
  var city = cityState[0];
  var setCity = cityState[1];

  var suggestionsState = useState([]);
  var suggestions = suggestionsState[0];
  var setSuggestions = suggestionsState[1];

  var showSuggestionsState = useState(false);
  var showSuggestions = showSuggestionsState[0];
  var setShowSuggestions = showSuggestionsState[1];

  var activeSuggestionState = useState(-1);
  var activeSuggestion = activeSuggestionState[0];
  var setActiveSuggestion = activeSuggestionState[1];

  var debounceRef = useRef(null);
  var inputRef = useRef(null);

  var fetchCities = useCallback(function (query) {
    fetch('/weather/city/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: query })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        var filtered = (data.cities || []).filter(function (c) { return c && c.trim() !== ''; });
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setActiveSuggestion(-1);
      })
      .catch(function () {
        setSuggestions([]);
        setShowSuggestions(false);
      });
  }, []);

  function handleInputChange(e) {
    var value = e.target.value;
    setCity(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length >= 3) {
      debounceRef.current = setTimeout(function () {
        fetchCities(value);
      }, AUTOCOMPLETE_DEBOUNCE_MS);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(suggestion) {
    setCity(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function handleKeyDown(e) {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(function (prev) {
        return prev < suggestions.length - 1 ? prev + 1 : prev;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(function (prev) {
        return prev > 0 ? prev - 1 : 0;
      });
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!city.trim()) return;

    props.onError(null);

    fetch('/weather/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: city })
    })
      .then(function (response) {
        if (!response.ok) {
          return response.text().then(function (text) {
            throw new Error(text || 'Failed to fetch forecast');
          });
        }
        return response.json();
      })
      .then(function (data) {
        props.onForecast(data);
        props.onError(null);
        setCity('');
        setSuggestions([]);
        setShowSuggestions(false);

        if (data.coord && typeof google !== 'undefined') {
          // Delay to ensure the DOM element is rendered before initializing the map
          setTimeout(function () { renderMap(data); }, MAP_RENDER_DELAY_MS);
        }
      })
      .catch(function (err) {
        props.onForecast(null);
        props.onError(err.message);
        var mapCanvas = document.getElementById('map-canvas');
        if (mapCanvas) {
          mapCanvas.innerHTML = '';
          mapCanvas.style.backgroundColor = '#FFFFFF';
        }
      });
  }

  function renderMap(data) {
    var myLatlng = new google.maps.LatLng(data.coord.lat, data.coord.lon);
    var mapOptions = {
      center: myLatlng,
      zoom: 8,
      mapId: 'DEMO_MAP_ID'
    };

    var contentString = data.main.temp + '\u00B0C ' + data.weather[0].description +
      ' (' + data.weather[0].main + ')';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var marker = new google.maps.marker.AdvancedMarkerElement({
      position: myLatlng,
      map: map,
      title: data.name
    });

    marker.addEventListener('gmp-click', function () {
      infowindow.open({ anchor: marker, map: map });
    });
  }

  useEffect(function () {
    function handleClickOutside(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return function () {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  var isValid = city.trim().length > 0;

  return React.createElement('div', { style: { width: '400px' } },
    React.createElement('form', { noValidate: true, onSubmit: handleSubmit },
      React.createElement('label', { htmlFor: 'city' },
        React.createElement('h2', null, 'City')
      ),
      React.createElement('fieldset', { className: 'form-group' },
        React.createElement('div', { ref: inputRef, style: { position: 'relative' } },
          React.createElement('input', {
            id: 'city',
            className: 'form-control',
            placeholder: 'enter a City',
            title: 'City',
            value: city,
            onChange: handleInputChange,
            onKeyDown: handleKeyDown,
            autoComplete: 'off',
            required: true
          }),
          showSuggestions ? React.createElement('ul', {
            className: 'ui-autocomplete ui-menu',
            style: {
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              maxHeight: '200px',
              overflowY: 'auto'
            }
          },
          suggestions.map(function (suggestion, index) {
            return React.createElement('li', {
              key: index,
              className: 'ui-menu-item' + (index === activeSuggestion ? ' ui-state-active' : ''),
              style: {
                padding: '5px 10px',
                cursor: 'pointer',
                backgroundColor: index === activeSuggestion ? '#007bff' : 'white',
                color: index === activeSuggestion ? 'white' : 'black'
              },
              onClick: function () { handleSuggestionClick(suggestion); }
            }, suggestion);
          })
          ) : null
        )
      ),
      React.createElement('fieldset', { className: 'form-group' },
        React.createElement('input', {
          type: 'submit',
          className: 'btn btn-primary pull-right',
          disabled: !isValid,
          value: 'Send'
        })
      )
    )
  );
}

module.exports = ForecastForm;
