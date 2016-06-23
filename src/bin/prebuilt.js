#! /usr/bin/env node

import path from 'path'
import fs from 'fs'
import yargs from 'yargs'
import { createLogger } from 'bunyan'
import deasync from 'deasync'
import { textSync } from 'figlet'
import chalk from 'chalk'

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
                .alias('r', 'repack')
                .describe('r', 'repack all packed packages with the latest version of prebuilt')
                .alias('m', 'msvs_version')
                .describe('m', 'the msvs_version to use')
                .default('m', 2015)
                .alias('h', 'help')
                .help()
                .strict()
                .argv

const opts = { root: process.cwd(), msvs_version: argv.msvs_version }
let done = false
if(argv.pack) {
  console.info(`calling pack for ${argv.pack}`)
  pack(argv.pack, opts)
    .then(() => console.info(`${argv.pack} packed successfully!`))
    .catch(err => console.error(err, `${argv.pack} error occurred while packing!`))
    .finally(() => { done = true })
} else if(argv.repack) {
  console.warn('NOT YET IMPLEMENTED')
} else if(argv.install) {
  console.info(`calling install for ${argv.install}`)
  install(argv.install, opts)
    .then(() => console.info(`${argv.install} installed successfully!`))
    .catch(err => console.error(err, `${argv.install} error occurred while installing!`))
    .finally(() => { done = true })
} else {
  yargs.showHelp()
  done = true
}
deasync.loopWhile(() => !done)
