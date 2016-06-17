import Promise from 'bluebird'
import path from 'path'
import util from 'util'
import { add7z, extractFull7z } from 'es-7z'
const access = Promise.promisify(require('fs').access)
const rimraf = Promise.promisify(require('rimraf'))
const mkdirp = Promise.promisify(require('mkdirp'))
const ncp = Promise.promisify(require('ncp').ncp)
const exePath = path.resolve(__dirname, '..', '7za.exe')

const testPath = x => access(x).then(() => ({ exists: true, resolved: x })).catch(() => ({ exists: false }))

const getModulePath = (packageName, cwd) => {
  if(!packageName) return Promise.reject(new Error('packageName is required.'))
  if(cwd) {
    const relativePath = path.join(cwd, 'node_modules', packageName)
    return testPath(relativePath)
      .then(result => {
        console.info(`RESULT => ${JSON.stringify(result)}`)
        if(result.exists)
          return result.resolved
        throw new Error(`Could not locate packageName ${packageName} at ${relativePath}`)
      })
  }
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

const getPrebuiltPath = (cwd) => path.resolve(cwd ? path.join(cwd, 'prebuilt') : 'prebuilt', process.platform, process.arch, process.version)
const getPrebuiltPackage = (packageName, cwd) => path.resolve(getPrebuiltPath(cwd), packageName)
const getZipFrom = (packageName, cwd) => `./node_modules/${packageName}/*` //path.relative(__dirname, path.resolve(`${cwd ? `${cwd}/` : ''}`).replace(/\\/g, '/') + '/'
const getZipTo = (packageName, cwd) => `prebuilt/${process.platform}/${process.arch}/${process.version}/${packageName}.7z`.replace(/\\/g, '/')

export function pack (packageName, cwd = process.cwd()) {
  if(!packageName) return Promise.reject(new Error('packageName is required.'))
  return getModulePath(packageName, cwd)
    .then(filePath => {
      const destDir = getPrebuiltPath(cwd)
      const prebuiltPackagePath = getPrebuiltPackage(packageName, cwd)
      const zipFrom = getZipFrom(packageName, cwd)
      const zipTo = getZipTo(packageName, cwd)
      const nodeModulePath = path.relative(__dirname, filePath).replace(/\\/g, '/') + '/'
      return mkdirp(destDir)
        .then(() => {
          //console.info(`file copied, starting 7z of ${zipFrom} to ${zipTo}`)
          return add7z(zipTo, zipFrom, { exePath })
            //.progress(files => console.info(`progress: 7z'ing files ${JSON.stringify(files)}`))
            .then(() => {
              //console.info('7zip completed, cleaning package')
            })
            .catch(err => {
              console.error(util.inspect(err), '7zip error occurred')
              throw err
            })
        })
    })
}

export function install(packageName, cwd = process.cwd()) {
  if(!packageName) return Promise.reject(new Error('packageName is required.'))
  const zipFrom = getZipTo(packageName, cwd)
  const packagePath = getPrebuiltPackage(packageName, cwd)
  const installPath = path.join(cwd, 'node_modules', packageName)
  console.info(`extracting package at ${zipFrom} to ${installPath}...`)
  return extractFull7z(zipFrom, installPath, { exePath })
    //.progress(files => console.info(`progress: extracting files ${JSON.stringify(files)}`))
    .then(() => {
      //console.info('extraction completed!')
    })
    .catch(err => {
      console.error(util.inspect(err), 'extraction error occurred')
      throw err
    })

  //return ncp(packagePath, installPath)
}


export function query(packageName) {
  return Promise.reject('placeholder')
}
