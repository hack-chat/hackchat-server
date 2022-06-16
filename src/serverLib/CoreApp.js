import { resolve, dirname, sep } from 'path';
import { fileURLToPath } from 'url';

import pkg from 'fs-extra';
const { pathExists, readJson } = pkg;

import CommandManager from './CommandManager.js';
import MainServer from './MainServer.js';
import StatsManager from './StatsManager.js';

import { CoreOptions } from '../utility/Constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
  * The core app builds all required classes and maintains a central
  * reference point across the app
  * @property {Object} coreOptions Constructed options, reference to config path, language and verbosity level
  * @property {Object} i18n Translation string references
  * @property {Object} config Server configuraiton data including port and other options
  * @property {CommandManager} commands Manages and executes command modules
  * @property {StatsManager} stats Stores and adjusts arbritary stat data
  * @property {MainServer} server Main websocket server reference
  * @author Marzavec ( https://github.com/marzavec )
  * @version v2.2.0
  * @license WTFPL ( http://www.wtfpl.net/txt/copying/ )
  */
class CoreApp {
  /**
    * Create a `CoreApp` instance for managing application settings
    * @param {Object} options Core server options like configPath & logErrDetailed
    */
  constructor(options) {
    /**
      * Stored server configuration options
      * @type {String}
      */
    this.coreOptions = { ...CoreOptions, ...options  };

    /**
      * Server translation strings
      * @type {String}
      */
    this.i18n = {};

    /**
      * Server configuration settings
      * @type {Object}
      */
     this.config = {};
  }

  /**
    * Load config then initialize children
    * @public
    * @return {void}
    */
  async init() {
    this.i18n = await this.loadLanguage();
    this.config = await this.loadConfig();

    await this.buildCommandsManager();
    this.buildStatsManager();
    this.buildMainServer();
  }

  /**
    * Attempt to load requested translation file as json and return result
    * @private
    * @return {object}
    */
  async loadLanguage() {
    let langPath = `${dirname(__dirname)}${sep}translations${sep}${this.coreOptions.lang}.json`;
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

  /**
    * Attempt to load the configuration file as json and return result
    * @private
    * @return {object}
    */
  async loadConfig() {
    let cfgPath = `${resolve()}${sep}${this.coreOptions.configPath}`;
    const exists = await pathExists(cfgPath);

    if (exists === false) {
      throw new Error(`${this.i18n.errors.missingConfig}\n${cfgPath}`);
    }

    try {
      return await readJson(cfgPath);
    } catch (err) {
      throw new Error(`${this.i18n.errors.badConfig}\n${cfgPath}`);
    }
  }

  /**
    * Creates a new instance of the CommandManager and loads the command modules
    * @private
    * @return {void}
    */
  async buildCommandsManager() {
    this.commands = new CommandManager(this, `${resolve(this.config.modulesPath)}${sep}`);
    await this.commands.loadCommands();
  }

  /**
    * Creates a new instance of the StatsManager and sets the server start time
    * @private
    * @return {void}
    */
  buildStatsManager() {
    this.stats = new StatsManager();
    this.stats.set('start-time', process.hrtime());
  }

  /**
    * Creates a new instance of the MainServer
    * @private
    * @return {void}
    */
  buildMainServer() {
    this.server = new MainServer(this);
  }
}

// export { CoreApp as default };
export default CoreApp;
