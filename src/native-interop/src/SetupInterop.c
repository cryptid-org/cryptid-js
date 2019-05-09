#include "SetupInterop.h"

#include <stdlib.h>

#include "gmp.h"

#include "CryptID.h"
#include "PublicParametersInterop.h"
#include "identity-based/PublicParameters.h"
#include "util/Status.h"


SetupResult* EMSCRIPTEN_KEEPALIVE cryptid_interop_setup(int securityLevel)
{
    SetupResult* result = malloc(sizeof (SetupResult));
    result->publicParameters = malloc(sizeof (PublicParameters));
    mpz_t masterSecret;
    mpz_init(masterSecret);
    mpz_init(result->publicParameters->q);

    result->status = cryptid_setup(securityLevel, result->publicParameters, masterSecret);

    if (result->status == CRYPTID_SUCCESS)
    {
        result->masterSecret = mpz_get_str(NULL, CONVERSION_BASE, masterSecret);
    }

    mpz_clear(masterSecret);

    return result;
}

int EMSCRIPTEN_KEEPALIVE cryptid_interop_isSetupSuccess(SetupResult* result)
{
    return result->status == 0;
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getMasterSecret(SetupResult* result)
{
    return result->masterSecret;
}

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroySetupResult(SetupResult* result)
{
    if (result->status == CRYPTID_SUCCESS)
    {
        cryptid_interop_destroyPublicParameters(result->publicParameters);
        free(result->masterSecret);
    }

    free(result->publicParameters);
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersFieldOrder(SetupResult* result)
{
    return mpz_get_str(NULL, CONVERSION_BASE, result->publicParameters->ellipticCurve.fieldOrder);
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersQ(SetupResult* result)
{
    return mpz_get_str(NULL, CONVERSION_BASE, result->publicParameters->q);
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersPointPX(SetupResult* result)
{
    return mpz_get_str(NULL, CONVERSION_BASE, result->publicParameters->pointP.x);
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersPointPY(SetupResult* result)
{
    return mpz_get_str(NULL, CONVERSION_BASE, result->publicParameters->pointP.y);
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersPointPpublicX(SetupResult* result)
{
    return mpz_get_str(NULL, CONVERSION_BASE, result->publicParameters->pointPpublic.x);
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersPointPpublicY(SetupResult* result)
{
    return mpz_get_str(NULL, CONVERSION_BASE, result->publicParameters->pointPpublic.y);
}
