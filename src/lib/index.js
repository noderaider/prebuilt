import Promise from 'bluebird'
import path from 'path'
import util from 'util'
const access = Promise.promisify(require('fs').access)
const rimraf = Promise.promisify(require('rimraf'))
const mkdirp = Promise.promisify(require('mkdirp'))
const ncp = Promise.promisify(require('ncp').ncp)

const testPath = x => access(x).then(() => ({ exists: true, resolved: x })).catch(() => ({ exists: false }))

const getModulePath = packageName => {
  if(!packageName) return Promise.reject(new Error('packageName is required.'))
  const testPaths = module.parent.paths.map(x => path.join(x, packageName))
  return Promise.all(testPaths.map(testPath))
    .then(results => {
      for(let result of results) {
        if(result.exists)
          return result.resolved
      }
      throw new Error(`Could not locate packageName ${packageName}`)
    })
}

const getPrebuiltPath = () => path.resolve('prebuilt', process.platform, process.arch, process.version)
const getPrebuiltPackage = packageName => path.resolve(getPrebuiltPath(), packageName)

export function pack (packageName) {
  if(!packageName) return Promise.reject(new Error('packageName is required.'))
  return getModulePath(packageName)
    .then(filePath => {
      const destDir = getPrebuiltPath()
      const prebuiltPackagePath = getPrebuiltPackage(packageName)
      return mkdirp(destDir).then(x => ncp(filePath, prebuiltPackagePath))
    })
}

export function install(packageName) {
  if(!packageName) return Promise.reject(new Error('packageName is required.'))

  const packagePath = getPrebuiltPackage(packageName)
  const installPath = path.join('node_modules', packageName)
  return ncp(packagePath, installPath)
}


export function query(packageName) {
  return Promise.reject('placeholder')

}
