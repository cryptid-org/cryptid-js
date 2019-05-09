#ifndef __CRYPTID_CIPHER_TEXT_TUPLE_INTEROP_H
#define __CRYPTID_CIPHER_TEXT_TUPLE_INTEROP_H

#include "CommonInterop.h"


typedef struct CipherTextTuple CipherTextTuple;

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherUX(CipherTextTuple* ciphertext);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherUY(CipherTextTuple* ciphertext);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherV(CipherTextTuple* ciphertext);

int EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherVLength(CipherTextTuple* ciphertext);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherW(CipherTextTuple* ciphertext);

int EMSCRIPTEN_KEEPALIVE cryptid_interop_getCipherWLength(CipherTextTuple* ciphertext);

CipherTextTuple* EMSCRIPTEN_KEEPALIVE cryptid_interop_allocateCiphterTextTuple(
    char* cipherUX,
    char* cipherUY,
    unsigned char* cipherV,
    int cipherVLength,
    unsigned char* cipherW,
    int cipherWLength
);

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyCipherTextTuple(CipherTextTuple* ciphertext);

#endif
