[![NPM](https://raw.githubusercontent.com/noderaider/localsync/master/public/images/prebuilt-cli.png)](https://npmjs.com/packages/prebuilt)

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
