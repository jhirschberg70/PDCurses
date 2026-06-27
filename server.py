import http.server

class WasmDevHandler(http.server.SimpleHTTPRequestHandler):
    # Explicitly define MIME types so Firefox doesn't block the workers
    extensions_map = http.server.SimpleHTTPRequestHandler.extensions_map.copy()
    extensions_map['.wasm'] = 'application/wasm'
    extensions_map['.js'] = 'application/javascript'

    def end_headers(self):
        # 1. Security headers required for pthreads (SharedArrayBuffer)
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        
        # 2. Anti-caching headers so your browser always fetches the latest .wasm rebuild
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        
        super().end_headers()

if __name__ == '__main__':
    print("Starting Wasm Dev Server on http://127.0.0.1:3000...")
    print("Security Headers: ENABLED")
    print("Caching: DISABLED")
    http.server.test(HandlerClass=WasmDevHandler, port=3000)