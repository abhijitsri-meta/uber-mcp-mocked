import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const MCP_SERVER_URL = process.env.MCP_TEST_URL || 'http://localhost:8000/mcp';

async function testServer() {
  console.log('Testing Uber Ride Booking MCP Server (SSE)...');
  console.log(`Connecting to: ${MCP_SERVER_URL}\n`);

  const transport = new SSEClientTransport(new URL(MCP_SERVER_URL));

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
    const estimatesPreview = estimatesResult.content[0].text.substring(0, 150);
    console.log(`  Response: ${estimatesPreview}...\n`);

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
    const createPreview = createResult.content[0].text.substring(0, 150);
    console.log(`  Response: ${createPreview}...\n`);

    console.log('Testing get_ride_details...');
    const detailsResult = await client.callTool({
      name: 'get_ride_details',
      arguments: {
        request_id: 'f3a604eb-8b90-4068-932c-13d6a5002f86',
      },
    });
    console.log('✓ get_ride_details succeeded');
    const detailsPreview = detailsResult.content[0].text.substring(0, 150);
    console.log(`  Response: ${detailsPreview}...\n`);

    console.log('✓ All tests passed!');

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    console.error('\nMake sure:');
    console.error('1. The MCP server is running: npm start');
    console.error('2. The backend API is running on port 3001');
    console.error(`3. The MCP server URL is correct: ${MCP_SERVER_URL}`);
    process.exit(1);
  }
}

testServer();
