#include "DecryptInterop.h"

#include <stdlib.h>

#include "CryptID.h"
#include "elliptic/AffinePoint.h"
#include "identity-based/CipherTextTuple.h"
#include "identity-based/PublicParameters.h"
#include "util/Status.h"


DecryptResult* EMSCRIPTEN_KEEPALIVE cryptid_interop_decrypt(CipherTextTuple* ciphertext, AffinePoint* privateKey, PublicParameters* params)
{
    DecryptResult* result = malloc(sizeof (DecryptResult));

    result->status = cryptid_decrypt(&(result->plaintext), *privateKey, *ciphertext, *params);

    return result;
}

int EMSCRIPTEN_KEEPALIVE cryptid_interop_isDecryptSuccess(DecryptResult* result)
{
    return result->status == 0;
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getDecryptPlaintext(DecryptResult* result)
{
    return result->plaintext;
}

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyDecryptResult(DecryptResult* result)
{
    if (result->status == CRYPTID_SUCCESS)
    {
        free(result->plaintext);
    }
}
