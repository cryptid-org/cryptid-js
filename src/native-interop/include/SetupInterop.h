#ifndef __CRYPTID_SETUP_INTEROP_H
#define __CRYPTID_SETUP_INTEROP_H

#include "CommonInterop.h"


typedef struct PublicParameters PublicParameters;

typedef struct
{
    PublicParameters* publicParameters;
    char* masterSecret;
    int status;
} SetupResult;

SetupResult* EMSCRIPTEN_KEEPALIVE cryptid_interop_setup(int securityLevel);

int EMSCRIPTEN_KEEPALIVE cryptid_interop_isSetupSuccess(SetupResult* result);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getMasterSecret(SetupResult* result);

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroySetupResult(SetupResult* result);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersFieldOrder(SetupResult* result);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersQ(SetupResult* result);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersPointPX(SetupResult* result);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersPointPY(SetupResult* result);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersPointPpublicX(SetupResult* result);

char* EMSCRIPTEN_KEEPALIVE cryptid_interop_getPublicParametersPointPpublicY(SetupResult* result);

#endif
