if (typeof window.PDCurses === ("undefined" || null)) {
  
  window.PDCurses = (() => {
    "use strict";
  
    const CURSOR_ID = "cursor";
    const ERR = -1;
    const FALSE = 0;
    const KEY_RESIZE = 0x222;
    const OK = 0;
    const SCREEN_ID = "screen";
    const TRUE = 1;

    const BOX_DRAWING_MAP = new Map([
      [0x005F, 'char-horiz-low'], // _
      [0x007C, 'char-vert'],      // |
      [0x23BA, 'char-s1'],        // ⎺
      [0x23BB, 'char-s3'],        // ⎻
      [0x23BC, 'char-s7'],        // ⎼
      [0x23BD, 'char-s9'],        // ⎽            
      [0x2500, 'char-horiz'],     // ─
      [0x2502, 'char-vert'],      // │
      [0x250C, 'char-tl'],        // ┌
      [0x2510, 'char-tr'],        // ┐
      [0x2514, 'char-bl'],        // └
      [0x2518, 'char-br'],        // ┘
      [0x251C, 'char-l-tee'],     // ├
      [0x2524, 'char-r-tee'],     // ┤
      [0x252C, 'char-t-tee'],     // ┬
      [0x2534, 'char-b-tee'],     // ┴
      [0x253C, 'char-cross'],     // ┼
      [0x2550, 'char-dbl-horiz'], // ═
      [0x2551, 'char-dbl-vert'],  // ║
      [0x2554, 'char-dbl-tl'],    // ╔
      [0x2557, 'char-dbl-tr'],    // ╗
      [0x255A, 'char-dbl-bl'],    // ╚
      [0x255D, 'char-dbl-br'],    // ╝
      [0x256C, 'char-dbl-cross'], // ╬
      [0x2588, 'char-block-full'],// █
      [0x2580, 'char-block-top'], // ▀
      [0x2584, 'char-block-bot'], // ▄
      [0x2591, 'char-shade-light'],// ░
      [0x2592, 'char-shade-med'],  // ▒
      [0x2593, 'char-shade-dark']  // ▓
    ]);
  
    const KEY_MAP = new Map([
      ["^@",         0x00],
      ["^a",         0x01],
      ["^b",         0x02],
      ["^c",         0x03],
      ["^d",         0x04],
      ["^e",         0x05],
      ["^f",         0x06],
      ["^g",         0x07],
      ["^i",         0x09],
      ["^j",         0x0A],
      ["^k",         0x0B],
      ["^l",         0x0C],
      ["^m",         0x0D],
      ["Enter",      0x0D],
      ["^n",         0x0E],
      ["^o",         0x0F],
      ["^p",         0x10],
      ["^q",         0x11],
      ["^r",         0x12],
      ["^s",         0x13],
      ["^t",         0x14],
      ["^u",         0x15],
      ["^v",         0x16],
      ["^w",         0x17],
      ["^x",         0x18],
      ["^y",         0x19],
      ["^z",         0x1A],
      ["^[",         0x1B],
      ["Escape",     0x1B],
      ["^\\",        0x1C],
      ["^]",         0x1D],
      ["^^",         0x1E],
      ["^_",         0x1F],
      [" ",          0x20],
      ["!",          0x21],
      ["\"",         0x22],
      ["#",          0x23],
      ["$",          0x24],
      ["%",          0x25],
      ["&",          0x26],
      ["'",          0x27],
      ["(",          0x28],
      [")",          0x29],
      ["*",          0x2A],
      ["+",          0x2B],
      [",",          0x2C],
      ["-",          0x2D],
      [".",          0x2E],
      ["/",          0x2F],
      ["0",          0x30],
      ["1",          0x31],
      ["2",          0x32],
      ["3",          0x33],
      ["4",          0x34],
      ["5",          0x35],
      ["6",          0x36],
      ["7",          0x37],
      ["8",          0x38],
      ["9",          0x39],
      [":",          0x3A],
      [";",          0x3B],
      ["<",          0x3C],
      ["=",          0x3D],
      [">",          0x3E],
      ["?",          0x3F],
      ["@",          0x40],
      ["A",          0x41],
      ["B",          0x42],
      ["C",          0x43],
      ["D",          0x44],
      ["E",          0x45],
      ["F",          0x46],
      ["G",          0x47],
      ["H",          0x48],
      ["I",          0x49],
      ["J",          0x4A],
      ["K",          0x4B],
      ["L",          0x4C],
      ["M",          0x4D],
      ["N",          0x4E],
      ["O",          0x4F],
      ["P",          0x50],
      ["Q",          0x51],
      ["R",          0x52],
      ["S",          0x53],
      ["T",          0x54],
      ["U",          0x55],
      ["V",          0x56],
      ["W",          0x57],
      ["X",          0x58],
      ["Y",          0x59],
      ["Z",          0x5A],
      ["[",          0x5B],
      ["\\",         0x5C],
      ["]",          0x5D],
      ["^",          0x5E],
      ["_",          0x5F],
      ["`",          0x60],
      ["a",          0x61],
      ["b",          0x62],
      ["c",          0x63],
      ["d",          0x64],
      ["e",          0x65],
      ["f",          0x66],
      ["g",          0x67],
      ["h",          0x68],
      ["i",          0x69],
      ["j",          0x6A],
      ["k",          0x6B],
      ["l",          0x6C],
      ["m",          0x6D],
      ["n",          0x6E],
      ["o",          0x6F],
      ["p",          0x70],
      ["q",          0x71],
      ["r",          0x72],
      ["s",          0x73],
      ["t",          0x74],
      ["u",          0x75],
      ["v",          0x76],
      ["w",          0x77],
      ["x",          0x78],
      ["y",          0x79],
      ["z",          0x7A],
      ["}",          0x7D],
      ["{",          0x7B],
      ["|",          0x7C],
      ["~",          0x7E],
      ["ArrowDown",  0x102],
      ["ArrowUp",    0x103],
      ["ArrowLeft",  0x104],
      ["ArrowRight", 0x105],
      ["Home",       0x106], 
      ["^h",         0x107], // KEY_BACKSPACE
      ["Backspace",  0x107], // KEY_BACKSPACE
      ["F1",         0x109], // KEY_F(1) - KEY_F(12)
      ["F2",         0x10a], 
      ["F3",         0x10b],
      ["F4",         0x10c],
      ["F5",         0x10d],
      ["F6",         0x10e],
      ["F7",         0x10f],
      ["F8",         0x110],
      ["F9",         0x111],
      ["F10",        0x112],
      ["F11",        0x113],
      ["F12",        0x114],
      ["Insert",     0x14b], // KEY_IC
      ["^?",         0x14a], // KEY_DC
      ["Delete",     0x14a], // KEY_DC
      ["PageUp",     0x152], // KEY_PPAGE
      ["PageDown",   0x153], // KEY_NPAGE
      ["End",        0x168]  // KEY_END
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
  
    const colorMap = [];
    const inputBuffer = [];
    const screenBuffer = [];

    let beepContext = null;
    let cursorElement = null;;
    let numColumns = null;
    let numRows = null;
    let observer = null;
    let screenElement = null;
    let throttleBeep = false;

    function createCells(columnIndex, numColumns, rowIndex, numRows) {
      function cell(bg, fg) {
        this.bg = bg;
        this.fg = fg;
      }

      for (let row = rowIndex; row < numRows; ++row) {
        screenBuffer[row] = screenBuffer[row] ?? [];

        for (let column = columnIndex; column < numColumns; ++column) {
          if (!screenBuffer[row][column]) {
            const bg = document.createElement("div");
            const fg = document.createElement("div");

            bg.classList.add("cell-bg");
            bg.style.setProperty("--column", column + 1);
            bg.style.setProperty("--row", row + 1);

            fg.classList.add("cell-fg");
            fg.maskClass = null;
            fg.style.setProperty("--column", column + 1);
            fg.style.setProperty("--row", row + 1);
            screenBuffer[row][column] = new cell(bg, fg);
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

      return { columns: Math.floor(window.visualViewport.width / chWidth), rows: Math.floor(window.visualViewport.height / chHeight) };
    }

    function initEventHandlers() {
      document.addEventListener("keydown", keydownHandler);
      observer = new ResizeObserver(resizeHandler);
      observer.observe(screenElement);
    }

    function keydownHandler(event) {
      /* Restart the cursor animation on any keydown */
      restartCursorAnimation();

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

        dispatchEvent(new CustomEvent("inputBufferedEvent"));

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

    function PDC_check_key(timeout) {
      return new Promise((resolve) => {
        if (inputBuffer.length) return resolve(true);

        if (timeout >= 0) {
          function listener(event) {
            if (timeoutId) clearTimeout(timeoutId);
            resolve(true);
          }
          
          let timeoutId = null;

          addEventListener("inputBufferedEvent", listener, { once: true });

          timeoutId = setTimeout(() => {
            removeEventListener("inputBufferedEvent", listener);
            resolve(inputBuffer.length > 0);
          }, timeout);
        } else {
          addEventListener("inputBufferedEvent", (event) => {
            resolve(true);
          }, { once: true });
        }
      });
    }

    function PDC_curs_set(visibility) {
      const display = visibility ? "block" : "none";

      cursorElement.style.setProperty("display", display);
    }

    function PDC_flushinp() {
      inputBuffer.length = 0;
    }

    function PDC_get_columns() {
      if (!screenElement) {
        console.error("PDC_get_columns(): screenElement doesn't exist. Call PDC_scr_open() to create screenElement.");

        return;
      }

      return numColumns;
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
      const currentColumn = parseInt(cursorElement.style.getPropertyValue("--column"));
      const currentRow = parseInt(cursorElement.style.getPropertyValue("--row"));
      const bgColor = screenBuffer[row][col].bg.style.getPropertyValue("--bg-color");
      const fgColor = screenBuffer[row][col].fg.style.getPropertyValue("--fg-color");
      const textContent = screenBuffer[row][col].fg.textContent;
      const maskClass = screenBuffer[row][col].fg.maskClass;
      
      let classList = "cursor";

      cursorElement.style.setProperty("--column", col + 1);
      cursorElement.style.setProperty("--row", row + 1);
      
      if (maskClass) {
        classList += ` mask ${maskClass}`;
        cursorElement.style.setProperty("--bg-color", fgColor);
        cursorElement.style.setProperty("--fg-color", "transparent");
        cursorElement.style.setProperty("--mask-bg-color", bgColor);
        cursorElement.textContent = "";
      } else {
        cursorElement.style.setProperty("--bg-color", `${(bgColor == "") ? "white" : fgColor}`);
        cursorElement.style.setProperty("--fg-color", `${(fgColor == "") ? "black" : bgColor}`);
        cursorElement.textContent = textContent;
      }
      
      cursorElement.className = classList;

      if ((currentColumn != col + 1) || (currentRow != row + 1)) {
        restartCursorAnimation();
      } 
    }

    function PDC_scr_close() {
      document.removeEventListener("keydown", keydownHandler);
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

      ({ columns: numColumns, rows: numRows } = getGridDimensions(screenElement));
      screenElement.style.setProperty("--columns", numColumns);
      screenElement.style.setProperty("--rows", numRows);

      console.log(`numRows:${numRows} numColumns:${numColumns}`);

      createCells(0, numColumns, 0, numRows);

      PDC_gotoyx(0, 0);
      screenElement.append(cursorElement);

      initEventHandlers();

      return OK;
    }

    function removeCells(columnIndex, rowIndex) {
      for (let row = rowIndex; row < numRows; ++row) {
        for (let column = columnIndex; column < numColumns; ++column) {
          if (screenBuffer[row][column]) {
            screenBuffer[row][column].bg.remove();
            screenBuffer[row][column].fg.remove();
          }
        }
      }
    }

    function resizeHandler() {
      const { columns: newColumns, rows: newRows } = getGridDimensions(screenElement);

      const screenComputedStyle = window.getComputedStyle(screenElement);

      if ((newColumns != numColumns) || (newRows != numRows)) {
        screenElement.style.setProperty("--columns", numColumns);
        screenElement.style.setProperty("--rows", numRows);

        if (newRows < numRows) {
          removeCells(0, newRows);
        }

        if (newColumns < numColumns) {
          removeCells(newColumns, 0);
        }

        if (newRows > numRows) {
          createCells(0, numColumns, numRows, newRows);
        }

        if (newColumns > numColumns) {
          createCells(numColumns, newColumns, 0, newRows);
        }

        numColumns = newColumns;
        numRows = newRows;

        inputBuffer.unshift(KEY_RESIZE)
        console.log(`resize numRows:${numRows} numColumns:${numColumns}`);
      }
    }

    function restartCursorAnimation() {
      // cursorElement.offsetWidth is necessary to force reflow, which forces the browser to
      // apply animation-name to none. Otherwise, it could potentially optimize it away.
      cursorElement.style.setProperty("animation-name", "none");
      cursorElement.offsetWidth;
      cursorElement.style.setProperty("animation-name", "blink");
    }

    function setCell(row, column, codePoint, color, background, blink, bold, underline, italic) {
      const cell = screenBuffer[row][column];

      if (!cell) {
        console.error(`error: tried to access row ${row} column ${column}`);
        return;
      }

      const fg = cell.fg;
      const bg = cell.bg;

      // 1. Reset everything to a "Standard Text" state
      let classList = "cell-fg"; // Clears all classes execept cell-fg
      // fg.style.removeProperty("width"); // Reset wide-char width

      // 2. Set Colors via CSS Variables
      const fgColor = colorMap[color];
      const bgColor = colorMap[background];

      // 3. Handle Mask vs Text Logic
      const maskClass = BOX_DRAWING_MAP.get(codePoint);

      if (maskClass) {
        fg.textContent = "";
        fg.maskClass = maskClass;
        classList += ` mask ${maskClass}`;
        fg.style.setProperty("--mask-bg-color", fgColor);
      } else {
        const char = String.fromCodePoint(codePoint);
        fg.textContent = char;
        fg.maskClass = null;
        classList += " text";

        if (typeof wcwidth !== 'undefined' && wcwidth(char) > 1) {
          classList  += " wide-char";
        }
      }
        
      bg.style.setProperty("--bg-color", bgColor);
      fg.style.setProperty("--fg-color", fgColor);
      
      // Wide Character Support (like 0x26f7 Skier)
      // if (typeof wcwidth !== 'undefined' && wcwidth(char) > 1) {
      //   fg.classList.add("wide-char");
      //   fg.style.setProperty("width", "2ch");
      // }
    
      // 4. Apply Attributes (Blink, Bold, etc.)
      if (blink) classList += " blink-text";
      if (bold)  classList += " bold";
      if (italic) classList += " italic";
      if (underline) classList += " underline";

      fg.className = classList;
      
      // 5. DOM Connectivity (Matching your original logic)
      // Handle Background Visibility (0 is often 'transparent/black' in Curses)
      if (background === 0) {
        bg.remove();
      } else if (!bg.isConnected) {
        screenElement.append(bg);
      }

      // Handle Foreground Visibility (Whitespace vs Visible chars)
      if (WHITESPACE.has(codePoint)) {
        fg.remove();
      } else if (!fg.isConnected) {
        screenElement.append(fg);
      }
    }

    return {
      mapColor: mapColor,
      PDC_beep: PDC_beep,
      PDC_check_key: PDC_check_key,
      PDC_curs_set: PDC_curs_set,
      PDC_flushinp: PDC_flushinp,
      PDC_get_columns: PDC_get_columns,
      PDC_get_key: PDC_get_key,
      PDC_get_rows: PDC_get_rows,
      PDC_gotoyx: PDC_gotoyx,
      PDC_scr_close: PDC_scr_close,
      PDC_scr_open: PDC_scr_open,
      setCell: setCell
    }
  })();
}