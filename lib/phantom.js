"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _phantomjsPrebuilt = require("phantomjs-prebuilt");

var _phantomjsPrebuilt2 = _interopRequireDefault(_phantomjsPrebuilt);

var _child_process = require("child_process");

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _linerstream = require("linerstream");

var _linerstream2 = _interopRequireDefault(_linerstream);

var _page = require("./page");

var _page2 = _interopRequireDefault(_page);

var _command = require("./command");

var _command2 = _interopRequireDefault(_command);

var _out_object = require("./out_object");

var _out_object2 = _interopRequireDefault(_out_object);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = new _winston2.default.Logger({
    transports: [new _winston2.default.transports.Console({
        level: process.env.DEBUG === 'true' ? 'debug' : 'info',
        colorize: true
    })]
});

/**
 * A phantom instance that communicates with phantomjs
 */

var Phantom = function () {

    /**
     * Creates a new instance of Phantom
     *
     * @param args command args to pass to phantom process
     */

    function Phantom() {
        var _this = this;

        var args = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
        var phantomBin = arguments[1];

        _classCallCheck(this, Phantom);

        if (!Array.isArray(args)) {
            throw new Error('Unexpected type of parameters. Expecting args to be array.');
        }

        var pathToPhantom = phantomBin || _phantomjsPrebuilt2.default.path;
        var pathToShim = _path2.default.normalize(__dirname + '/shim.js');
        logger.debug("Starting " + pathToPhantom + " " + args.concat([pathToShim]).join(' '));
        this.process = (0, _child_process.spawn)(pathToPhantom, args.concat([pathToShim]));
        this.commands = new Map();
        this.events = new Map();

        this.process.stdin.setEncoding('utf-8');

        this.process.stdout.pipe(new _linerstream2.default()).on('data', function (data) {
            var message = data.toString('utf8');
            if (message[0] === '>') {
                var json = message.substr(1);
                logger.debug('Parsing: %s', json);
                var command = JSON.parse(json);

                var deferred = _this.commands.get(command.id).deferred;
                if (command.error === undefined) {
                    deferred.resolve(command.response);
                } else {
                    deferred.reject(new Error(command.error));
                }
                _this.commands.delete(command.id);
            } else if (message.indexOf('<event>') === 0) {
                var _json = message.substr(7);
                logger.debug('Parsing: %s', _json);
                var event = JSON.parse(_json);

                var emitter = _this.events[event.target];
                if (emitter) {
                    emitter.emit.apply(emitter, [event.type].concat(event.args));
                }
            } else {
                logger.info(message);
            }
        });

        this.process.stderr.on('data', function (data) {
            return logger.error(data.toString('utf8'));
        });
        this.process.on('exit', function (code) {
            return logger.debug("Child exited with code {" + code + "}");
        });
        this.process.on('error', function (error) {
            logger.error("Could not spawn [" + pathToPhantom + "] executable. Please make sure phantomjs is installed correctly.");
            logger.error(error);
            process.exit(1);
        });

        this.heartBeatId = setInterval(this._heartBeat.bind(this), 100);
    }

    /**
     * Returns a value in the global space of phantom process
     * @returns {Promise}
     */


    _createClass(Phantom, [{
        key: "windowProperty",
        value: function windowProperty() {
            return this.execute('phantom', 'windowProperty', [].slice.call(arguments));
        }

        /**
         * Returns a new instance of Promise which resolves to a {@link Page}.
         * @returns {Promise.<Page>}
         */

    }, {
        key: "createPage",
        value: function createPage() {
            var _this2 = this;

            return this.execute('phantom', 'createPage').then(function (response) {
                var page = new _page2.default(_this2, response.pageId);
                if (typeof Proxy === 'function') {
                    page = new Proxy(page, {
                        set: function set(target, prop) {
                            logger.warn("Using page." + prop + " = ...; is not supported. Use page.property('" + prop + "', ...) instead. See the README file for more examples of page#property.");
                            return false;
                        }
                    });
                }
                return page;
            });
        }

        /**
         * Creates a special object that can be used for returning data back from PhantomJS
         * @returns {OutObject}
         */

    }, {
        key: "createOutObject",
        value: function createOutObject() {
            return new _out_object2.default(this);
        }

        /**
         * Used for creating a callback in phantomjs for content header and footer
         * @param obj
         */

    }, {
        key: "callback",
        value: function callback(obj) {
            return { transform: true, target: obj, method: 'callback', parent: 'phantom' };
        }

        /**
         * Executes a command object
         * @param command the command to run
         * @returns {Promise}
         */

    }, {
        key: "executeCommand",
        value: function executeCommand(command) {
            command.deferred = {};

            var promise = new Promise(function (res, rej) {
                command.deferred.resolve = res;
                command.deferred.reject = rej;
            });

            this.commands.set(command.id, command);

            var json = JSON.stringify(command, function (key, val) {
                var r = void 0;
                if (key[0] === '_') {
                    r = undefined;
                } else {
                    r = typeof val === 'function' ? val.toString() : val;
                }
                return r;
            });
            logger.debug('Sending: %s', json);

            this.process.stdin.write(json + _os2.default.EOL, 'utf8');

            return promise;
        }

        /**
         * Executes a command
         *
         * @param target target object to execute against
         * @param name the name of the method execute
         * @param args an array of args to pass to the method
         * @returns {Promise}
         */

    }, {
        key: "execute",
        value: function execute(target, name) {
            var args = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

            return this.executeCommand(new _command2.default(null, target, name, args));
        }

        /**
         * Adds an event listener to a target object (currently only works on pages)
         *
         * @param event the event type
         * @param target target object to execute against
         * @param runOnPhantom would the callback run in phantomjs or not
         * @param callback the event callback
         * @param args an array of args to pass to the callback
         */

    }, {
        key: "on",
        value: function on(event, target, runOnPhantom, callback) {
            var args = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

            var eventDescriptor = { type: event };

            if (runOnPhantom) {
                eventDescriptor.event = callback;
                eventDescriptor.args = args;
            } else {
                var emitter = this.getEmitterForTarget(target);
                emitter.on(event, function () {
                    var params = [].slice.call(arguments).concat(args);
                    return callback.apply(null, params);
                });
            }
            return this.execute(target, 'addEvent', [eventDescriptor]);
        }

        /**
         * Removes an event from a target object
         *
         * @param event
         * @param target
         */

    }, {
        key: "off",
        value: function off(event, target) {
            var emitter = this.getEmitterForTarget(target);
            emitter.removeAllListeners(event);
            return this.execute(target, 'removeEvent', [{ type: event }]);
        }
    }, {
        key: "getEmitterForTarget",
        value: function getEmitterForTarget(target) {
            if (!this.events[target]) {
                this.events[target] = new _events2.default();
            }

            return this.events[target];
        }

        /**
         * Cleans up and end the phantom process
         */

    }, {
        key: "exit",
        value: function exit() {
            clearInterval(this.heartBeatId);
            this.execute('phantom', 'exit');
        }
    }, {
        key: "_heartBeat",
        value: function _heartBeat() {
            if (this.commands.size === 0) {
                this.execute('phantom', 'noop');
            }
        }
    }]);

    return Phantom;
}();

exports.default = Phantom;