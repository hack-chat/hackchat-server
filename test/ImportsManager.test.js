import { expect } from 'chai';
import { resolve, sep } from 'path';
import fs from 'fs';
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

  it('should handle critical errors during import loading', async () => {
    const badPath = `${resolve()}${sep}test${sep}not_a_dir`;
    if (!fs.existsSync(badPath)) {
      fs.writeFileSync(badPath, 'not a directory');
    }

    const importsManager = new ImportsManager(badPath);
    const result = await importsManager.getImports();

    expect(result).to.be.a('string');
    expect(result).to.include('Critical error');

    try { fs.unlinkSync(badPath); } catch(e) {
      /* i hate unit tests so much */
    }
  });
});
