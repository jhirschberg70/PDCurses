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
DEMOS =

ifeq ($(DEBUG),Y)
ifeq ($(WIDE),Y)
	CFLAGS  = -g3 -Wall -DPDCDEBUG -DPDC_WIDE
	LIBCURSES	= libpdcursesw_g.a
	DEMOS = unicode.js
else
	CFLAGS  = -g3 -Wall -DPDCDEBUG
	LIBCURSES	= libpdcurses_g.a
endif
else ifeq ($(WIDE), Y)
	CFLAGS  = -O3 -Wall -DPDC_WIDE
	LIBCURSES	= libpdcursesw.a
	DEMOS = unicode.js
else
	CFLAGS  = -O3 -Wall
	LIBCURSES	= libpdcurses.a
endif

ARFLAGS = rcv
BUILD		= $(CC) $(CFLAGS) -I$(PDCURSES_SRCDIR)

PDCURSES_JS = pdcurses.js

DEMO_LDFLAGS	= $(LIBCURSES) --pre-js $(PDCURSES_JS) -lidbfs.js -sASYNCIFY -sENVIRONMENT=web -sEXIT_RUNTIME=1 -sEXPORTED_FUNCTIONS="[_main, __sigwinch_handler]" -sEXPORTED_RUNTIME_METHODS="[cwrap, callMain]" -sFORCE_FILESYSTEM -sINVOKE_RUN=0 -sSINGLE_FILE=1
DEMOS			+= firework.js ozdemo.js rain.js testcurs.js worm.js xmas.js

.PHONY: all libs clean demos

all:	libs demos

libs:	$(LIBCURSES)

clean:
	-rm -rf *.o trace firework.js ozdemo.js rain.js testcurs.js unicode.js worm.js xmas.js libpdcurses.a libpdcurses_g.a libpdcursesw.a libpdcursesw_g.a

demos:	$(DEMOS)

$(LIBCURSES) : $(LIBOBJS) $(PDCOBJS)
	$(AR) $(ARFLAGS) $@ $?
	-$(RANLIB) $@

$(LIBOBJS) $(PDCOBJS) : $(PDCURSES_HEADERS)
$(PDCOBJS) : $(PDCURSES_EMSCRIPTEN_H)
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
