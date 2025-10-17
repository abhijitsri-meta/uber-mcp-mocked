import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fg from 'fast-glob'

// Auto-discover widget entry points
function buildWidgetInputs() {
  const files = fg.sync('src/widgets/**/index.{tsx,jsx}', { dot: false });
  return Object.fromEntries(
    files.map((f) => [path.basename(path.dirname(f)), path.resolve(f)])
  );
}

// Custom plugin to create dev endpoints for each widget
function widgetDevEndpoints(options) {
  const { entries } = options;

  const renderWidgetsHtml = (names) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Uber MCP Widgets</title>
  <style>
    body { font: 16px/1.6 system-ui, sans-serif; margin: 40px; color: #1f2933; max-width: 800px; }
    h1 { font-size: 28px; margin-bottom: 8px; color: #000; }
    p { color: #666; margin-bottom: 24px; }
    ul { padding-left: 0; list-style: none; }
    li { margin-bottom: 12px; }
    a {
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    a:hover { text-decoration: underline; }
    code {
      font-family: ui-monospace, monospace;
      font-size: 13px;
      color: #64748b;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .emoji { font-size: 20px; }
  </style>
</head>
<body>
  <h1>🚗 Uber MCP Widgets</h1>
  <p>Development server for testing widgets locally</p>
  <ul>
    ${names
      .map(
        (name) =>
          `<li><span class="emoji">🎨</span> <a href="/${name}.html">${name}</a> <code>/${name}.html</code></li>`
      )
      .join('\n    ')}
  </ul>
</body>
</html>`;

  const renderDevHtml = (name) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${name} Widget</title>
  <script type="module" src="/@vite/client"></script>
  <script type="module">
    import RefreshRuntime from "/@react-refresh";

    if (!window.__vite_plugin_react_preamble_installed__) {
      RefreshRuntime.injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      window.__vite_plugin_react_preamble_installed__ = true;
    }
  </script>
  <script type="module">
    import '${entries[name]}';
  </script>
</head>
<body>
  <div id="${name}-root"></div>
</body>
</html>`;

  return {
    name: 'widget-dev-endpoints',
    configureServer(server) {
      const names = Object.keys(entries);
      const list = names.map((n) => `  /${n}.html`).join('\n');
      server.config.logger.info(`\n📦 Widget dev endpoints:\n${list}\n`);

      server.middlewares.use((req, res, next) => {
        try {
          if (req.method !== 'GET' || !req.url) return next();

          const url = req.url.split('?')[0];

          // Index page
          if (url === '/widgets') {
            const html = renderWidgetsHtml(names);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(html);
            return;
          }

          // Widget pages
          if (!url.endsWith('.html')) return next();

          const match = url.match(/^\/?([\w-]+)\.html$/);
          if (!match) return next();

          const name = match[1];
          if (!entries[name]) return next();

          const html = renderDevHtml(name);
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
          return;
        } catch (err) {
          // fall through
        }
        next();
      });
    },
  };
}

const inputs = buildWidgetInputs();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    widgetDevEndpoints({ entries: inputs })
  ],
  server: {
    port: 4444,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    outDir: 'mcp-server/widget-assets',
    assetsDir: '.',
    rollupOptions: {
      input: inputs,
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})
