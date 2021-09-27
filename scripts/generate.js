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
import { sep } from 'path';

import enquirerPkg from 'enquirer';
const { Input, Select, Confirm } = enquirerPkg;

import pkg from 'fs-extra';
const { pathExists, readJson, writeFileSync, mkdirSync } = pkg;

import i18n from './util/i18n.js';

let currentConfig = false;
let debugMode = false;

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
const finalize = async (outputModule, i18n) => {
  console.log('');

  const rootDir = `${process.cwd()}${debugMode ? `${sep}..` : ''}${sep}`;
  const cmdPath = `${rootDir}${currentConfig.modulesPath}`;
  const categoryPath = `${cmdPath}${sep}${outputModule.category}`;
  const filePath = `${categoryPath}${sep}${outputModule.commandName}.js`;

  createDirectory(cmdPath);
  createDirectory(categoryPath);

  console.log(filePath);

  const exists = await pathExists(filePath);

  if (exists === true) {
    const prompt = new Confirm({
      name: 'overwrite',
      message: i18n.existsWarning,
    });

    if (await prompt.run() === false) {
      return showMainMenu(outputModule, i18n);
    }
  }

  const moduleString = moduleToString(outputModule);

  writeFileSync(filePath, moduleString);
  console.log(i18n.writeSuccess);
}

//
const moduleToString = (outputModule) => {
  let moduleString = `/**
  * @author
  * @summary
  * @version 1.0.0
  * @description ${outputModule.info.description}
  * @module ${outputModule.info.name}
  */

/**
  * Executes when invoked by a remote client
  * @param {Object} env - Enviroment object with references to core, server, socket & payload
  * @public
  * @return {void}
  */
export async function run({
  core, server, socket, payload,
}) {

}\n\n`;

  if (outputModule.requireInit) {
    moduleString += `/**
  * Automatically executes once after server is ready
  * @param {Object} core - Reference to core enviroment object
  * @public
  * @return {void}
  */
export function init(core) {

}

`;
  }

  if (outputModule.hooks.length) {
    let registerBlock = `/**
  * Automatically executes once after server is ready to register this modules hooks
  * @param {Object} server - Reference to server enviroment object
  * @public
  * @return {void}
  */
export function initHooks(server) {
`;
    let functionBlock = '';
    let functionName;
    for (let i = 0, j = outputModule.hooks.length; i < j; i++) {
      functionName = `${outputModule.hooks[i].name}Hook`;

      registerBlock += `  server.registerHook('${outputModule.hooks[i].type}', '${outputModule.hooks[i].name}', this.${functionName}.bind(this), ${outputModule.hooks[i].priority});\n`;
      functionBlock += `/**
  * Executes every time an ${outputModule.hooks[i].type === 'in' ? 'incoming' : 'outgoing'} ${outputModule.hooks[i].name} command is invoked
  * @param {Object} env - Enviroment object with references to core, server, socket & payload
  * @public
  * @return {{Object|boolean|string}} Object = same/altered payload, false = suppress action, string = error
  */
export function ${functionName}({
  core, server, socket, payload,
}) {

}`;
    }

    moduleString += `${registerBlock}}\n\n${functionBlock}\n\n`;
  }

  moduleString += `/**
  * The following payload properties are required to invoke this module:
  * "${outputModule.requiredData.join('", "')}"
  * @public
  * @typedef {Array} ${outputModule.info.name}/requiredData
  */
export const requiredData = ['${outputModule.requiredData.join("', '")}'];\n\n`;

  moduleString += `/**
  * Module meta information
  * @public
  * @typedef {Object} ${outputModule.info.name}/info
  * @property {string} name - Module command name
  * @property {string} description - Information about module
  * @property {string} usage - Information about module usage
  */
export const info = {
  name: '${outputModule.info.name}',
  description: '${outputModule.info.description}',
  usage: \`${outputModule.info.usage === '""' ? '' : outputModule.info.usage}\`,
};`;

  return moduleString;
}

// Create the target command category directory, if needed
const createDirectory = async (path) => {
  const modulesPath = `${path}${sep}`;
  const exists = await pathExists(modulesPath);

  if (exists === false) {
    mkdirSync(modulesPath);
  }
}

// Induce cringe in linux fanatics
const cls = () => console.clear();

// Main Menu
let lastMenu = 0;
const showMainMenu = async (outputModule, i18n) => {
  cls();

  outputModuleInfo(outputModule, i18n);

  const menuPrompt = new Select({
    name: 'mainMenu',
    message: i18n.choiceLabel,
    initial: lastMenu,
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
    case i18n.setNameLabel: {
      lastMenu = 0;

      const namePrompt = new Input({
        type: 'input',
        name: 'name',
        message: i18n.inputName,
        initial: outputModule.commandName === i18n.requiredText ? '' : outputModule.commandName,
      });

      outputModule.commandName = await namePrompt.run();
      showMainMenu(outputModule, i18n);
      break;
    }
    case i18n.setCategoryLabel: {
      lastMenu = 1;

      const catPrompt = new Input({
        type: 'input',
        name: 'category',
        message: i18n.inputCategory,
        initial: outputModule.category === '""' ? '' : outputModule.category,
      });

      outputModule.category = await catPrompt.run();
      showMainMenu(outputModule, i18n);
      break;
    }
    case i18n.setCmdLabel: {
      lastMenu = 2;

      const cmdPrompt = new Input({
        type: 'input',
        name: 'cmd',
        message: i18n.inputCmd,
        initial: outputModule.commandName === i18n.requiredText ? outputModule.commandName : outputModule.commandName,
      });

      outputModule.info.name = await cmdPrompt.run();
      showMainMenu(outputModule, i18n);
      break;
    }
    case i18n.setDescLabel: {
      lastMenu = 3;

      const descPrompt = new Input({
        type: 'input',
        name: 'desc',
        message: i18n.inputDesc,
        initial: outputModule.info.description === '""' ? '' : outputModule.info.description,
      });

      outputModule.info.description = await descPrompt.run();
      showMainMenu(outputModule, i18n);
      break;
    }
    case i18n.setUsageLabel: {
      lastMenu = 4;

      const usagePrompt = new Input({
        type: 'input',
        name: 'usage',
        message: i18n.inputUsage,
        initial: outputModule.info.usage === '""' ? '' : outputModule.info.usage,
      });

      outputModule.info.usage = await usagePrompt.run();
      showMainMenu(outputModule, i18n);
      break;
    }
    case i18n.setReqPropsLabel: {
      lastMenu = 5;

      const reqPropPrompt = new Input({
        type: 'input',
        name: 'requiredData',
        message: i18n.inputRequiredData,
      });

      outputModule.requiredData.push(await reqPropPrompt.run());
      showMainMenu(outputModule, i18n);
      break;
    }
    case i18n.setHooksLabel: {
      lastMenu = 6;

      const newHook = {
        type: 'in',
        name: '',
        priority: 35,
      };

      const typePromp = new Select({
        name: 'typePromp',
        message: i18n.inputHookType,
        choices: [
          i18n.inputHookIncoming,
          i18n.inputHookOutgoing,
        ],
      });

      newHook.type = (await typePromp.run()) === i18n.inputHookIncoming ? 'in' : 'out';

      const hookNamePrompt = new Input({
        type: 'input',
        name: 'name',
        message: i18n.inputHookName,
      });
      newHook.name = (await hookNamePrompt.run());

      const hookPrioPrompt = new Input({
        type: 'input',
        name: 'priority',
        message: i18n.inputHookPriority,
      });
      newHook.priority = (await hookPrioPrompt.run());

      outputModule.hooks.push(newHook);
      showMainMenu(outputModule, i18n);
      break;
    }
    case i18n.setInitLabel: {
      lastMenu = 7;
      const initPrompt = new Confirm({
        name: 'init',
        message: i18n.inputInit,
      });

      outputModule.requireInit = await initPrompt.run();
      showMainMenu(outputModule, i18n);
      break;
    }
    case i18n.saveLabel: {
      finalize(outputModule, i18n);
      break;
    }
    case i18n.cancelLabel: {
      // Okthnxbai
      break;
    }
    default: {
      showMainMenu(outputModule, i18n);
    }
  }
}

const outputModuleInfo = (outputModule, i18n) => console.log(`
  \x1b[35m${i18n.nameLabel}:\x1b[0m ${outputModule.commandName}
  \x1b[35m${i18n.categoryLabel}:\x1b[0m ${outputModule.category}
  \x1b[35m${i18n.cmdLabel}:\x1b[0m ${outputModule.info.name}
  \x1b[35m${i18n.descriptionLabel}:\x1b[0m ${outputModule.info.description}
  \x1b[35m${i18n.usageLabel}:\x1b[0m ${outputModule.info.usage}
  \x1b[35m${i18n.requiredLabel}:\x1b[0m ['${outputModule.requiredData.join("', '")}']
  \x1b[35m${i18n.hooksLabel}:\x1b[0m ${outputModule.hooks.length}
  \x1b[35m${i18n.initLabel}:\x1b[0m ${outputModule.requireInit}
`);

// Script main
const start = async () => {
  const argv = yargs(hideBin(process.argv)).argv;
  const targetLang = argv.lang || 'en';
  const configFile = argv.conf || '.hcserver.json';

  const i18nStrings = await i18n.getLanguage(targetLang);
  currentConfig = await loadConfig(configFile, i18nStrings);

  const outputModule = {
    commandName: i18nStrings.generate.requiredText,
    category: '""',
    info: {
      name: i18nStrings.generate.requiredText,
      description: '""',
      usage: '""',
    },
    requiredData: [],
    hooks: [],
    requireInit: false,
  }

  showMainMenu(outputModule, i18nStrings.generate);
}

// Start script
start();
