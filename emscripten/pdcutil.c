/* PDCurses */

#include "pdcemscripten.h"
#include <unistd.h>

void PDC_beep(void)
{
    PDC_LOG(("PDC_beep() - called\n"));
    MAIN_THREAD_EM_ASM(PDCurses.PDC_beep());
}

void PDC_napms(int ms)
{
    PDC_LOG(("PDC_napms() - called: ms=%d\n", ms));
    usleep((useconds_t)ms * 1000U);
}

const char *PDC_sysname(void)
{
    PDC_LOG(("PDC_sysname() - called\n"));
    return "emscripten";
}
