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

var _lib = require('../lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = require('chai').should();

var log = (0, _bunyan.createLogger)({ name: 'prebuilt', level: 'info' });

var header = (0, _figlet.textSync)('- prebuilt -', { font: 'Doom' });

console.log(_chalk2.default.red(header));

var argv = _yargs2.default.usage('usage: $0 [options] package-name').alias('p', 'package').describe('p', 'package a prebuilt version of a package in the node_modules folder for current architecture / node / bitness combination').alias('i', 'install').describe('i', 'install a prebuilt package to the node_modules folder for the current architecture / node / bitness combination').help().strict().argv;

/*

if(argv.init) {
  let { username, organization, full, email, host } = argv.init
  let repackagerc = { username, organization, full, email, host }
  try {
    fs.writeFileSync('.repackagerc', JSON.stringify(repackagerc, null, 2), 'utf8')
  } catch(err) {
    if(err) {
      log.error(err, 'error during writing .repackagerc')
      yargs.showHelp()
      process.exit(1)
    }
  }
  process.exit(0)
}


let done = false
const repackage = createRepackage({ log })
repackage(argv.transform, argv.package)
  .then(message => {
    log.info(message)
    done = true
  })
  .catch(err => {
    log.error(err, 'you may need to use repackage init [options]')
    yargs.showHelp()
    done = true
  })
deasync.loopWhile(() => !done)
*/