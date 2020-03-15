import http.server
import socketserver
import webbrowser

def startServer(PORT=8000):

	Handler = http.server.SimpleHTTPRequestHandler

	with socketserver.TCPServer(("", PORT), Handler) as httpd:
	    httpd.serve_forever()

def openBrowser(PORT=8000):
	webbrowser.open('http://0.0.0.0:' + str(PORT) + '/')