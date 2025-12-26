/* PDCurses */

#ifndef PDCEMSCRIPTEN_H
#define PDCEMSCRIPTEN_H

#include <curspriv.h>
#include <emscripten.h>

typedef struct 
{
  short r;
  short g;
  short b;
} PDC_EMSCRIPTEN_COLOR;

extern PDC_EMSCRIPTEN_COLOR pdc_color[PDC_MAXCOL];

#endif
