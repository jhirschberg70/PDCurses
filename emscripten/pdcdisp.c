/* PDCurses */

#include "pdcemscripten.h"
#include "common/acsuni.h"

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

    static PDC_EMSCRIPTEN_CELL *line_buffer = NULL;
    static int line_buffer_size = 0;

    if (!line_buffer)
    {
        line_buffer = malloc(len * sizeof(PDC_EMSCRIPTEN_CELL));
        line_buffer_size = len;
    }
    else if (line_buffer_size < len)
    {
        line_buffer = realloc(line_buffer, len * sizeof(PDC_EMSCRIPTEN_CELL));
        line_buffer_size = len;
    }

    attr_t sysattrs = SP->termattrs;

    for (int i = 0; i < len; ++i)
    {
        bool blink = FALSE;
        bool bold = FALSE;
        bool italic = FALSE;
        bool underline = FALSE;

        chtype codePoint = srcp[i] & A_CHARTEXT;

        short background = COLOR_BLACK;
        short color = COLOR_WHITE;

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

        line_buffer[i].code_point = codePoint;
        line_buffer[i].color = color;
        line_buffer[i].background = background;
        line_buffer[i].attrs = (blink ? 1 : 0) | (bold ? 2 : 0) | (italic ? 4 : 0) | (underline ? 8 : 0);
    }

    EM_ASM({ PDCurses.PDC_transform_line(HEAPU32, $0 >>> 2, $1, $2, $3); }, line_buffer, lineno, x, len);
}

int PDC_wcwidth(wchar_t ch)
{
    return EM_ASM_INT(return PDCurses.PDC_wcwidth($0), ch);
}
