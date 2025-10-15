import express from 'express';
import estimatesRouter from './trips/estimates.js';

const router = express.Router();

router.use('/estimates', estimatesRouter);

router.post('/', (req, res) => {
  const {
    guest,
    pickup,
    dropoff,
    product_id,
    fare_id,
    policy_uuid,
    expense_code,
    expense_memo,
    sender_display_name,
    note_for_driver,
    call_enabled,
    contacts_to_notify,
    stops,
    additional_guests,
    communication_channel
  } = req.body;

  if (!guest || !guest.first_name || !guest.last_name || !guest.phone_number) {
    return res.status(400).json({
      message: 'Guest information with first_name, last_name, and phone_number is required',
      metadata: {
        statusCode: '400'
      },
      code: 'invalid_request_parameters'
    });
  }

  if (!pickup || !pickup.latitude || !pickup.longitude) {
    return res.status(400).json({
      message: 'Pickup location with latitude and longitude is required',
      metadata: {
        statusCode: '400'
      },
      code: 'invalid_request_parameters'
    });
  }

  if (!dropoff || !dropoff.latitude || !dropoff.longitude) {
    return res.status(400).json({
      message: 'Dropoff location with latitude and longitude is required',
      metadata: {
        statusCode: '400'
      },
      code: 'invalid_request_parameters'
    });
  }

  if (!product_id) {
    return res.status(400).json({
      message: 'Product ID is required',
      metadata: {
        statusCode: '400'
      },
      code: 'invalid_request_parameters'
    });
  }

  const response = {
    eta: 12,
    request_id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    product_id: product_id,
    status: 'processing',
    surge_multiplier: 1,
    guest: {
      guest_id: `${Math.random().toString(36).substring(2, 9)}-${Date.now()}`,
      first_name: guest.first_name,
      last_name: guest.last_name,
      phone_number: guest.phone_number,
      email: guest.email || `${guest.first_name.toLowerCase()}.${guest.last_name.toLowerCase()}@example.com`,
      locale: guest.locale || 'en'
    }
  };

  res.json(response);
});

router.get('/:request_id', (req, res) => {
  const { request_id } = req.params;

  if (!request_id) {
    return res.status(400).json({
      message: 'Request ID is required',
      metadata: {
        statusCode: '400'
      },
      code: 'validation_failed'
    });
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(request_id)) {
    return res.status(400).json({
      message: 'Request.RequestID is not a uuid.',
      metadata: {
        statusCode: '400'
      },
      code: 'validation_failed'
    });
  }

  const response = {
    request_id: request_id,
    status: 'accepted',
    requester_name: 'David Example',
    requester_uuid: 'f3a604eb-8b90-4068-932c-13d6a5002f86',
    request_time: Date.now(),
    surge_multiplier: 1,
    rider_tracking_url: `https://trip.uber.com/${Math.random().toString(36).substring(2, 10)}`,
    driver: {
      id: '42d53206-d8ba-5d5e-9f9b-c9e4a33d3a4c',
      name: 'Joe',
      phone_number: '+11234567891',
      sms_number: '+11234567891',
      picture_url: 'https://d1w2poirtb3as9.cloudfront.net/exampleurl',
      rating: 4.9,
      regulatory_info: 'Licensed by TfL, PHL 123456789',
      pin_based_phone_number: {
        phone_number: '+11234567890',
        pin: '12345678'
      }
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
      timezone: 'America/New_York',
      place: {
        place_id: 'ChIJYWvLK15YwokR9nuSX-MHTZA',
        provider: 'google_places'
      }
    },
    destination: {
      address: 'Bryant Park, New York, NY 10018',
      eta: 18,
      latitude: 40.7535965,
      longitude: -73.9832326,
      title: 'Bryant Park',
      subtitle: 'New York, NY 10018',
      timezone: 'America/New_York',
      place: {
        place_id: 'ChIJvbGg56pZwokRp_E3JbivnLQ',
        provider: 'google_places'
      }
    },
    location: {
      bearing: 0,
      latitude: 40.775573965137674,
      longitude: -73.98604690473967
    },
    note_for_driver: 'Example note to driver',
    expense_memo: 'Memo note example',
    location_uuid: 'a18860d5-ffee-429f-acb3-2f74641a0bf9',
    editable_fields: {
      PICKUP: {
        editable: false,
        max_radius_meters: 200
      },
      STOPS: {
        editable: false
      },
      DROPOFF: {
        editable: false
      }
    },
    communication_channel: 'WHATSAPP'
  };

  res.json(response);
});

export default router;
