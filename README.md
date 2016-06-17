# prebuilt

**A simple CLI/API tool to package and deploy prebuilt versions of node_modules packages to bypass gcc node-gyp issues. This is another level up from node-pre-gyp, if one of your target node_modules does not precompile, you can use this to bundle versions of that entire library.**


[![Build Status](https://travis-ci.org/noderaider/prebuilt.svg?branch=master)](https://travis-ci.org/noderaider/prebuilt)
[![codecov](https://codecov.io/gh/noderaider/prebuilt/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/prebuilt)

[![NPM](https://nodei.co/npm/prebuilt.png?stars=true&downloads=true)](https://nodei.co/npm/prebuilt/)


## Install (For npm script or API usage)

`npm i -D prebuilt`

## Install (global)

`npm i -g prebuilt`

## Usage

#### CLI / NPM scripts

**Pack an installed (and built) package from a VM:**

```bash
prebuilt --pack package_name

# shorthand
prebuilt -p package_name
```

**Install prebuilt packages on a machine, node version, platform and bitness will be handled automatically:**

```bash
prebuilt --install package_name

# shorthand
prebuilt -i package_name
```


#### API

```js
import { pack, install } from 'prebuilt'
import util from 'util'

const printResult = x => console.log(util.inspect(x))
const printError = err => console.error(err)

/** Pack an installed package for later distribution */
pack('package_name')
  .then(printResult)
  .catch(printError)

/** Install a prebuilt packed package */
install('package_name')
  .then(printResult)
  .catch(printError)
```

---


## TEST

**Unit tests output for current release:**

TESTING PATHS => C:\Users\ColeChamberlain\noderaider\prebuilt\test\node_modules\invalid-package, C:\Users\ColeChamberlain\noderaider\prebuilt\node_modules\invalid-package, C:\Users\ColeChamberlain\noderaider\node_modules\invalid-package, C:\Users\ColeChamberlain\node_modules\invalid-package, C:\Users\node_modules\invalid-package
module => Module {
  id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\lib\\index.js',
  exports: 
   { pack: [Function: pack],
     install: [Function: install],
     query: [Function: query] },
  parent: 
   Module {
     id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\test\\lib.js',
     exports: {},
     parent: 
      Module {
        id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\mocha\\lib\\mocha.js',
        exports: [Object],
        parent: [Object],
        filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\mocha\\lib\\mocha.js',
        loaded: true,
        children: [Object],
        paths: [Object] },
     filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\test\\lib.js',
     loaded: true,
     children: [ [Object], [Object], [Object], [Object], [Object], [Circular] ],
     paths: 
      [ 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\test\\node_modules',
        'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules',
        'C:\\Users\\ColeChamberlain\\noderaider\\node_modules',
        'C:\\Users\\ColeChamberlain\\node_modules',
        'C:\\Users\\node_modules' ] },
  filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\lib\\index.js',
  loaded: true,
  children: 
   [ Module {
       id: 'C:\\Users\\ColeChamberlain\\noderaider\\es-7z\\lib\\index.js',
       exports: [Object],
       parent: [Circular],
       filename: 'C:\\Users\\ColeChamberlain\\noderaider\\es-7z\\lib\\index.js',
       loaded: true,
       children: [Object],
       paths: [Object] },
     Module {
       id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\ncp\\lib\\ncp.js',
       exports: [Object],
       parent: [Circular],
       filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\ncp\\lib\\ncp.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  require: [Function],
  paths: 
   [ 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\lib\\node_modules',
     'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules',
     'C:\\Users\\ColeChamberlain\\noderaider\\node_modules',
     'C:\\Users\\ColeChamberlain\\node_modules',
     'C:\\Users\\node_modules' ] }
TESTING PATHS => C:\Users\ColeChamberlain\noderaider\prebuilt\test\node_modules\fake-package, C:\Users\ColeChamberlain\noderaider\prebuilt\node_modules\fake-package, C:\Users\ColeChamberlain\noderaider\node_modules\fake-package, C:\Users\ColeChamberlain\node_modules\fake-package, C:\Users\node_modules\fake-package
module => Module {
  id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\lib\\index.js',
  exports: 
   { pack: [Function: pack],
     install: [Function: install],
     query: [Function: query] },
  parent: 
   Module {
     id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\test\\lib.js',
     exports: {},
     parent: 
      Module {
        id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\mocha\\lib\\mocha.js',
        exports: [Object],
        parent: [Object],
        filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\mocha\\lib\\mocha.js',
        loaded: true,
        children: [Object],
        paths: [Object] },
     filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\test\\lib.js',
     loaded: true,
     children: [ [Object], [Object], [Object], [Object], [Object], [Circular] ],
     paths: 
      [ 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\test\\node_modules',
        'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules',
        'C:\\Users\\ColeChamberlain\\noderaider\\node_modules',
        'C:\\Users\\ColeChamberlain\\node_modules',
        'C:\\Users\\node_modules' ] },
  filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\lib\\index.js',
  loaded: true,
  children: 
   [ Module {
       id: 'C:\\Users\\ColeChamberlain\\noderaider\\es-7z\\lib\\index.js',
       exports: [Object],
       parent: [Circular],
       filename: 'C:\\Users\\ColeChamberlain\\noderaider\\es-7z\\lib\\index.js',
       loaded: true,
       children: [Object],
       paths: [Object] },
     Module {
       id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\ncp\\lib\\ncp.js',
       exports: [Object],
       parent: [Circular],
       filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\ncp\\lib\\ncp.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  require: [Function],
  paths: 
   [ 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\lib\\node_modules',
     'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules',
     'C:\\Users\\ColeChamberlain\\noderaider\\node_modules',
     'C:\\Users\\ColeChamberlain\\node_modules',
     'C:\\Users\\node_modules' ] }
pack: {"filePath":"C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\fake-package","destDir":"C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\prebuilt\\win32\\x64\\v6.2.2","prebuiltPackagePath":"C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\prebuilt\\win32\\x64\\v6.2.2\\fake-package","zipFrom":"./node_modules/fake-package/*","zipTo":"prebuilt/win32/x64/v6.2.2/fake-package.7z","nodeModulePath":"../node_modules/fake-package/"}
file copied, starting 7z of ./node_modules/fake-package/* to prebuilt/win32/x64/v6.2.2/fake-package.7z
progress: 7z'ing files []
progress: 7z'ing files []
7zip completed, cleaning package
TESTING PATHS => C:\Users\ColeChamberlain\noderaider\prebuilt\test\node_modules\fake-package, C:\Users\ColeChamberlain\noderaider\prebuilt\node_modules\fake-package, C:\Users\ColeChamberlain\noderaider\node_modules\fake-package, C:\Users\ColeChamberlain\node_modules\fake-package, C:\Users\node_modules\fake-package
module => Module {
  id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\lib\\index.js',
  exports: 
   { pack: [Function: pack],
     install: [Function: install],
     query: [Function: query] },
  parent: 
   Module {
     id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\test\\lib.js',
     exports: {},
     parent: 
      Module {
        id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\mocha\\lib\\mocha.js',
        exports: [Object],
        parent: [Object],
        filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\mocha\\lib\\mocha.js',
        loaded: true,
        children: [Object],
        paths: [Object] },
     filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\test\\lib.js',
     loaded: true,
     children: [ [Object], [Object], [Object], [Object], [Object], [Circular] ],
     paths: 
      [ 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\test\\node_modules',
        'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules',
        'C:\\Users\\ColeChamberlain\\noderaider\\node_modules',
        'C:\\Users\\ColeChamberlain\\node_modules',
        'C:\\Users\\node_modules' ] },
  filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\lib\\index.js',
  loaded: true,
  children: 
   [ Module {
       id: 'C:\\Users\\ColeChamberlain\\noderaider\\es-7z\\lib\\index.js',
       exports: [Object],
       parent: [Circular],
       filename: 'C:\\Users\\ColeChamberlain\\noderaider\\es-7z\\lib\\index.js',
       loaded: true,
       children: [Object],
       paths: [Object] },
     Module {
       id: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\ncp\\lib\\ncp.js',
       exports: [Object],
       parent: [Circular],
       filename: 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\ncp\\lib\\ncp.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  require: [Function],
  paths: 
   [ 'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\lib\\node_modules',
     'C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules',
     'C:\\Users\\ColeChamberlain\\noderaider\\node_modules',
     'C:\\Users\\ColeChamberlain\\node_modules',
     'C:\\Users\\node_modules' ] }
pack: {"filePath":"C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\fake-package","destDir":"C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\prebuilt\\win32\\x64\\v6.2.2","prebuiltPackagePath":"C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\prebuilt\\win32\\x64\\v6.2.2\\fake-package","zipFrom":"./node_modules/fake-package/*","zipTo":"prebuilt/win32/x64/v6.2.2/fake-package.7z","nodeModulePath":"../node_modules/fake-package/"}
file copied, starting 7z of ./node_modules/fake-package/* to prebuilt/win32/x64/v6.2.2/fake-package.7z
progress: 7z'ing files []
progress: 7z'ing files []
7zip completed, cleaning package
extracting package at prebuilt/win32/x64/v6.2.2/invalid-package.7z to node_modules\invalid-package...
progress: extracting files []
extracting package at prebuilt/win32/x64/v6.2.2/fake-package.7z to node_modules\fake-package...
progress: extracting files []
progress: extracting files []
extraction completed
# TOC
   - [lib](#lib)
     - [#default](#lib-default)
     - [#pack](#lib-pack)
     - [#install](#lib-install)
     - [#query](#lib-query)
<a name=""></a>
 
<a name="lib"></a>
# lib
should exist.

```js
return should.exist(lib);
```

<a name="lib-default"></a>
## #default
should not have a default function export.

```js
return should.not.exist(lib.default);
```

<a name="lib-pack"></a>
## #pack
should exist.

```js
return should.exist(pack);
```

should be a function.

```js
return pack.should.be.a('function');
```

should not throw for non-existant package name.

```js
return function () {
  return pack().should.be.rejected;
}.should.not.throw();
```

should reject non-existant package name.

```js
return pack().should.be.rejected;
```

should reject invalid package name.

```js
return pack('invalid-package').should.be.rejected;
```

should pack valid package.

```js
return pack('fake-package').should.be.fulfilled;
```

should create prebuilt.

```js
pack('fake-package').then(function () {
  return access(fakePackagePath);
}).catch(function (err) {
  console.error(util.inspect(err));
  should.not.exist(err);
}).finally(function () {
  done();
});
```

<a name="lib-install"></a>
## #install
should exist.

```js
return should.exist(install);
```

should be a function.

```js
return install.should.be.a('function');
```

should not throw for non-existant package name.

```js
return function () {
  return install().should.be.rejected;
}.should.not.throw();
```

should reject non-existant package name.

```js
return install().should.be.rejected;
```

should reject invalid package name.

```js
return install('invalid-package').should.be.rejected;
```

should install valid package.

```js
return install('fake-package').should.be.fulfilled;
```

<a name="lib-query"></a>
## #query
