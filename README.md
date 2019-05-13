# CryptID.js

## Using CryptID.js

Below you can find a small example that sets up an IBE system instance, and then encrypts and decrypts a message:

~~~~JavaScript
const CryptID = require('wherever-cryptid-is');

// getInstance() asynchronously acquires a client instance
CryptID.getInstance().then(instance => {
    // 0 means the LOWEST security level
    // setupResult contains the crucial parts - the public parameters and the master secret
    const setupResult = instance.setup(CryptID.SecurityLevel.LOWEST);

    if (!setupResult.success) {
        console.log('Failed to setup :(');
        return;
    }

    const message = 'Ironic.';
    const identity = 'Darth Plagueis';

    // First let's encrypt the message.
    // The ciphertext is saved into encryptResult.ciphertext
    const encryptResult = instance.encrypt(setupResult.publicParameters, identity, message);

    if (!encryptResult.success) {
        console.log('Failed to encrypt :(');
        return;
    }

    // Decryption requires a private key - that's what extract can be used for!
    // The private key is accessible as extractResult.privateKey
    const extractResult = instance.extract(setupResult.publicParameters, setupResult.masterSecret, identity);

    if (!extractResult.success) {
        console.log('Failed to extract :(');
        return;
    }

    // Now, that we have the appropriate private key, decryption is easy-peasy.
    // If the decryption was successful, the plaintext is saved into decryptResult.plaintext.
    const decryptResult = instance.decrypt(setupResult.publicParameters, extractResult.privateKey, encryptResult.ciphertext);

    if (!decryptResult.success) {
        console.log('Failed to decrypt :(');
        return;
    }

    console.log(decryptResult.plaintext);
});
~~~~

**Note**: Keep in mind, that in order to use CryptID.js in Node, you must build CryptID (the WASM part) with the `--forceNode` option!

## Testing CryptID.js

The end-to-end tests of CryptID.js can be run using `task.js`. The following description assumes that you're using the [CryptID Dev Machine](dev-machine).

First `vagrant ssh` into the dev virtual machine. Then switch to the root account using `sudo su`. Now setup the emscripten dev environment:

~~~~bash
cd /home/vagrant/emsdk
./emsdk activate sdk-tag-1.38.8-32bit
source ./emsdk_env.sh
~~~~

Finally, issue the following command from the repository root:

~~~~bash
./task.js cryptid-js e2e
~~~~
