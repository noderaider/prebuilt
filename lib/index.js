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

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _es7z = require('es-7z');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var access = _bluebird2.default.promisify(require('fs').access);
var rimraf = _bluebird2.default.promisify(require('rimraf'));
var mkdirp = _bluebird2.default.promisify(require('mkdirp'));
var ncp = _bluebird2.default.promisify(require('ncp').ncp);
var exePath = _path2.default.resolve(__dirname, '..', '7za.exe');

var testPath = function testPath(x) {
  return access(x).then(function () {
    return { exists: true, resolved: x };
  }).catch(function () {
    return { exists: false };
  });
};

var getModulePath = function getModulePath(packageName, cwd) {
  if (!packageName) return _bluebird2.default.reject(new Error('packageName is required.'));
  if (cwd) {
    var _ret = function () {
      var relativePath = _path2.default.join(cwd, 'node_modules', packageName);
      return {
        v: testPath(relativePath).then(function (result) {
          console.info('RESULT => ' + JSON.stringify(result));
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

var getPrebuiltPath = function getPrebuiltPath(cwd) {
  return _path2.default.resolve(cwd ? _path2.default.join(cwd, 'prebuilt') : 'prebuilt', process.platform, process.arch, process.version);
};
var getPrebuiltPackage = function getPrebuiltPackage(packageName, cwd) {
  return _path2.default.resolve(getPrebuiltPath(cwd), packageName);
};
var getZipFrom = function getZipFrom(packageName, cwd) {
  return './node_modules/' + packageName + '/*';
}; //path.relative(__dirname, path.resolve(`${cwd ? `${cwd}/` : ''}`).replace(/\\/g, '/') + '/'
var getZipTo = function getZipTo(packageName, cwd) {
  return ('prebuilt/' + process.platform + '/' + process.arch + '/' + process.version + '/' + packageName + '.7z').replace(/\\/g, '/');
};

function pack(packageName) {
  var cwd = arguments.length <= 1 || arguments[1] === undefined ? process.cwd() : arguments[1];

  if (!packageName) return _bluebird2.default.reject(new Error('packageName is required.'));
  return getModulePath(packageName, cwd).then(function (filePath) {
    var destDir = getPrebuiltPath(cwd);
    var prebuiltPackagePath = getPrebuiltPackage(packageName, cwd);
    var zipFrom = getZipFrom(packageName, cwd);
    var zipTo = getZipTo(packageName, cwd);
    var nodeModulePath = _path2.default.relative(__dirname, filePath).replace(/\\/g, '/') + '/';
    return mkdirp(destDir).then(function () {
      //console.info(`file copied, starting 7z of ${zipFrom} to ${zipTo}`)
      return (0, _es7z.add7z)(zipTo, zipFrom, { exePath: exePath })
      //.progress(files => console.info(`progress: 7z'ing files ${JSON.stringify(files)}`))
      .then(function () {
        //console.info('7zip completed, cleaning package')
      }).catch(function (err) {
        console.error(_util2.default.inspect(err), '7zip error occurred');
        throw err;
      });
    });
  });
}

function install(packageName) {
  var cwd = arguments.length <= 1 || arguments[1] === undefined ? process.cwd() : arguments[1];

  if (!packageName) return _bluebird2.default.reject(new Error('packageName is required.'));
  var zipFrom = getZipTo(packageName, cwd);
  var packagePath = getPrebuiltPackage(packageName, cwd);
  var installPath = _path2.default.join(cwd, 'node_modules', packageName);
  console.info('extracting package at ' + zipFrom + ' to ' + installPath + '...');
  return (0, _es7z.extractFull7z)(zipFrom, installPath, { exePath: exePath })
  //.progress(files => console.info(`progress: extracting files ${JSON.stringify(files)}`))
  .then(function () {
    //console.info('extraction completed!')
  }).catch(function (err) {
    console.error(_util2.default.inspect(err), 'extraction error occurred');
    throw err;
  });

  //return ncp(packagePath, installPath)
}

function query(packageName) {
  return _bluebird2.default.reject('placeholder');
}