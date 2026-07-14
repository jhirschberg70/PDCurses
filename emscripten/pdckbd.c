/* PDCurses */

#include "pdcemscripten.h"

#include <emscripten/threading.h>
#include <stdatomic.h>

static _Atomic uint32_t keyReady = 0;

void PDC_kbd_init(void)
{
  MAIN_THREAD_EM_ASM(PDCurses.set_key_notify(HEAP32, $0),
                     (uintptr_t)&keyReady);
}

bool PDC_check_key(int timeout)
{
  PDC_LOG(("PDC_check_key() - called\n"));

  if (keyReady) return TRUE;

  if (timeout == 0)
    return FALSE;

  emscripten_atomic_wait_u32((void *)&keyReady, 0,
                             timeout < 0 ? -1.0 : (double)timeout);

  return keyReady;
}

void PDC_flushinp(void)
{
  PDC_LOG(("PDC_flushinp() - called\n"));

  MAIN_THREAD_EM_ASM(PDCurses.PDC_flushinp());
}

int PDC_get_key(void)
{
  PDC_LOG(("PDC_get_key() - called\n"));

  int key = MAIN_THREAD_EM_ASM_INT(return PDCurses.PDC_get_key());

  SP->key_code = key > KEY_CODE_YES;

  PDC_modifiers_set();

  if (SP->key_code && key == KEY_MOUSE)
  {
    // _js_fetch_mouse_event((int)&SP->mouse_status);
    MAIN_THREAD_EM_ASM({
      const evt = PDCurses.dequeue_mouse_event();
      if (!evt)
        return;
      HEAP32[$0 >> 2] = evt.x;
      HEAP32[($0 + 4) >> 2] = evt.y;
      HEAP16[($0 + 8) >> 1] = evt.button0;
      HEAP16[($0 + 10) >> 1] = evt.button1;
      HEAP16[($0 + 12) >> 1] = evt.button2;
      HEAP32[($0 + 16) >> 2] = evt.changes; }, (int)&SP->mouse_status);
  }

  return key;
}

bool PDC_has_mouse(void)
{
  PDC_LOG(("PDC_has_mouse() - called\n"));

  return TRUE;
}

int PDC_modifiers_set(void)
{
  PDC_LOG(("PDC_modifiers_set() - called\n"));

  if (!SP)
    return ERR;

  SP->key_modifiers =
      (unsigned long)MAIN_THREAD_EM_ASM_INT(return PDCurses.PDC_get_modifiers());

  return OK;
}

int PDC_mouse_set(void)
{
  PDC_LOG(("PDC_mouse_set() - called\n"));

  if (!SP)
    return ERR;

  MAIN_THREAD_EM_ASM(PDCurses.PDC_mouse_set($0, $1), SP->_trap_mbe ? 1 : 0, SP->mouse_wait);

  return OK;
}

void PDC_set_keyboard_binary(bool on)
{
  PDC_LOG(("PDC_set_keyboard_binary() - called\n"));
}
