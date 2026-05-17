/* PDCurses */

#include "pdcemscripten.h"
#include <stdlib.h>

EM_ASYNC_JS(int, _js_setclipboard, (const char *text), {
  const str = UTF8ToString(text);
  return await PDCurses.PDC_setclipboard_async(str);
});

EM_ASYNC_JS(int, _js_getclipboard, (int out_ptr, int out_len), {
  const text = await PDCurses.PDC_getclipboard_async();
  if (!text || text.length == 0) {
    HEAP32[out_ptr >> 2] = 0;
    HEAP32[out_len >> 2] = 0;
    return 2; /* PDC_CLIP_EMPTY */
  }
  const byteLen = lengthBytesUTF8(text);
  const ptr = _malloc(byteLen + 1);
  stringToUTF8(text, ptr, byteLen + 1);
  HEAP32[out_ptr >> 2] = ptr;
  HEAP32[out_len >> 2] = byteLen;
  return 0; /* PDC_CLIP_SUCCESS */
});

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

  return _js_getclipboard((int)contents, (int)length);
}

int PDC_setclipboard(const char *contents, long length) {
  PDC_LOG(("PDC_setclipboard() - called\n"));

  if (!contents)
    return PDC_CLIP_ACCESS_ERROR;

  return _js_setclipboard(contents);
}

int PDC_freeclipboard(char *contents) {
  PDC_LOG(("PDC_freeclipboard() - called\n"));

  free(contents);
  return PDC_CLIP_SUCCESS;
}

int PDC_clearclipboard(void) {
  PDC_LOG(("PDC_clearclipboard() - called\n"));

  EM_ASM(PDCurses.PDC_clearclipboard());
  return PDC_CLIP_SUCCESS;
}
