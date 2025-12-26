### TODO
- [ ] Add wide character support
- [ ] Add mouse support
- [ ] Add clipboard support
- [ ] Test `raw()` and `noraw()` behavior
- [ ] Create headless testbench
- [ ] Determine cause of Uncaught SyntaxError: Identifier 'ExitStatus' has already been declared
- [ ] Create demo page with previews
- [ ] Support running multiple demos without reloading demo page
- [ ] Understand resize test in testcurs.c
- [ ] Look at timing differences in xmas.c and ozdemo.c vs SDL
- [ ] Update emscripten/README


### 2025-12-15

I've gotten basic functionality working, though there's much left to do. I'm going to create a to-do list for the features that I still need to implement. One specific note I want to make is that I really wanted to use `auto-fill` to create the cells for `screenElement`. I was thinking that on resize, it would allow me to update `LINES` and `COLS` just by counting the `gridTemplateRows` and `gridTemplateColumns` for `screenElement`. Unfortunately, when you shrink the viewport `gridTemplateRows` and `gridTemplateColumns` remain the same because there are `div`s in the cells. I need to remove the `div`s to get `auto-fill` to automatically adjust `gridTemplateRows` and `gridTemplateColumns`. That becomes a catch-22, because if you shrink the window size, you need to remove the `div`s, but you can't tell how many to remove because `gridTemplateRows` and `gridTemplatesColumns` retain their old values until the `div`s are removed.


### 2025-12-26

I believe I have basic functionality complete. I need to conduct more testing, but it's times to get a baseline checked in.