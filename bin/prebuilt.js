#! /usr/bin/env node
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _bunyan = require('bunyan');

var _deasync = require('deasync');

var _deasync2 = _interopRequireDefault(_deasync);

var _figlet = require('figlet');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _lib = require('../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = require('chai').should();
var log = (0, _bunyan.createLogger)({ name: 'prebuilt', level: 'info' });

var header = (0, _figlet.textSync)('- prebuilt -', { font: 'Doom' });

console.log(_chalk2.default.red(header));

var argv = _yargs2.default.usage('usage: $0 [options] package-name').alias('p', 'pack').describe('p', 'pack a prebuilt version of a pack in the node_modules folder for current architecture / node / bitness combination').alias('i', 'install').describe('i', 'install a prebuilt pack to the node_modules folder for the current architecture / node / bitness combination').alias('m', 'msvs_version').describe('m', 'the msvs_version to use').default('m', 2015).alias('h', 'help').help().strict().argv;

var opts = { root: process.cwd(), msvs_version: argv.msvs_version };
var done = false;
if (argv.pack) {
  console.info('calling pack for ' + argv.pack);
  (0, _lib.pack)(argv.pack, opts).then(function () {
    return console.info(argv.pack + ' packed successfully!');
  }).catch(function (err) {
    return console.error(err, argv.pack + ' error occurred while packing!');
  }).finally(function () {
    done = true;
  });
} else if (argv.install) {
  console.info('calling install for ' + argv.install);
  (0, _lib.install)(argv.install, opts).then(function () {
    return console.info(argv.install + ' installed successfully!');
  }).catch(function (err) {
    return console.error(err, argv.install + ' error occurred while installing!');
  }).finally(function () {
    done = true;
  });
} else {
  _yargs2.default.showHelp();
  done = true;
}
_deasync2.default.loopWhile(function () {
  return !done;
});