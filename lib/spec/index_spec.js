"use strict";

var _index = require("../index");

var _index2 = _interopRequireDefault(_index);

var _phantom = require("../phantom");

var _phantom2 = _interopRequireDefault(_phantom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('index.js', function () {
    it('phantom#create().then() returns a new Phantom instance', function (done) {
        _index2.default.create().then(function (ph) {
            expect(ph).toEqual(jasmine.any(_phantom2.default));
            ph.exit();
            done();
        });
    });

    it('phantom#create() returns a new Promise instance', function (done) {
        var promise = _index2.default.create();
        expect(promise).toEqual(jasmine.any(Promise));
        promise.then(function (ph) {
            ph.exit();
            done();
        });
    });
});