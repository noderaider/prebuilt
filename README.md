# prebuilt

**Package and deploy prebuilt versions of node_modules to bypass gcc node-gyp issues. This is another level up from node-pre-gyp, if one of your target node_modules does not precompile, you can use this to bundle versions of that entire library.**


[![Build Status](https://travis-ci.org/noderaider/prebuilt.svg?branch=master)](https://travis-ci.org/noderaider/prebuilt)
[![codecov](https://codecov.io/gh/noderaider/prebuilt/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/prebuilt)

[![NPM](https://nodei.co/npm/prebuilt.png?stars=true&downloads=true)](https://nodei.co/npm/prebuilt/)


## Install

`npm i -S prebuilt`


## Usage

**Package prebuilt binaries on a VM:**

```js
prebuilt -p package_name
```

**Install prebuilt binaries on a machine, node version, platform and bitness will be handled automatically:**

```js
prebuilt -i package_name
```

**This project is in active development. Please come back in a couple of weeks.**

---


## TEST

**Unit tests output for current release:**

# TOC
   - [lib](#lib)
<a name=""></a>
 
<a name="lib"></a>
# lib
should have default function export.

```js
should.exist(lib.default);
lib.default.should.be.a('function');
```

