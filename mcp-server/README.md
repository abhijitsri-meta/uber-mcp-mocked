# Uber Ride Booking MCP Server

A Model Context Protocol (MCP) server that exposes Uber ride booking functionality as tools for AI assistants and other MCP clients.

## Overview

This MCP server provides three main tools for interacting with Uber ride booking services:

1. **get_ride_estimates** - Get price and time estimates for available Uber products
2. **create_ride_request** - Create a new ride request for a guest
3. **get_ride_details** - Retrieve detailed information about an existing ride

## Installation

```bash
cd mcp-server
npm install
```

## Configuration

The MCP server calls your Express API endpoints. Configure the API base URL:

```bash
cp .env.example .env
```

Edit `.env` to set your API URL (default: `http://localhost:3001/api`):

```env
API_BASE_URL=http://localhost:3001/api
```

**Important:** The Express API server must be running for the MCP server to work.

## Usage

### Running the Server Standalone

```bash
npm start
```

**Note:** Make sure your Express API server is running on `http://localhost:3001` first!

### Using with Claude Desktop

Add the following configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

Replace `/absolute/path/to/uber-mcp-pampas/mcp-server/index.js` with the actual absolute path to the MCP server file on your system.

### Using with Other MCP Clients

This server uses the standard MCP protocol over stdio, so it can be integrated with any MCP-compatible client by configuring it to run the server with:

```bash
node /path/to/mcp-server/index.js
```

## Available Tools

### 1. get_ride_estimates

Get price and time estimates for available Uber products between two locations.

**Parameters:**

- `pickup` (required): Object with `latitude` and `longitude`
- `dropoff` (required): Object with `latitude` and `longitude`

**Example:**

```json
{
  "pickup": {
    "latitude": 40.7580,
    "longitude": -73.9855
  },
  "dropoff": {
    "latitude": 40.7489,
    "longitude": -73.9680
  }
}
```

**Response:**
Returns a list of available ride options with:

- Price estimates
- ETA information
- Product details (UberX, UberBlack, etc.)
- Trip distance and duration
- Fare breakdown

### 2. create_ride_request

Create a new ride request for a guest user.

**Parameters:**

- `guest` (required): Object with guest information
  - `first_name` (required): Guest's first name
  - `last_name` (required): Guest's last name
  - `phone_number` (required): Guest's phone number with country code
  - `email` (optional): Guest's email address
  - `locale` (optional): Guest's locale (default: "en")
- `pickup` (required): Object with `latitude` and `longitude`
- `dropoff` (required): Object with `latitude` and `longitude`
- `product_id` (required): Uber product ID (from estimates response)
- `fare_id` (optional): Fare ID from the estimates response
- `note_for_driver` (optional): Special instructions for the driver
- `expense_memo` (optional): Expense memo for business tracking

**Example:**

```json
{
  "guest": {
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+12125551234",
    "email": "john.doe@example.com"
  },
  "pickup": {
    "latitude": 40.7580,
    "longitude": -73.9855
  },
  "dropoff": {
    "latitude": 40.7489,
    "longitude": -73.9680
  },
  "product_id": "b8e5c464-5de2-4539-a35a-986d6e58f186",
  "note_for_driver": "Please call when you arrive"
}
```

**Response:**
Returns:

- Request ID (for tracking the ride)
- ETA
- Product ID
- Status
- Guest information with generated guest_id

### 3. get_ride_details

Get detailed information about an existing ride request.

**Parameters:**

- `request_id` (required): UUID of the ride request

**Example:**

```json
{
  "request_id": "f3a604eb-8b90-4068-932c-13d6a5002f86"
}
```

**Response:**
Returns comprehensive ride details including:

- Request status
- Driver information (name, phone, rating, picture)
- Vehicle details (make, model, license plate, color)
- Pickup and dropoff locations with addresses
- Current location
- Rider tracking URL
- ETA information
- Notes and expense memo

## MCP Specification Compliance

This server follows the Model Context Protocol specification:

- **Transport**: Uses stdio transport for communication
- **Tools**: Implements the `tools/list` and `tools/call` capabilities
- **Error Handling**: Returns structured error responses with error codes
- **Schema Validation**: Uses JSON Schema for input validation
- **Content Types**: Returns results as text content type with JSON formatting

## Development

### Testing Locally

You can test the server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node index.js
```

This will open a web interface where you can test the tools interactively.

### Extending the Server

To add new tools or modify existing ones:

1. Add the tool definition to the `ListToolsRequestSchema` handler
2. Implement the tool logic in the `CallToolRequestSchema` handler
3. Ensure proper error handling and validation

## License

MIT
