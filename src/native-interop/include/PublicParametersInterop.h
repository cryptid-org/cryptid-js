#ifndef __CRYPTID_PUBLIC_PARAMETERS_INTEROP_H
#define __CRYPTID_PUBLIC_PARAMETERS_INTEROP_H

#include "CommonInterop.h"


typedef struct PublicParameters PublicParameters;

PublicParameters* EMSCRIPTEN_KEEPALIVE cryptid_interop_allocatePublicParameters(
    char* fieldOrder,
    char* subgroupOrder,
    char* pointPx,
    char* pointPy,
    char* pointPpublicx,
    char* pointPpublicy,
    int securityLevel
);

void EMSCRIPTEN_KEEPALIVE cryptid_interop_destroyPublicParameters(PublicParameters* params);

#endif
