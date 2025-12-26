/* PDCurses */

#include "pdcemscripten.h"

void PDC_beep(void)
{
    PDC_LOG(("PDC_beep() - called\n"));
    EM_ASM({ PDCurses.PDC_beep(); },);
}

void PDC_napms(int ms)
{
    PDC_LOG(("PDC_napms() - called: ms=%d\n", ms));
    emscripten_sleep(ms);
}

const char *PDC_sysname(void)
{
    PDC_LOG(("PDC_sysname() - called\n"));
    return "emscripten";
}
