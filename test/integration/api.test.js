'use strict';

var assert = require('assert');
var sinon = require('sinon');
var supertest = require('supertest');
var http = require('http');
var https = require('https');
var EventEmitter = require('events');

var app = require('../../weather');

describe('API Integration Tests', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('GET / redirect', function () {
    it('should redirect root to /weather/index.html', function (done) {
      supertest(app)
        .get('/')
        .expect(302)
        .expect('Location', '/weather/index.html', done);
    });
  });

  describe('POST /weather/city/list', function () {
    it('should return 200 with city list on success', function (done) {
      sinon.stub(http, 'get').callsFake(function (url, callback) {
        var mockResponse = new EventEmitter();
        mockResponse.statusCode = 200;
        mockResponse.setEncoding = sinon.stub();
        callback(mockResponse);
        process.nextTick(function () {
          mockResponse.emit('data', '?(["London, GB","London, US"]);');
          mockResponse.emit('end');
        });
        return new EventEmitter();
      });

      supertest(app)
        .post('/weather/city/list')
        .send({ city: 'London' })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          assert.ok(res.body.cities);
          assert.ok(Array.isArray(res.body.cities));
          done();
        });
    });

    it('should return 500 when upstream city service is unavailable', function (done) {
      sinon.stub(http, 'get').callsFake(function (url, callback) {
        var mockRequest = new EventEmitter();
        process.nextTick(function () {
          mockRequest.emit('error', new Error('Connection refused'));
        });
        return mockRequest;
      });

      supertest(app)
        .post('/weather/city/list')
        .send({ city: 'London' })
        .expect(500, done);
    });
  });

  describe('POST /weather/forecast', function () {
    it('should return 200 with forecast data on success', function (done) {
      var weatherData = {
        cod: 200,
        name: 'London',
        main: { temp: 15, humidity: 80, pressure: 1013, temp_min: 10, temp_max: 20 },
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

      supertest(app)
        .post('/weather/forecast')
        .send({ city: 'London' })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.name, 'London');
          assert.strictEqual(res.body.cod, 200);
          done();
        });
    });

    it('should return 404 when city is not found', function (done) {
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

      supertest(app)
        .post('/weather/forecast')
        .send({ city: 'NonExistentCity12345' })
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          assert.strictEqual(res.text, 'city not found');
          done();
        });
    });

    it('should return 500 when upstream weather service is unavailable', function (done) {
      sinon.stub(https, 'get').callsFake(function (url, callback) {
        var mockRequest = new EventEmitter();
        process.nextTick(function () {
          mockRequest.emit('error', new Error('Connection refused'));
        });
        return mockRequest;
      });

      supertest(app)
        .post('/weather/forecast')
        .send({ city: 'London' })
        .expect(500, done);
    });
  });

  describe('GET /weather/googlemaps', function () {
    it('should redirect to Google Maps API', function (done) {
      supertest(app)
        .get('/weather/googlemaps')
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err);
          assert.ok(res.headers.location.startsWith('https://maps.googleapis.com/'));
          done();
        });
    });
  });

  describe('GET /weather/index.html (static files)', function () {
    it('should serve the main HTML page', function (done) {
      supertest(app)
        .get('/weather/index.html')
        .expect(200)
        .expect('Content-Type', /html/, done);
    });
  });
});
