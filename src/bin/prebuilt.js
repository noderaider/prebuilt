#! /usr/bin/env node

import path from 'path'
import fs from 'fs'
import yargs from 'yargs'
import { createLogger } from 'bunyan'
import deasync from 'deasync'
import { textSync } from 'figlet'
import chalk from 'chalk'
import util from 'util'

import { pack, install } from '../lib'

const should = require('chai').should()
const log = createLogger({ name: 'prebuilt', level: 'info' })

const header = textSync('- prebuilt -', { font: 'Doom' })

console.log(chalk.red(header))

let argv = yargs.usage('usage: $0 [options] package-name')
                .alias('p', 'pack')
                .describe('p', 'pack a prebuilt version of a pack in the node_modules folder for current architecture / node / bitness combination')
                .alias('i', 'install')
                .describe('i', 'install a prebuilt pack to the node_modules folder for the current architecture / node / bitness combination')
                .alias('h', 'help')
                .help()
                .strict()
                .argv

const cwd = process.cwd()
let done = false
if(argv.pack) {
  console.info(`calling pack for ${argv.pack}`)
  pack(argv.pack, cwd)
    .then(() => {
      console.info(`${argv.pack} packed successfully!`)
    })
    .catch(err => {
      console.error(err, `${argv.pack} error occurred while packing!`)
    })
    .finally(() => { done = true })
} else if(argv.install, cwd) {
  console.info(`calling install for ${argv.install}`)
  install(argv.install)
    .then(() => {
      console.info(`${argv.install} installed successfully!`)
    })
    .catch(err => {
      console.error(err, `${argv.install} error occurred while installing!`)
    })
    .finally(() => { done = true })
} else {
  yargs.showHelp()
  done = true
}
deasync.loopWhile(() => !done)
