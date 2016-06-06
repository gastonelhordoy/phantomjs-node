"use strict";

var _proxyquire = require("proxyquire");

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _phantomjsPrebuilt = require("phantomjs-prebuilt");

var _phantomjsPrebuilt2 = _interopRequireDefault(_phantomjsPrebuilt);

var _phantom = require("../phantom");

var _phantom2 = _interopRequireDefault(_phantom);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _page = require("../page");

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Phantom', function () {
    var instance = void 0;
    beforeAll(function () {
        return instance = new _phantom2.default();
    });
    afterAll(function () {
        return instance.exit();
    });

    it('#createPage() returns a Promise', function () {
        expect(instance.createPage()).toEqual(jasmine.any(Promise));
    });

    it('#createPage() resolves to a Page', function (done) {
        instance.createPage().then(function (page) {
            expect(page).toEqual(jasmine.any(_page2.default));
            done();
        });
    });

    it('#create([]) execute with no parameters', function () {
        spyOn(_child_process2.default, 'spawn').and.callThrough();
        var ProxyPhantom = (0, _proxyquire2.default)('../phantom', {
            child_process: _child_process2.default
        }).default;

        var pp = new ProxyPhantom();
        var pathToShim = _path2.default.normalize(__dirname + '/../shim.js');
        expect(_child_process2.default.spawn).toHaveBeenCalledWith(_phantomjsPrebuilt2.default.path, [pathToShim]);
        pp.exit();
    });

    it('#create(["--ignore-ssl-errors=yes"]) adds parameter to process', function () {
        spyOn(_child_process2.default, 'spawn').and.callThrough();
        var ProxyPhantom = (0, _proxyquire2.default)('../phantom', {
            child_process: _child_process2.default
        }).default;
        var pp = new ProxyPhantom(['--ignore-ssl-errors=yes']);
        var pathToShim = _path2.default.normalize(__dirname + '/../shim.js');
        expect(_child_process2.default.spawn).toHaveBeenCalledWith(_phantomjsPrebuilt2.default.path, ['--ignore-ssl-errors=yes', pathToShim]);
        pp.exit();
    });

    it('#create("--ignore-ssl-errors=yes") to throw an exception', function () {
        expect(function () {
            return new _phantom2.default('--ignore-ssl-errors=yes');
        }).toThrow();
    });

    it('#create(true) to throw an exception', function () {
        expect(function () {
            return new _phantom2.default(true);
        }).toThrow();
    });
});