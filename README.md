# Uber Ride Booking Application

A full-stack Uber ride booking application with multiple interfaces:
- 🌐 **Web UI**: React frontend with Vite
- 🔌 **REST API**: Express backend
- 🤖 **MCP Server**: Model Context Protocol server for AI assistants

## Project Structure

```plaintext
├── src/               # React frontend (web UI)
├── server/            # Express backend (REST API)
│   ├── index.js      # Server entry point
│   └── routes/       # API routes
├── mcp-server/        # MCP server (for AI assistants like Claude)
│   ├── index.js      # MCP server implementation
│   ├── package.json  # MCP dependencies
│   └── README.md     # MCP server documentation
├── public/           # Static assets
└── package.json      # Main project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Installation

```bash
npm install
```

### Running the Application

#### Development Mode (Recommended)

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:

- **Frontend**: <http://localhost:5173>
- **Backend**: <http://localhost:3001>

#### Development Mode with MCP Server (Testing All Services)

Run frontend, backend, AND MCP server with inspector UI:

```bash
npm run dev:all
```

This will start:

- **Frontend**: <http://localhost:5173>
- **Backend**: <http://localhost:3001>
- **MCP Inspector**: Opens in your browser for testing MCP tools

**Note**: The MCP Inspector provides a web UI to test MCP tools. Claude Desktop will start its own MCP server instance automatically - you don't need `dev:all` for normal Claude usage.

#### Run Individual Services

```bash
npm run client        # Frontend only
npm run server        # Backend only
npm run mcp:inspect   # MCP server with inspector UI
npm run mcp:test      # Test MCP server
```

### API Endpoints

The backend API is available at `http://localhost:3001`

#### Health Check

- **GET** `/health` - Server health status

#### Uber Guest Trips API

- **POST** `/api/guests/trips/estimates` - Get trip fare and time estimates
  - Request body: `{ pickup: { latitude, longitude }, dropoff: { latitude, longitude } }`

- **POST** `/api/guests/trips` - Create a new guest trip
  - Request body: `{ guest: { first_name, last_name, phone_number }, pickup: { latitude, longitude }, dropoff: { latitude, longitude }, product_id, ... }`

- **GET** `/api/guests/trips/:request_id` - Get trip details by request ID
  - Path parameter: `request_id` (UUID format)

All `/api` requests from the frontend are proxied to the backend server automatically.

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Environment Variables

Create a `.env` file in the root directory:

```bash
PORT=3001
```

## MCP Server (AI Assistant Integration)

This project includes a Model Context Protocol (MCP) server that allows AI assistants like Claude to interact with the Uber booking functionality.

### Features

The MCP server exposes three tools:
- `get_ride_estimates` - Get price and time estimates
- `create_ride_request` - Book a ride for a guest
- `get_ride_details` - Get ride status and details

### Quick Start

```bash
cd mcp-server
npm install
npm test
```

### Using with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "uber-ride-booking": {
      "command": "node",
      "args": ["/absolute/path/to/uber-mcp-pampas/mcp-server/index.js"]
    }
  }
}
```

Then restart Claude Desktop. You can now ask Claude to book rides, get estimates, and check ride details!

**📖 Full Documentation**: See [`mcp-server/README.md`](./mcp-server/README.md) for complete setup, API reference, and troubleshooting.

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Express.js, Node.js
- **MCP Server**: @modelcontextprotocol/sdk
- **Dev Tools**: ESLint, Nodemon, Concurrently
