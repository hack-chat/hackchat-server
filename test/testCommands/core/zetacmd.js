/*
  Description: Echo stuff
*/

// module main
export async function run() {
    // dispatch info
    return true;
  }
  
  export function init(server) {
    return server;
  }
  
  export function initHooks() {
    this.info.initialized = true;
  }
  
  export const reloadVerif = Math.random().toString(36).substring(7);

  export const requiredData = ['ignore', 'this', 'error'];
  
  export const info = {
    name: 'zetacmd',
    aliases: ['the_command'],
    category: 'core',
    description: 'Echo stuff',
    usage: `
        API: { cmd: 'echo', text: '<text to echo>' }`,
  };
  