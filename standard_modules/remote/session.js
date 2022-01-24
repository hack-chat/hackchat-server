/**
  * @author Marzavec
  * @summary Using a jwt token, re-initialize a previous session
  * @version 1.0.0
  * @description Restore a previous session
  * @module session
  * @note Remember to run `npm i jsonwebtoken --save` after importing
  */

import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';

const CertLocation = './cert.key';

/**
 * Executes when invoked by a remote client
 * @param {Object} env - Enviroment object with references to core, server, socket & payload
 * @public
 * @return {void}
 */
export async function run({ core, server, socket, payload }) {
  let restored = false;
  let session = false;
  socket.session = false;

  if (typeof payload.jwt === 'undefined') {
    return server.reply({
      cmd: 'error',
      text: 'Invalid jwt',
    }, socket);
  }

  try {
    session = jsonwebtoken.verify(payload.jwt, core.cert);
  } catch(err) {
    return server.reply({
      cmd: 'error',
      text: 'Invalid jwt',
    }, socket);
  }

  /**
    * Additional session checking here
    */

  socket.session = session;
  restored = true;

  // refresh jwt token
  const token = jsonwebtoken.sign(session, core.cert, {
    expiresIn: '7 days',
  });

   // dispatch info
  server.reply({
    ...{
      cmd: 'session',
      sessionID: token,
      restored,
    },
    ...session,
  }, socket);
}

/**
  * Automatically executes once after server is ready
  * @param {Object} core - Reference to core enviroment object
  * @public
  * @return {void}
  */
export function init(core) {
  // load the encryption key if required
  if (typeof core.cert === 'undefined') {
    core.cert = fs.readFileSync(CertLocation);
  }
}

/**
  * Module meta information
  * @public
  * @typedef {Object} session/info
  * @property {string} name - Module command name
  * @property {string} description - Information about module
  * @property {string} usage - Information about module usage
  */
export const info = {
  name: 'session',
  category: 'remote',
  description: 'Restore previous state by session id or return new session id',
  usage: `API: { cmd: 'session', id: '<previous session>' }`,
};
