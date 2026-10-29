# Node.js Test Lab

Requires Node.js 22.13 or newer. No dependencies or database.

1. Extract this ZIP.
2. Run: npm start
3. Open http://localhost:3000

Linux custom port: PORT=3001 npm start
PowerShell custom port: $env:PORT=3001; npm start

For cPanel/Enhance/Passenger or a persistent application, use server.js as the startup file and select the directory containing package.json as the application root. Configure your reverse proxy to the selected port. Passenger may select its own port through PORT.

GET /api/health returns status, Node version and UTC time.
POST /api/echo accepts application/json up to 16 KB.

Example: curl http://127.0.0.1:3000/api/health
Example: curl -H 'Content-Type: application/json' -d '{"test":"hello"}' http://127.0.0.1:3000/api/echo

Request history is browser-session only; no secrets or database configuration required. The Download source link works when this ZIP is placed alongside server.js.
The published Sites edition uses Cloudflare Workers; this package runs directly in Node.js.
