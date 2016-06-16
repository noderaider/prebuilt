#! /usr/bin/env node

import path from 'path'
import fs from 'fs'
import yargs from 'yargs'
import { createLogger } from 'bunyan'
import deasync from 'deasync'
import { textSync } from 'figlet'
import chalk from 'chalk'

import prebuilt from '../lib'

const should = require('chai').should()

const log = createLogger({ name: 'prebuilt', level: 'info' })

const header = textSync('- prebuilt -', { font: 'Doom' })

console.log(chalk.red(header))

let argv = yargs.usage('usage: $0 [options] package-name')
                .alias('p', 'package')
                .describe('p', 'package a prebuilt version of a package in the node_modules folder for current architecture / node / bitness combination')
                .alias('i', 'install')
                .describe('i', 'install a prebuilt package to the node_modules folder for the current architecture / node / bitness combination')
                .help()
                .strict()
                .argv

/*

if(argv.init) {
  let { username, organization, full, email, host } = argv.init
  let repackagerc = { username, organization, full, email, host }
  try {
    fs.writeFileSync('.repackagerc', JSON.stringify(repackagerc, null, 2), 'utf8')
  } catch(err) {
    if(err) {
      log.error(err, 'error during writing .repackagerc')
      yargs.showHelp()
      process.exit(1)
    }
  }
  process.exit(0)
}


let done = false
const repackage = createRepackage({ log })
repackage(argv.transform, argv.package)
  .then(message => {
    log.info(message)
    done = true
  })
  .catch(err => {
    log.error(err, 'you may need to use repackage init [options]')
    yargs.showHelp()
    done = true
  })
deasync.loopWhile(() => !done)
*/
