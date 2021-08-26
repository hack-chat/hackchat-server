import { expect } from 'chai';
import { resolve, sep } from 'path';
import CommandManager from '../src/serverLib/CommandManager.js';

const mockCore = {
  coreOptions: {
    logErrDetailed: true,
  },
}

describe('Checking Command Manager', () => {
  it('should be constructed', () => {
    expect(new CommandManager(mockCore)).to.be.an.instanceof(CommandManager);
  });

  it('should load required commands', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    const errors = await commandManager.loadCommands();

    expect(errors).to.equal('');
  });

  it('should reload required commands', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    const origVerif = commandManager.commands[0].reloadVerif;

    await commandManager.reloadCommands();
    const newVerif = commandManager.commands[0].reloadVerif;

    expect(origVerif).to.not.equal(newVerif);
  });

  it('should return errors as a string on load', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}badCommands`);
    const errors = await commandManager.loadCommands();

    expect(errors).to.have.string('Unable');
  });

  it('should return errors as a string on reload', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}badCommands`);
    const errors = await commandManager.reloadCommands();

    expect(errors).to.have.string('Unable');
  });

  it('should alert verification issues', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}faultyCommands`);
    const errors = await commandManager.loadCommands();

    expect(errors).to.have.string('Failed to load command module');
  });

  it('should get all commands', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    
    const commands = commandManager.all();

    expect(commands[0].info.category).to.have.string('core');
  });

  it('should get all commands filtered by category', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    
    const commands = commandManager.all('core');

    expect(commands[0].info.category).to.have.string('core');
  });

  it('should get all categories', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();

    expect(commandManager.categoriesList[0]).to.have.string('core');
  });

  it('should find a command by name', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();

    expect(commandManager.get('echo').info.name).to.have.string('echo');
  });

  it('should find a command by alias', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();

    expect(commandManager.get('the_command').info.name).to.have.string('echo');
  });

  it('should initialize all hooks', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    commandManager.initCommandHooks({});
    
    expect(commandManager.get('echo').info.initialized).to.equal(true);
  });
  
  it('should execute command by name', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    const ret = await commandManager.handleCommand({}, {}, {
      cmd: 'echo',
      text: 'test',
    });

    expect(ret).to.equal(true);
  });

  it('should handle bad command names', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    const ret = await commandManager.handleCommand({}, {}, {
      cmd: '404_unicorn',
      text: 'test',
    });

    expect(ret).to.equal(true);
  });

  it('should suggest closely named commands', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    const ret = await commandManager.handleCommand({}, {}, {
      cmd: 'ech',
      text: 'test',
    });

    expect(ret).to.equal(true);
  });

  it('should validate required command params', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    const ret = await commandManager.handleCommand({}, {}, {
      cmd: 'zetacmd',
      text: 'test',
    });

    expect(ret).to.equal(null);
  });
  
  it('should verbosely inform about failed commands', async () => {
    const commandManager = new CommandManager(mockCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    const ret = await commandManager.handleCommand({}, {}, {
      cmd: 'fail',
    });

    expect(ret).to.equal(null);
  });

  it('should inform about failed commands', async () => {
    const nonverboseCore = {
      coreOptions: {
        logErrDetailed: false,
      },
    }

    const commandManager = new CommandManager(nonverboseCore, `${resolve()}${sep}test${sep}testCommands`);
    await commandManager.loadCommands();
    const ret = await commandManager.handleCommand({}, {}, {
      cmd: 'fail',
    });

    expect(ret).to.equal(null);
  });
});
