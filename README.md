[![NPM version](https://img.shields.io/npm/v/hackchat-server.svg?maxAge=3600)](https://www.npmjs.com/package/hackchat-server)
[![NPM downloads](https://img.shields.io/npm/dt/hackchat-server.svg?maxAge=3600)](https://www.npmjs.com/package/hackchat-server)
[![travis build](https://img.shields.io/travis/marzavec/hackchat-server.svg?style=flat)](https://travis-ci.org/marzavec/hackchat-server)
[![Dependency Status](https://david-dm.org/marzavec/hackchat-server.svg?theme=shields.io)](https://david-dm.org/marzavec/hackchat-server)
[![Codecov](https://img.shields.io/codecov/c/github/marzavec/hackchat-server.svg)](https://app.codecov.io/gh/marzavec/hackchat-server)
[![Language grade: JS/TS](https://img.shields.io/lgtm/grade/javascript/github/marzavec/hackchat-server.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/marzavec/hackchat-server/context:javascript)
[![MIT License](https://img.shields.io/github/license/marzavec/hackchat-server.svg?style=flat)](http://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Patreon](https://img.shields.io/badge/donate-patreon-orange.svg)](https://www.patreon.com/marzavec)


## Table of contents

- [About](#about)
- [Installation](#installation)
- [Example Usage](#example-usage)
- [Links](#links)
- [Contributing](#contributing)
- [Help](#help)

## About

hackchat-server is a general use websocket server module designed to quickly bootstrap an application. The protocol is json only, with a module-based RPC-style command structure.

- Hot reload support
  - Update code without losing current connections
- Built in ratelimiting & ip ban
- Simple statistics tracking
- Multi-language support
- Quick module boilerplate generation
  - `npx hackchat-server generate`

## Installation

**Node.js (version 14.0) or newer is required.**

Add to your project with: `npm install hackchat-server --save`.
After the install a configuration script will be run and a server config file will be generated

This setup script can be manually called by using `npx hackchat-server config`.

## Example usage

```js
import { CoreApp } from 'hackchat-server';

const server = new CoreApp({
  configPath: '.hcserver.json',
  logErrDetailed: true,
  lang: 'en',
});

server.init();
```

## Links

- [Documentation](https://github.com/hack-chat/hackchat-server)
- [GitHub](https://github.com/hack-chat/hackchat-server)
- [NPM](https://www.npmjs.com/package/hackchat-server)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the [documentation](https://github.com/hack-chat/hackchat-server).
