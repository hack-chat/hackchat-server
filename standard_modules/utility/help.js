/**
  * @author Marzavec
  * @summary Output help info
  * @version 1.0.0
  * @description This will deliver auto-compiled module help info to a remote user
  * @module help
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
  // verify user input
  if (typeof payload.command !== 'undefined' && typeof payload.command !== 'string') {
    return true;
  }

  let general = false;
  let specific = false;

  if (typeof payload.command === 'undefined') {
    // reply with general command information
    general = [];

    const categories = core.commands.categoriesList.sort();
    for (let i = 0, j = categories.length; i < j; i += 1) {
      const catCommands = core.commands.all(categories[i]).sort(
        (a, b) => a.info.name.localeCompare(b.info.name),
      );

      general.push({
        category: categories[i].replace('../src/commands/', '').replace(/^\w/, (c) => c.toUpperCase()),
        cmds: catCommands.map((c) => `${c.info.name}`),
      });
    }
  } else {
    // reply with specific module information
    const command = core.commands.get(payload.command);

    if (typeof command !== 'undefined') {
      specific = {
        name: command.info.name,
        aliases: command.info.aliases || [],
        category: command.info.category.replace('../src/commands/', '').replace(/^\w/, (c) => c.toUpperCase()),
        required: command.requiredData || [],
        description: command.info.description || '',
        usage: command.info.usage || command.info.name,
      };
    }
  }

  // output reply
  return server.reply({
    cmd: 'help',
    general,
    specific,
  }, socket);
}

/**
  * Module meta information
  * @public
  * @typedef {Object} help/info
  * @property {string} name - Module command name
  * @property {string} description - Information about module
  * @property {string} usage - Information about module usage
  */
export const info = {
  name: 'help',
  description: 'This will deliver auto-compiled module help info to a remote user',
  usage: `API: { cmd: 'help', command: '<optional command name>' }`,
};
