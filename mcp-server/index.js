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
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListResourceTemplatesRequestSchema,
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

// Widget configuration for UI rendering
// Following the pizzaz pattern: reference pre-built assets
const rideEstimatesWidget = {
  id: 'ride-estimates',
  title: 'Ride Estimates',
  templateUri: 'ui://widget/ride-estimates.html',
  invoking: 'Loading ride estimates',
  invoked: 'Loaded ride estimates',
  html: `
<div id="ride-estimate-root"></div>
<script type="module" src="http://localhost:3000/ride-estimate.js"></script>
  `.trim(),
  responseText: 'Rendered ride estimates widget!'
};

function widgetMeta(widget) {
  return {
    'openai/outputTemplate': widget.templateUri,
    'openai/toolInvocation/invoking': widget.invoking,
    'openai/toolInvocation/invoked': widget.invoked,
    'openai/widgetAccessible': true,
    'openai/resultCanProduceWidget': true
  };
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
        resources: {},
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

  // Add resource handlers for UI widget
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: rideEstimatesWidget.templateUri,
          name: rideEstimatesWidget.title,
          description: `${rideEstimatesWidget.title} widget markup`,
          mimeType: 'text/html+skybridge',
          _meta: widgetMeta(rideEstimatesWidget)
        }
      ]
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === rideEstimatesWidget.templateUri) {
      return {
        contents: [
          {
            uri: rideEstimatesWidget.templateUri,
            mimeType: 'text/html+skybridge',
            text: rideEstimatesWidget.html,
            _meta: widgetMeta(rideEstimatesWidget)
          }
        ]
      };
    }
    throw new Error(`Unknown resource: ${request.params.uri}`);
  });

  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
    return {
      resourceTemplates: [
        {
          uriTemplate: rideEstimatesWidget.templateUri,
          name: rideEstimatesWidget.title,
          description: `${rideEstimatesWidget.title} widget markup`,
          mimeType: 'text/html+skybridge',
          _meta: widgetMeta(rideEstimatesWidget)
        }
      ]
    };
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
          _meta: widgetMeta(rideEstimatesWidget),
        },
        {
          name: 'create_ride_request',
          description: 'Create an IMMEDIATE ride request for a guest (not scheduled). Books an Uber ride NOW on behalf of a guest user with specified pickup and dropoff locations. Returns ride details including request ID, and ETA. IMPORTANT: Only call this tool AFTER the user has explicitly selected a ride option from the get_ride_estimates results. Never call this tool without prior user confirmation of their choice. This tool only supports immediate pickup - scheduling rides for later is NOT supported.',
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
    const startTime = Date.now();

    console.log('\n=== Tool Call Started ===');
    console.log(`Tool Name: ${name}`);
    console.log(`Request Arguments: ${safeStringify(args)}`);

    try {
      let response;
      switch (name) {
        case 'get_ride_estimates': {
          const { pickup, dropoff } = args;

          response = await callAPI('/guests/trips/estimates', 'POST', {
            pickup,
            dropoff,
          });

          break;
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

          response = await callAPI('/guests/trips', 'POST', {
            guest: testGuest,
            pickup,
            dropoff,
            product_id,
            fare_id,
            note_for_driver: '',
            expense_memo: '',
          });

          break;
        }

        case 'get_ride_details': {
          const { request_id } = args;

          response = await callAPI(`/guests/trips/${request_id}`, 'GET');

          break;
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      const duration = Date.now() - startTime;
      console.log(`Response: ${safeStringify(response)}`);
      console.log(`Status: SUCCESS`);
      console.log(`Duration: ${duration}ms`);
      console.log('=== Tool Call Completed ===\n');

      if (name === 'get_ride_estimates') {
        return {
          content: [
            {
              type: 'text',
              text: safeStringify(response),
            },
          ],
          _meta: widgetMeta(rideEstimatesWidget),
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: safeStringify(response),
            },
          ],
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`Error: ${error.message || String(error)}`);
      console.log(`Status: FAILED`);
      console.log(`Duration: ${duration}ms`);
      console.log('=== Tool Call Failed ===\n');

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
