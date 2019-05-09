#include "CipherTextTupleInterop.h"

#include <stdlib.h>

#include "gmp.h"

#include "elliptic/AffinePoint.h"
#include "identity-based/CipherTextTuple.h"


char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherUX(CipherTextTuple* ciphertext)
{
    return mpz_get_str(NULL, CONVERSION_BASE, ciphertext->cipherU.x);
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherUY(CipherTextTuple* ciphertext)
{
    return mpz_get_str(NULL, CONVERSION_BASE, ciphertext->cipherU.y);
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherV(CipherTextTuple* ciphertext)
{
    return (char*) ciphertext->cipherV;
}

int EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherVLength(CipherTextTuple* ciphertext)
{
    return ciphertext->cipherVLength;
}

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherW(CipherTextTuple* ciphertext)
{
    return (char*) ciphertext->cipherW;
}

int EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherWLength(CipherTextTuple* ciphertext)
{
    return ciphertext->cipherWLength;
}

CipherTextTuple* EMSCRIPTEN_KEEPALIVE cryptid_interop_allocateCiphterTextTuple(
    char* cipherUX,
    char* cipherUY,
    unsigned char* cipherV,
    int cipherVLength,
    unsigned char* cipherW,
    int cipherWLength
)
{
    mpz_t ux, uy;
    mpz_init_set_str(ux, cipherUX, CONVERSION_BASE);
    mpz_init_set_str(uy, cipherUY, CONVERSION_BASE);

    CipherTextTuple* ciphertext = malloc(sizeof (CipherTextTuple));
    AffinePoint cipherU = affine_init(ux, uy);
    *ciphertext = cipherTextTuple_init(cipherU, cipherV, cipherVLength, cipherW, cipherWLength);

    affine_destroy(cipherU);
    mpz_clears(ux, uy, NULL);

    return ciphertext;
}

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyCipherTextTuple(CipherTextTuple* ciphertext)
{
    cipherTextTuple_destroy(*ciphertext);
}
