Ravencore
=======

This is Unders fork of Bitpay's Bitcore that uses Ravencoin 0.15.0. It has a limited segwit support.

We (Under) are not promising to keep these forks "alive", updated and maintained, long-term. For that reason, they are not pushed into NPM, just on github.

What is also added is support for new smart fees; `/utils/estimatesmartfee?nbBlocks=2&mode=economical` returns the new smart fees. Similarly, estimatesmartfee (with `int bool` parameters) is added to the ravencore websocket API.

We do not version Ravencore here, either for mainnet or for the forks; we are using https://github.com/underdarkskies/ravencore-deb to build debian packages, which are versioned, for all the coins. So this repo might seem a little chaotic, but we are pinning commit hashes for various altcoins in the ravencore-deb repo.

Bitpay's Bitcore has diverged from our code with their recent rewrites and refactors (for example, added bcoin for transaction parsing); we do not plan to merge the big refactors back here. (see https://github.com/bitpay/bitcore )

----
Infrastructure to build Ravencoin and blockchain-based applications for the next generation of financial technology.

**Note:** If you're looking for the Ravencore Library please see: https://github.com/underdarkskies/ravencore-lib

## Getting Started

Before you begin you'll need to have Node.js v4 or v0.12 installed. There are several options for installation. One method is to use [nvm](https://github.com/creationix/nvm) to easily switch between different versions, or download directly from [Node.js](https://nodejs.org/).

```bash
npm install -g ravencore
```

Spin up a full node and join the network:

```bash
npm install -g ravencore
ravencored
```

You can then view the Insight block explorer at the default location: `http://localhost:3001/insight`, and your configuration file will be found in your home directory at `~/.ravencore`.

Create a transaction:
```js
var ravencore = require('ravencore');
var transaction = new ravencore.Transaction();
var transaction.from(unspent).to(address, amount);
transaction.sign(privateKey);
```

## Applications

- [Node](https://github.com/underdarkskies/ravencore-node) - A full node with extended capabilities using Ravencoin Core
- [Insight API](https://github.com/underdarkskies/insight-api) - A blockchain explorer HTTP API
- [Insight UI](https://github.com/underdarkskies/insight) - A blockchain explorer web user interface
- [Wallet Service](https://github.com/underdarkskies/ravencore-wallet-service) - A multisig HD service for wallets
- [Wallet Client](https://github.com/underdarkskies/ravencore-wallet-client) - A client for the wallet service
- [CLI Wallet](https://github.com/underdarkskies/ravencore-wallet) - A command-line based wallet client
- [Angular Wallet Client](https://github.com/underdarkskies/angular-ravencore-wallet-client) - An Angular based wallet client
- [Copay](https://github.com/underdarkskies/copay) - An easy-to-use, multiplatform, multisignature, secure ravencoin wallet

## Libraries

- [Lib](https://github.com/underdarkskies/ravencore-lib) - All of the core Ravencoin primatives including transactions, private key management and others
- [Payment Protocol](https://github.com/underdarkskies/ravencore-payment-protocol) - A protocol for communication between a merchant and customer
- [P2P](https://github.com/underdarkskies/ravencore-p2p) - The peer-to-peer networking protocol
- [Mnemonic](https://github.com/underdarkskies/ravencore-mnemonic) - Implements mnemonic code for generating deterministic keys
- [Channel](https://github.com/underdarkskies/ravencore-channel) - Micropayment channels for rapidly adjusting ravencoin transactions
- [Message](https://github.com/underdarkskies/ravencore-message) - Ravencoin message verification and signing
- [ECIES](https://github.com/underdarkskies/ravencore-ecies) - Uses ECIES symmetric key negotiation from public keys to encrypt arbitrarily long data streams.

## Documentation

The complete docs are hosted here: [bitcore documentation](http://bitcore.io/guide/). There's also a [bitcore API reference](http://bitcore.io/api/) available generated from the JSDocs of the project, where you'll find low-level details on each bitcore utility.

- [Read the Developer Guide](http://bitcore.io/guide/)
- [Read the API Reference](http://bitcore.io/api/)

To get community assistance and ask for help with implementation questions, please use our [community forums](http://bitpaylabs.com/c/bitcore).

## Security

We're using Ravencore in production, as are [many others](http://bitcore.io#projects), but please use common sense when doing anything related to finances! We take no responsibility for your implementation decisions.

If you find a security issue, please email security@bitpay.com.

## Contributing

Please send pull requests for bug fixes, code optimization, and ideas for improvement. For more information on how to contribute, please refer to our [CONTRIBUTING](https://github.com/underdarkskies/ravencore/blob/master/CONTRIBUTING.md) file.

This will generate files named `ravencore.js` and `ravencore.min.js`.

You can also use our pre-generated files, provided for each release along with a PGP signature by one of the project's maintainers. To get them, checkout a release commit (for example, https://github.com/underdarkskies/ravencore/commit/e33b6e3ba6a1e5830a079e02d949fce69ea33546 for v0.12.6).

To verify signatures, use the following PGP keys:
- @braydonf: https://pgp.mit.edu/pks/lookup?op=get&search=0x9BBF07CAC07A276D `D909 EFE6 70B5 F6CC 89A3 607A 9BBF 07CA C07A 276D`
- @gabegattis: https://pgp.mit.edu/pks/lookup?op=get&search=0x441430987182732C `F3EA 8E28 29B4 EC93 88CB  B0AA 4414 3098 7182 732C`
- @kleetus: https://pgp.mit.edu/pks/lookup?op=get&search=0x33195D27EF6BDB7F `F8B0 891C C459 C197 65C2 5043 3319 5D27 EF6B DB7F`
- @matiu: https://pgp.mit.edu/pks/lookup?op=get&search=0x9EDE6DE4DE531FAC `25CE ED88 A1B1 0CD1 12CD  4121 9EDE 6DE4 DE53 1FAC`

## License

Code released under [the MIT license](https://github.com/underdarkskies/ravencore/blob/master/LICENSE).

Copyright 2013-2015 BitPay, Inc. Bitcore is a trademark maintained by BitPay, Inc.
