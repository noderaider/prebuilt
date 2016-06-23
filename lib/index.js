'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.pack = pack;
exports.install = install;
exports.query = query;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _es7z = require('es-7z');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var readFile = _bluebird2.default.promisify(require('fs').readFile);
var writeFile = _bluebird2.default.promisify(require('fs').writeFile);
var access = _bluebird2.default.promisify(require('fs').access);
var rimraf = _bluebird2.default.promisify(require('rimraf'));
var mkdirp = _bluebird2.default.promisify(require('mkdirp'));
var ncp = _bluebird2.default.promisify(require('ncp').ncp);

var isWin = process.platform === 'win32';
var exePath = _path2.default.resolve(__dirname, '..', 'bin', '7za.exe');
var replaceInstallScript = function replaceInstallScript(packageName) {
  return 'echo prebuilt => ' + packageName + ' | platform[' + process.platform + '] | arch[' + process.arch + '] | version[' + process.version + ']';
};

var testPath = function testPath(x) {
  return access(x).then(function () {
    return { exists: true, resolved: x };
  }).catch(function () {
    return { exists: false };
  });
};

var getModulePath = function getModulePath(packageName, root) {
  if (!packageName) return _bluebird2.default.reject(new Error('packageName is required.'));
  if (root) {
    var _ret = function () {
      var relativePath = _path2.default.join(root, 'node_modules', packageName);
      return {
        v: testPath(relativePath).then(function (result) {
          if (result.exists) return result.resolved;
          throw new Error('Could not locate packageName ' + packageName + ' at ' + relativePath);
        })
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
  var testPaths = module.parent.paths.map(function (x) {
    return _path2.default.join(x, packageName);
  });
  return _bluebird2.default.all(testPaths.map(testPath)).then(function (results) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var result = _step.value;

        if (result.exists) return result.resolved;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    throw new Error('Could not locate packageName ' + packageName);
  });
};

var getPrebuiltPath = function getPrebuiltPath(root) {
  return _path2.default.resolve(root ? _path2.default.join(root, 'prebuilt') : 'prebuilt', process.platform, process.arch, process.version);
};
var getPrebuiltPackage = function getPrebuiltPackage(packageName, root) {
  return _path2.default.resolve(getPrebuiltPath(root), packageName);
};
var getZipFrom = function getZipFrom(packageName, root) {
  return './node_modules/' + packageName;
};
var getZipTo = function getZipTo(packageName, root) {
  return ('prebuilt/' + process.platform + '/' + process.arch + '/' + process.version + '/' + packageName + '.7z').replace(/\\/g, '/');
};

var readJSON = function readJSON(jsonPath, fallback) {
  return readFile(jsonPath, 'utf8').then(function (data) {
    return JSON.parse(data);
  }).catch(function (err) {
    console.error(err, 'prebuilt: error reading file at ' + jsonPath + '.');
    if (fallback) return fallback(err);
    throw err;
  });
};

var writeJSON = function writeJSON(jsonPath, json) {
  return writeFile(jsonPath, JSON.stringify(json, null, 2), 'utf8').catch(function (err) {
    console.error(err, 'prebuilt: error writing file at ' + jsonPath + '.');
    throw err;
  });
};

function executeGyp(commands, _ref) {
  var msvs_version = _ref.msvs_version;
  var cwd = _ref.cwd;

  return new _bluebird2.default(function (resolve, reject) {
    var _cp$spawnSync = _child_process2.default.spawnSync(_path2.default.resolve(cwd, '..', '.bin', 'node-gyp' + (isWin ? '.cmd' : '')), [].concat(_toConsumableArray(commands), ['--msvs_version=' + msvs_version]), { cwd: _path2.default.resolve(cwd), encoding: 'utf8' });

    var error = _cp$spawnSync.error;
    var stdio = _cp$spawnSync.stdio;
    var stdout = _cp$spawnSync.stdout;
    var status = _cp$spawnSync.status;
    var signal = _cp$spawnSync.signal;
    var output = _cp$spawnSync.output;

    if (error) return reject(error);
    resolve(stdio);
  });
}

function gypClean() {
  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var msvs_version = _ref2.msvs_version;
  var cwd = _ref2.cwd;

  console.info('running node-gyp clean for package at ' + cwd);
  return executeGyp(['clean'], { msvs_version: msvs_version, cwd: cwd });
}

function gypConfigure() {
  var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var msvs_version = _ref3.msvs_version;
  var cwd = _ref3.cwd;

  console.info('running node-gyp configure for package at ' + cwd);
  return executeGyp(['configure'], { msvs_version: msvs_version, cwd: cwd });
}

function gypBuild(isDebug) {
  var _ref4 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var msvs_version = _ref4.msvs_version;
  var cwd = _ref4.cwd;

  console.info('running node-gyp build for package at ' + cwd + ' in ' + (isDebug ? 'debug' : 'release') + ' mode');
  return executeGyp(['build', isDebug ? '--debug' : '--release'], { msvs_version: msvs_version, cwd: cwd });
}

function pack(packageName) {
  var _ref5 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref5$root = _ref5.root;
  var root = _ref5$root === undefined ? process.cwd() : _ref5$root;
  var _ref5$msvs_version = _ref5.msvs_version;
  var msvs_version = _ref5$msvs_version === undefined ? 2015 : _ref5$msvs_version;

  if (!packageName) return _bluebird2.default.reject(new Error('packageName is required.'));
  return getModulePath(packageName, root).then(function (packagePath) {
    var packageJSONPath = _path2.default.join(packagePath, 'package.json');
    return readJSON(packageJSONPath).then(function (packageJSON) {
      if (packageJSON.scripts && packageJSON.scripts.install) {
        console.info('prebuilt: rewriting ' + packageJSONPath + ' to remove node-gyp install step.');
        packageJSON.scripts.install = replaceInstallScript(packageName);
        return writeJSON(packageJSONPath, packageJSON);
      }
    }).then(function () {
      var destDir = getPrebuiltPath(root);
      var prebuiltPackagePath = getPrebuiltPackage(packageName, root);
      var zipFrom = getZipFrom(packageName, root);
      var zipTo = getZipTo(packageName, root);
      var nodeModulePath = _path2.default.relative(__dirname, packagePath).replace(/\\/g, '/') + '/';
      var gypOpts = { msvs_version: msvs_version, cwd: _path2.default.resolve(zipFrom) };
      return gypClean(gypOpts).then(function () {
        return gypConfigure(gypOpts);
      }).then(function () {
        return gypBuild(true, gypOpts);
      }).then(function () {
        return gypBuild(false, gypOpts);
      }).catch(function (err) {
        console.error('pack: error occurred during node-gyp step');
        throw err;
      }).then(function () {
        console.info('pack: node-gyp finished executing!');
        return mkdirp(destDir).then(function () {
          //console.info(`file copied, starting 7z of ${zipFrom} to ${zipTo}`)
          return (0, _es7z.add7z)(zipTo, zipFrom + '/*', { exePath: exePath })
          //.progress(files => console.info(`progress: 7z'ing files ${JSON.stringify(files)}`))
          .then(function () {
            //console.info('7zip completed, cleaning package')
          }).catch(function (err) {
            console.error(err, '7-zip error occurred');
            throw err;
          });
        });
      });
    });
  });
}

function install(packageName) {
  var _ref6 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref6$root = _ref6.root;
  var root = _ref6$root === undefined ? process.cwd() : _ref6$root;

  if (!packageName) return _bluebird2.default.reject(new Error('packageName is required.'));
  var zipFrom = getZipTo(packageName, root);
  var packagePath = getPrebuiltPackage(packageName, root);
  var installPath = _path2.default.join(root, 'node_modules', packageName);
  console.info('extracting package at ' + zipFrom + ' to ' + installPath + '...');
  return (0, _es7z.extractFull7z)(zipFrom, installPath, { exePath: exePath })
  //.progress(files => console.info(`progress: extracting files ${JSON.stringify(files)}`))
  .then(function () {
    //console.info('extraction completed!')
  }).catch(function (err) {
    console.error(err, 'extraction error occurred');
    throw err;
  });

  //return ncp(packagePath, installPath)
}

function query(packageName) {
  return _bluebird2.default.reject('placeholder');
}