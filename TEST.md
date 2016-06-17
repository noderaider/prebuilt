RESULT => {"exists":false}
RESULT => {"exists":true,"resolved":"C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\fake-package"}
pack: running node-gyp for package
pack: node-gyp finished executing: [object Object]
RESULT => {"exists":true,"resolved":"C:\\Users\\ColeChamberlain\\noderaider\\prebuilt\\node_modules\\fake-package"}
pack: running node-gyp for package
pack: node-gyp finished executing: [object Object]
extracting package at prebuilt/win32/x64/v6.2.2/invalid-package.7z to C:\Users\ColeChamberlain\noderaider\prebuilt\node_modules\invalid-package...
extracting package at prebuilt/win32/x64/v6.2.2/fake-package.7z to C:\Users\ColeChamberlain\noderaider\prebuilt\node_modules\fake-package...
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
