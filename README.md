<div align="center">
  <a href="https://github.com/cryptid-org">
    <img alt="CryptID" src="docs/img/cryptid-logo.png" width="200">
  </a>
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@cryptid/cryptid-js.svg)](https://www.npmjs.com/package/@cryptid/cryptid-js)
[![License](![GitHub](https://img.shields.io/github/license/cryptid-org/cryptid-js.svg?label=license))](LICENSE)

</div>

<div align="center">
Cross-platform Identity-based Encryption solution.
</div>

# CryptID.js

Browser-friendly Identity-based Encryption library powered by WebAssembly.

If you're new to CryptID and Identity-based Encryption, then make sure to check out the [CryptID Getting Started](https://github.com/cryptid-org/getting-started) guide.

## Install

CryptID.js is available via NPM:

~~~~
$ npm install --save @cryptid/cryptid-js
~~~~

## Using CryptID.js

Below you can find a small example that sets up an IBE system instance, and then encrypts and decrypts a message:

~~~~JavaScript
const CryptID = require('@cryptid/cryptid-js');

(async function main() {
    const instance = await CryptID.getInstance();

    const setupResult = instance.setup(CryptID.SecurityLevel.LOWEST);

    if (!setupResult.success) {
        console.log('Failed to setup :(');
        return;
    }

    const message = 'Ironic.';
    // Name is somewhat unique among Sith Lords :)
    const identity = {
        name: 'Darth Plagueis'
    };

    const encryptResult = instance.encrypt(setupResult.publicParameters, identity, message);
    if (!encryptResult.success) {
        console.log('Failed to encrypt :(');
        return;
    }

    const extractResult = instance.extract(setupResult.publicParameters, setupResult.masterSecret, identity);
    if (!extractResult.success) {
        console.log('Failed to extract :(');
        return;
    }

    const decryptResult = instance.decrypt(setupResult.publicParameters, extractResult.privateKey, encryptResult.ciphertext);
    if (!decryptResult.success) {
        console.log('Failed to decrypt :(');
        return;
    }

    console.log(decryptResult.plaintext);
})();
~~~~

## License

CryptID.js is licensed under the [Apache License 2.0](LICENSE).

Licenses of dependencies:

  * [CryptID.native](https://github.com/cryptid-org/cryptid-native): [Apache License 2.0](https://github.com/cryptid-org/cryptid-native/blob/master/LICENSE)
  * [GMP](https://gmplib.org/): [GNU LGPL v3](https://www.gnu.org/licenses/lgpl.html)

## Acknowledgements

This work is supported by the construction EFOP-3.6.3-VEKOP-16-2017-00002. The project is supported by the European Union, co-financed by the European Social Fund.

<p align="right">
  <img alt="CryptID" src="docs/img/szechenyi-logo.jpg" width="350">
</p>

