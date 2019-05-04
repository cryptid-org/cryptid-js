const POINTER = 'number';
const VOID = '';
const NUMBER = 'number';

const ExposedFunction = function ExposedFunction(name, returnType, parameters) {
    return {
        name,
        returnType,
        parameters
    };
}

const exposedFunctionSignatures = {
    allocatePublicParameters: ExposedFunction(
        'cryptid_interop_allocatePublicParameters',
        POINTER,
        [POINTER, POINTER, POINTER, POINTER, POINTER, POINTER, NUMBER]
    ),
    destroyPublicParameters: ExposedFunction(
        'cryptid_interop_destroyPublicParameters',
        VOID,
        [POINTER]
    ),
    encrypt: ExposedFunction(
        'cryptid_interop_encrypt',
        POINTER,
        [POINTER, NUMBER, POINTER, NUMBER, POINTER]
    ),
    getCipherUX: ExposedFunction(
        'cryptid_interop_getCipherUX',
        POINTER,
        [POINTER]
    ),
    getCipherUY: ExposedFunction(
        'cryptid_interop_getCipherUY',
        POINTER,
        [POINTER]
    ),
    getCipherV: ExposedFunction(
        'cryptid_interop_getCipherV',
        POINTER,
        [POINTER]
    ),
    getCipherVLength: ExposedFunction(
        'cryptid_interop_getCipherVLength',
        POINTER,
        [NUMBER]
    ),
    getCipherW: ExposedFunction(
        'cryptid_interop_getCipherW',
        POINTER,
        [POINTER]
    ),
    getCipherWLength: ExposedFunction(
        'cryptid_interop_getCipherWLength',
        POINTER,
        [NUMBER]
    ),
    allocateCipherTextTuple: ExposedFunction(
        'cryptid_interop_allocateCiphterTextTuple',
        POINTER,
        [POINTER, POINTER, POINTER, NUMBER, POINTER, NUMBER]
    ),
    destroyCipherTextTuple: ExposedFunction(
        'cryptid_interop_destroyCipherTextTuple',
        VOID,
        [POINTER]
    ),
    allocatePrivateKey: ExposedFunction(
        'cryptid_interop_allocatePrivateKey',
        POINTER,
        [POINTER, POINTER]
    ),
    destroyPrivateKey: ExposedFunction(
        'cryptid_interop_destroyPrivateKey',
        VOID,
        [POINTER]
    ),
    decrypt: ExposedFunction(
        'cryptid_interop_decrypt',
        POINTER,
        [POINTER, POINTER, POINTER]
    ),
    isDecryptSuccess: ExposedFunction(
        'cryptid_interop_isDecryptSuccess',
        NUMBER,
        [POINTER]
    ),
    getDecryptPlaintext: ExposedFunction(
        'cryptid_interop_getDecryptPlaintext',
        POINTER,
        [POINTER]
    ),
    destroyDecryptResult: ExposedFunction(
        'cryptid_interop_destroyDecryptResult',
        VOID,
        [POINTER]
    ),
    isEncryptSuccess: ExposedFunction(
        'cryptid_interop_isEncryptSuccess',
        NUMBER,
        [POINTER]
    ),
    getEncryptCiphertext: ExposedFunction(
        'cryptid_interop_getEncryptCiphertext',
        POINTER,
        [POINTER]
    ),
    destroyEncryptResult: ExposedFunction(
        'cryptid_interop_destroyEncryptResult',
        VOID,
        [POINTER]
    ),
    extract: ExposedFunction(
        'cryptid_interop_extract',
        POINTER,
        [POINTER, POINTER, POINTER]
    ),
    getPrivateKeyX: ExposedFunction(
        'cryptid_interop_getPrivateKeyX',
        POINTER,
        [POINTER]
    ),
    getPrivateKeyY: ExposedFunction(
        'cryptid_interop_getPrivateKeyY',
        POINTER,
        [POINTER]
    ),
    isExtractSuccess: ExposedFunction(
        'cryptid_interop_isExtractSuccess',
        NUMBER,
        [POINTER]
    ),
    destroyExtractResult: ExposedFunction(
        'cryptid_interop_destroyExtractResult',
        VOID,
        [POINTER]
    ),
    setup: ExposedFunction(
        'cryptid_interop_setup',
        POINTER,
        [NUMBER]
    ),
    isSetupSuccess: ExposedFunction(
        'cryptid_interop_isSetupSuccess',
        NUMBER,
        [POINTER]
    ),
    getMasterSecret: ExposedFunction(
        'cryptid_interop_getMasterSecret',
        POINTER,
        [POINTER]
    ),
    destroySetupResult: ExposedFunction(
        'cryptid_interop_destroySetupResult',
        VOID,
        [POINTER]
    ),
    getPublicParametersFieldOrder: ExposedFunction(
        'cryptid_interop_getPublicParametersFieldOrder',
        POINTER,
        [POINTER]
    ),
    getPublicParametersQ: ExposedFunction(
        'cryptid_interop_getPublicParametersQ',
        POINTER,
        [POINTER]
    ),
    getPublicParametersPointPX: ExposedFunction(
        'cryptid_interop_getPublicParametersPointPX',
        POINTER,
        [POINTER]
    ),
    getPublicParametersPointPY: ExposedFunction(
        'cryptid_interop_getPublicParametersPointPY',
        POINTER,
        [POINTER]
    ),
    getPublicParametersPointPpublicX: ExposedFunction(
        'cryptid_interop_getPublicParametersPointPpublicX',
        POINTER,
        [POINTER]
    ),
    getPublicParametersPointPpublicY: ExposedFunction(
        'cryptid_interop_getPublicParametersPointPpublicY',
        POINTER,
        [POINTER]
    )
};

function wrapFunctions(Module) {
    const result = {};

    Object.keys(exposedFunctionSignatures).forEach(jsName => {
        const { name, returnType, parameters } = exposedFunctionSignatures[jsName];

        result[jsName] = Module.cwrap(name, returnType, parameters);
    });

    return result;
}

module.exports = {
    wrapFunctions
};
