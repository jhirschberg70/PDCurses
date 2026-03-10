/* PDCurses rendering stress test
 *
 * Fills every cell with a random foreground/background color pair and a
 * random printable BMP Unicode character, then calls refresh().  Runs for
 * PASSES iterations (or until a key is pressed) and reports elapsed time.
 *
 * Build with PDC_WIDE / WIDE=Y so the full Unicode BMP range is available.
 *
 * Key-break uses a JS keydown listener rather than getch() so that ASYNCIFY
 * stack save/restore is not triggered on every iteration of the hot loop.
 */

#include <curses.h>
#include <emscripten.h>
#include <stdlib.h>
#include <time.h>

#define PASSES 500
#define NC     15   /* number of colors to cycle through */

/* Return a random printable ASCII code point. */
static chtype rand_ascii_char(void)
{
    return (chtype)(unsigned int)(rand() % (0x7F - 0x0021)) + 0x0021;
}

int main(int argc, char **argv)
{
    int row, col, pass, ncolors;
    clock_t t_start, t_end, t_ref_start;
    double elapsed_total, elapsed_refresh;

    srand((unsigned int)time(NULL));

    initscr();
    start_color();
    noecho();
    curs_set(0);
    nodelay(stdscr, TRUE);

    ncolors = (COLORS >= NC) ? NC : COLORS;

    /* Pre-initialise every fg/bg combination as a numbered pair.
     * Pair index = fg * ncolors + bg, shifted by 1 (pair 0 is reserved). */
    {
        int fg, bg;
        for (fg = 0; fg < ncolors; fg++)
            for (bg = 0; bg < ncolors; bg++)
                init_pair((short)(fg * ncolors + bg + 1),
                          (short)fg, (short)bg);
    }

    t_start = clock();
    elapsed_refresh = 0.0;

    for (pass = 0; pass < PASSES; pass++)
    {
        if (getch() != ERR)
            break;

        for (row = 0; row < LINES; row++)
        {
            for (col = 0; col < COLS; col++)
            {
                /* Background: pick from colors 1..ncolors-1 (never COLOR_BLACK). */
                // int bg = rand() % (ncolors - 1) + 1;
                // int fg;
                /* Ensure foreground is always distinct from background. */
                // do { fg = rand() % ncolors; } while (fg == bg);

                // mvaddch(row, col,
                //         rand_bmp_char() |
                //         COLOR_PAIR(fg * ncolors + bg + 1));
                mvaddch(row, col,
                        rand_ascii_char() |
                        COLOR_PAIR(rand() % ncolors));
            }
        }

        t_ref_start = clock();
        refresh();
        elapsed_refresh += (double)(clock() - t_ref_start) / CLOCKS_PER_SEC;
    }

    t_end = clock();
    elapsed_total = (double)(t_end - t_start) / CLOCKS_PER_SEC;

    nodelay(stdscr, FALSE);
    curs_set(1);
    clear();

    mvprintw(LINES / 2 - 2, (COLS - 40) / 2,
             "Stress test complete: %d / %d passes", pass, PASSES);
    if (elapsed_total > 0.0)
        mvprintw(LINES / 2 - 1, (COLS - 40) / 2,
                 "Total:   %.2f s  (%.1f passes/sec)",
                 elapsed_total, (double)pass / elapsed_total);
    if (elapsed_refresh > 0.0)
        mvprintw(LINES / 2, (COLS - 40) / 2,
                 "Refresh: %.2f s  (%.1f refreshes/sec)",
                 elapsed_refresh, (double)pass / elapsed_refresh);
    mvprintw(LINES / 2 + 1, (COLS - 24) / 2, "Press any key to exit");
    refresh();

    /* Single getch() at the end — ASYNCIFY overhead is acceptable here. */
    nodelay(stdscr, FALSE);
    getch();

    endwin();
    return 0;
}
