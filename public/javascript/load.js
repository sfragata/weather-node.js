// Load Google Maps API via server-side proxy route (keeps API key server-side)
(function () {
  var s = document.createElement('script');
  s.src = '/weather/googlemaps';
  document.head.appendChild(s);
}());