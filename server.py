#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JNxKeys Local Development & Administration Server
Handles static file serving and POST /api/save-ads to persist publication changes directly to assets/data/ads.json.
"""

import http.server
import socketserver
import json
import os
import sys
from pathlib import Path

# Safe stdout/stderr for Windows consoles
if sys.platform == 'win32':
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = 8000
BASE_DIR = Path(__file__).resolve().parent
ADS_FILE = BASE_DIR / "assets" / "data" / "ads.json"

class JNxKeysHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def end_headers(self):
        # Disable caching for ads.json and html to ensure instant updates
        if self.path.endswith('.json') or self.path.endswith('.html') or self.path.endswith('/'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path.split('?')[0] == '/api/save-ads':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length <= 0:
                    self._send_json({"success": False, "error": "Cuerpo vacio"}, status=400)
                    return

                post_data = self.rfile.read(content_length).decode('utf-8')
                new_ads = json.loads(post_data)

                if not isinstance(new_ads, dict):
                    self._send_json({"success": False, "error": "Formato de datos invalido, debe ser un objeto JSON"}, status=400)
                    return

                # Write directly to ads.json
                ADS_FILE.parent.mkdir(parents=True, exist_ok=True)
                with open(ADS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(new_ads, f, indent=2, ensure_ascii=False)

                print(f"[JNxKeys Server] [OK] {len(new_ads)} publicaciones guardadas exitosamente en ads.json")
                self._send_json({
                    "success": True,
                    "message": f"Se guardaron correctamente {len(new_ads)} ubicaciones publicitarias en ads.json",
                    "count": len(new_ads)
                })
            except json.JSONDecodeError as err:
                self._send_json({"success": False, "error": f"JSON invalido: {str(err)}"}, status=400)
            except Exception as e:
                self._send_json({"success": False, "error": f"Error del servidor: {str(e)}"}, status=500)
        else:
            self.send_error(404, "Endpoint no encontrado")

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

def run():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), JNxKeysHandler) as httpd:
        print("=" * 65)
        print(f"[JNxKeys] Servidor activo en:        http://127.0.0.1:{PORT}/")
        print(f"[JNxKeys] Panel de Administracion:  http://127.0.0.1:{PORT}/admin/")
        print(f"[JNxKeys] Directorio base:          {BASE_DIR}")
        print("=" * 65)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nApagando servidor JNxKeys...")
            httpd.server_close()

if __name__ == '__main__':
    run()
