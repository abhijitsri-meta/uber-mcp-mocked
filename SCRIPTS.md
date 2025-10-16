# NPM Scripts Guide

Quick reference for all available npm scripts in this project.

## 🚀 Main Development Scripts

### `npm run dev` ⭐ (Recommended for normal development)

Runs the frontend and backend together.

```bash
npm run dev
```

**Starts:**
- ✅ React Frontend (Vite) on <http://localhost:5173>
- ✅ Express Backend API on <http://localhost:3001>

**Use when:** Building the web application

---

### `npm run dev:all` 🔍 (For testing everything)

Runs frontend, backend, AND MCP server with inspector.

```bash
npm run dev:all
```

**Starts:**
- ✅ React Frontend (Vite) on <http://localhost:5173>
- ✅ Express Backend API on <http://localhost:3001>
- ✅ MCP Inspector (opens in browser for testing MCP tools)

**Use when:** You want to test the MCP server alongside your web app

**Important:** You DON'T need this for Claude Desktop - Claude automatically starts the MCP server!

---

## 🎯 Individual Service Scripts

### `npm run client`

Runs ONLY the React frontend.

```bash
npm run client
```

---

### `npm run server`

Runs ONLY the Express backend.

```bash
npm run server
```

---

### `npm run mcp:inspect`

Runs ONLY the MCP server with the Inspector UI.

```bash
npm run mcp:inspect
```

Opens a web interface to test MCP tools interactively.

---

### `npm run mcp:test`

Tests the MCP server to ensure all tools work.

```bash
npm run mcp:test
```

**Output:**
```
✓ Connected to MCP server
✓ Found 3 tools
✓ get_ride_estimates succeeded
✓ create_ride_request succeeded
✓ get_ride_details succeeded
✓ All tests passed!
```

---

## 🏗️ Build Scripts

### `npm run build`

Creates a production build of the frontend.

```bash
npm run build
```

Output goes to `dist/` directory.

---

### `npm run preview`

Preview the production build locally.

```bash
npm run preview
```

---

## 🧹 Code Quality

### `npm run lint`

Run ESLint to check code quality.

```bash
npm run lint
```

---

## 📊 Decision Matrix

| What do you want to do? | Command to run |
|-------------------------|---------------|
| Work on the web app | `npm run dev` |
| Test all services together | `npm run dev:all` |
| Use with Claude Desktop | (No command - Claude starts it automatically) |
| Test MCP tools manually | `npm run mcp:inspect` |
| Verify MCP server works | `npm run mcp:test` |
| Frontend development only | `npm run client` |
| Backend development only | `npm run server` |
| Build for production | `npm run build` |

---

## 🤔 Common Questions

### Q: Do I need to run the MCP server manually to use Claude Desktop?

**A:** No! Claude Desktop automatically starts and stops the MCP server when needed. You only run it manually for testing/debugging.

### Q: When should I use `npm run dev:all`?

**A:** When you want to test the MCP tools in the browser while also having your web app running. The MCP Inspector gives you a UI to test tools without using Claude Desktop.

### Q: Can the Express API and MCP server run at the same time?

**A:** Yes! In fact, **the MCP server requires the Express API to be running** because:
- **Express API**: Contains the business logic and returns actual data
- **MCP Server**: Calls the Express API endpoints and formats responses for AI assistants

The MCP server acts as a **proxy/adapter** between AI assistants and your Express API.

### Q: Why does the MCP server need the Express API?

**A:** The MCP server doesn't duplicate logic - it calls your existing Express API endpoints. This means:
- ✅ Single source of truth (business logic lives in one place)
- ✅ Easy to maintain (changes to API automatically apply to MCP)
- ✅ DRY principle (don't repeat yourself)
