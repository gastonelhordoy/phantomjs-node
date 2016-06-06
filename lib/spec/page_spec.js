"use strict";

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _phantom = require("../phantom");

var _phantom2 = _interopRequireDefault(_phantom);

require("babel-polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('jasmine-co').install();

describe('Page', function () {
    var server = void 0;
    var phantom = void 0;
    beforeAll(function (done) {
        server = _http2.default.createServer(function (request, response) {
            if (request.url === '/script.js') {
                response.end('window.fooBar = 2;');
            } else if (request.url === '/test.html') {
                response.end('<html><head><title>Page Title</title></head><body>Test</body></html>');
            } else {
                response.end('hi, ' + request.url);
            }
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

    it('#open() a valid page', regeneratorRuntime.mark(function _callee() {
        var page, status;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context.sent;
                        _context.next = 5;
                        return page.open('http://localhost:8888/test');

                    case 5:
                        status = _context.sent;

                        expect(status).toEqual('success');

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    it('#property(\'plainText\') returns valid content', regeneratorRuntime.mark(function _callee2() {
        var page, content;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context2.sent;
                        _context2.next = 5;
                        return page.open('http://localhost:8888/test');

                    case 5:
                        _context2.next = 7;
                        return page.property('plainText');

                    case 7:
                        content = _context2.sent;

                        expect(content).toEqual('hi, /test');

                    case 9:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    it('#property(\'onResourceRequested\', function(){}) sets property', regeneratorRuntime.mark(function _callee3() {
        var page, content;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context3.sent;
                        _context3.next = 5;
                        return page.property('onResourceRequested', function (requestData, networkRequest) {
                            networkRequest.changeUrl('http://localhost:8888/foo-bar-xyz');
                        });

                    case 5:
                        _context3.next = 7;
                        return page.open('http://localhost:8888/whatever');

                    case 7:
                        _context3.next = 9;
                        return page.property('plainText');

                    case 9:
                        content = _context3.sent;

                        expect(content).toEqual('hi, /foo-bar-xyz'); // should have been changed to /foo-bar-xyz

                    case 11:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    it('#property(\'onResourceRequested\', function(){}, params...) passes parameters', regeneratorRuntime.mark(function _callee4() {
        var page, RESULT;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context4.sent;

                        page.property('onResourceRequested', function (requestData, networkRequest, foo, a, b) {
                            RESULT = [foo, a, b];
                        }, 'foobar', 1, -100);
                        _context4.next = 6;
                        return page.open('http://localhost:8888/whatever');

                    case 6:
                        _context4.next = 8;
                        return phantom.windowProperty('RESULT');

                    case 8:
                        RESULT = _context4.sent;

                        expect(RESULT).toEqual(['foobar', 1, -100]);

                    case 10:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    it('#property(\'key\', value) sets property', regeneratorRuntime.mark(function _callee5() {
        var page, value;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context5.sent;
                        _context5.next = 5;
                        return page.property('viewportSize', { width: 800, height: 600 });

                    case 5:
                        _context5.next = 7;
                        return page.property('viewportSize');

                    case 7:
                        value = _context5.sent;

                        expect(value).toEqual({ width: 800, height: 600 });

                    case 9:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    it('#property(\'paperSize\', value) sets value properly with phantom.paperSize', regeneratorRuntime.mark(function _callee6() {
        var page, file;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context6.sent;

                        page.property('paperSize', {
                            width: '8.5in',
                            height: '11in',
                            header: {
                                height: "1cm",
                                contents: phantom.callback(function (pageNum, numPages) {
                                    return "<h1>Header <span style='float:right'>" + pageNum + " / " + numPages + "</span></h1>";
                                })
                            },
                            footer: {
                                height: "1cm",
                                contents: phantom.callback(function (pageNum, numPages) {
                                    return "<h1>Footer <span style='float:right'>" + pageNum + " / " + numPages + "</span></h1>";
                                })
                            }
                        });

                        _context6.next = 6;
                        return page.open('http://localhost:8888/test');

                    case 6:
                        file = 'test.pdf';
                        _context6.next = 9;
                        return page.render(file);

                    case 9:
                        expect(function () {
                            _fs2.default.accessSync(file, _fs2.default.F_OK);
                        }).not.toThrow();
                        _fs2.default.unlinkSync(file);

                    case 11:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    it('#setting(\'javascriptEnabled\') returns true', regeneratorRuntime.mark(function _callee7() {
        var page, value;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context7.sent;
                        _context7.next = 5;
                        return page.setting('javascriptEnabled');

                    case 5:
                        value = _context7.sent;

                        expect(value).toBe(true);

                    case 7:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    it('#setting(\'key\', value) sets setting', regeneratorRuntime.mark(function _callee8() {
        var page, value;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context8.sent;
                        _context8.next = 5;
                        return page.setting('javascriptEnabled', false);

                    case 5:
                        _context8.next = 7;
                        return page.setting('javascriptEnabled');

                    case 7:
                        value = _context8.sent;

                        expect(value).toBe(false);

                    case 9:
                    case "end":
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    it('#evaluate(function(){return document.title}) executes correctly', regeneratorRuntime.mark(function _callee9() {
        var page, response;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context9.sent;
                        _context9.next = 5;
                        return page.open('http://localhost:8888/test.html');

                    case 5:
                        _context9.next = 7;
                        return page.evaluate(function () {
                            return document.title;
                        });

                    case 7:
                        response = _context9.sent;

                        expect(response).toEqual('Page Title');

                    case 9:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    it('#evaluate(function(){...}) executes correctly', regeneratorRuntime.mark(function _callee10() {
        var page, response;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context10.sent;
                        _context10.next = 5;
                        return page.evaluate(function () {
                            return 'test';
                        });

                    case 5:
                        response = _context10.sent;

                        expect(response).toEqual('test');

                    case 7:
                    case "end":
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));

    it('#evaluateJavaScript(\'function(){return document.title}\') executes correctly', regeneratorRuntime.mark(function _callee11() {
        var page, response;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context11.sent;
                        _context11.next = 5;
                        return page.open('http://localhost:8888/test.html');

                    case 5:
                        _context11.next = 7;
                        return page.evaluate('function () { return document.title }');

                    case 7:
                        response = _context11.sent;

                        expect(response).toEqual('Page Title');

                    case 9:
                    case "end":
                        return _context11.stop();
                }
            }
        }, _callee11, this);
    }));

    it('#evaluateJavaScript(\'function(){...}\') executes correctly', regeneratorRuntime.mark(function _callee12() {
        var page, response;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context12.sent;
                        _context12.next = 5;
                        return page.evaluate('function () { return \'test\' }');

                    case 5:
                        response = _context12.sent;

                        expect(response).toEqual('test');

                    case 7:
                    case "end":
                        return _context12.stop();
                }
            }
        }, _callee12, this);
    }));

    it('#injectJs() properly injects a js file', regeneratorRuntime.mark(function _callee13() {
        var page, response;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _context13.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context13.sent;
                        _context13.next = 5;
                        return page.open('http://localhost:8888/test');

                    case 5:
                        _context13.next = 7;
                        return page.injectJs(__dirname + '/inject_example.js');

                    case 7:
                        _context13.next = 9;
                        return page.evaluate(function () {
                            return foo; // eslint-disable-line no-undef
                        });

                    case 9:
                        response = _context13.sent;


                        expect(response).toEqual(1);

                    case 11:
                    case "end":
                        return _context13.stop();
                }
            }
        }, _callee13, this);
    }));

    it('#includeJs() properly injects a js file', regeneratorRuntime.mark(function _callee14() {
        var page, response;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _context14.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context14.sent;
                        _context14.next = 5;
                        return page.open('http://localhost:8888/test');

                    case 5:
                        _context14.next = 7;
                        return page.includeJs('http://localhost:8888/script.js');

                    case 7:
                        _context14.next = 9;
                        return page.evaluate(function () {
                            return fooBar; // eslint-disable-line no-undef
                        });

                    case 9:
                        response = _context14.sent;

                        expect(response).toEqual(2);

                    case 11:
                    case "end":
                        return _context14.stop();
                }
            }
        }, _callee14, this);
    }));

    it('#render() creates a file', regeneratorRuntime.mark(function _callee15() {
        var page, file;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        _context15.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context15.sent;
                        _context15.next = 5;
                        return page.open('http://localhost:8888/test');

                    case 5:
                        file = 'test.png';
                        _context15.next = 8;
                        return page.render(file);

                    case 8:
                        expect(function () {
                            _fs2.default.accessSync(file, _fs2.default.F_OK);
                        }).not.toThrow();
                        _fs2.default.unlinkSync(file);

                    case 10:
                    case "end":
                        return _context15.stop();
                }
            }
        }, _callee15, this);
    }));

    it('#renderBase64() returns encoded PNG', regeneratorRuntime.mark(function _callee16() {
        var page, content;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                        _context16.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context16.sent;
                        _context16.next = 5;
                        return page.open('http://localhost:8888/test');

                    case 5:
                        _context16.next = 7;
                        return page.renderBase64('PNG');

                    case 7:
                        content = _context16.sent;

                        expect(content).not.toBeNull();

                    case 9:
                    case "end":
                        return _context16.stop();
                }
            }
        }, _callee16, this);
    }));

    it('#addCookie() adds a cookie to the page', regeneratorRuntime.mark(function _callee17() {
        var page, cookies;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        _context17.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context17.sent;
                        _context17.next = 5;
                        return page.addCookie({
                            'name': 'Valid-Cookie-Name',
                            'value': 'Valid-Cookie-Value',
                            'domain': 'localhost',
                            'path': '/foo',
                            'httponly': true,
                            'secure': false,
                            'expires': new Date().getTime() + 1000 * 60 * 60
                        });

                    case 5:
                        _context17.next = 7;
                        return page.property('cookies');

                    case 7:
                        cookies = _context17.sent;

                        expect(cookies[0].name).toEqual('Valid-Cookie-Name');

                    case 9:
                    case "end":
                        return _context17.stop();
                }
            }
        }, _callee17, this);
    }));

    it('#clearCookies() removes all cookies', regeneratorRuntime.mark(function _callee18() {
        var page, cookies;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
                switch (_context18.prev = _context18.next) {
                    case 0:
                        _context18.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context18.sent;
                        _context18.next = 5;
                        return page.addCookie({
                            'name': 'Valid-Cookie-Name',
                            'value': 'Valid-Cookie-Value',
                            'domain': 'localhost',
                            'path': '/foo',
                            'httponly': true,
                            'secure': false,
                            'expires': new Date().getTime() + 1000 * 60 * 60
                        });

                    case 5:
                        _context18.next = 7;
                        return page.clearCookies();

                    case 7:
                        _context18.next = 9;
                        return page.property('cookies');

                    case 9:
                        cookies = _context18.sent;

                        expect(cookies).toEqual([]);

                    case 11:
                    case "end":
                        return _context18.stop();
                }
            }
        }, _callee18, this);
    }));

    it('#deleteCookie() removes one cookie', regeneratorRuntime.mark(function _callee19() {
        var page, cookies;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        _context19.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context19.sent;
                        _context19.next = 5;
                        return page.addCookie({
                            'name': 'cookie-1',
                            'value': 'Valid-Cookie-Value',
                            'domain': 'localhost',
                            'path': '/foo',
                            'httponly': true,
                            'secure': false,
                            'expires': new Date().getTime() + 1000 * 60 * 60
                        });

                    case 5:
                        _context19.next = 7;
                        return page.addCookie({
                            'name': 'cookie-2',
                            'value': 'Valid-Cookie-Value',
                            'domain': 'localhost',
                            'path': '/foo',
                            'httponly': true,
                            'secure': false,
                            'expires': new Date().getTime() + 1000 * 60 * 60
                        });

                    case 7:
                        _context19.next = 9;
                        return page.property('cookies');

                    case 9:
                        cookies = _context19.sent;

                        expect(cookies.length).toBe(2);

                        _context19.next = 13;
                        return page.deleteCookie('cookie-1');

                    case 13:
                        _context19.next = 15;
                        return page.property('cookies');

                    case 15:
                        cookies = _context19.sent;


                        expect(cookies.length).toBe(1);
                        expect(cookies[0].name).toEqual('cookie-2');

                    case 18:
                    case "end":
                        return _context19.stop();
                }
            }
        }, _callee19, this);
    }));

    it('#reject(...) works when there is an error', regeneratorRuntime.mark(function _callee20() {
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
            while (1) {
                switch (_context20.prev = _context20.next) {
                    case 0:
                        _context20.prev = 0;
                        _context20.next = 3;
                        return phantom.execute('phantom', 'doesNotExist');

                    case 3:
                        _context20.next = 8;
                        break;

                    case 5:
                        _context20.prev = 5;
                        _context20.t0 = _context20["catch"](0);

                        expect(_context20.t0.message).toEqual("undefined is not an object (evaluating 'method.apply')");

                    case 8:
                    case "end":
                        return _context20.stop();
                }
            }
        }, _callee20, this, [[0, 5]]);
    }));

    it('multiple pages can be opened', regeneratorRuntime.mark(function _callee21() {
        var page1, page2, content;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
            while (1) {
                switch (_context21.prev = _context21.next) {
                    case 0:
                        _context21.next = 2;
                        return phantom.createPage();

                    case 2:
                        page1 = _context21.sent;
                        _context21.next = 5;
                        return page1.open('http://localhost:8888/test1');

                    case 5:
                        page1.close();

                        _context21.next = 8;
                        return phantom.createPage();

                    case 8:
                        page2 = _context21.sent;
                        _context21.next = 11;
                        return page2.open('http://localhost:8888/test2');

                    case 11:
                        _context21.next = 13;
                        return page2.property('plainText');

                    case 13:
                        content = _context21.sent;

                        expect(content).toEqual('hi, /test2');
                        page2.close();

                    case 16:
                    case "end":
                        return _context21.stop();
                }
            }
        }, _callee21, this);
    }));

    it('#windowProperty() returns a window value', regeneratorRuntime.mark(function _callee22() {
        var page, lastResponse;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
            while (1) {
                switch (_context22.prev = _context22.next) {
                    case 0:
                        _context22.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context22.sent;
                        _context22.next = 5;
                        return page.property('onResourceReceived', function (response) {
                            lastResponse = response;
                        });

                    case 5:
                        _context22.next = 7;
                        return page.open('http://localhost:8888/test');

                    case 7:
                        _context22.next = 9;
                        return phantom.windowProperty('lastResponse');

                    case 9:
                        lastResponse = _context22.sent;

                        expect(lastResponse.url).toEqual('http://localhost:8888/test');

                    case 11:
                    case "end":
                        return _context22.stop();
                }
            }
        }, _callee22, this);
    }));

    it('#setContent() works with custom url', regeneratorRuntime.mark(function _callee23() {
        var page, html, response;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
            while (1) {
                switch (_context23.prev = _context23.next) {
                    case 0:
                        _context23.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context23.sent;
                        html = '<html><head><title>setContent Title</title></head><body></body></html>';
                        _context23.next = 6;
                        return page.setContent(html, 'http://localhost:8888/');

                    case 6:
                        _context23.next = 8;
                        return page.evaluate(function () {
                            return [document.title, location.href];
                        });

                    case 8:
                        response = _context23.sent;


                        expect(response).toEqual(['setContent Title', 'http://localhost:8888/']);

                    case 10:
                    case "end":
                        return _context23.stop();
                }
            }
        }, _callee23, this);
    }));

    it('#sendEvent() sends an event', regeneratorRuntime.mark(function _callee24() {
        var page, html, response;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
            while (1) {
                switch (_context24.prev = _context24.next) {
                    case 0:
                        _context24.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context24.sent;
                        html = '<html  onclick="docClicked = true;"><head><title>setContent Title</title></head><body></body></html>';
                        _context24.next = 6;
                        return page.setContent(html, 'http://localhost:8888/');

                    case 6:
                        _context24.next = 8;
                        return page.sendEvent('click', 1, 2);

                    case 8:
                        _context24.next = 10;
                        return page.evaluate(function () {
                            return window.docClicked;
                        });

                    case 10:
                        response = _context24.sent;


                        expect(response).toBe(true);

                    case 12:
                    case "end":
                        return _context24.stop();
                }
            }
        }, _callee24, this);
    }));

    it('#on() can register an event in the page and run the code locally', regeneratorRuntime.mark(function _callee25() {
        var page, runnedHere;
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
            while (1) {
                switch (_context25.prev = _context25.next) {
                    case 0:
                        _context25.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context25.sent;
                        runnedHere = false;
                        _context25.next = 6;
                        return page.on('onResourceReceived', function () {
                            runnedHere = true;
                        });

                    case 6:
                        _context25.next = 8;
                        return page.open('http://localhost:8888/test');

                    case 8:

                        expect(runnedHere).toBe(true);

                    case 9:
                    case "end":
                        return _context25.stop();
                }
            }
        }, _callee25, this);
    }));

    it('#on() event registered does not run if not triggered', regeneratorRuntime.mark(function _callee26() {
        var page, runnedHere;
        return regeneratorRuntime.wrap(function _callee26$(_context26) {
            while (1) {
                switch (_context26.prev = _context26.next) {
                    case 0:
                        _context26.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context26.sent;
                        runnedHere = false;
                        _context26.next = 6;
                        return page.on('onResourceReceived', function () {
                            runnedHere = true;
                        });

                    case 6:

                        expect(runnedHere).toBe(false);

                    case 7:
                    case "end":
                        return _context26.stop();
                }
            }
        }, _callee26, this);
    }));

    it('#on() can register more than one event of the same type', regeneratorRuntime.mark(function _callee27() {
        var page, runnedHere, runnedHereToo;
        return regeneratorRuntime.wrap(function _callee27$(_context27) {
            while (1) {
                switch (_context27.prev = _context27.next) {
                    case 0:
                        _context27.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context27.sent;
                        runnedHere = false;
                        _context27.next = 6;
                        return page.on('onResourceReceived', function () {
                            runnedHere = true;
                        });

                    case 6:
                        runnedHereToo = false;
                        _context27.next = 9;
                        return page.on('onResourceReceived', function () {
                            runnedHereToo = true;
                        });

                    case 9:
                        _context27.next = 11;
                        return page.open('http://localhost:8888/test');

                    case 11:

                        expect(runnedHere).toBe(true);
                        expect(runnedHereToo).toBe(true);

                    case 13:
                    case "end":
                        return _context27.stop();
                }
            }
        }, _callee27, this);
    }));

    it('#on() can pass parameters', regeneratorRuntime.mark(function _callee28() {
        var page, parameterProvided;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
            while (1) {
                switch (_context28.prev = _context28.next) {
                    case 0:
                        _context28.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context28.sent;
                        parameterProvided = false;
                        _context28.next = 6;
                        return page.on('onResourceReceived', function (status, param) {
                            parameterProvided = param;
                        }, 'param');

                    case 6:
                        _context28.next = 8;
                        return page.open('http://localhost:8888/test');

                    case 8:

                        expect(parameterProvided).toBe('param');

                    case 9:
                    case "end":
                        return _context28.stop();
                }
            }
        }, _callee28, this);
    }));

    it('#on() can register an event in the page which code runs in phantom runtime', regeneratorRuntime.mark(function _callee29() {
        var page, runnedHere, runnedInPhantomRuntime;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
            while (1) {
                switch (_context29.prev = _context29.next) {
                    case 0:
                        _context29.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context29.sent;
                        runnedHere = false;
                        _context29.next = 6;
                        return page.on('onLoadFinished', true, function () {
                            runnedHere = true;
                            runnedInPhantomRuntime = true;
                        });

                    case 6:
                        _context29.next = 8;
                        return page.open('http://localhost:8888/test');

                    case 8:
                        _context29.next = 10;
                        return phantom.windowProperty('runnedInPhantomRuntime');

                    case 10:
                        runnedInPhantomRuntime = _context29.sent;


                        expect(runnedHere).toBe(false);
                        expect(runnedInPhantomRuntime).toBe(true);

                    case 13:
                    case "end":
                        return _context29.stop();
                }
            }
        }, _callee29, this);
    }));

    it('#on() can pass parameters to functions to be executed in phantom runtime', regeneratorRuntime.mark(function _callee30() {
        var page, parameterProvided;
        return regeneratorRuntime.wrap(function _callee30$(_context30) {
            while (1) {
                switch (_context30.prev = _context30.next) {
                    case 0:
                        _context30.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context30.sent;
                        _context30.next = 5;
                        return page.on('onResourceReceived', true, function (status, param) {
                            parameterProvided = param;
                        }, 'param');

                    case 5:
                        _context30.next = 7;
                        return page.open('http://localhost:8888/test');

                    case 7:
                        _context30.next = 9;
                        return phantom.windowProperty('parameterProvided');

                    case 9:
                        parameterProvided = _context30.sent;


                        expect(parameterProvided).toBe('param');

                    case 11:
                    case "end":
                        return _context30.stop();
                }
            }
        }, _callee30, this);
    }));

    it('#on() event supposed to run in phantom runtime wont run if not triggered', regeneratorRuntime.mark(function _callee31() {
        var page, runnedInPhantomRuntime;
        return regeneratorRuntime.wrap(function _callee31$(_context31) {
            while (1) {
                switch (_context31.prev = _context31.next) {
                    case 0:
                        _context31.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context31.sent;
                        _context31.next = 5;
                        return page.on('onResourceReceived', true, function () {
                            runnedInPhantomRuntime = true;
                        });

                    case 5:
                        _context31.next = 7;
                        return phantom.windowProperty('runnedInPhantomRuntime');

                    case 7:
                        runnedInPhantomRuntime = _context31.sent;


                        expect(runnedInPhantomRuntime).toBeFalsy();

                    case 9:
                    case "end":
                        return _context31.stop();
                }
            }
        }, _callee31, this);
    }));

    it('#on() can register at the same event to run locally or in phantom runtime', regeneratorRuntime.mark(function _callee32() {
        var page, runnedHere, runnedInPhantomRuntime;
        return regeneratorRuntime.wrap(function _callee32$(_context32) {
            while (1) {
                switch (_context32.prev = _context32.next) {
                    case 0:
                        _context32.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context32.sent;
                        runnedHere = false;
                        _context32.next = 6;
                        return page.on('onResourceReceived', true, function () {
                            runnedInPhantomRuntime = true;
                        });

                    case 6:
                        _context32.next = 8;
                        return page.on('onResourceReceived', function () {
                            runnedHere = true;
                        });

                    case 8:
                        _context32.next = 10;
                        return page.open('http://localhost:8888/test');

                    case 10:
                        _context32.next = 12;
                        return phantom.windowProperty('runnedInPhantomRuntime');

                    case 12:
                        runnedInPhantomRuntime = _context32.sent;


                        expect(runnedHere).toBe(true);
                        expect(runnedInPhantomRuntime).toBe(true);

                    case 15:
                    case "end":
                        return _context32.stop();
                }
            }
        }, _callee32, this);
    }));

    it('#off() can disable an event whose listener is going to run locally', regeneratorRuntime.mark(function _callee33() {
        var page, runnedHere;
        return regeneratorRuntime.wrap(function _callee33$(_context33) {
            while (1) {
                switch (_context33.prev = _context33.next) {
                    case 0:
                        _context33.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context33.sent;
                        runnedHere = false;
                        _context33.next = 6;
                        return page.on('onResourceReceived', function () {
                            runnedHere = true;
                        });

                    case 6:
                        _context33.next = 8;
                        return page.off('onResourceReceived');

                    case 8:
                        _context33.next = 10;
                        return page.open('http://localhost:8888/test');

                    case 10:

                        expect(runnedHere).toBe(false);

                    case 11:
                    case "end":
                        return _context33.stop();
                }
            }
        }, _callee33, this);
    }));

    it('#off() can disable an event whose listener is going to run on the phantom process', regeneratorRuntime.mark(function _callee34() {
        var page, runnedInPhantomRuntime;
        return regeneratorRuntime.wrap(function _callee34$(_context34) {
            while (1) {
                switch (_context34.prev = _context34.next) {
                    case 0:
                        _context34.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context34.sent;
                        _context34.next = 5;
                        return page.on('onResourceReceived', true, function () {
                            runnedInPhantomRuntime = true;
                        });

                    case 5:
                        _context34.next = 7;
                        return page.off('onResourceReceived');

                    case 7:
                        _context34.next = 9;
                        return page.open('http://localhost:8888/test');

                    case 9:
                        _context34.next = 11;
                        return phantom.windowProperty('runnedInPhantomRuntime');

                    case 11:
                        runnedInPhantomRuntime = _context34.sent;


                        expect(runnedInPhantomRuntime).toBeFalsy();

                    case 13:
                    case "end":
                        return _context34.stop();
                }
            }
        }, _callee34, this);
    }));

    it('#switchToFrame(framePosition) will switch to frame of framePosition', regeneratorRuntime.mark(function _callee35() {
        var page, html, inIframe;
        return regeneratorRuntime.wrap(function _callee35$(_context35) {
            while (1) {
                switch (_context35.prev = _context35.next) {
                    case 0:
                        _context35.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context35.sent;
                        html = '<html><head><title>Iframe Test</title></head><body><iframe id="testframe" src="http://localhost:8888/test.html"></iframe></body></html>';
                        _context35.next = 6;
                        return page.setContent(html, 'http://localhost:8888/');

                    case 6:
                        _context35.next = 8;
                        return page.switchToFrame(0);

                    case 8:
                        _context35.next = 10;
                        return page.evaluate(function () {
                            // are we in the iframe?
                            return window.frameElement && window.frameElement.id === 'testframe';
                        });

                    case 10:
                        inIframe = _context35.sent;


                        // confirm we are in an iframe
                        expect(inIframe).toBe(true);

                    case 12:
                    case "end":
                        return _context35.stop();
                }
            }
        }, _callee35, this);
    }));

    it('#switchToMainFrame() will switch back to the main frame', regeneratorRuntime.mark(function _callee36() {
        var page, html, inMainFrame;
        return regeneratorRuntime.wrap(function _callee36$(_context36) {
            while (1) {
                switch (_context36.prev = _context36.next) {
                    case 0:
                        _context36.next = 2;
                        return phantom.createPage();

                    case 2:
                        page = _context36.sent;
                        html = '<html><head><title>Iframe Test</title></head><body><iframe id="testframe" src="http://localhost:8888/test.html"></iframe></body></html>';
                        _context36.next = 6;
                        return page.setContent(html, 'http://localhost:8888/');

                    case 6:
                        _context36.next = 8;
                        return page.switchToFrame(0);

                    case 8:
                        _context36.next = 10;
                        return page.switchToMainFrame();

                    case 10:
                        _context36.next = 12;
                        return page.evaluate(function () {
                            // are we in the main frame?
                            return !window.frameElement;
                        });

                    case 12:
                        inMainFrame = _context36.sent;


                        // confirm we are in the main frame
                        expect(inMainFrame).toBe(true);

                    case 14:
                    case "end":
                        return _context36.stop();
                }
            }
        }, _callee36, this);
    }));
});