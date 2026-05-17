/*
 * test_mouse.c -- mouse event viewer for PDCurses Emscripten port
 *
 * Based on ncurses test_mouse.c by Leonid S. Usov
 * Copyright 2022-2024,2025 Thomas E. Dickey
 * Copyright 2022 Leonid S. Usov <leonid.s.usov at gmail.com>
 * MIT License - see ncurses source for full copyright notice.
 *
 * Adapted for PDCurses (Emscripten) by the PDCurses project:
 *   - Removed raw/terminal mode (not applicable to the browser)
 *   - Removed command-line parsing (TERM, -r, -T not applicable)
 *   - Uses mouse_set() instead of mousemask() to include drag/move events
 *     (mousemask() explicitly filters out BUTTON_MOVED)
 *   - Decodes events via PDCurses-specific BUTTON_STATUS/BUTTON_CHANGED macros
 *     for full fidelity (drag, horizontal wheel, per-button modifiers)
 *   - Reports ncurses-compatible bstate from MEVENT alongside PDCurses detail
 *   - Handles KEY_RESIZE
 *
 * Press 'q' or Ctrl-C to quit.
 */

/* Map getmouse() to nc_getmouse() for ncurses compatibility */
#define PDC_NCMOUSE

#include <stdarg.h>
#include <curses.h>

static int logoffset = 0;

/*
 * logw() -- append a line to the scrolling event log on stdscr.
 * The log region occupies rows [logoffset, LINES) and scrolls by advancing
 * the cursor row mod (LINES - logoffset), matching ncurses test_mouse.c.
 */
static void logw(const char *fmt, ...)
#ifdef __GNUC__
    __attribute__((format(printf, 1, 2)))
#endif
    ;

static void logw(const char *fmt, ...)
{
    int row = getcury(stdscr);
    va_list args;

    va_start(args, fmt);
    wmove(stdscr, row++, 0);
    vw_printw(stdscr, fmt, args);
    va_end(args);

    clrtoeol();

    row %= (getmaxy(stdscr) - logoffset);
    if (row < logoffset)
        row = logoffset;

    wmove(stdscr, row, 0);
    wprintw(stdscr, ">");
    clrtoeol();
}

static void show_header(void)
{
    move(0, 0);
    logw("PDCurses mouse test -- click, double-click, drag, and scroll");
    logw("Double-click interval: %d ms   Press 'q' or Ctrl-C to quit", mouseinterval(-1));
    logw("-------------------------------------------------------------");
    logoffset = getcury(stdscr);
}

int main(void)
{
    MEVENT event;

    initscr();
    noecho();
    cbreak();
    nonl();
    keypad(stdscr, TRUE);

    /*
     * Set double-click interval to 200 ms.  Must be called after initscr()
     * and before mouse_set() so PDC_mouse_set() picks up the new value.
     */
    mouseinterval(200);

    /*
     * Use mouse_set() directly rather than mousemask() so that drag/move
     * events (BUTTON_MOVED) are not filtered out.  mousemask() strips those
     * bits from the mask before storing it in SP->_trap_mbe.
     */
    mouse_set(ALL_MOUSE_EVENTS);

    show_header();
    refresh();

    for (;;)
    {
        int c = getch();

        switch (c)
        {
        case KEY_MOUSE:
            /*
             * getmouse() (= nc_getmouse() via PDC_NCMOUSE) populates both
             * the ncurses-compatible MEVENT and the PDCurses Mouse_status
             * global (via request_mouse_pos() called internally).
             * We use both: MEVENT for bstate/coordinates, Mouse_status
             * macros for full PDCurses-specific detail.
             */
            if (getmouse(&event) == OK)
            {
                int btn;
                bool any = FALSE;

                /* Buttons 1-3: left, middle, right */
                for (btn = 1; btn <= 3; btn++)
                {
                    short bst;
                    const char *action;

                    if (!BUTTON_CHANGED(btn))
                        continue;

                    bst = BUTTON_STATUS(btn);

                    switch (bst & BUTTON_ACTION_MASK)
                    {
                    case BUTTON_RELEASED:
                        action = "released";
                        break;
                    case BUTTON_PRESSED:
                        action = "pressed";
                        break;
                    case BUTTON_CLICKED:
                        action = "clicked";
                        break;
                    case BUTTON_DOUBLE_CLICKED:
                        action = "double-clicked";
                        break;
                    case BUTTON_TRIPLE_CLICKED:
                        action = "triple-clicked";
                        break;
                    case BUTTON_MOVED:
                        action = "dragged";
                        break;
                    default:
                        action = "?";
                        break;
                    }

                    logw("[%08lX] button%d %s%s%s%s @ %d, %d",
                         (unsigned long)event.bstate,
                         btn,
                         action,
                         (bst & PDC_BUTTON_SHIFT) ? " +shift" : "",
                         (bst & PDC_BUTTON_CONTROL) ? " +ctrl" : "",
                         (bst & PDC_BUTTON_ALT) ? " +alt" : "",
                         event.y, event.x);
                    any = TRUE;
                }

                /* Vertical scroll wheel (ncurses: BUTTON4/5_PRESSED) */
                if (MOUSE_WHEEL_UP)
                {
                    logw("[%08lX] wheel up @ %d, %d",
                         (unsigned long)event.bstate, event.y, event.x);
                    any = TRUE;
                }
                else if (MOUSE_WHEEL_DOWN)
                {
                    logw("[%08lX] wheel down @ %d, %d",
                         (unsigned long)event.bstate, event.y, event.x);
                    any = TRUE;
                }

                /* Horizontal scroll wheel (PDCurses-specific; not in bstate) */
                if (MOUSE_WHEEL_LEFT)
                {
                    logw("[%08lX] wheel left @ %d, %d",
                         (unsigned long)event.bstate, event.y, event.x);
                    any = TRUE;
                }
                else if (MOUSE_WHEEL_RIGHT)
                {
                    logw("[%08lX] wheel right @ %d, %d",
                         (unsigned long)event.bstate, event.y, event.x);
                    any = TRUE;
                }

                if (!any)
                {
                    logw("[%08lX] (unrecognised) @ %d, %d",
                         (unsigned long)event.bstate, event.y, event.x);
                }
            }
            break;

        case 'q':
        case '\003': /* Ctrl-C */
            goto done;

        case KEY_RESIZE:
            logoffset = 0;
            clear();
            show_header();
            break;

        default:
            logw("key: 0x%x", c);
            break;
        }

        refresh();
    }

done:
    endwin();
    return 0;
}
