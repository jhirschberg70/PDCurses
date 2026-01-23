/* PDCurses */

#include "pdcemscripten.h"

PDC_EMSCRIPTEN_COLOR pdc_color[PDC_EMSCRIPTEN_MAXCOL];

static void _initialize_colors(void)
{
    int i, r, g, b;

    for (i = 0; i < 8; i++)
    {
        pdc_color[i].r = (i & COLOR_RED) ? 0x80 + ((i == 7) ? 0x40 : 0) : 0;
        pdc_color[i].g = (i & COLOR_GREEN) ? 0x80 + ((i == 7) ? 0x40 : 0) : 0;
        pdc_color[i].b = (i & COLOR_BLUE) ? 0x80 + ((i == 7) ? 0x40 : 0) : 0;

        pdc_color[i + 8].r = (i & COLOR_RED) ? 0xff - ((i == 0) ? 0x80 : 0) : 0;
        pdc_color[i + 8].g = (i & COLOR_GREEN) ? 0xff - ((i == 0) ? 0x80 : 0) : 0;
        pdc_color[i + 8].b = (i & COLOR_BLUE) ? 0xff - ((i == 0) ? 0x80 : 0) : 0;
    }

    /* 256-color xterm extended palette: 216 colors in a 6x6x6 color
       cube, plus 24 shades of gray */

    for (i = 16, r = 0; r < 6; r++)
        for (g = 0; g < 6; g++)
            for (b = 0; b < 6; b++, i++)
            {
                pdc_color[i].r = (r ? r * 40 + 55 : 0);
                pdc_color[i].g = (g ? g * 40 + 55 : 0);
                pdc_color[i].b = (b ? b * 40 + 55 : 0);
            }

    for (i = 232; i < 256; i++)
        pdc_color[i].r = pdc_color[i].g = pdc_color[i].b = (i - 232) * 10 + 8;

    for (i = 0; i < 256; i++)
        EM_ASM(PDCurses.mapColor($0, $1, $2, $3), i, pdc_color[i].r, pdc_color[i].g, pdc_color[i].b);
}

bool PDC_can_change_color(void)
{
    PDC_LOG(("PDC_can_change_color() - called\n"));
    return TRUE;
}

int PDC_color_content(short color, short *red, short *green, short *blue)
{
    PDC_LOG(("PDC_color_content() - called\n"));

    *red = DIVROUND(pdc_color[color].r * 1000, 255);
    *green = DIVROUND(pdc_color[color].g * 1000, 255);
    *blue = DIVROUND(pdc_color[color].b * 1000, 255);

    return OK;
}

int PDC_init_color(short color, short red, short green, short blue)
{
    PDC_LOG(("PDC_init_color() - called\n"));

    pdc_color[color].r = DIVROUND(red * 255, 1000);
    pdc_color[color].g = DIVROUND(green * 255, 1000);
    pdc_color[color].b = DIVROUND(blue * 255, 1000);

    EM_ASM(PDCurses.mapColor($0, $1, $2, $3), color, pdc_color[color].r, pdc_color[color].g, pdc_color[color].b);

    return OK;
}

void PDC_reset_prog_mode(void)
{
    PDC_LOG(("PDC_reset_prog_mode() - called.\n"));
}

void PDC_reset_shell_mode(void)
{
    PDC_LOG(("PDC_reset_shell_mode() - called.\n"));
}

int PDC_resize_screen(int nlines, int ncols)
{
    PDC_LOG(("PDC_resize_screen() - called. Lines: %d Cols: %d\n",
             nlines, ncols));
    return OK;
}

void PDC_restore_screen_mode(int i)
{
    PDC_LOG(("PDC_restore_screen_mode() - called\n"));
}

void PDC_save_screen_mode(int i)
{
    PDC_LOG(("PDC_save_screen_mode() - called\n"));
}

void PDC_scr_close(void)
{
    PDC_LOG(("PDC_scr_close() - called\n"));

    EM_ASM(PDCurses.PDC_scr_close());
}

void PDC_scr_free(void)
{
    PDC_LOG(("PDC_scr_free() - called\n"));
}

int PDC_scr_open(void)
{
    PDC_LOG(("PDC_scr_open() - called\n"));

    SP->orig_attr = FALSE;
    SP->mouse_wait = PDC_CLICK_PERIOD;
    SP->audible = TRUE;
    SP->mono = FALSE;
    SP->termattrs = A_COLOR | A_ITALIC | A_UNDERLINE | A_LEFT | A_RIGHT | 
                    A_REVERSE;

    _initialize_colors();
    
    return EM_ASM_INT(return PDCurses.PDC_scr_open());
}

void _sigwinch_handler(void)
{
    PDC_LOG(("_sigwinch_handler() - called\n"));
    printf("resizing");
    clearok(curscr, TRUE);
}
