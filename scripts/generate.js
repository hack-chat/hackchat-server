#! /usr/bin/env node

/**
  * This setup script allows a user to quickly create an rpc module inside the command directory.
  * It requests the command name, description and other info to generate the boilerplate.
  *
  * Script arguments:
  * --lang - Specify the translation file to use, example: --lang=de
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

let currentConfig = false;
let debugMode = true;

// Load and return target language
const loadLanguage = async (lang) => {
  let langPath = `${dirname(__dirname)}${sep}src${sep}translations${sep}${lang}.json`;
  const exists = await pathExists(langPath);

  if (exists === false) {
    throw new Error(`Cannot find translation file: ${langPath}`);
  }

  try {
    return await readJson(langPath);
  } catch (err) {
    throw new Error(`Error loading translation file: ${langPath}\n${err}`);
  }
}

const loadConfig = async (configFile, i18n) => {
  let cfgPath = `${process.cwd()}${debugMode ? `${sep}..` : ''}${sep}${configFile}`;
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

// Save new config settings as a json file
const finalize = async (i18n, data) => {
  /*console.log('');

  const configPath = `${process.cwd()}${debugMode ? `${sep}..` : ''}${sep}${data.configName}`;
  console.log(i18n.savePathInfo);
  console.log(configPath);
  console.log('');

  const exists = await pathExists(configPath);

  if (exists === true) {
    const prompt = new Confirm({
      name: 'overwrite',
      message: i18n.existsWarning,
    });

    if (await prompt.run() === false) {
      console.log('');
      console.log(i18n.writeAborted);
      process.exit();
    }
  }

  const configData = {
    modulesPath: data.modulesPath,
    websocketPort: data.websocketPort,
    rateLimit: {
      halflife: data.halflife,
      threshold: data.threshold,
    },
    pulseSpeed: data.pulseSpeed,
  };

  try {
    await writeJson(configPath, configData);
    console.log(i18n.writeSuccess);
  } catch (err) {
    console.error(i18n.writeFailure);
    console.error(err);
  }*/
}

// Create the target command category directory, if needed
const createCategoryDirectory = async (path, i18n) => {
  const modulesPath = `${process.cwd()}${debugMode ? `${sep}..` : ''}${sep}${path}${sep}`;
  const exists = await pathExists(modulesPath);

  if (exists === false) {
    mkdirSync(modulesPath);
  }
}

// Induce cringe in linux fanatics
const cls = () => console.clear();

// Main Menu
const showMainMenu = async (outputModule, i18n) => {
  cls();

  outputModuleInfo(outputModule, i18n);

  const menuPrompt = new Select({
    name: 'mainMenu',
    message: i18n.choiceLabel,
    choices: [
      i18n.setNameLabel,
      i18n.setCategoryLabel,
      i18n.setCmdLabel,
      i18n.setDescLabel,
      i18n.setUsageLabel,
      i18n.setReqPropsLabel,
      i18n.setHooksLabel,
      i18n.setInitLabel,
      i18n.saveLabel,
      i18n.cancelLabel,
    ],
  });

  const choice = await menuPrompt.run();

  switch(choice) {
    case i18n.setNameLabel:

      break;
    case i18n.setCategoryLabel:

      break;
    case i18n.setCmdLabel:

      break;
    case i18n.setDescLabel:

      break;
    case i18n.setUsageLabel:

      break;
    case i18n.setReqPropsLabel:

      break;
    case i18n.setHooksLabel:

      break;
    case i18n.setInitLabel:

      break;
    case i18n.saveLabel:

      break;
    case i18n.cancelLabel:

      break;

    default:
      showMainMenu(outputModule, i18n);
  }
}

const outputModuleInfo = (outputModule, i18n) => console.log(`
  \x1b[35m${i18n.nameLabel}:\x1b[0m ${outputModule.commandName}
  \x1b[35m${i18n.categoryLabel}:\x1b[0m ${outputModule.category}
  \x1b[35m${i18n.cmdLabel}:\x1b[0m ${outputModule.info.name}
  \x1b[35m${i18n.descriptionLabel}:\x1b[0m ${outputModule.info.description}
  \x1b[35m${i18n.usageLabel}:\x1b[0m ${outputModule.info.usage}
  \x1b[35m${i18n.requiredLabel}:\x1b[0m ${outputModule.requiredData}
  \x1b[35m${i18n.hooksLabel}:\x1b[0m ${outputModule.hooks}
  \x1b[35m${i18n.initLabel}:\x1b[0m ${outputModule.requireInit}
`);

// Script main
const start = async () => {
  const argv = yargs(hideBin(process.argv)).argv;
  const targetLang = argv.lang || 'en';
  const configFile = argv.conf || '.hcserver.json';

  const i18n = await loadLanguage(targetLang);
  currentConfig = await loadConfig(configFile, i18n);

  const outputModule = {
    commandName: i18n.generate.requiredText,
    category: '""',
    info: {
      name: i18n.generate.requiredText,
      description: '""',
      usage: '""',
    },
    requiredData: [],
    hooks: 0,
    requireInit: false,
  }

  showMainMenu(outputModule, i18n.generate);
}

// Start script
start();
