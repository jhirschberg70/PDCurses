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
  
    const KEY_MAP = new Map();
  
    KEY_MAP.set("^@",         0x00);
    KEY_MAP.set("^a",         0x01);
    KEY_MAP.set("^b",         0x02);
    KEY_MAP.set("^c",         0x03);
    KEY_MAP.set("^d",         0x04);
    KEY_MAP.set("^e",         0x05);
    KEY_MAP.set("^f",         0x06);
    KEY_MAP.set("^g",         0x07);
    KEY_MAP.set("^h",         0x08);
    KEY_MAP.set("Backspace",  0x08);
    KEY_MAP.set("^i",         0x09);
    KEY_MAP.set("^j",         0x0A);
    KEY_MAP.set("^k",         0x0B);
    KEY_MAP.set("^l",         0x0C);
    KEY_MAP.set("^m",         0x0D);
    KEY_MAP.set("Enter",      0x0D);
    KEY_MAP.set("^n",         0x0E);
    KEY_MAP.set("^o",         0x0F);
    KEY_MAP.set("^p",         0x10);
    KEY_MAP.set("^q",         0x11);
    KEY_MAP.set("^r",         0x12);
    KEY_MAP.set("^s",         0x13);
    KEY_MAP.set("^t",         0x14);
    KEY_MAP.set("^u",         0x15);
    KEY_MAP.set("^v",         0x16);
    KEY_MAP.set("^w",         0x17);
    KEY_MAP.set("^x",         0x18);
    KEY_MAP.set("^y",         0x19);
    KEY_MAP.set("^z",         0x1A);
    KEY_MAP.set("^[",         0x1B);
    KEY_MAP.set("Escape",     0x1B);
    KEY_MAP.set("^\\",        0x1C);
    KEY_MAP.set("^]",         0x1D);
    KEY_MAP.set("^^",         0x1E);
    KEY_MAP.set("^_",         0x1F);
    KEY_MAP.set(" ",          0x20);
    KEY_MAP.set("!",          0x21);
    KEY_MAP.set("\"",         0x22);
    KEY_MAP.set("#",          0x23);
    KEY_MAP.set("$",          0x24);
    KEY_MAP.set("%",          0x25);
    KEY_MAP.set("&",          0x26);
    KEY_MAP.set("'",          0x27);
    KEY_MAP.set("(",          0x28);
    KEY_MAP.set(")",          0x29);
    KEY_MAP.set("*",          0x2A);
    KEY_MAP.set("+",          0x2B);
    KEY_MAP.set(",",          0x2C);
    KEY_MAP.set("-",          0x2D);
    KEY_MAP.set(".",          0x2E);
    KEY_MAP.set("/",          0x2F);
    KEY_MAP.set("0",          0x30);
    KEY_MAP.set("1",          0x31);
    KEY_MAP.set("2",          0x32);
    KEY_MAP.set("3",          0x33);
    KEY_MAP.set("4",          0x34);
    KEY_MAP.set("5",          0x35);
    KEY_MAP.set("6",          0x36);
    KEY_MAP.set("7",          0x37);
    KEY_MAP.set("8",          0x38);
    KEY_MAP.set("9",          0x39);
    KEY_MAP.set(":",          0x3A);
    KEY_MAP.set(";",          0x3B);
    KEY_MAP.set("<",          0x3C);
    KEY_MAP.set("=",          0x3D);
    KEY_MAP.set(">",          0x3E);
    KEY_MAP.set("?",          0x3F);
    KEY_MAP.set("@",          0x40);
    KEY_MAP.set("A",          0x41);
    KEY_MAP.set("B",          0x42);
    KEY_MAP.set("C",          0x43);
    KEY_MAP.set("D",          0x44);
    KEY_MAP.set("E",          0x45);
    KEY_MAP.set("F",          0x46);
    KEY_MAP.set("G",          0x47);
    KEY_MAP.set("H",          0x48);
    KEY_MAP.set("I",          0x49);
    KEY_MAP.set("J",          0x4A);
    KEY_MAP.set("K",          0x4B);
    KEY_MAP.set("L",          0x4C);
    KEY_MAP.set("M",          0x4D);
    KEY_MAP.set("N",          0x4E);
    KEY_MAP.set("O",          0x4F);
    KEY_MAP.set("P",          0x50);
    KEY_MAP.set("Q",          0x51);
    KEY_MAP.set("R",          0x52);
    KEY_MAP.set("S",          0x53);
    KEY_MAP.set("T",          0x54);
    KEY_MAP.set("U",          0x55);
    KEY_MAP.set("V",          0x56);
    KEY_MAP.set("W",          0x57);
    KEY_MAP.set("X",          0x58);
    KEY_MAP.set("Y",          0x59);
    KEY_MAP.set("Z",          0x5A);
    KEY_MAP.set("[",          0x5B);
    KEY_MAP.set("\\",         0x5C);
    KEY_MAP.set("]",          0x5D);
    KEY_MAP.set("^",          0x5E);
    KEY_MAP.set("_",          0x5F);
    KEY_MAP.set("`",          0x60);
    KEY_MAP.set("a",          0x61);
    KEY_MAP.set("b",          0x62);
    KEY_MAP.set("c",          0x63);
    KEY_MAP.set("d",          0x64);
    KEY_MAP.set("e",          0x65);
    KEY_MAP.set("f",          0x66);
    KEY_MAP.set("g",          0x67);
    KEY_MAP.set("h",          0x68);
    KEY_MAP.set("i",          0x69);
    KEY_MAP.set("j",          0x6A);
    KEY_MAP.set("k",          0x6B);
    KEY_MAP.set("l",          0x6C);
    KEY_MAP.set("m",          0x6D);
    KEY_MAP.set("n",          0x6E);
    KEY_MAP.set("o",          0x6F);
    KEY_MAP.set("p",          0x70);
    KEY_MAP.set("q",          0x71);
    KEY_MAP.set("r",          0x72);
    KEY_MAP.set("s",          0x73);
    KEY_MAP.set("t",          0x74);
    KEY_MAP.set("u",          0x75);
    KEY_MAP.set("v",          0x76);
    KEY_MAP.set("w",          0x77);
    KEY_MAP.set("x",          0x78);
    KEY_MAP.set("y",          0x79);
    KEY_MAP.set("z",          0x7A);
    KEY_MAP.set("}",          0x7D);
    KEY_MAP.set("{",          0x7B);
    KEY_MAP.set("|",          0x7C);
    KEY_MAP.set("~",          0x7E);
    KEY_MAP.set("^?",         0x7F);
    KEY_MAP.set("Delete",     0x7F);
    KEY_MAP.set("ArrowDown",  0x102);
    KEY_MAP.set("ArrowUp",    0x103);
    KEY_MAP.set("ArrowLeft",  0x104);
    KEY_MAP.set("ArrowRight", 0x105);
    KEY_MAP.set("Home",       0x106);

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