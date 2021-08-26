import { expect } from 'chai';
import { resolve, sep } from 'path';
import ImportsManager from '../src/serverLib/ImportsManager.js';

describe('Checking Imports Manager', () => {
  it('should be constructed', () => {
    expect(new ImportsManager()).to.be.an.instanceof(ImportsManager);
  });

  it('should expose the base path', () => {
    const importsManager = new ImportsManager('test');

    expect(importsManager.base).to.be.a('string');
  });

  it('should load modules from directory', async () => {
    const importsManager = new ImportsManager(`${resolve()}${sep}test${sep}testCommands`);
    const commandImports = await importsManager.getImports();

    expect(commandImports).to.be.a('object');
  });

  it('should error on a bad path', async () => {
    const importsManager = new ImportsManager(`${resolve()}${sep}test${sep}missingcommands`);
    const commandImports = await importsManager.getImports();

    expect(commandImports).to.be.a('string');
  });

  it('should return a string on failures', async () => {
    const importsManager = new ImportsManager(`${resolve()}${sep}test${sep}badCommands`);
    const commandImports = await importsManager.getImports();

    expect(commandImports).to.be.a('string');
  });

  it('should reload all commands', async () => {
    const importsManager = new ImportsManager(`${resolve()}${sep}test${sep}testCommands`);

    let commandImports = await importsManager.getImports();
    const origVerif = commandImports[Object.keys(commandImports)[0]].reloadVerif;

    commandImports = await importsManager.getImports();
    const newVerif = commandImports[Object.keys(commandImports)[0]].reloadVerif;

    expect(origVerif).to.not.equal(newVerif);
  });
});
