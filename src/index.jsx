'use strict';

var React = require('react');
var ReactDOM = require('react-dom/client');
var App = require('./App.jsx');

var root = ReactDOM.createRoot(document.getElementById('app'));
root.render(React.createElement(App));
