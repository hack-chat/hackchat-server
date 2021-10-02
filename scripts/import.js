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
import { dirname, sep, join } from 'path';
import { fileURLToPath } from 'url';

import enquirerPkg from 'enquirer';
const { Select, MultiSelect } = enquirerPkg;

import pkg from 'fs-extra';
const { pathExists, readJson, readdirSync, lstatSync, copySync } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import i18n from './util/i18n.js';

const loadConfig = async (configFile, i18n) => {
  let cfgPath = `${process.cwd()}${sep}${configFile}`;
  const exists = await pathExists(cfgPath);

  if (exists === false) {
    throw new Error(`${i18n.errors.missingConfig}\n${cfgPath}`);
  }

  try {
    return await readJson(cfgPath);
  } catch (err) {
    throw new Error(`${i18n.errors.badConfig}\n${cfgPath}`);
  }
}

const gatherFiles = (startPath, filter) => {
  let out = [];

  let files = readdirSync(startPath);
  for(let i = 0; i < files.length; i++) {
    let filename = join(startPath, files[i]);
    let stat = lstatSync(filename);
    if (stat.isDirectory()){
      out = out.concat(gatherFiles(filename, filter));
    } else if (filename.indexOf(filter) >= 0) {
      if (filename.split('\\').pop().split('/').pop()[0] !== '_') {
        out.push(filename);
      }
    }
  }

  return out;
}

const importModules = async (destPath, targetModules, goodImport, failedImport) => {
  const rootDir = `${process.cwd()}${sep}`;
  const cmdPath = `${rootDir}${destPath}`;

  let destName = '';
  for (let i = 0, j = targetModules.length; i < j; i += 1) {
    destName = targetModules[i].split(`standard_modules${sep}`)[1];

    try {
      copySync(targetModules[i], `${cmdPath}${sep}${destName}`);
    } catch (err) {
      console.log(failedImport);
      console.log(err);
      return;
    }
  }

  console.log(goodImport);
}

// Script main
const start = async () => {
  const argv = yargs(hideBin(process.argv)).argv;
  const targetLang = argv.lang || 'en';
  const i18nStrings = await i18n.getLanguage(targetLang);
  const configFile = argv.conf || '.hcserver.json';
  const currentConfig = await loadConfig(configFile, i18nStrings);
  const standardModules = gatherFiles(`${dirname(__dirname)}${sep}standard_modules${sep}`, '.js');
  const remoteUrl = argv.remote || false;

  if (remoteUrl) {
    console.log(i18nStrings.import.missingFeature);
    return;
  }

  const modePrompt = new Select({
    name: 'mode',
    message: i18nStrings.import.importMode,
    choices: [
      i18nStrings.import.importAllLabel,
      i18nStrings.import.importSomeLabel,
      i18nStrings.import.importRemoteLabel,
    ],
  });

  const mode = await modePrompt.run();
  switch(mode) {
    case i18nStrings.import.importAllLabel: {
      importModules(currentConfig.modulesPath, standardModules, i18nStrings.import.goodImport, i18nStrings.import.failedImport);
      break;
    }
    case i18nStrings.import.importSomeLabel: {
      const moduleChoices = [];
      for (let i = 0, j = standardModules.length; i < j; i += 1) {
        moduleChoices.push({
          name: standardModules[i].split(`standard_modules${sep}`)[1],
          value: standardModules[i],
        });
      }

      const targetPrompt = new MultiSelect({
        name: 'moduleSelect',
        message: i18nStrings.import.somePrompt,
        limit: standardModules.length,
        choices: moduleChoices,
        result (names) {
          return this.map(names);
        },
      });

      const targetModules = Object.values(await targetPrompt.run());

      if (targetModules.length === 0) return;

      importModules(currentConfig.modulesPath, targetModules, i18nStrings.import.goodImport, i18nStrings.import.failedImport);
      break;
    }
    case i18nStrings.import.importRemoteLabel: {
      console.log(i18nStrings.import.missingFeature);
      break;
    }
  }
}

start();
