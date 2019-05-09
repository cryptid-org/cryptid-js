#ifndef __CRYPTID_ENCRYPT_INTEROP_H
#define __CRYPTID_ENCRYPT_INTEROP_H

#include "CommonInterop.h"


typedef struct PublicParameters PublicParameters;
typedef struct CipherTextTuple CipherTextTuple;

typedef struct
{
    CipherTextTuple *ciphertext;
    int status;
} EncryptResult;

EncryptResult* EMSCRIPTEN_KEEPALIVE cryptid_interop_encrypt(char* message, int messageLength, char* identity, int identityLength, PublicParameters* params);

int EMSCRIPTEN_KEEPALIVE cryptid_interop_isEncryptSuccess(EncryptResult* result);

CipherTextTuple* EMSCRIPTEN_KEEPALIVE cryptid_interop_getEncryptCiphertext(EncryptResult* result);

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyEncryptResult(EncryptResult* result);

#endif
