#include "PublicParametersInterop.h"

#include <stdlib.h>

#include "gmp.h"

#include "elliptic/AffinePoint.h"
#include "elliptic/EllipticCurve.h"
#include "identity-based/HashFunction.h"
#include "identity-based/PublicParameters.h"


PublicParameters* EMSCRIPTEN_KEEPALIVE cryptid_interop_allocatePublicParameters(
    char* fieldOrder,
    char* subgroupOrder,
    char* pointPx,
    char* pointPy,
    char* pointPpublicx,
    char* pointPpublicy,
    int securityLevel
) 
{
    PublicParameters* params = (PublicParameters*)malloc(sizeof (PublicParameters));
    mpz_t zero, one, p, px, py, ppx, ppy;
    mpz_init_set_ui(zero, 0);
    mpz_init_set_ui(one, 1);
    mpz_init_set_str(p, fieldOrder, CONVERSION_BASE);
    mpz_init_set_str(px, pointPx, CONVERSION_BASE);
    mpz_init_set_str(py, pointPy, CONVERSION_BASE);
    mpz_init_set_str(ppx, pointPpublicx, CONVERSION_BASE);
    mpz_init_set_str(ppy, pointPpublicy, CONVERSION_BASE);

    params->ellipticCurve = ellipticCurve_init(zero, one, p);
    mpz_init_set_str(params->q, subgroupOrder, CONVERSION_BASE);

    params->pointP = affine_init(px, py);
    params->pointPpublic = affine_init(ppx, ppy);

    params->hashFunction = hashFunction_initForSecurityLevel(securityLevel);

    mpz_clears(zero, one, p, px, py, ppx, ppy, NULL);

    return params;
}

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyPublicParameters(PublicParameters* params)
{
    ellipticCurve_destroy(params->ellipticCurve);
    mpz_clear(params->q);
    affine_destroy(params->pointP);
    affine_destroy(params->pointPpublic);
}
