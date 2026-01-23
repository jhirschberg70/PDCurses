/* PDCurses */

#include "pdcemscripten.h"

int PDC_curs_set(int visibility)
{
    int ret_vis;

    PDC_LOG(("PDC_curs_set() - called: visibility=%d\n", visibility));

    ret_vis = SP->visibility;

    SP->visibility = visibility;

    EM_ASM(PDCurses.PDC_curs_set($0), visibility);

    return ret_vis;
}

int PDC_set_blink(bool blinkon)
{
    PDC_LOG(("PDC_set_blink() - called\n"));

    if (!SP)
        return ERR;

    if (SP->color_started)
        COLORS = PDC_EMSCRIPTEN_MAXCOL;


    if (blinkon)
    {
        if (!(SP->termattrs & A_BLINK))
        {
            SP->termattrs |= A_BLINK;
        }
    }
    else
        SP->termattrs &= ~A_BLINK;

    return OK;
}

int PDC_set_bold(bool boldon)
{
    PDC_LOG(("PDC_set_bold() - called\n"));

    if (!SP)
        return ERR;

    if (SP->color_started)
        COLORS = PDC_EMSCRIPTEN_MAXCOL;


    if (boldon)
    {
        if (!(SP->termattrs & A_BOLD))
        {
            SP->termattrs |= A_BOLD;
        }
    }
    else
        SP->termattrs &= ~A_BOLD;

    return OK;
}