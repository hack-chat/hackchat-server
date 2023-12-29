/* eslint global-require: 0 */
/* eslint no-console: 0 */

import { join, resolve, relative } from 'path';
import pkg from 'fs-extra';
const { existsSync, readdirSync, lstatSync, renameSync } = pkg;

/**
  * Import managment base, used to load commands/protocol and configuration objects
  * @property {String} base - Base path that all imports are required in from
  * @author Marzavec ( https://github.com/marzavec )
  * @version v2.0.0
  * @license WTFPL ( http://www.wtfpl.net/txt/copying/ )
  */
class ImportsManager {
  /**
    * Create an `ImportsManager` instance for (re)loading classes and config
    * @param {String} basePath executing directory name
    */
  constructor(basePath) {
    /**
      * Stored reference to the base directory path
      * @type {String}
      */
    this.basePath = basePath;

    /**
      * Data holder for imported modules
      * @type {Array}
      */
    this.imports = [];
  }

  /**
    * Pull base path that all imports are required in from
    * @public
    * @type {String} readonly
    */
  get base() {
    return this.basePath;
  }

  /**
    * Collect paths of files matching the filter
    * @private
    * @type {String} readonly
    */
  gatherFiles(startPath, filter){
    let out = [];

    let files = readdirSync(startPath);
    for(let i = 0; i < files.length; i++) {
      let filename = join(startPath, files[i]);
      let stat = lstatSync(filename);
      if (stat.isDirectory()){
        out = out.concat(this.gatherFiles(filename, filter));
      } else if (filename.indexOf(filter) >= 0) {
        if (filename.split('\\').pop().split('/').pop()[0] !== '_') {
          out.push(filename);
        }
      }
    }

    return out;
  }

  /**
    * Gather all js files from target directory, then verify and load
    * @param {String} dirName The name of the dir to load, relative to the basePath
    * @private
    * @return {String} Load errors or empty if none
    */
  async loadDir(dirName) {
    const dir = resolve(dirName);
    let errorText = '';
    let files = this.gatherFiles(dir, '.js');
    let imported;

    for (let i = 0, j = files.length; i < j; i++) {
      try {
        imported = await import(`file://${files[i]}`);

        this.imports[`${this.basePath}${relative(dir, files[i])}`] = imported;
      } catch (e) {
        const err = `Unable to load module ${relative(dir, files[i])}\n${e}`;
        errorText += err;
        console.error(err);
      }
    }

    return errorText;
  }

  /**
    * Pull reference to imported modules that were imported from dirName, or
    * load required directory if not found
    * @public
    * @return {Object} Object containing command module paths and structs
    */
  async getImports() {
    if (!existsSync(this.basePath)) {
      return `Cannot locate directory: ${this.basePath}`;
    }

    this.imports = [];
    let errorText = '';

    const tempImports = `${this.basePath.substr(0, this.basePath.length - 1)}.${Math.random().toString(36).substring(7)}`;
    renameSync(this.basePath, tempImports);

    errorText += await this.loadDir(tempImports);

    renameSync(tempImports, this.basePath);

    if (errorText !== '') {
      return errorText;
    }

    return { ...this.imports };
  }
}

export default ImportsManager;
