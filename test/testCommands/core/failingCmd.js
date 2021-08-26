/*
  Description: Echo stuff
*/

// module main
export async function run() {
    throw new Error('This error is meant to occur, please ignore');
  }
  
  export function init(server) {
    return server;
  }
  
  export function initHooks() {
    this.info.initialized = true;
  }
  
  export const reloadVerif = Math.random().toString(36).substring(7);
  
  export const info = {
    name: 'fail',
    category: 'core',
    description: 'Echo stuff',
    usage: `
        API: { cmd: 'echo', text: '<text to echo>' }`,
  };
  