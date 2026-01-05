/* PDCurses */

#include "pdcemscripten.h"
#include "../common/acsuni.h"

void PDC_doupdate(void)
{
    PDC_LOG(("PDC_doupdate() - called"));
}


/* draw a cursor at (y, x) */

void PDC_gotoyx(int row, int col)
{
    PDC_LOG(("PDC_gotoyx() - called: row %d col %d from row %d col %d\n",
             row, col, SP->cursrow, SP->curscol));

    EM_ASM(PDCurses.PDC_gotoyx($0, $1), row, col);
}

/* update the given physical line to look like the corresponding line in
   curscr */

void PDC_transform_line(int lineno, int x, int len, const chtype *srcp)
{
    PDC_LOG(("PDC_transform_line() - called: lineno=%d\n", lineno));

    attr_t sysattrs = SP->termattrs;

    chtype codePoint = 0;
    
    short background = COLOR_BLACK;
    short color = COLOR_WHITE;

    bool blink = FALSE;
    bool bold = FALSE;
    bool italic = FALSE;
    bool underline = FALSE;

    for (int i = 0; i < len; ++i) {
        codePoint = srcp[i] & A_CHARTEXT;

        if (srcp[i] & A_ALTCHARSET && !(srcp[i] & 0xff80))
            codePoint = acs_map[codePoint & 0x7f];
        
        pair_content(PAIR_NUMBER(srcp[i]), &color, &background);

        if ((srcp[i] & A_BLINK) && !(sysattrs & A_BLINK))
            background |= 8;

        if ((srcp[i] & A_BLINK) && (sysattrs & A_BLINK))
            blink = TRUE;
        
        if ((srcp[i] & A_BOLD) && !(sysattrs & A_BOLD))
            color |= 8;

        if ((srcp[i] & A_BOLD) && (sysattrs & A_BOLD))
            bold = TRUE;

        if ((srcp[i] & A_ITALIC) && (sysattrs & A_ITALIC))
            italic = TRUE;
        
        if ((srcp[i] & A_REVERSE) && (sysattrs & A_REVERSE))
        {
            short temp = color;

            color = background;
            background = temp;
        }

        if ((srcp[i] & A_UNDERLINE) && (sysattrs & A_UNDERLINE))
            underline = TRUE;

        EM_ASM(PDCurses.setCell($0, $1, $2, $3, $4, $5, $6, $7, $8), lineno, x + i, codePoint, color, background, blink, bold, underline, italic);
    }
}
