#!/usr/bin/bash

# Check if --build was passed as an argument
BUILD=false
for arg in "$@"; do
  if [ "$arg" == "--build" ]; then
    BUILD=true
    break
  fi
done

# Only execute emmake and mv commands if the build flag is true
if [ "$BUILD" = true ]; then
  emmake make clean && \
  emmake make DEBUG=Y -j && \
  mv libpdcurses_g.a /tmp && \
  emmake make clean && \
  emmake make DEBUG=Y WIDE=Y -j && \
  mv libpdcursesw_g.a /tmp && \
  emmake make clean && \
  emmake make -j && \
  mv libpdcurses.a /tmp && \
  emmake make clean && \
  emmake make WIDE=Y -j && \
  mv /tmp/libpdcurses_g.a . && \
  mv /tmp/libpdcursesw_g.a . && \
  mv /tmp/libpdcurses.a .
fi

# These run unconditionally 
mkdir -p $EMSDK/upstream/emscripten/system/lib/pdcurses && \
mkdir -p $EMSDK/upstream/emscripten/system/include/pdcurses && \
cp libpdcurses.a libpdcurses_g.a libpdcursesw.a libpdcursesw_g.a $EMSDK/upstream/emscripten/system/lib/pdcurses && \
cp ../curses.h ../curspriv.h ../panel.h pdcemscripten.h $EMSDK/upstream/emscripten/system/include/pdcurses