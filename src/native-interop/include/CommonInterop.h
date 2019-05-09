#ifndef __CRYPTID_COMMON_INTEROP_H
#define __CRYPTID_COMMON_INTEROP_H

#define CONVERSION_BASE 10

#if defined(__EMSCRIPTEN__)
#   include <emscripten.h>
#else
#   define EMSCRIPTEN_KEEPALIVE
#endif

#endif
