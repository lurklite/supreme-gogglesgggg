#!/usr/bin/env python3
"""
LURKOUT Script Builder - Local Development Server
Run this to test the application locally
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main():
    print("=" * 60)
    print("LURKOUT Script Builder - Development Server")
    print("=" * 60)
    print(f"\n🚀 Starting server on http://localhost:{PORT}")
    print(f"📁 Serving files from: {os.getcwd()}")
    print("\n💡 Tips:")
    print("   - Press Ctrl+C to stop the server")
    print("   - The app will auto-login in demo mode")
    print("   - Check README.md for Discord OAuth setup")
    print("\n" + "=" * 60 + "\n")

    Handler = MyHTTPRequestHandler

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✅ Server stopped. Goodbye!")

if __name__ == "__main__":
    main()
