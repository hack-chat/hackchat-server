/**
  * @author Marzavec
  * @summary Hot reload module
  * @version 1.0.0
  * @description Allows a remote user to clear and re-import the server command modules
  * @module reload
  */

/**
  * Executes when invoked by a remote client
  * @param {Object} env - Enviroment object with references to core, server, socket & payload
  * @public
  * @return {void}
  */
export async function run({
  core, server, socket,
}) {
  /**
    * ADD USER VERIFICATION HERE
    * NOT EVERY USER SHOULD BE ABLE TO RUN THIS MODULE!
    */

  // do command reload and store results
  let loadResult = core.dynamicImports.reloadDirCache();
  loadResult += core.commands.loadCommands();

  // clear and rebuild all module hooks
  server.loadHooks();

  // build reply based on reload results
  if (loadResult === '') {
    loadResult = `Reloaded ${core.commands.commands.length} commands, 0 errors`;
  } else {
    loadResult = `Reloaded ${core.commands.commands.length} commands, error(s):
      ${loadResult}`;
  }

  // reply with reload result
  return server.reply({
    cmd: 'info',
    text: loadResult,
  }, socket);
}

/**
  * Module meta information
  * @public
  * @typedef {Object} reload/info
  * @property {string} name - Module command name
  * @property {string} description - Information about module
  * @property {string} usage - Information about module usage
  */
export const info = {
  name: 'reload',
  category: 'utility',
  description: 'Allows a remote user to clear and re-import the server command modules',
  usage: 'API: { cmd: \'reload\' }',
};
