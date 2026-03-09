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

      const screenComputedStyle = window.getComputedStyle(screenElement);

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

        inputBuffer.unshift(KEY_RESIZE)
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

    function setCell(row, col, codePoint, color, background, blink, bold, underline, italic) {
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
        classList  += " wide-char";
      }
        
      cell.style.setProperty("--bg-color", bgColor);
      cell.style.setProperty("--fg-color", fgColor);
    
      if (blink) classList += " blink-text";
      if (bold)  classList += " bold";
      if (italic) classList += " italic";
      if (underline) { classList += " underline"; cell.underline = true; }

      cell.className = classList;
      
      // Handle Foreground Visibility (Whitespace vs Visible chars)
      if ((WHITESPACE.has(codePoint)) && (background == 0) && (!underline)) {
        cell.remove();
      } else if (!cell.isConnected) {
        screenElement.append(cell);
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
      PDC_wcwidth: PDC_wcwidth,
      setCell: setCell
    }
  })();
}