/*
  Description: Echo stuff
*/

// module main
export async function run() {
    return true;
  }
  
  export function init(server) {
    return server;
  }
  
  export function initHooks() {
    this.info.initialized = true;
  }
  
  export const reloadVerif = Math.random().toString(36).substring(7);
  
  export const info = {
    name: 'socketreply',
    aliases: ['the_command'],
    category: 'internal',
    description: 'Echo stuff',
    usage: `
        API: { cmd: 'echo', text: '<text to echo>' }`,
  };
  