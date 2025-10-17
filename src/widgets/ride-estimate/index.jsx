import React from 'react';
import { createRoot } from 'react-dom/client';

function RideEstimates() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#000', fontSize: '24px', marginBottom: '16px' }}>
        Hello World
      </h1>
      <p style={{ color: '#666', fontSize: '16px' }}>
        This is a simple React component rendered from the Uber MCP server!
      </p>
    </div>
  );
}

// Wait for DOM to be ready before mounting
const rootElement = document.getElementById('ride-estimate-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<RideEstimates />);
} else {
  console.error('Root element #ride-estimate-root not found');
}
