# Makefile for PDCurses library for emscripten

O = o

ifndef PDCURSES_SRCDIR
	PDCURSES_SRCDIR	= ..
endif

include $(PDCURSES_SRCDIR)/common/libobjs.mif

osdir		= $(PDCURSES_SRCDIR)/emscripten

PDCURSES_EMSCRIPTEN_H	= $(osdir)/pdcemscripten.h

# If your system doesn't have these, remove the defines here
SFLAGS		+= -DHAVE_VSNPRINTF -DHAVE_VSSCANF

DEMO_LDFLAGS	= $(LIBCURSES) --pre-js $(PDCURSES_JS) -lidbfs.js -sASYNCIFY -sENVIRONMENT=web -sEXIT_RUNTIME=1 -sEXPORTED_FUNCTIONS="[_main, __sigwinch_handler]" -sEXPORTED_RUNTIME_METHODS="[cwrap, callMain]" -sFORCE_FILESYSTEM -sINVOKE_RUN=0 -sSINGLE_FILE=1
#DEMO_LDFLAGS	= $(LIBCURSES) -sASYNCIFY -sENVIRONMENT=web -sEXPORTED_FUNCTIONS="[_main, __sigwinch_handler]" -sEXPORTED_RUNTIME_METHODS="[cwrap, callMain]" -sFORCE_FILESYSTEM -sINVOKE_RUN=0 -sSINGLE_FILE=1

ifeq ($(DEBUG),Y)
	CFLAGS  = -g3 -Wall -DPDCDEBUG
	LDFLAGS = $(LIBCURSES) -sASSERTIONS=2 -sNO_DISABLE_EXCEPTION_CATCHING -sSAFE_HEAP=1 -sSTACK_OVERFLOW_CHECK=2
else
	CFLAGS  = -O3 -Wall
	LDFLAGS	= $(LIBCURSES) -O3
endif

ifeq ($(WIDE), Y)
	CFLAGS += -DPDC_WIDE
endif

ARFLAGS = rcv
BUILD		= $(CC) $(CFLAGS) -I$(PDCURSES_SRCDIR)

LINK		= $(CC)
LIBCURSES	= libpdcurses.a
PDCURSES_JS = pdcurses.js

DEMOS			= firework.js ozdemo.js rain.js testcurs.js unicode.js worm.js xmas.js

.PHONY: all libs clean demos

all:	libs demos

libs:	$(LIBCURSES)

clean:
	-rm -rf *.o trace $(LIBCURSES) $(DEMOS)

demos:	$(DEMOS)

$(LIBCURSES) : $(LIBOBJS) $(PDCOBJS)
	$(AR) $(ARFLAGS) $@ $?
	-$(RANLIB) $@

$(LIBOBJS) $(PDCOBJS) : $(PDCURSES_HEADERS)
$(PDCOBJS) : $(PDCURSES_SDL_H)
$(DEMOS) : $(PDCURSES_CURSES_H) $(LIBCURSES)
tui.o tuidemo.o : $(PDCURSES_CURSES_H)
terminfo.o: $(TERM_HEADER)
panel.o ptest: $(PANEL_HEADER)

$(LIBOBJS) : %.o: $(srcdir)/%.c
	$(BUILD) $(SFLAGS) -c $<

$(PDCOBJS) : %.o: $(osdir)/%.c
	$(BUILD) $(SFLAGS) -c $<

firework.js: ../demos/firework.c $(PDCURSES_JS)
	$(BUILD) -o $@ $< $(DEMO_LDFLAGS)

ozdemo.js: ../demos/ozdemo.c $(PDCURSES_JS)
	$(BUILD) -o $@ $< $(DEMO_LDFLAGS)

rain.js: ../demos/rain.c $(PDCURSES_JS)
	$(BUILD) -o $@ $< $(DEMO_LDFLAGS)

testcurs.js: ../demos/testcurs.c $(PDCURSES_JS)
	$(BUILD) -o $@ $< $(DEMO_LDFLAGS)

unicode.js: ../demos/unicode.c $(PDCURSES_JS)
	$(BUILD) -o $@ $< $(DEMO_LDFLAGS)

worm.js: ../demos/worm.c $(PDCURSES_JS)
	$(BUILD) -o $@ $< $(DEMO_LDFLAGS)

xmas.js: ../demos/xmas.c $(PDCURSES_JS)
	$(BUILD) -o $@ $< $(DEMO_LDFLAGS)
