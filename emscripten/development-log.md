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

### 2026-02-21

It's been more than a month since I've updated this log, and a lot has happened! I ran into issues using PDCurses with Angband. The cursor wasn't positionined properly. After spending quite a bit of time trying to debug it, I abandoned PDCurses and started looking into porting ncurses to emscripten. I made enough progress to get a terminal driver to compile and run, but the ncurses build process is complicated and the terminal driver architecture isn't appealing to me, so I returned to PDCurses. First, I wanted to solve the cursor issue. I was finally able to track it down: PDCurses was checking the wrong conditions to determine if the physical cursor should be moved. It was checking the logical cursor position against the physical cursor position. This isn't correct. Each window needs to track the movement of its logical cursor independently and update the physical cursor if the logical cursor has moved since the previous refresh. I fixed this to work in a manner similar to ncurses. This led me down the path of looking at what other errors might exsist in PDCurses.

I decided to use this as an opportunity to explore AI coding. I had the PDCurses codebase and the X/Open Curses spec, and I asked AI to examine the codebase and compare it against the spec and identify any errors. It came up with 14 different errors, for typos and memory leaks and dangling pointers to issues with condition checking similar to the cursor issue. I asked it to implement fixes, and I examined each fix in detail to make sure I understood what it thought was wrong and the fix. Everything checked out, so I commited those changes. This also pushed down the path of just keeping this version of PDCurses as a fork. There are a number of outstanding pull requests for the main repository, and William McBrine, the creator of PDCurses, doesn't seem motivated/doesn't have time to maintain it. I think it's a viable option for Curses support in Emscripten, so I'm going to continue development. I briefly looked at PDCursesMod, but there are things I don't like about it. I don't care for the implementation of non-spacing characters. There are also some strange formatting choices. I'm going to stick with my own version, wich allows me to make changes that specifically deal with emscripten.

One of those changes was in how PDC_check_key() operates. I didn't care for the crude polling implemented in wgetch(). JavaScript allows for much finer control, so I've partially updated wgetch() to take advantage of this. In talking with AI about this, I found out that the way I had implemented the timeout forced the JavaScript to always wait for timeout period, even if a key came in during that period. I've fixed this, and I've gotten rid of the setInterval-based polling I was using for blocking cases.

I've also updated how certain glyphs are rendered, such ┌. Relying on the font's built-in glyphs for the drawing symbols meant that they couldn't connect to neighboring cells in the grid, due to how grid works with text. After working with AI, I've implemented a system that replaces the drawing symbols with SVG-based CSS masks, which can cover the entire width and height of a grid cell. This allows for seamless connections that emulate what you get in a terminal.

Overall, I'm feeling really good about where this is at. I've still got a number of things on my todo list, with mouse support being the most significant.