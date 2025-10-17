# Widgets Guide

## 1. Architecture

```
┌─────────────────────────────────────────────────────────┐
│ ChatGPT                                                 │
│                                                         │
│  1. Calls get_ride_estimates tool                      │
│  2. Receives response with _meta field                 │
│  3. Reads widget resource (HTML template)              │
│  4. Loads http://localhost:8000/widgets/ride-estimate.js│
│  5. Renders widget UI                                  │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────┐
│ MCP Server (port 8000)                                  │
│                                                         │
│  - Handles tool calls                                  │
│  - Returns widget metadata with _meta field            │
│  - Serves widget HTML template                         │
│  - Serves built widget assets at /widgets/*            │
└─────────────────────────────────────────────────────────┘
```

### Key Components

- **Widget Source**: `/src/widgets/{widget-name}/index.jsx` - React components
- **Build Output**: `/mcp-server/widget-assets/{widget-name}.js` - Built bundles
- **MCP Server**: Serves both MCP protocol and widget assets
- **Widget ID**: Must match directory name (e.g., `ride-estimate-root`)

## 2. Setup Instructions

### Install Dependencies

```bash
npm install
cd mcp-server && npm install && cd ..
```

### Build Widgets for Production

```bash
npm run build:widgets
```

This creates optimized bundles in `/mcp-server/widget-assets/`.

### Start MCP Server (Production)

```bash
cd mcp-server
npm start

OR just run,
npm run dev:all (which will start the mcp server also)
```

The MCP server will:

- Listen on `http://localhost:8000/mcp` for ChatGPT
- Serve widget assets at `http://localhost:8000/widgets/*`

Connect ChatGPT to `http://localhost:8000/mcp` and test!

### Running on Remote Servers

When deploying to a remote server (e.g., Codespaces, cloud VMs), you need to configure the public URL:

```bash
# Set the public URL environment variable
export MCP_PUBLIC_URL=https://your-server.com:8000

# Start the MCP server
cd mcp-server
npm start
```

**Important**: Do NOT include a trailing slash in the URL. The server automatically removes it to prevent double-slash issues.

#### Widget Asset Serving & CORS

The MCP server now serves widget assets directly at `/widget-assets/*` with proper CORS headers:

- **Built widgets**: Located in `/mcp-server/widget-assets/`
- **Asset endpoint**: `${MCP_PUBLIC_URL}/widget-assets/ride-estimate.js`
- **CORS support**: Handles both OPTIONS (preflight) and GET requests with `Access-Control-Allow-Origin: *`
- **Absolute URLs**: Widget HTML uses `${MCP_PUBLIC_URL}` to generate absolute URLs that work across domains

This ensures widgets load correctly when:

- Running on remote servers (Codespaces, cloud VMs, etc.)
- Accessed from ChatGPT's sandboxed iframes
- Cross-origin requests are required

The server configuration:

- Automatically strips trailing slashes from `MCP_PUBLIC_URL`
- Serves widget assets with proper MIME types
- Includes CORS headers on all widget asset responses
- Handles CORS preflight (OPTIONS) requests

## 3. Testing Locally

### Quick Development Testing

```bash
npm run dev:all
```

Then open **<http://localhost:4444/widgets>** to see all available widgets.

This starts Vite's dev server with:

- ⚡ **Hot Module Replacement** - Instant updates
- 🎨 **Widget Index** - Lists all widgets at `/widgets`
- 🔥 **No Build Step** - Changes reflect immediately

### Development Workflow

```bash
# Terminal: Start dev server
npm run dev:widgets

# Browser: Open http://localhost:4444/widgets
# Click on any widget to test

# Editor: Edit src/widgets/ride-estimate/index.jsx
# Browser: Hot reload - changes appear instantly!
```

### Adding New Widgets

1. Create new directory: `/src/widgets/my-new-widget/`
2. Add entry point: `/src/widgets/my-new-widget/index.jsx`
3. Use correct root element:

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

function MyWidget() {
  return <div>My New Widget</div>;
}

// Root ID must match directory name + '-root'
const root = createRoot(document.getElementById('my-new-widget-root'));
root.render(<MyWidget />);
```

**That's it!** The widget is automatically discovered by Vite (via `vite.config.js`'s `buildWidgetInputs()` function). No manual configuration needed - just refresh <http://localhost:4444/widgets> and your new widget will appear in the list!

### Widget Auto-Discovery

The `vite.config.js` file automatically discovers all widgets:

```javascript
function buildWidgetInputs() {
  const files = fg.sync('src/widgets/**/index.{tsx,jsx}', { dot: false });
  return Object.fromEntries(
    files.map((f) => [path.basename(path.dirname(f)), path.resolve(f)])
  );
}
```

Any directory in `/src/widgets/` with an `index.jsx` or `index.tsx` file is automatically:

- ✅ Added to the dev server
- ✅ Available for building
- ✅ Listed at <http://localhost:4444/widgets>

**No manual configuration required!**
