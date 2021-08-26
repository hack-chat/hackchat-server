/*
  Description: Echo stuff
*/

// module main
/* export async function run({ server, socket, payload }) {

  // dispatch info
  server.reply({
      cmd: 'echo',
      text: 'a' + payload.text,
  }, socket);
}
*/

export const reloadVerif = Math.random().toString(36).substring(7);

export const info = {
  name: 'echo',
  description: 'Echo stuff',
  usage: `
      API: { cmd: 'echo', text: '<text to echo>' }`,
};
