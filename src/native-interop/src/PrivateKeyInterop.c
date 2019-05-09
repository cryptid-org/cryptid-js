#include "PrivateKeyInterop.h"

#include <stdlib.h>

#include "gmp.h"

#include "elliptic/AffinePoint.h"


AffinePoint* EMSCRIPTEN_KEEPALIVE cryptid_interop_allocatePrivateKey(char* ch_pkx, char* ch_pky)
{
    mpz_t pkx, pky;
    mpz_init_set_str(pkx, ch_pkx, CONVERSION_BASE);
    mpz_init_set_str(pky, ch_pky, CONVERSION_BASE);

    AffinePoint* pk = malloc(sizeof (AffinePoint));

    *pk = affine_init(pkx, pky);
    
    mpz_clears(pkx, pky, NULL);

    return pk;
}

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyPrivateKey(AffinePoint *privateKey)
{
    affine_destroy(*privateKey);
}
