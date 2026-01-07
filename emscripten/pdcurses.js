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
      ["^h",         0x08],
      ["Backspace",  0x08],
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
      ["^?",         0x7F],
      ["Delete",     0x7F],
      ["ArrowDown",  0x102],
      ["ArrowUp",    0x103],
      ["ArrowLeft",  0x104],
      ["ArrowRight", 0x105],
      ["Home",       0x106]
    ]);

    const PREVENT_DEFAULT = new Set([
      "Escape"
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
      for (let row = rowIndex; row < numRows; ++row) {
        screenBuffer[row] = screenBuffer[row] ?? [];

        for (let column = columnIndex; column < numColumns; ++column) {
          if (!screenBuffer[row][column]) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.style.setProperty("--col", column + 1);
            cell.style.setProperty("--row", row + 1);
            screenBuffer[row][column] = cell;
          }

          screenElement.append(screenBuffer[row][column]);
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
        console.log(inputBuffer);
      }
      else {
        console.log("key " + key + " doesn't map to ASCII code");
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

    function PDC_check_key() {
      if (inputBuffer.length) {
        return TRUE;
      }

      return FALSE;
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

    function PDC_get_key(timeout) {
      return inputBuffer.length ? inputBuffer.shift() : ERR;
    }

    function PDC_get_rows() {
      if (!screenElement) {
        console.error("PDC_get_rows(): screenElement doesn't exist. Call PDC_scr_open() to create screenElement.");

        return;
      }

      return numRows;
    }

    function PDC_gotoyx(row, col) {
      const background = screenBuffer[row][col].style.getPropertyValue("--background");
      const color = screenBuffer[row][col].style.getPropertyValue("--color");
      const textContent = screenBuffer[row][col].textContent;

      cursorElement.style.cssText = `grid-row:${row + 1};grid-column:${col + 1};--background: ${background};--color: ${color}`;
      cursorElement.textContent = textContent;
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
      screenElement.style.setProperty("--cols", numColumns);
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
          if (screenBuffer[row][column]) screenBuffer[row][column].remove();
        }
      }
    }

    function resizeHandler() {
      const { columns: newColumns, rows: newRows } = getGridDimensions(screenElement);

      const screenComputedStyle = window.getComputedStyle(screenElement);

      if ((newColumns != numColumns) || (newRows != numRows)) {
        screenElement.style.setProperty("--cols", numColumns);
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

    function setCell(row, column, ch, color, background, blink, bold, underline, italic) {
      if (screenBuffer[row][column]) {
        screenBuffer[row][column].style.setProperty("--background", `${colorMap[background]}`);
        screenBuffer[row][column].style.setProperty("--color", `${colorMap[color]}`);
        screenBuffer[row][column].textContent = String.fromCodePoint(ch);

        if (blink) {
          screenBuffer[row][column].classList.add("blink-text");
        } else {
          screenBuffer[row][column].classList.remove("blink-text");
        }

        if (bold) {
          screenBuffer[row][column].classList.add("bold");
        } else {
          screenBuffer[row][column].classList.remove("bold");
        }

        if (italic) {
          screenBuffer[row][column].classList.add("italic");
        } else {
          screenBuffer[row][column].classList.remove("italic");
        }

        if (underline) {
          screenBuffer[row][column].classList.add("underline");
        } else {
          screenBuffer[row][column].classList.remove("underline");
        }
      } else {
        console.error(`error: tried to access row ${row} column ${column}`);
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