### TODO
- [ ] Add wide character support
- [ ] Add mouse support
- [ ] Add clipboard support
- [ ] Test `raw()` and `noraw()` behavior
- [ ] Create headless testbench
- [x] Determine cause of Uncaught SyntaxError: Identifier 'ExitStatus' has already been declared
- [ ] Create demo page with previews
- [ ] Support running multiple demos without reloading demo page
- [ ] Understand resize test in testcurs.c
- [ ] Look at timing differences in xmas.c and ozdemo.c vs SDL
- [ ] Update emscripten/README
- [ ] Fix cursor issues seen in testcurs when opening and then closing developer tools
- [ ] Examine accessibility of using `<dialog>` for the curses screen


### 2025-12-15

I've gotten basic functionality working, though there's much left to do. I'm going to create a to-do list for the features that I still need to implement. One specific note I want to make is that I really wanted to use `auto-fill` to create the cells for `screenElement`. I was thinking that on resize, it would allow me to update `LINES` and `COLS` just by counting the `gridTemplateRows` and `gridTemplateColumns` for `screenElement`. Unfortunately, when you shrink the viewport `gridTemplateRows` and `gridTemplateColumns` remain the same because there are `div`s in the cells. I need to remove the `div`s to get `auto-fill` to automatically adjust `gridTemplateRows` and `gridTemplateColumns`. That becomes a catch-22, because if you shrink the window size, you need to remove the `div`s, but you can't tell how many to remove because `gridTemplateRows` and `gridTemplatesColumns` retain their old values until the `div`s are removed.


### 2025-12-26

I believe I have basic functionality complete. I need to conduct more testing, but it's time to get a baseline checked in.

Added support for increasing `font-weight` when A_BOLD is set for a chtype and SP->termattrs.

Wide character support appears to work if compiling with PDC_WIDE defined. I need to complete more testing.


### 2025-12-28

Wide characters that are actually greater than 1ch in width are truncated. If I change the width of `.cell` to be `max-content`, the full character is displayed. There are issues with the cursor, however, which need to be resolved. Additionally, if I open developer tools running testcurs (which causes a resize) and then close the developer tools, the cursor changes from a block to an underline. I'm not sure how this is even possible, as both the normal and high-visibiltiy cursors are block. I'll have to investigate.


### 2026-01-07

I've determined the cause of `Uncaught SyntaxError: Identifier 'ExitStatus' has already been declared`. It turns out that focus was remaining on the `button` used to launch a particular program. Because the `click` handler for the button isn't disabled, pressing `Enter` or `Spacebar` when in the curses program also fired the `click` event for the `button` again. This resulted in  multiple copies of the JavaScript for the program being appended to `<head>`, which led to the errors. By calling `showModal()` for the `<dialog>` used for the curses screen, I can trap focus within the `<dialog>`, preventing this from happening. I also had to add a check to see if the `Escape` key is pressed in `keydownHandler()` in order to prevent the default action, which would be to close the `dialog`. Ultimately, I'm not sure if I want to continue using `<dialog>` for the screen. I'm worried about accessibility with what I've done. That's something to explore more in the future.

I have implemented wide character support, and cursory testing shows that it is behaving the same as ncurses. Though wide characters would display before, there were cases where it wasn't working properly, namely when a double-width character overlaps another character. In this case, the two characters should be superimposed where they overlap. My previous implementation would show just half of the double-width character, with the second character being the only thing visible in the overlap. In order to make this work, I had to create separate foreground and background `<div>`s for each cell. Previously, I just had a single `<div>` for each cell and set foreground and background accordingly, but this caused issues when using background colors with the characters. With separate `<div>`s, I can make sure that backgrounds always stay beneath foregrounds. Doubling the number of `<div>`s appended to the DOM wasn't desirable, so I instead check for certain conditions and remove the foreground and background `<div>`s for a given cell if possible. If the background color is the same as the default background, black, then I don't need the background `<div>`. If the foreground contains whitespace, then I don't need the foreground `<div>`. In most cases, this results in considerably fewer `<div>`s in the DOM, which leads to better performance. I'm not currently using a `DocumentFragment` or `requestAnimationFrame()` for updating the screen. That would probably be the better approach, technically speaking. My observations and measuring frame rates indicate it isn't necessary at this point.

