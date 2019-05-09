const assert = require('assert');

const faker = require('faker');

const CryptID = require('../../src/js');

const MESSAGE_LENGTH = 256;

function disableTimeout() {
    this.timeout(0);
}

const SecurityLevel = {
    LOWEST: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    HIGHEST: 4
};

function generateTestCaseWithMatchingIdentities() {
    const message = faker.random.alphaNumeric(MESSAGE_LENGTH);

    const identity = JSON.stringify(faker.helpers.createCard());

    return [
        message,
        identity
    ];
}

function generateTestCaseWithDifferentIdentities() {
    const message = faker.random.alphaNumeric(MESSAGE_LENGTH);

    const encryptIdentity = JSON.stringify(faker.helpers.createCard());
    const decryptIdentity = JSON.stringify(faker.helpers.userCard());

    return [
        message,
        encryptIdentity,
        decryptIdentity
    ];
}

describe('Matching ID suite', function matchingSuite() {
    disableTimeout.bind(this)();

    const setups = [
        [SecurityLevel.LOWEST, 20], [SecurityLevel.LOW, 5], [SecurityLevel.MEDIUM, 1]
    ];

    setups.forEach(function ([securityLevel, caseCount]) {
        for (let c = 0; c < caseCount; ++c) {
            // Given
            const [message, identity] = generateTestCaseWithMatchingIdentities();

            it(`Should encrypt and decrypt message correctly with matching IDs with security level ${securityLevel}`, async function matchingCase() {
                const client = await CryptID.getInstance();

                // When
                const setupResult = client.setup(securityLevel);
                const extractResult = client.extract(setupResult.publicParameters, setupResult.masterSecret, identity);
                const encryptResult = client.encrypt(setupResult.publicParameters, identity, message);
                const decryptResult = client.decrypt(setupResult.publicParameters, extractResult.privateKey, encryptResult.ciphertext);

                // Then
                assert.ok(encryptResult.success);
                assert.ok(decryptResult.success);
                assert.equal(decryptResult.plaintext, message);
            });
        }
    });
});

describe('Differing ID suite', function differingSuite() {
    disableTimeout.bind(this)();

    const setups = [
        [SecurityLevel.LOWEST, 20], [SecurityLevel.LOW, 5], [SecurityLevel.MEDIUM, 1]
    ];

    setups.forEach(function ([securityLevel, caseCount]) {
        for (let c = 0; c < caseCount; ++c) {
            // Given
            const [message, encryptIdentity, decryptIdentity] = generateTestCaseWithDifferentIdentities();

            it(`Should not be able to decrypt message with wrong ID with security level ${securityLevel}`, async function differingCase() {
                const client = await CryptID.getInstance();

                // When
                const setupResult = client.setup(securityLevel);
                const extractResult = client.extract(setupResult.publicParameters, setupResult.masterSecret, decryptIdentity);
                const encryptResult = client.encrypt(setupResult.publicParameters, encryptIdentity, message);
                const decryptResult = client.decrypt(setupResult.publicParameters, extractResult.privateKey, encryptResult.ciphertext);

                // Then
                assert.ok(encryptResult.success, 'Encryption was successful.');
                assert(!decryptResult.success, 'Decryption failed.');
                assert(decryptResult.plaintext === null, 'Decrypted plaintext is null.');
            });
        }
    });
});
