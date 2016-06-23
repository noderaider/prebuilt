import Promise from 'bluebird'
import path from 'path'
import cp from 'child_process'
import { add7z, extractFull7z } from 'es-7z'
const readFile = Promise.promisify(require('fs').readFile)
const writeFile = Promise.promisify(require('fs').writeFile)
const access = Promise.promisify(require('fs').access)
const rimraf = Promise.promisify(require('rimraf'))
const mkdirp = Promise.promisify(require('mkdirp'))
const ncp = Promise.promisify(require('ncp').ncp)

const isWin = process.platform === 'win32'
const exePath = path.resolve(__dirname, '..', 'bin', '7za.exe')
const replaceInstallScript = packageName => `echo prebuilt => ${packageName} | platform[${process.platform}] | arch[${process.arch}] | version[${process.version}]`

const testPath = x => access(x).then(() => ({ exists: true, resolved: x })).catch(() => ({ exists: false }))

const getModulePath = (packageName, root) => {
  if(!packageName) return Promise.reject(new Error('packageName is required.'))
  if(root) {
    const relativePath = path.join(root, 'node_modules', packageName)
    return testPath(relativePath)
      .then(result => {
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

const getPrebuiltPath = (root) => path.resolve(root ? path.join(root, 'prebuilt') : 'prebuilt', process.platform, process.arch, process.version)
const getPrebuiltPackage = (packageName, root) => path.resolve(getPrebuiltPath(root), packageName)
const getZipFrom = (packageName, root) => `./node_modules/${packageName}`
const getZipTo = (packageName, root) => `prebuilt/${process.platform}/${process.arch}/${process.version}/${packageName}.7z`.replace(/\\/g, '/')

const readJSON = (jsonPath, fallback) => {
  return readFile(jsonPath, 'utf8')
    .then(data => JSON.parse(data))
    .catch(err => {
      console.error(err, `prebuilt: error reading file at ${jsonPath}.`)
      if(fallback)
        return fallback(err)
      throw err
    })
}

const writeJSON = (jsonPath, json) => {
  return writeFile(jsonPath, JSON.stringify(json, null, 2), 'utf8')
    .catch(err => {
      console.error(err, `prebuilt: error writing file at ${jsonPath}.`)
      throw err
    })
}


function executeGyp(commands, { msvs_version, cwd }) {
  return new Promise((resolve, reject) => {
    const { error, stdio, stdout, status, signal, output  } = cp.spawnSync(path.resolve(cwd, '..', '.bin', `node-gyp${isWin ? '.cmd' : ''}`), [ ...commands, `--msvs_version=${msvs_version}` ], { cwd: path.resolve(cwd), encoding: 'utf8' })
    if(error)
      return reject(error)
    resolve(stdio)
  })
}

function gypClean({ msvs_version, cwd } = {}) {
  console.info(`running node-gyp clean for package at ${cwd}`)
  return executeGyp([ 'clean' ], { msvs_version, cwd })
}

function gypConfigure({ msvs_version, cwd } = {}) {
  console.info(`running node-gyp configure for package at ${cwd}`)
  return executeGyp([ 'configure' ], { msvs_version, cwd })
}

function gypBuild(isDebug, { msvs_version, cwd } = {}) {
  console.info(`running node-gyp build for package at ${cwd} in ${isDebug ? 'debug' : 'release'} mode`)
  return executeGyp([ 'build', isDebug ? '--debug' : '--release' ], { msvs_version, cwd })
}

export function pack (packageName, { root = process.cwd(), msvs_version = 2015 } = {}) {
  if(!packageName) return Promise.reject(new Error('packageName is required.'))
  return getModulePath(packageName, root)
    .then(packagePath => {
      const packageJSONPath = path.join(packagePath, 'package.json')
      return readJSON(packageJSONPath)
        .then(packageJSON => {
          if(packageJSON.scripts && packageJSON.scripts.install) {
            console.info(`prebuilt: rewriting ${packageJSONPath} to remove node-gyp install step.`)
            packageJSON.scripts.install = replaceInstallScript(packageName)
            return writeJSON(packageJSONPath, packageJSON)
          }
        })
        .then(() => {
          const destDir = getPrebuiltPath(root)
          const prebuiltPackagePath = getPrebuiltPackage(packageName, root)
          const zipFrom = getZipFrom(packageName, root)
          const zipTo = getZipTo(packageName, root)
          const nodeModulePath = path.relative(__dirname, packagePath).replace(/\\/g, '/') + '/'
          const gypOpts = { msvs_version, cwd: path.resolve(zipFrom) }
          return gypClean(gypOpts)
            .then(() => gypConfigure(gypOpts))
            .then(() => gypBuild(true, gypOpts))
            .then(() => gypBuild(false, gypOpts))
            .catch(err => {
              console.error('pack: error occurred during node-gyp step')
              throw err
            })
            .then(() => {
              console.info('pack: node-gyp finished executing!')
              return mkdirp(destDir)
                      .then(() => {
                        //console.info(`file copied, starting 7z of ${zipFrom} to ${zipTo}`)
                        return add7z(zipTo, `${zipFrom}/*`, { exePath })
                          //.progress(files => console.info(`progress: 7z'ing files ${JSON.stringify(files)}`))
                          .then(() => {
                            //console.info('7zip completed, cleaning package')
                          })
                          .catch(err => {
                            console.error(err, '7-zip error occurred')
                            throw err
                          })
                      })
                  })
            })
        })
}

export function install(packageName, { root = process.cwd() } = {}) {
  if(!packageName) return Promise.reject(new Error('packageName is required.'))
  const zipFrom = getZipTo(packageName, root)
  const packagePath = getPrebuiltPackage(packageName, root)
  const installPath = path.join(root, 'node_modules', packageName)
  console.info(`extracting package at ${zipFrom} to ${installPath}...`)
  return extractFull7z(zipFrom, installPath, { exePath })
    //.progress(files => console.info(`progress: extracting files ${JSON.stringify(files)}`))
    .then(() => {
      //console.info('extraction completed!')
    })
    .catch(err => {
      console.error(err, 'extraction error occurred')
      throw err
    })

  //return ncp(packagePath, installPath)
}


export function query(packageName) {
  return Promise.reject('placeholder')
}
