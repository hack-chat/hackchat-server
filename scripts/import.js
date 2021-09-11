#! /usr/bin/env node

/**
  * This import script will copy module files from either the `standard_modules` directory,
  * or from a remote source (@todo)
  *
  * Script arguments:
  * --lang - Specify the translation file to use, example: --lang=de
  * --remote - Remote url @todo, could be url to .git, .zip, .js- or a crazed mixture of all three?
  */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { dirname, sep } from 'path';
import { fileURLToPath } from 'url';

import enquirerPkg from 'enquirer';
const { prompt, Select, Confirm } = enquirerPkg;

import pkg from 'fs-extra';
const { pathExists, readJson, writeJson, mkdirSync } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import i18n from './util/i18n.js';

// Script main
const start = async () => {
  const argv = yargs(hideBin(process.argv)).argv;
  const targetLang = argv.lang || 'en';
  const i18nStrings = await i18n.getLanguage(targetLang);

  console.log(i18nStrings);
}

start();
