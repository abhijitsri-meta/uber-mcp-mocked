#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

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

const server = new Server(
  {
    name: 'uber-ride-booking-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_ride_estimates',
        description: 'Get price and time estimates for available Uber products between two locations. Returns a list of available ride options with pricing, ETA, and product details.',
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
        description: 'Create a new ride request for a guest. Books an Uber ride on behalf of a guest user with specified pickup and dropoff locations. Returns ride details including request ID, ETA, and guest information.',
        inputSchema: {
          type: 'object',
          properties: {
            guest: {
              type: 'object',
              description: 'Guest rider information',
              properties: {
                first_name: {
                  type: 'string',
                  description: 'Guest first name',
                },
                last_name: {
                  type: 'string',
                  description: 'Guest last name',
                },
                phone_number: {
                  type: 'string',
                  description: 'Guest phone number with country code (e.g., +12125551234)',
                },
                email: {
                  type: 'string',
                  description: 'Guest email address (optional)',
                },
                locale: {
                  type: 'string',
                  description: 'Guest locale (default: en)',
                },
              },
              required: ['first_name', 'last_name', 'phone_number'],
            },
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
            note_for_driver: {
              type: 'string',
              description: 'Special instructions or notes for the driver (optional)',
            },
            expense_memo: {
              type: 'string',
              description: 'Expense memo for business tracking (optional)',
            },
          },
          required: ['guest', 'pickup', 'dropoff', 'product_id'],
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
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case 'create_ride_request': {
        const { guest, pickup, dropoff, product_id, fare_id, note_for_driver, expense_memo } = args;

        const response = await callAPI('/guests/trips', 'POST', {
          guest,
          pickup,
          dropoff,
          product_id,
          fare_id,
          note_for_driver,
          expense_memo,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
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
              text: JSON.stringify(response, null, 2),
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
          text: JSON.stringify({
            error: error.message,
            code: 'tool_execution_error',
          }),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Uber Ride Booking MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
