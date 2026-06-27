if ((typeof window !== "undefined") && (typeof window.document !== "undefined")) {
  window.PDCurses ??= (() => {
    "use strict";

    const CURSOR_ID = "cursor";
    const KEY_RESIZE = 0x222;
    const KEY_MOUSE           = 0x21b;
    const PDC_BUTTON_SHIFT    = 0x0008;
    const PDC_BUTTON_CONTROL  = 0x0010;
    const PDC_BUTTON_ALT      = 0x0020;
    const BUTTON_RELEASED     = 0x0000;
    const BUTTON_PRESSED      = 0x0001;
    const BUTTON_CLICKED      = 0x0002;
    const BUTTON_DOUBLE_CLICKED = 0x0003;
    const BUTTON_MOVED        = 0x0005;
    const PDC_MOUSE_MOVED     = 0x0008;
    const PDC_MOUSE_WHEEL_UP  = 0x0020;
    const PDC_MOUSE_WHEEL_DOWN = 0x0040;
    const PDC_MOUSE_WHEEL_LEFT = 0x0080;
    const PDC_MOUSE_WHEEL_RIGHT = 0x0100;
    const PDC_KEY_MODIFIER_SHIFT   = 1;
    const PDC_KEY_MODIFIER_CONTROL = 2;
    const PDC_KEY_MODIFIER_ALT     = 4;
    const OK = 0;
    const SCREEN_ID = "screen";
    const SIZEOF_CELL = 4;

    const KEY_MAP = new Map([
      ["^@", 0x00],
      ["^a", 0x01],
      ["^b", 0x02],
      ["^c", 0x03],
      ["^d", 0x04],
      ["^e", 0x05],
      ["^f", 0x06],
      ["^g", 0x07],
      ["^i", 0x09],
      ["^j", 0x0A],
      ["^k", 0x0B],
      ["^l", 0x0C],
      ["^m", 0x0D],
      ["Enter", 0x0D],
      ["^n", 0x0E],
      ["^o", 0x0F],
      ["^p", 0x10],
      ["^q", 0x11],
      ["^r", 0x12],
      ["^s", 0x13],
      ["^t", 0x14],
      ["^u", 0x15],
      ["^v", 0x16],
      ["^w", 0x17],
      ["^x", 0x18],
      ["^y", 0x19],
      ["^z", 0x1A],
      ["^[", 0x1B],
      ["Escape", 0x1B],
      ["^\\", 0x1C],
      ["^]", 0x1D],
      ["^^", 0x1E],
      ["^_", 0x1F],
      [" ", 0x20],
      ["!", 0x21],
      ["\"", 0x22],
      ["#", 0x23],
      ["$", 0x24],
      ["%", 0x25],
      ["&", 0x26],
      ["'", 0x27],
      ["(", 0x28],
      [")", 0x29],
      ["*", 0x2A],
      ["+", 0x2B],
      [",", 0x2C],
      ["-", 0x2D],
      [".", 0x2E],
      ["/", 0x2F],
      ["0", 0x30],
      ["1", 0x31],
      ["2", 0x32],
      ["3", 0x33],
      ["4", 0x34],
      ["5", 0x35],
      ["6", 0x36],
      ["7", 0x37],
      ["8", 0x38],
      ["9", 0x39],
      [":", 0x3A],
      [";", 0x3B],
      ["<", 0x3C],
      ["=", 0x3D],
      [">", 0x3E],
      ["?", 0x3F],
      ["@", 0x40],
      ["A", 0x41],
      ["B", 0x42],
      ["C", 0x43],
      ["D", 0x44],
      ["E", 0x45],
      ["F", 0x46],
      ["G", 0x47],
      ["H", 0x48],
      ["I", 0x49],
      ["J", 0x4A],
      ["K", 0x4B],
      ["L", 0x4C],
      ["M", 0x4D],
      ["N", 0x4E],
      ["O", 0x4F],
      ["P", 0x50],
      ["Q", 0x51],
      ["R", 0x52],
      ["S", 0x53],
      ["T", 0x54],
      ["U", 0x55],
      ["V", 0x56],
      ["W", 0x57],
      ["X", 0x58],
      ["Y", 0x59],
      ["Z", 0x5A],
      ["[", 0x5B],
      ["\\", 0x5C],
      ["]", 0x5D],
      ["^", 0x5E],
      ["_", 0x5F],
      ["`", 0x60],
      ["a", 0x61],
      ["b", 0x62],
      ["c", 0x63],
      ["d", 0x64],
      ["e", 0x65],
      ["f", 0x66],
      ["g", 0x67],
      ["h", 0x68],
      ["i", 0x69],
      ["j", 0x6A],
      ["k", 0x6B],
      ["l", 0x6C],
      ["m", 0x6D],
      ["n", 0x6E],
      ["o", 0x6F],
      ["p", 0x70],
      ["q", 0x71],
      ["r", 0x72],
      ["s", 0x73],
      ["t", 0x74],
      ["u", 0x75],
      ["v", 0x76],
      ["w", 0x77],
      ["x", 0x78],
      ["y", 0x79],
      ["z", 0x7A],
      ["}", 0x7D],
      ["{", 0x7B],
      ["|", 0x7C],
      ["~", 0x7E],
      ["ArrowDown", 0x102],
      ["ArrowUp", 0x103],
      ["ArrowLeft", 0x104],
      ["ArrowRight", 0x105],
      ["Home", 0x106],
      ["^h", 0x107], // KEY_BACKSPACE
      ["Backspace", 0x107], // KEY_BACKSPACE
      ["F1", 0x109], // KEY_F(1) - KEY_F(12)
      ["F2", 0x10a],
      ["F3", 0x10b],
      ["F4", 0x10c],
      ["F5", 0x10d],
      ["F6", 0x10e],
      ["F7", 0x10f],
      ["F8", 0x110],
      ["F9", 0x111],
      ["F10", 0x112],
      ["F11", 0x113],
      ["F12", 0x114],
      ["Insert", 0x14b], // KEY_IC
      ["^?", 0x14a], // KEY_DC
      ["Delete", 0x14a], // KEY_DC
      ["PageUp", 0x152], // KEY_PPAGE
      ["PageDown", 0x153], // KEY_NPAGE
      ["End", 0x168]  // KEY_END
    ]);

    const PREVENT_DEFAULT = new Set([
      "Escape"
    ]);

    const WHITESPACE = new Set([
      0x0009,
      0x000A,
      0x000B,
      0x000C,
      0x000D,
      0x0020,
      0x0085,
      0x00A0,
      0x0020,
      0x1680,
      0x2000,
      0x2002,
      0x2002,
      0x2001,
      0x2003,
      0x2003,
      0x2002,
      0x2000,
      0x2002,
      0x2003,
      0x2001,
      0x2003,
      0x2004,
      0x2005,
      0x2006,
      0x2009,
      0x2007,
      0x2008,
      0x2009,
      0x2002,
      0x2008,
      0x200A,
      0x2028,
      0x2029,
      0x202F,
      0x00A0,
      0x2009,
      0x205F,
      0x3000,
      0x180E,
      0x200B,
      0x200C,
      0x200D,
      0x2060,
      0x200B,
      0xFEFF
    ]);

    const charWidthMap = new Map();
    const colorMap = [];
    const inputBuffer = [];
    const screenBuffer = [];

    let beepContext = null;
    let charWidthCtx = null;
    let cursorElement = null;;
    let numCols = null;
    let numRows = null;
    let observer = null;
    let refCharWidth = null;
    let screenElement = null;
    let throttleBeep = false;

    const mouseEventQueue  = [];   // pending mouse events for C to dequeue
    let mouseEnabled       = false;
    let mouseWait          = 150;  // click timeout in ms (from mouseinterval())

    // Click-detection state
    let pendingPress       = null; // { button, col, row, timeoutId } or null
    let pressedButtons     = 0;   // bitmask of currently held buttons (0=left, 1=mid, 2=right as bit position)

    // Double-click detection
    let lastClickTime      = 0;
    let lastClickCol       = -1;
    let lastClickRow       = -1;
    let lastClickButton    = -1;

    // Move throttling
    let lastMoveCol        = -1;
    let lastMoveRow        = -1;

    // Modifier key state
    let currentModifiers   = 0;   // PDC_KEY_MODIFIER_* bitmask

    // Clipboard
    let cachedClipboardText = "";

    // Atomics-based key notification (initialised by PDC_kbd_init via set_key_notify)
    let _keyNotifyHeap = null;
    let _keyNotifyIdx = 0;

    function createCells(colIndex, numCols, rowIndex, numRows) {
      for (let row = rowIndex; row < numRows; ++row) {
        screenBuffer[row] = screenBuffer[row] ?? [];

        for (let col = colIndex; col < numCols; ++col) {
          if (!screenBuffer[row][col]) {
            const cell = document.createElement("div");

            cell.className = "cell";
            cell.style.setProperty("--col", col + 1);
            cell.style.setProperty("--row", row + 1);
            cell.underline = false;
            screenBuffer[row][col] = cell;
          }
        }
      }
    }

    function getChDimensions(parent = document.body) {
      const span = document.createElement("span");

      span.style.setProperty("position", "fixed");
      span.color = "transparent";
      span.textContent = "0";

      parent.append(span);

      const chHeight = parseFloat(window.getComputedStyle(parent).lineHeight);
      const chWidth = span.getBoundingClientRect().width;

      span.remove();

      return { chHeight, chWidth };
    }

    function getGridDimensions(element) {
      const { chHeight, chWidth } = getChDimensions(element);

      return { cols: Math.floor(window.visualViewport.width / chWidth), rows: Math.floor(window.visualViewport.height / chHeight) };
    }

    function initEventHandlers() {
      document.addEventListener("keydown", keydownHandler);
      document.addEventListener("keyup", keyupHandler);
      document.addEventListener("paste", pasteHandler);
      window.addEventListener("blur", blurHandler);
      observer = new ResizeObserver(resizeHandler);
      observer.observe(screenElement);
    }

    function _notifyKeyWaiter() {
      if (_keyNotifyHeap) {
        Atomics.add(_keyNotifyHeap, _keyNotifyIdx, 1);
        Atomics.notify(_keyNotifyHeap, _keyNotifyIdx, 1);
      }
    }

    function keydownHandler(event) {
      /* Restart the cursor animation on any keydown */
      restartCursorAnimation();

      // Update modifier state
      currentModifiers = 0;
      if (event.shiftKey) currentModifiers |= PDC_KEY_MODIFIER_SHIFT;
      if (event.ctrlKey) currentModifiers |= PDC_KEY_MODIFIER_CONTROL;
      if (event.altKey) currentModifiers |= PDC_KEY_MODIFIER_ALT;

      /* Need user gesture to start an AudioContext */
      if (beepContext === null) {
        beepContext = new window.AudioContext();
      }

      let key = "";

      if (PREVENT_DEFAULT.has(event.key)) event.preventDefault();

      // event.preventDefault();

      // If modifier only, return
      if ((event.key === "Alt") ||
        (event.key === "Control") ||
        (event.key === "Shift")) {
        return;
      }

      //  The only modifier key that has to be explicitly mapped is
      //  Ctrl because there aren't any ASCII codes that use Alt, and
      //  Shift is already accounted for with unique symbols(capital
      //  letters, +, _ etc.)

      if (event.ctrlKey) {
        key += "^";
      }

      key += event.key;

      if (KEY_MAP.has(key)) {
        inputBuffer.push(KEY_MAP.get(key));
        _notifyKeyWaiter();
        console.log(inputBuffer);
      }
      else {
        console.log("key " + key + " doesn't map to code point");
      }
    }

    function mapColor(num, r, g, b) {
      colorMap[num] = `rgb(${r}, ${g}, ${b})`;
    }

    function PDC_beep() {
      if ((!beepContext) || (throttleBeep)) return;

      throttleBeep = true;

      setTimeout(() => throttleBeep = false, 250);

      let beepSound = beepContext.createOscillator();
      let beepGain = beepContext.createGain();

      beepSound.type = "sine";
      beepSound.frequency.value = "587.33";
      beepGain.gain.value = 0.5;
      beepGain.gain.exponentialRampToValueAtTime(
        0.01,
        beepContext.currentTime + 0.25
      );

      beepSound.connect(beepGain).connect(beepContext.destination);
      beepSound.start();
      beepSound.stop(beepContext.currentTime + 0.25);
    }

    function inputBuffer_length() {
      return inputBuffer.length;
    }

    function set_key_notify(heapu32, ptr) {
      _keyNotifyHeap = heapu32;
      _keyNotifyIdx = ptr >>> 2;
    }

    function PDC_curs_set(visibility) {
      const display = visibility ? "block" : "none";

      cursorElement.style.setProperty("display", display);
    }

    function PDC_flushinp() {
      inputBuffer.length = 0;
      mouseEventQueue.length = 0;
    }

    function PDC_get_columns() {
      if (!screenElement) {
        console.error("PDC_get_columns(): screenElement doesn't exist. Call PDC_scr_open() to create screenElement.");

        return;
      }

      return numCols;
    }

    function PDC_get_key() {
      return inputBuffer.shift();
    }

    function PDC_get_rows() {
      if (!screenElement) {
        console.error("PDC_get_rows(): screenElement doesn't exist. Call PDC_scr_open() to create screenElement.");

        return;
      }

      return numRows;
    }

    function PDC_gotoyx(row, col) {
      const cell = screenBuffer[row][col];
      const currentCol = parseInt(cursorElement.style.getPropertyValue("--col"));
      const currentRow = parseInt(cursorElement.style.getPropertyValue("--row"));
      const bgColor = cell.style.getPropertyValue("--bg-color");
      const fgColor = cell.style.getPropertyValue("--fg-color");
      const textContent = cell.textContent;
      const underline = cell.underline;

      let classList = "cursor blink";

      cursorElement.style.setProperty("--col", col + 1);
      cursorElement.style.setProperty("--row", row + 1);

      cursorElement.textContent = textContent;

      if (underline) classList += " underline";

      cursorElement.style.setProperty("--bg-color", `${(bgColor == "") ? "white" : fgColor}`);
      cursorElement.style.setProperty("--fg-color", `${(fgColor == "") ? "black" : bgColor}`);
      cursorElement.className = classList;

      if ((currentCol != col + 1) || (currentRow != row + 1)) {
        restartCursorAnimation();
      }
    }

    function PDC_scr_close() {
      document.removeEventListener("keydown", keydownHandler);
      document.removeEventListener("keyup", keyupHandler);
      document.removeEventListener("paste", pasteHandler);
      window.removeEventListener("blur", blurHandler);
      if (mouseEnabled) {
        PDC_mouse_set(0, mouseWait);
      }
      observer.disconnect();

      screenElement?.remove();
    }

    function PDC_scr_open() {
      cursorElement = document.createElement("div");
      cursorElement.id = CURSOR_ID;
      cursorElement.classList.add("cursor");

      screenElement = document.createElement("dialog");
      screenElement.classList.add("screen");
      screenElement.id = SCREEN_ID;

      document.body.append(screenElement);

      screenElement.showModal();

      ({ cols: numCols, rows: numRows } = getGridDimensions(screenElement));
      screenElement.style.setProperty("--cols", numCols);
      screenElement.style.setProperty("--rows", numRows);

      console.log(`numRows:${numRows} numCols:${numCols}`);

      createCells(0, numCols, 0, numRows);

      PDC_gotoyx(0, 0);
      screenElement.append(cursorElement);

      initEventHandlers();

      return OK;
    }

    function PDC_transform_line(heap, base, row, col, len) {
      for (let i = 0; i < len; ++i) {
        const offset = i * SIZEOF_CELL;
        const ch    = heap[base + offset];
        const fg    = heap[base + offset + 1];
        const bg    = heap[base + offset + 2];
        const attrs = heap[base + offset + 3];

        setCell(row, col + i, ch, fg, bg, attrs & 1, attrs & 2, attrs & 4, attrs & 8);
      }
    }

    function PDC_wcwidth(codePoint) {
      if (charWidthMap.has(codePoint)) return charWidthMap.get(codePoint);

      // Lazily initialize on first call, after the screen modal is shown and
      // the font is fully computed. Capturing the font at PDC_scr_open() time
      // is too early -- the dialog isn't visible yet and getComputedStyle()
      // may return a fallback or empty font string.
      if (!charWidthCtx) {
        charWidthCtx = document.createElement('canvas').getContext('2d');
        charWidthCtx.font = getComputedStyle(screenElement).font;
        refCharWidth = charWidthCtx.measureText("0").width;
      }

      const charWidth = charWidthCtx.measureText(String.fromCodePoint(codePoint)).width / refCharWidth > 1.4 ? 2 : 1;

      charWidthMap.set(codePoint, charWidth);

      return charWidth;
    }

    function removeCells(colIndex, rowIndex) {
      for (let row = rowIndex; row < numRows; ++row) {
        for (let col = colIndex; col < numCols; ++col) {
          if (screenBuffer[row][col]) {
            screenBuffer[row][col].remove();
          }
        }
      }
    }

    function resizeHandler() {
      const { cols: newCols, rows: newRows } = getGridDimensions(screenElement);

      if ((newCols != numCols) || (newRows != numRows)) {
        screenElement.style.setProperty("--cols", newCols);
        screenElement.style.setProperty("--rows", newRows);

        if (newRows < numRows) {
          removeCells(0, newRows);
        }

        if (newCols < numCols) {
          removeCells(newCols, 0);
        }

        if (newRows > numRows) {
          createCells(0, numCols, numRows, newRows);
        }

        if (newCols > numCols) {
          createCells(numCols, newCols, 0, newRows);
        }

        numCols = newCols;
        numRows = newRows;

        inputBuffer.unshift(KEY_RESIZE);
        _notifyKeyWaiter();
        console.log(`resize numRows:${numRows} numCols:${numCols}`);
      }
    }

    function restartCursorAnimation() {
      // cursorElement.offsetWidth is necessary to force reflow, which forces the browser to
      // apply animation-name to none. Otherwise, it could potentially optimize it away.
      cursorElement.style.setProperty("animation-name", "none");
      cursorElement.offsetWidth;
      cursorElement.style.setProperty("animation-name", "blink");
    }
    
    function setCell(row, col, codePoint, color, background, blink, bold, italic, underline) {
      const cell = screenBuffer[row][col];

      if (!cell) {
        console.error(`error: tried to access row ${row} col ${col}`);
        return;
      }

      cell.textContent = "";
      cell.underline = false;

      let classList = "cell"; // Clears all classes execept cell

      const bgColor = colorMap[background];
      const fgColor = colorMap[color];

      const char = String.fromCodePoint(codePoint);
      cell.textContent = char;

      if (PDC_wcwidth(codePoint) > 1) {
        classList += " wide-char";
      }

      cell.style.setProperty("--bg-color", bgColor);
      cell.style.setProperty("--fg-color", fgColor);

      if (blink) classList += " blink-text";
      if (bold) classList += " bold";
      if (italic) classList += " italic";
      if (underline) { classList += " underline"; cell.underline = true; }
      if ((codePoint >= 0x2500) && (codePoint <= 0x257F)) classList += " box-drawing";

      cell.className = classList;

      // Handle Foreground Visibility (Whitespace vs Visible chars)
      if ((WHITESPACE.has(codePoint)) && (background == 0) && (!underline)) {
        cell.remove();
      } else if (!cell.isConnected) {
        screenElement.append(cell);
      }
    }

    function blurHandler() {
      currentModifiers = 0;
    }

    function contextmenuHandler(event) {
      event.preventDefault();
    }

    function dequeue_mouse_event() {
      return mouseEventQueue.shift();
    }

    function enqueueMouseEvent(evt) {
      mouseEventQueue.push(evt);
      inputBuffer.push(KEY_MOUSE);
      _notifyKeyWaiter();
    }

    function getButtonModifiers(event) {
      let flags = 0;
      if (event.shiftKey) flags |= PDC_BUTTON_SHIFT;
      if (event.ctrlKey)  flags |= PDC_BUTTON_CONTROL;
      if (event.altKey)   flags |= PDC_BUTTON_ALT;
      return flags;
    }

    function keyupHandler(event) {
      currentModifiers = 0;
      if (event.shiftKey)   currentModifiers |= PDC_KEY_MODIFIER_SHIFT;
      if (event.ctrlKey)    currentModifiers |= PDC_KEY_MODIFIER_CONTROL;
      if (event.altKey)     currentModifiers |= PDC_KEY_MODIFIER_ALT;
    }

    function mousedownHandler(event) {
      event.preventDefault();
      const { col, row } = pixelToCell(event.clientX, event.clientY);
      const btn = event.button;  // 0=left, 1=middle, 2=right
      const mods = getButtonModifiers(event);

      // Cancel any existing pending press for the same button (defensive)
      if (pendingPress && pendingPress.button === btn) {
        clearTimeout(pendingPress.timeoutId);
        pendingPress = null;
      }

      const startPendingPress = () => {
        const timeoutId = setTimeout(() => {
          // Timeout fired - treat as PRESS (drag will follow)
          pendingPress = null;
          pressedButtons |= (1 << btn);
          lastMoveCol = col;
          lastMoveRow = row;
          const buttons = [BUTTON_RELEASED, BUTTON_RELEASED, BUTTON_RELEASED];
          buttons[btn] = BUTTON_PRESSED | mods;
          enqueueMouseEvent({
            x: col, y: row,
            button0: buttons[0], button1: buttons[1], button2: buttons[2],
            changes: (1 << btn)
          });
        }, mouseWait);
        pendingPress = { button: btn, col, row, time: Date.now(), timeoutId, mods };
      };

      startPendingPress();

      // mouseup listener on document to capture releases even outside screen element
      document.addEventListener("mouseup", mouseupHandler);
    }

    function mousemoveHandler(event) {
      if (!event.buttons) return;  // no button held, ignore

      const { col, row } = pixelToCell(event.clientX, event.clientY);

      // If we have a pending press, check if we've moved to a different cell
      if (pendingPress) {
        if (col !== pendingPress.col || row !== pendingPress.row) {
          // Drag detected: cancel timer, send PRESSED, transition to DRAGGING
          const btn = pendingPress.button;
          const mods = pendingPress.mods;
          const pressCol = pendingPress.col;
          const pressRow = pendingPress.row;
          clearTimeout(pendingPress.timeoutId);
          pendingPress = null;
          pressedButtons |= (1 << btn);
          lastMoveCol = col;
          lastMoveRow = row;

          // First send PRESSED at the original position
          const buttons = [BUTTON_RELEASED, BUTTON_RELEASED, BUTTON_RELEASED];
          buttons[btn] = BUTTON_PRESSED | mods;
          enqueueMouseEvent({
            x: pressCol, y: pressRow,
            button0: buttons[0], button1: buttons[1], button2: buttons[2],
            changes: (1 << btn)
          });

          // Then send MOVED at new position
          const moveButtons = [BUTTON_RELEASED, BUTTON_RELEASED, BUTTON_RELEASED];
          moveButtons[btn] = BUTTON_MOVED | mods;
          enqueueMouseEvent({
            x: col, y: row,
            button0: moveButtons[0], button1: moveButtons[1], button2: moveButtons[2],
            changes: (1 << btn) | PDC_MOUSE_MOVED
          });
        }
        return;
      }

      // If we are DRAGGING, send MOVED only when cell changes
      if (pressedButtons && (col !== lastMoveCol || row !== lastMoveRow)) {
        lastMoveCol = col;
        lastMoveRow = row;
        const mods = getButtonModifiers(event);

        // Build button states based on which buttons are held
        const button0 = (pressedButtons & 1) ? (BUTTON_MOVED | mods) : BUTTON_RELEASED;
        const button1 = (pressedButtons & 2) ? (BUTTON_MOVED | mods) : BUTTON_RELEASED;
        const button2 = (pressedButtons & 4) ? (BUTTON_MOVED | mods) : BUTTON_RELEASED;
        let changes = PDC_MOUSE_MOVED;
        if (pressedButtons & 1) changes |= 1;
        if (pressedButtons & 2) changes |= 2;
        if (pressedButtons & 4) changes |= 4;

        enqueueMouseEvent({ x: col, y: row, button0, button1, button2, changes });
      }
    }

    function mouseupHandler(event) {
      document.removeEventListener("mouseup", mouseupHandler);

      const { col, row } = pixelToCell(event.clientX, event.clientY);
      const btn = event.button;
      const mods = getButtonModifiers(event);

      if (pendingPress && pendingPress.button === btn) {
        // We were in WAIT_FOR_RELEASE: cancel timer, send CLICKED or DOUBLE_CLICKED
        clearTimeout(pendingPress.timeoutId);
        pendingPress = null;

        let action;
        if (btn === lastClickButton &&
            col === lastClickCol && row === lastClickRow &&
            Date.now() - lastClickTime < mouseWait) {
          action = BUTTON_DOUBLE_CLICKED;
        } else {
          action = BUTTON_CLICKED;
        }

        lastClickButton = btn;
        lastClickCol = col;
        lastClickRow = row;
        lastClickTime = Date.now();

        const buttons = [BUTTON_RELEASED, BUTTON_RELEASED, BUTTON_RELEASED];
        buttons[btn] = action | mods;
        enqueueMouseEvent({
          x: col, y: row,
          button0: buttons[0], button1: buttons[1], button2: buttons[2],
          changes: (1 << btn)
        });
      } else if (pressedButtons & (1 << btn)) {
        // We were DRAGGING: send RELEASED
        pressedButtons &= ~(1 << btn);
        lastMoveCol = -1;
        lastMoveRow = -1;

        const buttons = [BUTTON_RELEASED, BUTTON_RELEASED, BUTTON_RELEASED];
        buttons[btn] = BUTTON_RELEASED | mods;
        enqueueMouseEvent({
          x: col, y: row,
          button0: buttons[0], button1: buttons[1], button2: buttons[2],
          changes: (1 << btn)
        });
      }
    }

    function pasteHandler(event) {
      cachedClipboardText = event.clipboardData?.getData("text/plain") ?? "";
      event.preventDefault();
    }

    function PDC_clearclipboard() {
      cachedClipboardText = "";
      navigator.clipboard.writeText("").catch(() => {});
      return 0;  // PDC_CLIP_SUCCESS
    }

    function PDC_get_modifiers() {
      return currentModifiers;
    }

    function PDC_getclipboard_async() {
      return navigator.clipboard.readText().then(
        (text) => { cachedClipboardText = text; return text; },
        () => cachedClipboardText
      );
    }

    function PDC_mouse_set(enable, wait) {
      mouseWait = wait;
      if (enable && !mouseEnabled) {
        screenElement.addEventListener("mousedown", mousedownHandler);
        screenElement.addEventListener("mousemove", mousemoveHandler);
        screenElement.addEventListener("wheel", wheelHandler, { passive: true });
        screenElement.addEventListener("contextmenu", contextmenuHandler);
        mouseEnabled = true;
      } else if (!enable && mouseEnabled) {
        screenElement.removeEventListener("mousedown", mousedownHandler);
        screenElement.removeEventListener("mousemove", mousemoveHandler);
        screenElement.removeEventListener("wheel", wheelHandler);
        screenElement.removeEventListener("contextmenu", contextmenuHandler);
        document.removeEventListener("mouseup", mouseupHandler);
        if (pendingPress) {
          clearTimeout(pendingPress.timeoutId);
          pendingPress = null;
        }
        pressedButtons = 0;
        mouseEventQueue.length = 0;
        mouseEnabled = false;
      }
    }

    function PDC_setclipboard_async(text) {
      cachedClipboardText = text;
      return navigator.clipboard.writeText(text).then(
        () => 0,    // PDC_CLIP_SUCCESS
        () => 0     // store locally succeeded even if OS clipboard failed
      );
    }

    function pixelToCell(clientX, clientY) {
      const rect = screenElement.getBoundingClientRect();
      const { chHeight, chWidth } = getChDimensions(screenElement);
      return {
        col: Math.max(0, Math.min(numCols - 1, Math.floor((clientX - rect.left) / chWidth))),
        row: Math.max(0, Math.min(numRows - 1, Math.floor((clientY - rect.top) / chHeight)))
      };
    }

    function wheelHandler(event) {
      const { col, row } = pixelToCell(event.clientX, event.clientY);
      let changes = 0;

      if (event.deltaY < 0)      changes |= PDC_MOUSE_WHEEL_UP;
      else if (event.deltaY > 0) changes |= PDC_MOUSE_WHEEL_DOWN;
      if (event.deltaX < 0)      changes |= PDC_MOUSE_WHEEL_LEFT;
      else if (event.deltaX > 0) changes |= PDC_MOUSE_WHEEL_RIGHT;

      if (changes) {
        enqueueMouseEvent({
          x: col, y: row,
          button0: BUTTON_RELEASED, button1: BUTTON_RELEASED, button2: BUTTON_RELEASED,
          changes
        });
      }
    }

    return {
      mapColor,
      PDC_beep,
      PDC_clearclipboard,
      PDC_curs_set,
      PDC_flushinp,
      PDC_get_columns,
      PDC_get_key,
      PDC_get_modifiers,
      PDC_get_rows,
      PDC_getclipboard_async,
      PDC_gotoyx,
      inputBuffer_length,
      PDC_mouse_set,
      PDC_scr_close,
      PDC_scr_open,
      PDC_setclipboard_async,
      PDC_transform_line,
      PDC_wcwidth,
      dequeue_mouse_event,
      set_key_notify,
      setCell
    }
  })();
}