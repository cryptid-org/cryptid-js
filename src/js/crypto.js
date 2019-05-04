function privateKeyToWasm(privateKey) {
    const xWasm = this.string.asciiToWasm(privateKey.x);
    const yWasm = this.string.asciiToWasm(privateKey.y);

    const pointer = this.interop.allocatePrivateKey(xWasm.pointer, yWasm.pointer);

    this.memory.free(xWasm.pointer, yWasm.pointer);

    return pointer;
}

function privateKeyFromWasm(extractResultPointer) {
    const xPointer = this.interop.getPrivateKeyX(extractResultPointer);
    const x = this.string.asciiFromWasm(xPointer);
    const yPointer = this.interop.getPrivateKeyY(extractResultPointer);
    const y = this.string.asciiFromWasm(yPointer);

    this.memory.free(xPointer, yPointer);

    return {
        x,
        y
    };
}

function ciphertextToWasm(ciphertext) {
    const UXWasm = this.string.asciiToWasm(ciphertext.cipherU.x);
    const UYWasm = this.string.asciiToWasm(ciphertext.cipherU.y);

    const cipherVArray = this.base64.toByteArray(ciphertext.cipherV);
    const cipherVPointer = this.memory.allocate(cipherVArray.length);
    this.memory.HEAPU8.set(cipherVArray, cipherVPointer);

    const cipherWArray = this.base64.toByteArray(ciphertext.cipherW);
    const cipherWPointer = this.memory.allocate(cipherWArray.length);
    this.memory.HEAPU8.set(cipherWArray, cipherWPointer);

    const ciphertextPointer = this.interop.allocateCipherTextTuple(
        UXWasm.pointer,
        UYWasm.pointer,
        cipherVPointer,
        // - 1 for the zero terminator
        cipherVArray.length - 1,
        cipherWPointer,
        // - 1 for the zero terminator
        cipherWArray.length - 1
    );

    this.memory.free(
        UXWasm.pointer,
        UYWasm.pointer,
    );

    return ciphertextPointer;
}

function ciphertextFromWasm(pointer) {
    const cipherU = {};

    const cipherUXPointer = this.interop.getCipherUX(pointer);
    cipherU.x = this.string.asciiFromWasm(cipherUXPointer);
    const cipherUYPointer = this.interop.getCipherUY(pointer);
    cipherU.y = this.string.asciiFromWasm(cipherUYPointer);

    const cipherVPointer = this.interop.getCipherV(pointer);
    // + 1 for the zero terminator
    const cipherVLength = this.interop.getCipherVLength(pointer) + 1;
    const cipherVArray = this.memory.HEAPU8.slice(cipherVPointer, cipherVPointer + cipherVLength);
    const cipherV = this.base64.fromByteArray(cipherVArray);

    const cipherWPointer = this.interop.getCipherW(pointer);
    // + 1 for the zero terminator
    const cipherWLength = this.interop.getCipherWLength(pointer) + 1;
    const cipherWArray = this.memory.HEAPU8.slice(cipherWPointer, cipherWPointer + cipherWLength);
    const cipherW = this.base64.fromByteArray(cipherWArray);
    
    return {
        cipherU,
        cipherV,
        cipherW
    };
}

function publicParametersToWasm(publicParameters) {
    const fieldOrderWasm = this.string.asciiToWasm(publicParameters.fieldOrder);
    const subgroupOrderWasm = this.string.asciiToWasm(publicParameters.subgroupOrder);

    const pointPXWasm = this.string.asciiToWasm(publicParameters.pointP.x);
    const pointPYWasm = this.string.asciiToWasm(publicParameters.pointP.y);

    const pointPPublicXWasm = this.string.asciiToWasm(publicParameters.pointPpublic.x);
    const pointPPublicYWasm = this.string.asciiToWasm(publicParameters.pointPpublic.y);

    const pointer = this.interop.allocatePublicParameters(
        fieldOrderWasm.pointer,
        subgroupOrderWasm.pointer,
        pointPXWasm.pointer,
        pointPYWasm.pointer,
        pointPPublicXWasm.pointer,
        pointPPublicYWasm.pointer,
        publicParameters.securityLevel
    );

    this.memory.free(
        fieldOrderWasm.pointer,
        subgroupOrderWasm.pointer,
        pointPXWasm.pointer,
        pointPYWasm.pointer,
        pointPPublicXWasm.pointer,
        pointPPublicYWasm.pointer
    );

    return pointer;
}

function publicParametersFromWasm(setupResultPointer, securityLevel) {
    const fieldOrderPtr = this.interop.getPublicParametersFieldOrder(setupResultPointer);
    const fieldOrder = this.string.asciiFromWasm(fieldOrderPtr);

    const subgroupOrderPtr = this.interop.getPublicParametersQ(setupResultPointer);
    const subgroupOrder = this.string.asciiFromWasm(subgroupOrderPtr);

    const pointPXPtr = this.interop.getPublicParametersPointPX(setupResultPointer);
    const pointPX = this.string.asciiFromWasm(pointPXPtr);
    const pointPYPtr = this.interop.getPublicParametersPointPY(setupResultPointer);
    const pointPY = this.string.asciiFromWasm(pointPYPtr);

    const pointPpublicXPtr = this.interop.getPublicParametersPointPpublicX(setupResultPointer);
    const pointPpublicX = this.string.asciiFromWasm(pointPpublicXPtr);
    const pointPpublicYPtr = this.interop.getPublicParametersPointPpublicY(setupResultPointer);
    const pointPpublicY = this.string.asciiFromWasm(pointPpublicYPtr);

    this.memory.free(fieldOrderPtr, subgroupOrderPtr, pointPXPtr, pointPYPtr, pointPpublicXPtr, pointPpublicYPtr);

    return {
        fieldOrder,
        subgroupOrder,
        pointP: {
            x: pointPX,
            y: pointPY
        },
        pointPpublic: {
            x: pointPpublicX,
            y: pointPpublicY
        },
        securityLevel
    };
}

function decrypt(publicParameters, privateKey, ciphertext) {
    const publicParametersPointer = publicParametersToWasm.call(this, publicParameters);
    const privateKeyPointer = privateKeyToWasm.call(this, privateKey);
    const ciphertextPointer = ciphertextToWasm.call(this, ciphertext);

    const result = {
        plaintext: null
    };

    const decryptResultPointer = this.interop.decrypt(ciphertextPointer, privateKeyPointer, publicParametersPointer);
    result.success = !!+this.interop.isDecryptSuccess(decryptResultPointer);

    if (result.success) {
        result.plaintext = this.string.utf8FromWasm(this.interop.getDecryptPlaintext(decryptResultPointer));
    }

    this.interop.destroyDecryptResult(decryptResultPointer);
    this.interop.destroyPublicParameters(publicParametersPointer);
    this.interop.destroyPrivateKey(privateKeyPointer);
    this.interop.destroyCipherTextTuple(ciphertextPointer);

    this.memory.free(
        decryptResultPointer,
        publicParametersPointer,
        privateKeyPointer,
        ciphertextPointer
    );

    return result;
}

function encrypt(publicParameters, identity, message) {
    const publicParametersPointer = publicParametersToWasm.call(this, publicParameters);
    const identityWasm = this.string.utf8ToWasm(identity);
    const messageWasm = this.string.utf8ToWasm(message);

    const result = {
        ciphertext: null
    };

    const encryptResultPointer = this.interop.encrypt(
        messageWasm.pointer,
        messageWasm.size,
        identityWasm.pointer,
        identityWasm.size,
        publicParametersPointer
    );

    result.success = !!+this.interop.isEncryptSuccess(encryptResultPointer);

    const ciphertextPointer = this.interop.getEncryptCiphertext(encryptResultPointer);

    if (result.success) {
        result.ciphertext = ciphertextFromWasm.call(this, ciphertextPointer);
    }

    this.interop.destroyEncryptResult(encryptResultPointer);
    this.interop.destroyPublicParameters(publicParametersPointer);

    this.memory.free(
        identityWasm.pointer,
        messageWasm.pointer,
        encryptResultPointer,
        publicParametersPointer
    );

    return result;
}

function setup(securityLevel) {
    const result = {
        masterSecret: null,
        publicParameters: null
    };

    const setupResultPointer = this.interop.setup(securityLevel);

    result.success = !!+this.interop.isSetupSuccess(setupResultPointer);

    if (result.success) {
        result.masterSecret = this.string.asciiFromWasm(this.interop.getMasterSecret(setupResultPointer));

        result.publicParameters = publicParametersFromWasm.call(this, setupResultPointer, securityLevel);
    }

    this.interop.destroySetupResult(setupResultPointer);

    this.memory.free(setupResultPointer);

    return result;
}

function extract(publicParameters, masterSecret, identity) {
    const result = {
        privateKey: null
    };

    const masterSecretWasm = this.string.asciiToWasm(masterSecret);
    const identityWasm = this.string.utf8ToWasm(identity);
    const publicParametersPointer = publicParametersToWasm.call(this, publicParameters);

    const extractResultPointer = this.interop.extract(identityWasm.pointer, publicParametersPointer, masterSecretWasm.pointer);

    result.success = !!+this.interop.isExtractSuccess(extractResultPointer);

    if (result.success) {
        result.privateKey = privateKeyFromWasm.call(this, extractResultPointer);
    }

    this.interop.destroyPublicParameters(publicParametersPointer);
    this.interop.destroyExtractResult(extractResultPointer);

    this.memory.free(
        masterSecretWasm.pointer,
        identityWasm.pointer,
        extractResultPointer,
        publicParametersPointer
    );

    return result;
}

module.exports = {
    encrypt,
    decrypt,
    setup,
    extract
};
