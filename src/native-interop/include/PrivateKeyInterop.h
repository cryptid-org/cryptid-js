#ifndef __CRYPTID_PRIVATE_KEY_INTEROP_H
#define __CRYPTID_PRIVATE_KEY_INTEROP_H

#include "CommonInterop.h"


typedef struct AffinePoint AffinePoint;

AffinePoint* EMSCRIPTEN_KEEPALIVE cryptid_interop_allocatePrivateKey(char* pkxr, char* pkyr);

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyPrivateKey(AffinePoint *privateKey);

#endif
