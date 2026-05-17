/* PDCurses */

#include "pdcemscripten.h"

EM_ASYNC_JS(int, _js_check_key, (int timeout),
            { return await PDCurses.PDC_check_key(timeout); });

EM_JS(void, _js_fetch_mouse_event, (int ptr), {
  const evt = PDCurses.dequeue_mouse_event();
  if (!evt)
    return;
  HEAP32[ptr >> 2] = evt.x;
  HEAP32[(ptr + 4) >> 2] = evt.y;
  HEAP16[(ptr + 8) >> 1] = evt.button0;
  HEAP16[(ptr + 10) >> 1] = evt.button1;
  HEAP16[(ptr + 12) >> 1] = evt.button2;
  HEAP32[(ptr + 16) >> 2] = evt.changes;
});

bool PDC_check_key(int timeout) {
  PDC_LOG(("PDC_check_key() - called\n"));

  return _js_check_key(timeout);
}

void PDC_flushinp(void) {
  PDC_LOG(("PDC_flushinp() - called\n"));

  EM_ASM(PDCurses.PDC_flushinp());
}

int PDC_get_key(void) {
  PDC_LOG(("PDC_get_key() - called\n"));

  int key = EM_ASM_INT(return PDCurses.PDC_get_key());

  SP->key_code = key > KEY_CODE_YES;

  PDC_modifiers_set();

  if (SP->key_code && key == KEY_MOUSE)
    _js_fetch_mouse_event((int)&SP->mouse_status);

  return key;
}

bool PDC_has_mouse(void) {
  PDC_LOG(("PDC_has_mouse() - called\n"));

  return TRUE;
}

int PDC_modifiers_set(void) {
  PDC_LOG(("PDC_modifiers_set() - called\n"));

  if (!SP)
    return ERR;

  SP->key_modifiers =
      (unsigned long)EM_ASM_INT(return PDCurses.PDC_get_modifiers());

  return OK;
}

int PDC_mouse_set(void) {
  PDC_LOG(("PDC_mouse_set() - called\n"));

  if (!SP)
    return ERR;

  EM_ASM(PDCurses.PDC_mouse_set($0, $1), SP->_trap_mbe ? 1 : 0, SP->mouse_wait);

  return OK;
}

void PDC_set_keyboard_binary(bool on) {
  PDC_LOG(("PDC_set_keyboard_binary() - called\n"));
}
