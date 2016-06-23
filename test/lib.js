import Promise from 'bluebird'
import path from 'path'
import rewire from 'rewire'
import chai from 'chai'
chai.use(require('chai-as-promised'))
const should = chai.should()
const writeFile = Promise.promisify(require('fs').writeFile)
const access = Promise.promisify(require('fs').access)
const rimraf = Promise.promisify(require('rimraf'))
const mkdirp = Promise.promisify(require('mkdirp'))

describe('lib', () => {
  const lib = rewire('../lib')
  const fakePackagePath = path.resolve(__dirname, '..', 'node_modules', 'fake-package')
  const fakePackageJSONPath = path.resolve(fakePackagePath, 'package.json')
  const fakePackageJSON = `{
  "name": "fake-package",
  "version": "1.0.0",
  "scripts": {
    "install": "THIS BETTER GO AWAY",
    "other": "THIS SHOULD NOT GO AWAY"
  }
}
`
  //afterEach(done => rimraf('prebuilt').finally(() => { done() }))

  it('should exist', () => should.exist(lib))

  describe('#default', function () {
    it('should not have a default function export', () => should.not.exist(lib.default))
  })

  describe('#pack', function () {
    const { pack } = lib
    beforeEach(done => mkdirp(fakePackagePath)
      .then(() => writeFile(fakePackageJSONPath, fakePackageJSON, 'utf8')).finally(() => { done() }))
    afterEach(done => rimraf(fakePackagePath).finally(() => { done() }))
    it('should exist', () => should.exist(pack))
    it('should be a function', () => pack.should.be.a('function'))
    it('should not throw for non-existant package name', () => (() => pack().should.be.rejected).should.not.throw())
    it('should reject non-existant package name', () => pack().should.be.rejected)
    it('should reject invalid package name', () => pack('invalid-package').should.be.rejected)
    it('should pack valid package', function() {
      this.timeout(5000)
      return pack('fake-package').should.be.fulfilled
    })
    it('should create prebuilt', function(done) {
      this.timeout(5000)
      pack('fake-package')
        .then(() => {
          return access(fakePackagePath)
        })
        .catch(err => {
          console.error(util.inspect(err))
          should.not.exist(err)
        })
        .finally(() => { done() })
    })
  })

  describe('#install', function () {
    const { install } = lib
    beforeEach(done => mkdirp(fakePackagePath)
      .then(() => writeFile(fakePackageJSONPath, fakePackageJSON, 'utf8')).finally(() => { done() }))
    afterEach(done => rimraf(fakePackagePath).finally(() => { done() }))
    it('should exist', () => should.exist(install))
    it('should be a function', () => install.should.be.a('function'))
    it('should not throw for non-existant package name', () => (() => install().should.be.rejected).should.not.throw())
    it('should reject non-existant package name', () => install().should.be.rejected)
    it('should reject invalid package name', () => install('invalid-package').should.be.rejected)
    it('should install valid package', () => install('fake-package').should.be.fulfilled)
  })

  xdescribe('#query', function() {
    const { query } = lib
    beforeEach(done => mkdirp(fakePackagePath)
      .then(() => writeFile(fakePackageJSONPath, fakePackageJSON, 'utf8')).finally(() => { done() }))
    afterEach(done => rimraf(fakePackagePath).finally(() => { done() }))
    it('should exist', () => should.exist(query))
    it('should be a function', () => query.should.be.a('function'))
    it('should not throw for non-existant package name', () => (() => query().should.be.rejected).should.not.throw())
    it('should reject non-existant package name', () => query().should.be.rejected)
    it('should reject invalid package name', () => query('invalid-package').should.be.rejected)
    it('should query valid package', () => query('fake-package').should.be.fulfilled)
  })
})
