/**
  * @author Marzavec
  * @summary Disconnection handler
  * @version 1.0.0
  * @description The server invokes this module each time a websocket connection is disconnected
  * @module disconnect
  */

/**
  * Executes when invoked by a remote client
  * @param {Object} env - Enviroment object with references to core, server, socket & payload
  * @public
  * @return {void}
  */
export async function run({ server, socket, payload }) {
  if (payload.cmdKey !== server.cmdKey) {
    // internal command attempt by client, increase rate limit chance and ignore
    return server.police.frisk(socket, 20);
  }

  /**
    * PROCESS EVENT HERE
    */

  // commit close just in case
  socket.terminate();

  return true;
}

/**
  * The following payload properties are required to invoke this module:
  * "cmdKey"
  * @public
  * @typedef {Array} disconnect/requiredData
  */
export const requiredData = ['cmdKey'];

/**
  * Module meta information
  * @public
  * @typedef {Object} disconnect/info
  * @property {string} name - Module command name
  * @property {string} description - Information about module
  * @property {string} usage - Information about module usage
  */
export const info = {
  name: 'disconnect',
  category: 'internal',
  description: 'Internally used to relay disconnect events to clients',
  usage: 'Internal Use Only',
};
