# Uber MCP Server

MCP (Model Context Protocol) server for Uber ride booking, designed for use with ChatGPT and other web-based AI clients via HTTP/SSE transport.

## Quick Start

### 1. Start your backend API:

```bash
# From the root of uber-mcp-pampas
npm start
```

This starts your API on `http://localhost:3001`

### 2. Start the MCP server:

```bash
cd mcp-server
npm start
```

You should see:

```
Uber MCP Server (SSE) listening on http://localhost:8000
  SSE stream: GET http://localhost:8000/mcp
  Message endpoint: POST http://localhost:8000/mcp/messages?sessionId=...
  Backend API: http://localhost:3001/api

Active sessions: 0
```

## Configuration

### Environment Variables:

- `MCP_PORT` or `PORT`: Server port (default: 8000)
- `API_BASE_URL`: Backend API URL (default: `http://localhost:3001/api`)

Example:

```bash
MCP_PORT=9000 API_BASE_URL=http://localhost:3001/api npm start
```

## Architecture

```
┌─────────────┐      SSE        ┌──────────────┐      HTTP       ┌─────────────┐
│   ChatGPT   │◄────────────────►│  MCP Server  │◄───────────────►│  Backend    │
│  (Client)   │   GET /mcp       │  (SSE/HTTP)  │   REST API      │  API        │
│             │   POST /messages │  Port 8000   │                 │  Port 3001  │
└─────────────┘                  └──────────────┘                 └─────────────┘
```

## Endpoints

### GET /mcp

Establishes a Server-Sent Events connection for MCP protocol communication.

**Response**: SSE stream with session initialization

### POST /mcp/messages?sessionId={sessionId}

Send MCP protocol messages for a specific session.

**Query Parameters**:
- `sessionId` (required): The session ID from the SSE connection

**Headers**:
- `Content-Type: application/json`

## Available Tools

The MCP server exposes three tools for Uber ride booking:

### 1. get_ride_estimates

Get price and time estimates for available Uber products between two locations.

**Parameters**:
- `pickup`: Object with `latitude` and `longitude`
- `dropoff`: Object with `latitude` and `longitude`

**Returns**: List of available ride options with pricing, ETA, and product details

### 2. create_ride_request

Create a new ride request for a guest user.

**Parameters**:
- `guest`: Object with `first_name`, `last_name`, `phone_number`, `email` (optional), `locale` (optional)
- `pickup`: Object with `latitude` and `longitude`
- `dropoff`: Object with `latitude` and `longitude`
- `product_id`: Uber product ID (from estimates)
- `fare_id`: Fare ID from estimates (optional)
- `note_for_driver`: Special instructions (optional)
- `expense_memo`: Business tracking memo (optional)

**Returns**: Ride details including request ID, ETA, and guest information

### 3. get_ride_details

Get detailed information about an existing ride request.

**Parameters**:
- `request_id`: UUID of the ride request

**Returns**: Comprehensive ride details including driver info, vehicle details, pickup/dropoff locations, and current status

## Using with ChatGPT

### Local Development with ngrok:

```bash
# Install ngrok if you haven't
brew install ngrok

# Start your MCP server
npm start

# In another terminal, expose it via ngrok
ngrok http 8000
```

Use the ngrok HTTPS URL (e.g., `https://abc123.ngrok.io/mcp`) in ChatGPT configuration.

### Production Deployment:

Deploy to a cloud service:
- **Heroku**: `git push heroku main`
- **Railway**: Connect your GitHub repo
- **Render**: Deploy as a web service
- **Vercel/Netlify**: Deploy with Node.js runtime

Configure ChatGPT with your deployed URL: `https://your-domain.com/mcp`

## Session Management

- Each client connection creates a new MCP server instance
- Sessions are tracked by unique session IDs
- Automatic cleanup when clients disconnect
- Server logs active session count every 30 seconds

## Development

### Start with auto-reload:

```bash
npm run dev
```

### Testing:

```bash
npm test
```

## Troubleshooting

### Port already in use

```bash
# Check what's using port 8000
lsof -i :8000

# Use a different port
MCP_PORT=9000 npm start
```

### Backend API not responding

- Ensure backend API is running on port 3001
- Check `API_BASE_URL` environment variable
- Verify API endpoints are accessible

### CORS issues

The server allows all origins by default (`Access-Control-Allow-Origin: *`). To restrict:

```javascript
// In index.js, modify the CORS headers
res.setHeader('Access-Control-Allow-Origin', 'https://chat.openai.com');
```

## Files

- `index.js` - Main MCP server with SSE transport
- `package.json` - Dependencies and scripts
- `test-server.js` - Test client for the server
- `.env` - Environment configuration
- `claude_desktop_config.example.json` - Legacy Claude Desktop config (not used)
- `index-stdio.js.backup` - Backup of stdio version (for Claude Desktop)

## Migration Note

This server now uses **SSE/HTTP transport** by default for web clients like ChatGPT.

If you need the **stdio version** for Claude Desktop, it's backed up in `index-stdio.js.backup`. To use it:

```bash
node index-stdio.js.backup
```

## License

MIT
