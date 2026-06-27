/* PDCurses */

#ifndef PDCEMSCRIPTEN_H
#define PDCEMSCRIPTEN_H

#include <curspriv.h>
#include <emscripten.h>
#include <stdint.h>

#define PDC_EMSCRIPTEN_MAXCOL 256

typedef struct
{
  short r;
  short g;
  short b;
} PDC_EMSCRIPTEN_COLOR;

typedef struct
{
  uint32_t code_point;
  uint32_t color;
  uint32_t background;
  uint32_t attrs;
} PDC_EMSCRIPTEN_CELL;

extern PDC_EMSCRIPTEN_COLOR pdc_color[PDC_EMSCRIPTEN_MAXCOL];

void PDC_kbd_init(void);

#endif
