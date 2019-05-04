const { wrapFunctions } = require('./signatures');
const Module = require('cryptid-wasm');
const cryptoApi = require('./crypto');
const identityConverter = require('./identity-converter');

const base64js = require('base64-js');

const base64Api = {
    base64: {
        toByteArray(base64String) {
            return base64js.toByteArray(base64String);
        },
        fromByteArray(byteArray) {
            return base64js.fromByteArray(byteArray);
        }
    }
};

const memoryApi = {
    memory: {
        allocate: size => Module._malloc(size),
        free: (...pointers) => pointers.forEach(pointer => Module._free(pointer)),
        HEAPU8: Module.HEAPU8,
        HEAPU32: Module.HEAPU32
    }
};

const stringApi = {
    string: {
        utf8ToWasm(str) {
            const size = Module.lengthBytesUTF8(str);

            // + 1 for the zero terminator
            const pointer = this.memory.allocate(size + 1);

            // + 1 for the zero terminator
            Module.stringToUTF8(str, pointer, size + 1);

            return {
                size,
                pointer
            };
        },
        utf8FromWasm(pointer) {
            return Module.UTF8ToString(pointer);
        },
        asciiToWasm(str) {
            const size = str.length;

            // + 1 for the zero terminator
            const pointer = this.memory.allocate(size + 1);

            Module.writeAsciiToMemory(str, pointer, false);

            return {
                size,
                pointer
            };
        },
        asciiFromWasm(pointer) {
            return Module.Pointer_stringify(pointer);
        }
    }
};

const privateApi = Object.assign(
    Object.create(null),
    {
        crypto: cryptoApi
    },
    base64Api,
    memoryApi,
    stringApi
);

function publicApiFactory() {
    const privateApiWithInterop = Object.assign(
        privateApi,
        {
            interop: wrapFunctions(Module)
        }
    );

    Object.values(privateApiWithInterop).forEach(api => Object.setPrototypeOf(api, privateApiWithInterop));

    const context = Object.create(privateApiWithInterop);

    let disposed = false;

    function checkDisposed() {
        if (disposed) {
            throw new Error('This object has already been disposed, please obtain a new instance!');
        }
    }

    return {
        encrypt(publicParameters, identity, message) {
            checkDisposed();

            const canonicIdentity = identityConverter(identity);

            return privateApi.crypto.encrypt.call(context, publicParameters, canonicIdentity, message);
        },
        decrypt(publicParameters, privateKey, ciphertext) {
            checkDisposed();

            return privateApi.crypto.decrypt.call(context, publicParameters, privateKey, ciphertext);
        },
        setup(securityLevel) {
            checkDisposed();

            return privateApi.crypto.setup.call(context, securityLevel);
        },
        extract(publicParameters, masterSecret, identity) {
            checkDisposed();

            const canonicIdentity = identityConverter(identity);

            return privateApi.crypto.extract.call(context, publicParameters, masterSecret, canonicIdentity);
        },
        dispose() {
            checkDisposed();

            disposed = true;
        }
    };
}

const wasmRuntimeInitialized = new Promise(function runtimeInitializationPromise(resolve) {
    Module['onRuntimeInitialized'] = resolve;
});

module.exports = {
    getInstance() {
        return wasmRuntimeInitialized.then(publicApiFactory);
    }
};