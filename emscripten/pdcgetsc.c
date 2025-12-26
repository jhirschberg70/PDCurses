/* PDCurses */

#include "pdcemscripten.h"

/* return width of screen/viewport */

int PDC_get_columns(void) {
  PDC_LOG(("PDC_get_columns() - called\n"));

  int cols = EM_ASM_INT(return PDCurses.PDC_get_columns());

  PDC_LOG(("PDC_get_columns() - returned: cols %d\n", cols));

  return cols;
}

/* get the cursor size/shape */

int PDC_get_cursor_mode(void)
{
    PDC_LOG(("PDC_get_cursor_mode() - called\n"));

    return 0;
}

/* return number of screen rows */

int PDC_get_rows(void) {
  PDC_LOG(("PDC_get_rows() - called\n"));

  int rows = EM_ASM_INT(return PDCurses.PDC_get_rows());

  PDC_LOG(("PDC_get_rows() - returned: rows %d\n", rows));

  return rows;
}
