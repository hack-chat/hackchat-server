import { expect } from 'chai';
import Ws from 'ws';
import MainServer from '../src/serverLib/MainServer.js';

const mockCore = {
  coreOptions: {
    logErrDetailed: false,
  },
  config: {
    websocketPort: 6060,
    pulseSpeed: 16000,
    rateLimit: {
      halflife: 30000,
      threshold: 25,
    },
  },

  commands: {
    initCommandHooks: (server) => {
      if (server.doHooks) {
        server.registerHook('in', 'echo', () => {
          return false;
        });
    
        server.registerHook('out', 'echo', () => {
          return false;
        });
      }
    },
    handleCommand: (server, socket, data) => {
      socket.send(JSON.stringify(data));
    },
  },
}

const mainServer = new MainServer(mockCore);

const resetEnv = () => {
  mainServer.closeAll();
  mainServer.police.clear();
  // mainServer.clearHooks();
}

describe('Checking Main Server', () => {
  it('should be constructed', () => {
    expect(mainServer).to.be.an.instanceof(MainServer);
  });

  it('should beat its heart without users', () => {
    mainServer.lastErr = 'No error';
    mainServer.beatHeart();
    expect(mainServer.lastErr).to.have.string('No error');
  });

  it('should store a command key', () => {
    expect(mainServer.cmdKey).to.be.a('string');
  });

  it('should handle and store errors', () => {
    mainServer.emit('error', 'This error is meant to occur, please ignore');
    expect(mainServer.lastErr).to.have.string('This error is meant to occur');
  });

  it('should accept new connections', () => {
    const ws = new Ws('ws://127.0.0.1:6060');
    ws.onopen = () => {
      const origState = ws.readyState;
      expect(origState).to.equal(Ws.OPEN);
    };
  });

  it('should beat its heart with users', () => {
    resetEnv();

    const ws = new Ws('ws://127.0.0.1:6060');
    ws.onopen = () => {
      mainServer.lastErr = 'No error';
      mainServer.beatHeart();
      expect(mainServer.lastErr).to.have.string('No error');
    };
  });

  it('should reject malformed json', () => {
    resetEnv();
    
    const ws = new Ws('ws://127.0.0.1:6060');
    ws.onopen = () => {
      ws.send('KillMe');
    };

    ws.onclose = (reason) => {
      expect(reason.code).to.equal(1005);
    }
  });

  it('should handle socket errors', () => {
    resetEnv();
    
    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      mainServer.lastErr = '';

      const targetSockets = mainServer.findSockets({});
      targetSockets[0].emit('error', 'This error is meant to occur, please ignore');

      expect(mainServer.lastErr).to.have.string('This error is meant to occur');
    };
  });

  it('should observe ratelimiting', () => {
    resetEnv();
    
    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const targetSockets = mainServer.findSockets({});
      mainServer.police.arrest(targetSockets[0].address);

      ws.send(JSON.stringify({
        cmd: 'echo',
        text: 'test',
      }));
    };

    ws.onmessage = (msg) => {
      mainServer.police.clear();
      ws.close();
      expect(msg.data).to.have.string('You are being rate-limited or blocked.');
    }
  });

  it('should ignore data larger than 65536', () => {
    // resetEnv();
    
    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        cmd: 'echo',
        text: `Fail if this string is found ${'A'.repeat(65536)}`,
      }));

      ws.send(JSON.stringify({
        cmd: 'echo',
        text: `Pass`,
      }));
    };

    ws.onmessage = (msg) => {
      ws.close();
      expect(msg.data).to.not.have.string('Fail if this string is found');
    }
  });

  it('should reject command if its not a string', () => {
    resetEnv();
    
    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        cmd: [],
        text: `Fail if this string is found`,
      }));

      ws.send(JSON.stringify({
        cmd: 'echo',
        text: `Pass`,
      }));
    };

    ws.onmessage = (msg) => {
      expect(msg.data).to.not.have.string('Fail if this string is found');
    }
  });

  it('should reject command if its a builtin', () => {
    resetEnv();
    
    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        cmd: 'hasOwnProperty',
        text: `Fail if this string is found`,
      }));

      ws.send(JSON.stringify({
        cmd: 'echo',
        text: `Pass`,
      }));
    };

    ws.onmessage = (msg) => {
      expect(msg.data).to.not.have.string('Fail if this string is found');
    }
  });

  it('should report in-hook errors', () => {
    resetEnv();
    mainServer.clearHooks();
    
    mainServer.registerHook('in', 'echo', () => {
      throw new Error('This error is meant to occur, please ignore');
    });
    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        cmd: 'echo',
        text: 'I really hate unit tests. . .',
      }));
    };

    ws.onmessage = (msg) => {
      mainServer.clearHooks();
      expect(msg.data).to.have.string('This error is meant to occur');
    }
  });

  it('should allow a in-hook to supress handling the command', () => {
    resetEnv();
    mainServer.clearHooks();

    mainServer.registerHook('in', 'echo', () => {
      return false;
    });
    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        cmd: 'echo',
        text: 'Fail if this string is found',
      }));

      mainServer.clearHooks();

      ws.send(JSON.stringify({
        cmd: 'echo',
        text: `Pass`,
      }));
    };

    ws.onmessage = (msg) => {
      mainServer.clearHooks();
      expect(msg.data).to.not.have.string('This error is meant to occur');
    }
  });

  it('should send data to target socket', () => {
    resetEnv();
    
    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const targetSockets = mainServer.findSockets({});
      const targetSocket = targetSockets[targetSockets.length - 1];

      mainServer.send({
        cmd: 'echo',
        text: 'Simulated send',
      }, targetSocket);
    };

    ws.onmessage = (msg) => {
      expect(msg.data).to.have.string('Simulated send');
    }
  });
  
  it('should report out-hook errors', () => {
    resetEnv();
    mainServer.clearHooks();
    
    mainServer.registerHook('out', 'echo', () => {
      throw new Error('This error is meant to occur, please ignore');
    });

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const targetSockets = mainServer.findSockets({});
      const targetSocket = targetSockets[targetSockets.length - 1];
      
      mainServer.send({
        cmd: 'echo',
        text: 'Simulated send',
      }, targetSocket);
    };

    ws.onmessage = (msg) => {
      expect(msg.data).to.have.string('This error is meant to occur');
    }
  });

  it('should allow a out-hook to supress handling the command', () => {
    resetEnv();
    mainServer.clearHooks();

    mainServer.registerHook('out', 'echo', () => {
      return false;
    });

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const targetSockets = mainServer.findSockets({});
      const targetSocket = targetSockets[targetSockets.length - 1];

      mainServer.send({
        cmd: 'echo',
        text: 'Out supression test',
      }, targetSocket);
    };

    ws.onmessage = (msg) => {
      expect(msg.data).to.not.have.string('Out supression test');
    }
  });

  it('should have a working reply function', () => {
    resetEnv();
    mainServer.clearHooks();

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const targetSockets = mainServer.findSockets({});
      const targetSocket = targetSockets[targetSockets.length - 1];

      mainServer.reply({
        cmd: 'echo',
        text: 'Reply test',
      }, targetSocket);
    };

    ws.onmessage = (msg) => {
      expect(msg.data).to.have.string('Reply test');
    }
  });

  it('should have a working broadcast function', () => {
    resetEnv();

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      mainServer.broadcast({
        cmd: 'echo',
        text: 'Broadcast test',
      }, {});
    };

    ws.onmessage = (msg) => {
      expect(msg.data).to.have.string('Broadcast test');
    }
  });

  it('should allow hooks to alter the payloads', () => {
    resetEnv();
    mainServer.clearHooks();
    
    mainServer.registerHook('in', 'echo', ({ payload }) => {
      payload.text = 'Unit tests should be a violation of the geneva convention';
      return payload;
    });
    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        cmd: 'echo',
        text: 'I really hate unit tests. . .',
      }));
    };

    ws.onmessage = (msg) => {
      mainServer.clearHooks();
      expect(msg.data).to.have.string('geneva convention');
    }
  });

  it('should have a working broadcast function with no users', () => {
    resetEnv();

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      mainServer.broadcast({
        cmd: 'echo',
        text: 'Broadcast test',
      }, { unknown: true });

      mainServer.broadcast({
        cmd: 'echo',
        text: 'Broadcast test',
      }, {});
    };

    ws.onmessage = (msg) => {
      expect(msg.data).to.have.string('Broadcast test');
    };
  });

  it('should get socket hash by address string', () => {
    expect(mainServer.getSocketHash('127.0.0.1')).to.be.a('string');
  });

  it('should get socket hash by socket', () => {
    resetEnv();

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const targetSockets = mainServer.findSockets({});
      const targetSocket = targetSockets[targetSockets.length - 1];

      expect(mainServer.getSocketHash(targetSocket)).to.be.a('string');
    };
  });

  it('should discover socket by attribute', () => {
    resetEnv();

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const targetSockets = mainServer.findSockets({});
      const targetSocket = targetSockets[targetSockets.length - 1];

      const foundSockets = mainServer.findSockets({
        address: targetSocket.address,
      })

      expect(foundSockets).to.be.a('array');
    };
  });

  it('should discover socket by function', () => {
    resetEnv();

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const foundSockets = mainServer.findSockets({
        address: () => true,
      });

      expect(foundSockets).to.be.a('array');
    };
  });

  it('should discover socket by array', () => {
    resetEnv();

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const targetSockets = mainServer.findSockets({});
      const targetSocket = targetSockets[targetSockets.length - 1];

      const foundSockets = mainServer.findSockets({
        address: [targetSocket.address],
      });

      expect(foundSockets).to.be.a('array');
    };
  });

  it('should discover socket by object', () => {
    resetEnv();

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      const targetSockets = mainServer.findSockets({});
      const targetSocket = targetSockets[targetSockets.length - 1];

      const foundSockets = mainServer.findSockets({
        _extensions: targetSocket._extensions,
      });

      expect(foundSockets).to.be.a('array');
    };
  });

  it('should (re)load module hooks', () => {
    resetEnv();

    mainServer.doHooks = true;

    mainServer.loadHooks();
  });

  it('should output verbose hook errors', () => {
    resetEnv();
    mainServer.clearHooks();
    mockCore.coreOptions.logErrDetailed = true;

    mainServer.registerHook('in', 'echo', () => {
      throw new Error('This error is meant to occur, please ignore');
    });

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        cmd: 'echo',
        text: 'I really hate unit tests. . .',
      }));
    };

    ws.onmessage = (msg) => {
      mainServer.clearHooks();
      expect(msg.data).to.have.string('This error is meant to occur');
    }
  });

  it('should not ', () => {
    resetEnv();
    mainServer.clearHooks();
    mockCore.coreOptions.logErrDetailed = true;

    mainServer.registerHook('in', 'echo', () => {
      throw new Error('This error is meant to occur, please ignore');
    });

    const ws = new Ws('ws://127.0.0.1:6060');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        cmd: 'not_echo',
        text: 'I really hate unit tests. . .',
      }));
    };

    ws.onmessage = (msg) => {
      mainServer.clearHooks();
      expect(msg.data).to.have.string('hate unit tests');
    }
  });
});
