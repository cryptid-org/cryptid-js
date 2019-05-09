#include "EncryptInterop.h"

#include <stdlib.h>

#include "CipherTextTupleInterop.h"
#include "CryptID.h"
#include "identity-based/CipherTextTuple.h"
#include "identity-based/PublicParameters.h"
#include "util/Status.h"


EncryptResult* EMSCRIPTEN_KEEPALIVE cryptid_interop_encrypt(char* message, int messageLength, char* identity, int identityLength, PublicParameters* params)
{
    EncryptResult* result = malloc(sizeof (EncryptResult));
    result->ciphertext = malloc(sizeof (CipherTextTuple));

    result->status = cryptid_encrypt(result->ciphertext, message, messageLength, identity, identityLength, *params);

    return result;
}

int EMSCRIPTEN_KEEPALIVE cryptid_interop_isEncryptSuccess(EncryptResult* result)
{
    return result->status == 0;
}

CipherTextTuple* EMSCRIPTEN_KEEPALIVE cryptid_interop_getEncryptCiphertext(EncryptResult* result)
{
    return result->ciphertext;
}

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyEncryptResult(EncryptResult* result)
{
    if (result->status == CRYPTID_SUCCESS)
    {
        cryptid_interop_destroyCipherTextTuple(result->ciphertext);
    }

    free(result->ciphertext);
}
