[![NPM version](https://img.shields.io/npm/v/hackchat-server.svg?maxAge=3600)](https://www.npmjs.com/package/hackchat-server)
[![NPM downloads](https://img.shields.io/npm/dt/hackchat-server.svg?maxAge=3600)](https://www.npmjs.com/package/hackchat-server)
[![travis build](https://img.shields.io/travis/hack-chat/hackchat-server.svg?style=flat)](https://travis-ci.org/hack-chat/hackchat-server)
[![Dependency Status](https://david-dm.org/hack-chat/hackchat-server.svg?theme=shields.io)](https://david-dm.org/hack-chat/hackchat-server)
[![Codecov](https://img.shields.io/codecov/c/github/hack-chat/hackchat-server.svg)](https://app.codecov.io/gh/hack-chat/hackchat-server)
[![Language grade: JS/TS](https://img.shields.io/lgtm/grade/javascript/github/hack-chat/hackchat-server.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/hack-chat/hackchat-server/context:javascript)
[![MIT License](https://img.shields.io/github/license/hack-chat/hackchat-server.svg?style=flat)](http://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Patreon](https://img.shields.io/badge/donate-patreon-orange.svg)](https://www.patreon.com/marzavec)


## Table of contents

- [About](#about)
- [Installation](#installation)
- [Example Usage](#example-usage)
- [Links](#links)
- [Languages](#languages)
- [Contributing](#contributing)

## About

hackchat-server is a general use websocket server module designed to quickly bootstrap an application. The protocol is json only, with a module-based RPC-style command structure.

- Hot reload support
  - Update code without losing current connections
- Built in ratelimiting & ip ban
- Simple statistics tracking
- Multi-language support
- Quick module boilerplate generation
  - `npx hc-generate-cmd`

## Installation

**Node.js (version 14.0) or newer is required.**

Add to your project with: `npm install hackchat-server --save`.

Once installed, run: `npx hc-config` to generate a config file, if needed.

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
- [Contributors](https://github.com/hack-chat/main/graphs/contributors) :heart:
- [Legacy Contributors](https://github.com/AndrewBelt/hack.chat/graphs/contributors) :heart:

## Languages

Currently supported:

- English (en): [src/translations/en.json](src/translations/en.json)

## Contributing

**Languages:**

After forking & cloning this repo, navigate to the [src/translations](src/translations) directory. Duplicate the `en.json` file. What you name the duplicate json file is fairly important, highly suggest that you use the two-letter [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) abbreviations. The new language file will then be used by the `lang` property passed to the server, or by the `--lang` argument on the npx scripts.

**Issues:**

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the [documentation](https://github.com/hack-chat/hackchat-server).
