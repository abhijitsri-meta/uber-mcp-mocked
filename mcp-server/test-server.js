import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testServer() {
  console.log('Testing Uber Ride Booking MCP Server...\n');

  const transport = new StdioClientTransport({
    command: 'node',
    args: ['index.js'],
  });

  const client = new Client({
    name: 'test-client',
    version: '1.0.0',
  }, {
    capabilities: {},
  });

  try {
    await client.connect(transport);
    console.log('✓ Connected to MCP server\n');

    const toolsList = await client.listTools();
    console.log(`✓ Found ${toolsList.tools.length} tools:`);
    toolsList.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    console.log('Testing get_ride_estimates...');
    const estimatesResult = await client.callTool({
      name: 'get_ride_estimates',
      arguments: {
        pickup: {
          latitude: 40.7580,
          longitude: -73.9855,
        },
        dropoff: {
          latitude: 40.7489,
          longitude: -73.9680,
        },
      },
    });
    console.log('✓ get_ride_estimates succeeded');
    console.log(`  Response: ${estimatesResult.content[0].text.substring(0, 100)}...\n`);

    console.log('Testing create_ride_request...');
    const createResult = await client.callTool({
      name: 'create_ride_request',
      arguments: {
        guest: {
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '+12125551234',
        },
        pickup: {
          latitude: 40.7580,
          longitude: -73.9855,
        },
        dropoff: {
          latitude: 40.7489,
          longitude: -73.9680,
        },
        product_id: 'b8e5c464-5de2-4539-a35a-986d6e58f186',
      },
    });
    console.log('✓ create_ride_request succeeded');
    console.log(`  Response: ${createResult.content[0].text.substring(0, 100)}...\n`);

    console.log('Testing get_ride_details...');
    const detailsResult = await client.callTool({
      name: 'get_ride_details',
      arguments: {
        request_id: 'f3a604eb-8b90-4068-932c-13d6a5002f86',
      },
    });
    console.log('✓ get_ride_details succeeded');
    console.log(`  Response: ${detailsResult.content[0].text.substring(0, 100)}...\n`);

    console.log('✓ All tests passed!');

    await client.close();
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
}

testServer();
