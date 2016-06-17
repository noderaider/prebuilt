'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pack = pack;
exports.install = install;
exports.query = query;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var access = _bluebird2.default.promisify(require('fs').access);
var rimraf = _bluebird2.default.promisify(require('rimraf'));
var mkdirp = _bluebird2.default.promisify(require('mkdirp'));
var ncp = _bluebird2.default.promisify(require('ncp').ncp);

var testPath = function testPath(x) {
  return access(x).then(function () {
    return { exists: true, resolved: x };
  }).catch(function () {
    return { exists: false };
  });
};

var getModulePath = function getModulePath(packageName) {
  if (!packageName) return _bluebird2.default.reject(new Error('packageName is required.'));
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

var getPrebuiltPath = function getPrebuiltPath() {
  return _path2.default.resolve('prebuilt', process.platform, process.arch, process.version);
};
var getPrebuiltPackage = function getPrebuiltPackage(packageName) {
  return _path2.default.resolve(getPrebuiltPath(), packageName);
};

function pack(packageName) {
  if (!packageName) return _bluebird2.default.reject(new Error('packageName is required.'));
  return getModulePath(packageName).then(function (filePath) {
    var destDir = getPrebuiltPath();
    var prebuiltPackagePath = getPrebuiltPackage(packageName);
    return mkdirp(destDir).then(function (x) {
      return ncp(filePath, prebuiltPackagePath);
    });
  });
}

function install(packageName) {
  if (!packageName) return _bluebird2.default.reject(new Error('packageName is required.'));

  var packagePath = getPrebuiltPackage(packageName);
  var installPath = _path2.default.join('node_modules', packageName);
  return ncp(packagePath, installPath);
}

function query(packageName) {
  return _bluebird2.default.reject('placeholder');
}