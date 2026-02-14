/* PDCurses */

#include "pdcemscripten.h"

EM_ASYNC_JS(int, _check_key, (int timeout), {
    return await PDCurses.PDC_check_key(timeout);
});

bool PDC_check_key(int timeout)
{
    PDC_LOG(("PDC_check_key() - called\n"));

    return _check_key(timeout);
}

void PDC_flushinp(void)
{
    PDC_LOG(("PDC_flushinp() - called\n"));

    EM_ASM(PDCurses.PDC_flushinp());
}

int PDC_get_key(void)
{
    PDC_LOG(("PDC_get_key() - called\n"));

    int key = EM_ASM_INT(return PDCurses.PDC_get_key());
  
    SP->key_code = key > KEY_CODE_YES;
  
    return key;
}

bool PDC_has_mouse(void)
{
    PDC_LOG(("PDC_has_mouse() - called\n"));

    return FALSE;
}

int PDC_modifiers_set(void)
{
    PDC_LOG(("PDC_modifiers_set() - called\n"));

    return ERR;
}

int PDC_mouse_set(void)
{
    PDC_LOG(("PDC_mouse_set() - called\n"));

    return ERR;
}

void PDC_set_keyboard_binary(bool on)
{
    PDC_LOG(("PDC_set_keyboard_binary() - called\n"));
}
