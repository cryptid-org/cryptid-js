#ifndef __CRYPTID_EXTRACT_INTEROP_H
#define __CRYPTID_EXTRACT_INTEROP_H

#include "CommonInterop.h"

#include "elliptic/AffinePoint.h"


typedef struct PublicParameters PublicParameters;

typedef struct
{
    AffinePoint privateKey;
    int status;
} ExtractResult;

ExtractResult* EMSCRIPTEN_KEEPALIVE cryptid_interop_extract(char* identity, PublicParameters* publicParameters, char* masterSecretStr);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPrivateKeyXR(ExtractResult* result);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPrivateKeyYR(ExtractResult* result);

int EMSCRIPTEN_KEEPALIVE cryptid_interop_isExtractSuccess(ExtractResult* result);

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyExtractResult(ExtractResult* result);

#endif
