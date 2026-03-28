'use strict';

var assert = require('assert');
var sinon = require('sinon');
var https = require('https');
var EventEmitter = require('events');

describe('forecast module', function () {
  var forecast;
  var req;
  var res;

  beforeEach(function () {
    forecast = require('../../modules/forecast');
    req = { body: { city: 'London' } };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      sendStatus: sinon.stub()
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should return weather data for a valid city', function (done) {
    var weatherData = {
      cod: 200,
      name: 'London',
      main: { temp: 15 },
      weather: [{ description: 'clear sky', icon: '01d', main: 'Clear' }],
      sys: { country: 'GB', sunrise: 1000, sunset: 2000 },
      wind: { speed: 5 },
      clouds: { all: 10 },
      coord: { lon: -0.1257, lat: 51.5085 },
      dt: 1620000000
    };

    sinon.stub(https, 'get').callsFake(function (url, callback) {
      var mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;
      mockResponse.setEncoding = sinon.stub();
      callback(mockResponse);
      process.nextTick(function () {
        mockResponse.emit('data', JSON.stringify(weatherData));
        mockResponse.emit('end');
      });
      return new EventEmitter();
    });

    res.send = sinon.stub().callsFake(function (body) {
      assert.strictEqual(body.name, 'London');
      assert.strictEqual(body.cod, 200);
      done();
    });

    forecast.retrieve(req, res);
  });

  it('should handle city not found (API returns non-200 cod)', function (done) {
    var errorData = { cod: 404, message: 'city not found' };

    sinon.stub(https, 'get').callsFake(function (url, callback) {
      var mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;
      mockResponse.setEncoding = sinon.stub();
      callback(mockResponse);
      process.nextTick(function () {
        mockResponse.emit('data', JSON.stringify(errorData));
        mockResponse.emit('end');
      });
      return new EventEmitter();
    });

    res.send = sinon.stub().callsFake(function (body) {
      assert.strictEqual(body, 'city not found');
      done();
    });

    forecast.retrieve(req, res);
  });

  it('should forward non-200 HTTP status codes', function (done) {
    sinon.stub(https, 'get').callsFake(function (url, callback) {
      var mockResponse = new EventEmitter();
      mockResponse.statusCode = 401;
      mockResponse.setEncoding = sinon.stub();
      callback(mockResponse);
      return new EventEmitter();
    });

    res.sendStatus = sinon.stub().callsFake(function (code) {
      assert.strictEqual(code, 401);
      done();
    });

    forecast.retrieve(req, res);
  });

  it('should return 500 when HTTPS request fails', function (done) {
    sinon.stub(https, 'get').callsFake(function (url, callback) {
      var mockRequest = new EventEmitter();
      process.nextTick(function () {
        mockRequest.emit('error', new Error('Connection refused'));
      });
      return mockRequest;
    });

    res.send = sinon.stub().callsFake(function (body) {
      assert.strictEqual(res.status.calledWith(500), true);
      assert.deepStrictEqual(body, { error: 'Internal server error' });
      done();
    });

    forecast.retrieve(req, res);
  });
});
