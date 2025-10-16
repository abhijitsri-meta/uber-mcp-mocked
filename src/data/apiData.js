export const apiEndpoints = [
  {
    id: 'get-trip-estimates',
    method: 'POST',
    endpoint: '/api/guests/trips/estimates',
    description: 'Retrieve fare and time estimates for a potential trip. This endpoint provides pricing information, ETAs, and available vehicle options for a given pickup and dropoff location.',
    requestPayload: {
      pickup: {
        latitude: 40.7484,
        longitude: -73.9857
      },
      dropoff: {
        latitude: 40.750568,
        longitude: -73.993519
      }
    },
    responsePayload: {
      etas_unavailable: false,
      fares_unavailable: false,
      product_estimates: [
        {
          estimate_info: {
            fare: {
              currency_code: 'USD',
              display: '$11.96',
              expires_at: 1558147984,
              fare_breakdown: [
                {
                  name: 'Base Fare',
                  type: 'base_fare',
                  value: 11.96
                }
              ],
              fare_id: '6e642142-27b8-49df-82e0-3d4a8633e79d',
              value: 11.96
            },
            fare_id: '6e642142-27b8-49df-82e0-3d4a8633e79d',
            pickup_estimate: 4,
            trip: {
              distance_estimate: 0.44,
              distance_unit: 'mile',
              duration_estimate: 927,
              travel_distance_estimate: 0.45
            }
          },
          product: {
            advance_booking_type: 'SCHEDULED',
            capacity: 4,
            description: 'Affordable rides, all to yourself',
            display_name: 'UberX',
            product_group: 'uberx',
            product_id: 'b8e5c464-5de2-4539-a35a-986d6e58f186',
            scheduling_enabled: true,
            shared: false,
            upfront_fare_enabled: true
          },
          fulfillment_indicator: 'GREEN'
        },
        {
          estimate_info: {
            fare: {
              currency_code: 'USD',
              display: '$28.00',
              expires_at: 1574718553,
              fare_breakdown: [
                {
                  name: 'Base Fare',
                  type: 'base_fare',
                  value: 28
                }
              ],
              fare_id: 'bbdce077-4088-449e-a898-a34df5c293c4',
              value: 28
            },
            fare_id: 'bbdce077-4088-449e-a898-a34df5c293c4',
            no_cars_available: false,
            trip: {
              distance_estimate: 0.44,
              distance_unit: 'mile',
              duration_estimate: 1126,
              travel_distance_estimate: 0.45
            }
          },
          product: {
            advance_booking_type: 'RESERVE',
            capacity: 4,
            description: 'Premium rides in luxury cars',
            display_name: 'Black',
            product_group: 'uberblack',
            product_id: '0e9d8dd3-ffec-4c2b-9714-537e6174bb88',
            scheduling_enabled: true,
            shared: false,
            upfront_fare_enabled: true
          },
          fulfillment_indicator: 'GREEN'
        }
      ]
    }
  },
  {
    id: 'create-guest-trip',
    method: 'POST',
    endpoint: '/api/guests/trips',
    description: 'Create a new trip for a guest user. This endpoint initiates a ride request with guest information, pickup/dropoff locations, and optional parameters like fare_id and policy_uuid.',
    requestPayload: {
      guest: {
        first_name: 'Alex',
        last_name: 'Smith',
        phone_number: '+14155550123',
        locale: 'en'
      },
      pickup: {
        latitude: 37.7673292,
        longitude: -122.3886371
      },
      dropoff: {
        latitude: 37.7830104,
        longitude: -122.4335835
      },
      product_id: 'bd12e2d9-4ee5-4a61-bbd6-48a2b2aa4c4f',
      fare_id: 'f97d4081-42de-4eba-944e-7ce399785984',
      policy_uuid: 'b1aea847-64fb-4f50-b719-ad6d452f437c',
      expense_code: 'Code_1234',
      expense_memo: 'Client Trip',
      sender_display_name: 'Amazing Company',
      note_for_driver: 'The rider will be waiting on the corner',
      call_enabled: true,
      communication_channel: 'WHATSAPP'
    },
    responsePayload: {
      eta: 12,
      request_id: 'da790cea-31b4-4131-8cd9-7adb1c06db99',
      product_id: 'b8e5c464-5de2-4539-a35a-986d6e58f186',
      status: 'processing',
      surge_multiplier: 1,
      guest: {
        guest_id: 'd49c5b20-81ea-537e-907e-9c4b1321fc72',
        first_name: 'Alex',
        last_name: 'Smith',
        phone_number: '+14155550123',
        email: 'alex.smith@aol.com',
        locale: 'en'
      }
    }
  },
  {
    id: 'get-trip-details',
    method: 'GET',
    endpoint: '/api/guests/trips/:request_id',
    description: 'Retrieve detailed information about an existing trip using the request ID. This endpoint returns comprehensive trip details including driver information, vehicle details, current location, and trip status.',
    requestPayload: null,
    responsePayload: {
      request_id: 'da790cea-31b4-4131-8cd9-7adb1c06db99',
      status: 'accepted',
      requester_name: 'David Example',
      requester_uuid: 'f3a604eb-8b90-4068-932c-13d6a5002f86',
      request_time: 1564758590788,
      surge_multiplier: 1,
      rider_tracking_url: 'https://trip.uber.com/d8lVg6Sx9H',
      driver: {
        id: '42d53206-d8ba-5d5e-9f9b-c9e4a33d3a4c',
        name: 'Joe',
        phone_number: '+11234567891',
        sms_number: '+11234567891',
        rating: 4.9,
        regulatory_info: 'Licensed by TfL, PHL 123456789'
      },
      vehicle: {
        license_plate: 'ABC1234',
        make: 'Oldsmobile',
        model: 'Intrigue',
        vehicle_color_name: 'white'
      },
      product: {
        display_name: 'UberX',
        product_id: 'b8e5c464-5de2-4539-a35a-986d6e58f186'
      },
      pickup: {
        address: 'Lincoln Square, New York, NY',
        eta: 1,
        latitude: 40.77417690000001,
        longitude: -73.98491179999999,
        title: 'Lincoln Square',
        subtitle: 'New York, NY',
        timezone: 'America/New_York'
      },
      destination: {
        address: 'Bryant Park, New York, NY 10018',
        eta: 18,
        latitude: 40.7535965,
        longitude: -73.9832326,
        title: 'Bryant Park',
        subtitle: 'New York, NY 10018',
        timezone: 'America/New_York'
      },
      location: {
        bearing: 0,
        latitude: 40.775573965137674,
        longitude: -73.98604690473967
      },
      note_for_driver: 'Example note to driver',
      expense_memo: 'Memo note example',
      communication_channel: 'WHATSAPP'
    }
  }
];
