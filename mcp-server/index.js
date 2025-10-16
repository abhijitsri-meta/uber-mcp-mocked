#!/usr/bin/env node

import { createServer } from 'node:http';
import { URL } from 'node:url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

function safeStringify(obj, space = 2) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, space);
}

async function callAPI(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

function createUberMcpServer() {
  const server = new Server(
    {
      name: 'uber-ride-booking-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
      },
    }
  );

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: 'book_ride_workflow',
          description: 'Standard workflow for booking an Uber ride with user selection',
          arguments: [],
        },
      ],
    };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name } = request.params;

    if (name === 'book_ride_workflow') {
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `When booking a ride, follow this workflow:
1. ALWAYS call get_ride_estimates first with pickup and dropoff locations
2. Present all available ride options to the user with pricing and ETA details
3. WAIT for the user to explicitly select which ride option they prefer
4. Only after user selection, call create_ride_request with the chosen product_id

NEVER skip step 3 - user confirmation is mandatory before booking.`,
            },
          },
        ],
      };
    }

    throw new Error(`Unknown prompt: ${name}`);
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'get_ride_estimates',
          description: 'Get price and time estimates for available Uber products between two locations. Returns a list of available ride options with pricing, ETA, and product details. REQUIRED FIRST STEP: Always call this tool first and present the options to the user for selection before booking any ride.',
          inputSchema: {
            type: 'object',
            properties: {
              pickup: {
                type: 'object',
                description: 'Pickup location coordinates',
                properties: {
                  latitude: {
                    type: 'number',
                    description: 'Pickup latitude coordinate',
                  },
                  longitude: {
                    type: 'number',
                    description: 'Pickup longitude coordinate',
                  },
                },
                required: ['latitude', 'longitude'],
              },
              dropoff: {
                type: 'object',
                description: 'Dropoff location coordinates',
                properties: {
                  latitude: {
                    type: 'number',
                    description: 'Dropoff latitude coordinate',
                  },
                  longitude: {
                    type: 'number',
                    description: 'Dropoff longitude coordinate',
                  },
                },
                required: ['latitude', 'longitude'],
              },
            },
            required: ['pickup', 'dropoff'],
          },
        },
        {
          name: 'create_ride_request',
          description: 'Create a new ride request for a guest. Books an Uber ride on behalf of a guest user with specified pickup and dropoff locations. Returns ride details including request ID, and ETA. IMPORTANT: Only call this tool AFTER the user has explicitly selected a ride option from the get_ride_estimates results. Never call this tool without prior user confirmation of their choice.',
          inputSchema: {
            type: 'object',
            properties: {
              pickup: {
                type: 'object',
                description: 'Pickup location coordinates',
                properties: {
                  latitude: {
                    type: 'number',
                    description: 'Pickup latitude coordinate',
                  },
                  longitude: {
                    type: 'number',
                    description: 'Pickup longitude coordinate',
                  },
                },
                required: ['latitude', 'longitude'],
              },
              dropoff: {
                type: 'object',
                description: 'Dropoff location coordinates',
                properties: {
                  latitude: {
                    type: 'number',
                    description: 'Dropoff latitude coordinate',
                  },
                  longitude: {
                    type: 'number',
                    description: 'Dropoff longitude coordinate',
                  },
                },
                required: ['latitude', 'longitude'],
              },
              product_id: {
                type: 'string',
                description: 'Uber product ID (e.g., UberX, UberBlack product ID from estimates)',
              },
              fare_id: {
                type: 'string',
                description: 'Fare ID from the estimates response (optional)',
              },
            },
            required: ['pickup', 'dropoff', 'product_id'],
          },
        },
        {
          name: 'get_ride_details',
          description: 'Get detailed information about an existing ride request. Returns comprehensive ride details including driver info, vehicle details, pickup/dropoff locations, and current status.',
          inputSchema: {
            type: 'object',
            properties: {
              request_id: {
                type: 'string',
                description: 'The UUID of the ride request to retrieve',
              },
            },
            required: ['request_id'],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'get_ride_estimates': {
          const { pickup, dropoff } = args;

          const response = await callAPI('/guests/trips/estimates', 'POST', {
            pickup,
            dropoff,
          });

          return {
            content: [
              {
                type: 'text',
                text: safeStringify(response),
              },
            ],
          };
        }

        case 'create_ride_request': {
          const { pickup, dropoff, product_id, fare_id } = args;

          const testGuest = {
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '+10000000000',
            email: 'guest@example.com',
            locale: 'en',
          };

          const response = await callAPI('/guests/trips', 'POST', {
            guest: testGuest,
            pickup,
            dropoff,
            product_id,
            fare_id,
            note_for_driver: '',
            expense_memo: '',
          });

          return {
            content: [
              {
                type: 'text',
                text: safeStringify(response),
              },
            ],
          };
        }

        case 'get_ride_details': {
          const { request_id } = args;

          const response = await callAPI(`/guests/trips/${request_id}`, 'GET');

          return {
            content: [
              {
                type: 'text',
                text: safeStringify(response),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: safeStringify({
              error: error.message || String(error),
              code: 'tool_execution_error',
            }),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

const sessions = new Map();

const ssePath = '/mcp';
const postPath = '/mcp/messages';

async function handleSseRequest(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const server = createUberMcpServer();
  const transport = new SSEServerTransport(postPath, res);
  const sessionId = transport.sessionId;

  sessions.set(sessionId, { server, transport });

  let isClosing = false;

  transport.onclose = async () => {
    if (isClosing) return;
    isClosing = true;

    try {
      sessions.delete(sessionId);
      await server.close();
      console.log(`Session closed: ${sessionId}`);
    } catch (error) {
      console.error(`Error closing session ${sessionId}:`, error.message);
    }
  };

  transport.onerror = (error) => {
    console.error('SSE transport error:', error?.message || error);
  };

  try {
    await server.connect(transport);
    console.log(`New SSE session started: ${sessionId}`);
  } catch (error) {
    isClosing = true;
    sessions.delete(sessionId);
    console.error('Failed to start SSE session:', error?.message || error);
    if (!res.headersSent) {
      res.writeHead(500).end('Failed to establish SSE connection');
    }
  }
}

async function handlePostMessage(req, res, url) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    res.writeHead(400).end('Missing sessionId query parameter');
    return;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    res.writeHead(404).end('Unknown session');
    return;
  }

  try {
    await session.transport.handlePostMessage(req, res);
  } catch (error) {
    console.error('Failed to process message', error);
    if (!res.headersSent) {
      res.writeHead(500).end('Failed to process message');
    }
  }
}

const portEnv = Number(process.env.MCP_PORT || process.env.PORT || 8000);
const port = Number.isFinite(portEnv) ? portEnv : 8000;

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end('Missing URL');
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'OPTIONS' && (url.pathname === ssePath || url.pathname === postPath)) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === ssePath) {
    await handleSseRequest(res);
    return;
  }

  if (req.method === 'POST' && url.pathname === postPath) {
    await handlePostMessage(req, res, url);
    return;
  }

  res.writeHead(404).end('Not Found');
});

httpServer.on('clientError', (err, socket) => {
  console.error('HTTP client error:', err?.message || 'Unknown error');
  if (socket.writable) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }
});

httpServer.listen(port, () => {
  console.log(`Uber MCP Server (SSE) listening on http://localhost:${port}`);
  console.log(`  SSE stream: GET http://localhost:${port}${ssePath}`);
  console.log(`  Message endpoint: POST http://localhost:${port}${postPath}?sessionId=...`);
  console.log(`  Backend API: ${API_BASE_URL}`);
  console.log(`\nActive sessions: 0`);
});

setInterval(() => {
  if (sessions.size > 0) {
    console.log(`Active sessions: ${sessions.size}`);
  }
}, 30000);
