#! /usr/bin/env node

/**
  * This setup script creates a config file that will be used by the server.
  * It allows a user to specify the port, command modules path, and other options.
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

// Compile and return the list of questions using the language data
const buildQuestions = (i18n, advancedMode) => {
  const questions = [];
  
  questions.push({
    type: 'input',
    name: 'configName',
    message: i18n.configName,
    initial: '.hcserver.json',
    skip: advancedMode,
  });

  questions.push({
    type: 'input',
    name: 'modulesPath',
    message: i18n.cmdDirName,
    initial: './commands',
  });

  questions.push({
    type: 'input',
    name: 'websocketPort',
    message: i18n.serverPort,
    initial: '6060',
  });

  questions.push({
    type: 'input',
    name: 'halflife',
    message: i18n.rlHalflife,
    initial: '30000',
    skip: advancedMode,
  });

  questions.push({
    type: 'input',
    name: 'threshold',
    message: i18n.rlThreshold,
    initial: '25',
    skip: advancedMode,
  });

  questions.push({
    type: 'input',
    name: 'pulseSpeed',
    message: i18n.pingSpeed,
    initial: '16000',
    skip: advancedMode,
  });

  return questions;
}

// Save new config settings as a json file
const finalize = async (i18n, data) => {
  console.log('');

  const configPath = `${process.cwd()}${sep}${data.configName}`;
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
  }
}

// Create the target command modules directory, if needed
const createModulesDirectory = async (path, i18n) => {
  const modulesPath = `${process.cwd()}${sep}${path}${sep}`;
  const exists = await pathExists(modulesPath);

  if (exists === false) {
    const prompt = new Confirm({
      name: 'create',
      message: i18n.createDir,
    });

    console.log('');

    if (await prompt.run() === true) {
      mkdirSync(modulesPath);
    }
  }
}

// Script main
const start = async () => {
  const argv = yargs(hideBin(process.argv)).argv;
  const targetLang = argv.lang || 'en';

  const i18n = await loadLanguage(targetLang);

  const modePrompt = new Select({
    name: 'mode',
    message: i18n.config.configMode,
    choices: [
      i18n.config.configModeSimple,
      i18n.config.configModeAdvanced,
    ],
  });

  const mode = await modePrompt.run();
  const advancedMode = mode === i18n.config.configModeAdvanced ? false : true;

  const questions = buildQuestions(i18n.config, advancedMode);
  let answers = await prompt(questions);

  await finalize(i18n.config, answers);
  await createModulesDirectory(answers.modulesPath, i18n.config);
}

// Start script
start();