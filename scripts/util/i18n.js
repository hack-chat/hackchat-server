import { dirname, sep } from 'path';
import { fileURLToPath } from 'url';

import pkg from 'fs-extra';
const { pathExists, readJson } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
  * Handles loading json from a specified language
  * @property {i18n} i18n Dynamic language loader helper functions
  * @property {string} lang Target language
  * @author Marzavec ( https://github.com/marzavec )
  * @version v2.0.0
  * @license WTFPL ( http://www.wtfpl.net/txt/copying/ )
  */
class i18n {
  /**
    * Load and store target language file
    * @public
    * @return {String} Module errors or empty if none
    */
  static async getLanguage(lang) {
    let langPath = `${dirname(__dirname)}${sep}..${sep}src${sep}translations${sep}${lang}.json`;
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
}

export default i18n;
