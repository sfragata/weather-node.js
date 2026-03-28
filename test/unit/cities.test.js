'use strict';

var assert = require('assert');
var sinon = require('sinon');
var http = require('http');
var EventEmitter = require('events');

describe('cities module', function () {
  var cities;
  var req;
  var res;

  beforeEach(function () {
    cities = require('../../modules/cities');
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

  it('should return city list on successful HTTP response', function (done) {
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

    res.send = sinon.stub().callsFake(function (body) {
      assert.deepStrictEqual(body, { cities: ['London, GB', 'London, US'] });
      done();
    });

    cities.list(req, res);
  });

  it('should return 500 when HTTP request fails', function (done) {
    sinon.stub(http, 'get').callsFake(function (url, callback) {
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

    cities.list(req, res);
  });

  it('should forward non-200 status codes', function (done) {
    sinon.stub(http, 'get').callsFake(function (url, callback) {
      var mockResponse = new EventEmitter();
      mockResponse.statusCode = 503;
      mockResponse.setEncoding = sinon.stub();
      callback(mockResponse);
      return new EventEmitter();
    });

    res.sendStatus = sinon.stub().callsFake(function (code) {
      assert.strictEqual(code, 503);
      done();
    });

    cities.list(req, res);
  });
});
