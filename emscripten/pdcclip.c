/* PDCurses */

#include "pdcemscripten.h"
#include <emscripten/threading.h>
#include <stdatomic.h>
#include <stdlib.h>

static _Atomic uint32_t clipboard_mutex = 0;

/*man-start**************************************************************

  Name:                                                         clipboard

  Synopsis:
        int PDC_getclipboard(char **contents, long *length);
        int PDC_setclipboard(const char *contents, long length);
        int PDC_freeclipboard(char *contents);
        int PDC_clearclipboard(void);

  Description:
        PDC_getclipboard() gets the textual contents of the system's
        clipboard. This function returns the contents of the clipboard
        in the contents argument. It is the responsibilitiy of the
        caller to free the memory returned, via PDC_freeclipboard().
        The length of the clipboard contents is returned in the length
        argument.

        PDC_setclipboard copies the supplied text into the system's
        clipboard, emptying the clipboard prior to the copy.

        PDC_clearclipboard() clears the internal clipboard.

  Return Values:
        indicator of success/failure of call.
        PDC_CLIP_SUCCESS        the call was successful
        PDC_CLIP_MEMORY_ERROR   unable to allocate sufficient memory for
                                the clipboard contents
        PDC_CLIP_EMPTY          the clipboard contains no text
        PDC_CLIP_ACCESS_ERROR   no clipboard support

  Portability                                X/Open    BSD    SYS V
        PDC_getclipboard                        -       -       -
        PDC_setclipboard                        -       -       -
        PDC_freeclipboard                       -       -       -
        PDC_clearclipboard                      -       -       -

**man-end****************************************************************/

int PDC_getclipboard(char **contents, long *length) {
  PDC_LOG(("PDC_getclipboard() - called\n"));

  if (!contents || !length)
    return PDC_CLIP_ACCESS_ERROR;

  clipboard_mutex = 0;
  MAIN_THREAD_EM_ASM(PDCurses.PDC_getclipboard_async(HEAP32, $0), &clipboard_mutex);

  emscripten_atomic_wait_u32(&clipboard_mutex, 0, -1.0);
  return MAIN_THREAD_EM_ASM_INT({
    const text = PDCurses.PDC_getclipboard();
    console.log(text);
    if (!text || text.length == 0) {
      HEAP32[$0 >> 2] = 0;
      HEAP32[$1 >> 2] = 0;
      return 2; // PDC_CLIP_EMPTY
    }
    const byteLen = lengthBytesUTF8(text);
    const ptr = _malloc(byteLen + 1);
    stringToUTF8(text, ptr, byteLen + 1);
    HEAP32[$0 >> 2] = ptr;
    HEAP32[$1 >> 2] = byteLen;
    return 0; // PDC_CLIP_SUCCESS
  }, contents, length);
}


int PDC_setclipboard(const char *contents, long length) {
  PDC_LOG(("PDC_setclipboard() - called\n"));

  if (!contents)
    return PDC_CLIP_ACCESS_ERROR;
  
  clipboard_mutex = 0;
  MAIN_THREAD_EM_ASM(PDCurses.PDC_setclipboard_async(UTF8ToString($0), HEAP32, $1), contents, &clipboard_mutex);
  emscripten_atomic_wait_u32(&clipboard_mutex, 0, -1.0);
  return PDC_CLIP_SUCCESS;
}

int PDC_freeclipboard(char *contents) {
  PDC_LOG(("PDC_freeclipboard() - called\n"));

  free(contents);
  return PDC_CLIP_SUCCESS;
}

int PDC_clearclipboard(void) {
  PDC_LOG(("PDC_clearclipboard() - called\n"));

  MAIN_THREAD_EM_ASM(PDCurses.PDC_clearclipboard());
  return PDC_CLIP_SUCCESS;
}
