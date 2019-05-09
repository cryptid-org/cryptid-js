#include "ExtractInterop.h"

#include <stdlib.h>
#include <string.h>

#include "gmp.h"

#include "CryptID.h"
#include "identity-based/PublicParameters.h"
#include "util/Status.h"


ExtractResult* EMSCRIPTEN_KEEPALIVE cryptid_interop_extract(char* identity, PublicParameters* publicParameters, char* masterSecretStr)
{
    ExtractResult* result = malloc(sizeof (ExtractResult));

    size_t identityLength = strlen(identity);

    mpz_t masterSecret;
    mpz_init_set_str(masterSecret, masterSecretStr, CONVERSION_BASE);

    result->status = cryptid_extract(&(result->privateKey), identity, identityLength, *publicParameters, masterSecret);

    mpz_clear(masterSecret);

    return result;
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPrivateKeyX(ExtractResult* result)
{
    return mpz_get_str(NULL, CONVERSION_BASE, result->privateKey.x);
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPrivateKeyY(ExtractResult* result)
{
    return mpz_get_str(NULL, CONVERSION_BASE, result->privateKey.y);
}

int EMSCRIPTEN_KEEPALIVE cryptid_interop_isExtractSuccess(ExtractResult* result)
{
    return result->status == 0;
}

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyExtractResult(ExtractResult* result)
{
    if (result->status == CRYPTID_SUCCESS)
    {
        affine_destroy(result->privateKey);
    }
}
