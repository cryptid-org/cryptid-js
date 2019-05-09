#ifndef __CRYPTID_DECRYPT_INTEROP_H
#define __CRYPTID_DECRYPT_INTEROP_H

#include "CommonInterop.h"


typedef struct AffinePoint AffinePoint;
typedef struct PublicParameters PublicParameters;
typedef struct CipherTextTuple CipherTextTuple;

typedef struct
{
    char* plaintext;
    int status;
} DecryptResult;

DecryptResult* EMSCRIPTEN_KEEPALIVE cryptid_interop_decrypt(CipherTextTuple* ciphertext, AffinePoint* privateKey, PublicParameters* params);

int EMSCRIPTEN_KEEPALIVE cryptid_interop_isDecryptSuccess(DecryptResult* result);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getDecryptPlaintext(DecryptResult* result);

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyDecryptResult(DecryptResult* result);

#endif
