"use strict";

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _phantom = require("../phantom");

var _phantom2 = _interopRequireDefault(_phantom);

require("babel-polyfill");

var _out_object = require("../out_object");

var _out_object2 = _interopRequireDefault(_out_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('jasmine-co').install();

describe('Command', function () {
    var server = void 0;
    var phantom = void 0;
    beforeAll(function (done) {
        server = _http2.default.createServer(function (request, response) {
            return response.end('hi, ' + request.url);
        });
        server.listen(8888, done);
    });

    afterAll(function () {
        return server.close();
    });
    beforeEach(function () {
        return phantom = new _phantom2.default();
    });
    afterEach(function () {
        return phantom.exit();
    });

    it('target to be set', function () {
        expect(phantom.createOutObject().target).toEqual(jasmine.any(String));
    });

    it('#createOutObject() is a valid OutObject', function () {
        var outObj = phantom.createOutObject();
        expect(outObj).toEqual(jasmine.any(_out_object2.default));
    });

    it('#property() returns a value set by phantom', regeneratorRuntime.mark(function _callee() {
        var page, outObj, lastResponse;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context.sent;
                        outObj = phantom.createOutObject();
                        _context.next = 6;
                        return page.property('onResourceReceived', function (response, out) {
                            out.lastResponse = response;
                        }, outObj);

                    case 6:
                        _context.next = 8;
                        return page.open('http://localhost:8888/test');

                    case 8:
                        _context.next = 10;
                        return outObj.property('lastResponse');

                    case 10:
                        lastResponse = _context.sent;


                        expect(lastResponse.url).toEqual('http://localhost:8888/test');

                    case 12:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    it('#property() returns a value set by phantom and node', regeneratorRuntime.mark(function _callee2() {
        var page, outObj, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context2.sent;
                        outObj = phantom.createOutObject();


                        outObj.test = 'fooBar$';

                        _context2.next = 7;
                        return page.property('onResourceReceived', function (response, out) {
                            out.data = out.test + response.url;
                        }, outObj);

                    case 7:
                        _context2.next = 9;
                        return page.open('http://localhost:8888/test2');

                    case 9:
                        _context2.next = 11;
                        return outObj.property('data');

                    case 11:
                        data = _context2.sent;

                        expect(data).toEqual('fooBar$http://localhost:8888/test2');

                    case 13:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    it('#property() works with input params', regeneratorRuntime.mark(function _callee3() {
        var page, outObj, data;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context3.sent;
                        outObj = phantom.createOutObject();
                        _context3.next = 6;
                        return page.property('onResourceReceived', function (response, test, out) {
                            out.data = test;
                        }, 'test', outObj);

                    case 6:
                        _context3.next = 8;
                        return page.open('http://localhost:8888/test2');

                    case 8:
                        _context3.next = 10;
                        return outObj.property('data');

                    case 10:
                        data = _context3.sent;

                        expect(data).toEqual('test');

                    case 12:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));
});