# Uber APIs Documentation

This document provides a comprehensive listing of available Uber APIs for guest rides and related services.

## Table of Contents
- [Estimates](#estimates)
- [Trips](#trips)
- [Trip Communication](#trip-communication)
- [Webhooks](#webhooks)

---

## Estimates

### Get Trip Estimate
Retrieve fare and time estimates for a potential trip.

- **Category**: ESTIMATES
- **Method**: POST
- **Endpoint**: `guests/trips/estimates`
- **Full URL**: `https://api.uber.com/v1/guests/trips/estimates`
- **Documentation**: https://developer.uber.com/docs/guest-rides/all-spec#tag/ESTIMATES/operation/getTripEstimate

#### Sample Request Payload
```json
{
  "pickup": {
    "latitude": 40.7484,
    "longitude": -73.9857
  },
  "dropoff": {
    "latitude": 40.750568,
    "longitude": -73.993519
  }
}
```

#### Sample Responses

**200 OK - Success**
```json
{
  "etas_unavailable": false,
  "fares_unavailable": false,
  "product_estimates": [
    {
      "estimate_info": {
        "fare": {
          "currency_code": "USD",
          "display": "$11.96",
          "expires_at": 1558147984,
          "fare_breakdown": [
            {
              "name": "Base Fare",
              "type": "base_fare",
              "value": 11.96
            }
          ],
          "fare_id": "6e642142-27b8-49df-82e0-3d4a8633e79d",
          "value": 11.96
        },
        "fare_id": "6e642142-27b8-49df-82e0-3d4a8633e79d",
        "pickup_estimate": 4,
        "trip": {
          "distance_estimate": 0.44,
          "distance_unit": "mile",
          "duration_estimate": 927,
          "travel_distance_estimate": 0.45
        }
      },
      "product": {
        "advance_booking_type": "SCHEDULED",
        "background_image": "https://d1a3f4spazzrp4.cloudfront.net/car-types/productImageBackgrounds/package_x_bg.png",
        "capacity": 4,
        "description": "Affordable rides, all to yourself",
        "display_name": "UberX",
        "image": "https://d1a3f4spazzrp4.cloudfront.net/car-types/productImages/package_x_fg.png",
        "parent_product_type_id": "6a8e56b8-914e-4b48-a387-e6ad21d9c00c",
        "product_group": "uberx",
        "product_id": "b8e5c464-5de2-4539-a35a-986d6e58f186",
        "scheduling_enabled": true,
        "shared": false,
        "short_description": "UberX",
        "upfront_fare_enabled": true,
        "vehicle_view_id": 39,
        "cancellation": {
          "min_cancellation_fee": 5,
          "cancellation_grace_period_threshold_sec": 120
        }
      },
      "fulfillment_indicator": "GREEN"
    },
    {
      "estimate_info": {
        "fare": {
          "currency_code": "USD",
          "display": "$11.96",
          "expires_at": 1558147984,
          "fare_breakdown": [
            {
              "name": "Base Fare",
              "type": "base_fare",
              "value": 11.96
            }
          ],
          "fare_id": "c143d9ab-57c5-4d35-981f-7a356a2f22e9",
          "value": 11.96
        },
        "fare_id": "c143d9ab-57c5-4d35-981f-7a356a2f22e9",
        "pickup_estimate": 8,
        "pricing_explanation": "Fares are higher due to increased demand",
        "trip": {
          "distance_estimate": 0.44,
          "distance_unit": "mile",
          "duration_estimate": 1178,
          "travel_distance_estimate": 0.45
        }
      },
      "product": {
        "advance_booking_type": "SCHEDULED",
        "background_image": "https://d1a3f4spazzrp4.cloudfront.net/car-types/productImageBackgrounds/package_wav_bg.png",
        "capacity": 4,
        "description": "Wheelchair-accessible rides",
        "display_name": "WAV",
        "image": "https://d1a3f4spazzrp4.cloudfront.net/car-types/productImages/package_wav_fg.png",
        "parent_product_type_id": "6a8e56b8-914e-4b48-a387-e6ad21d9c00c",
        "product_group": "uberx",
        "product_id": "3bca1cd3-df15-49d8-bd4f-93e014fc26ff",
        "scheduling_enabled": true,
        "shared": false,
        "short_description": "WAV",
        "upfront_fare_enabled": true,
        "vehicle_view_id": 10000936,
        "cancellation": {
          "min_cancellation_fee": 5,
          "cancellation_grace_period_threshold_sec": 120
        }
      },
      "fulfillment_indicator": "YELLOW"
    },
    {
      "estimate_info": {
        "fare": {
          "currency_code": "USD",
          "display": "$28.00",
          "expires_at": 1574718553,
          "fare_breakdown": [
            {
              "name": "Base Fare",
              "type": "base_fare",
              "value": 28
            }
          ],
          "fare_id": "bbdce077-4088-449e-a898-a34df5c293c4",
          "value": 28
        },
        "fare_id": "bbdce077-4088-449e-a898-a34df5c293c4",
        "no_cars_available": true,
        "trip": {
          "distance_estimate": 0.44,
          "distance_unit": "mile",
          "duration_estimate": 1126,
          "travel_distance_estimate": 0.45
        }
      },
      "product": {
        "advance_booking_type": "RESERVE",
        "background_image": "https://d1a3f4spazzrp4.cloudfront.net/car-types/productImageBackgrounds/package_blackCar_bg.png",
        "capacity": 4,
        "description": "Premium rides in luxury cars",
        "display_name": "Black",
        "image": "https://d1a3f4spazzrp4.cloudfront.net/car-types/productImages/package_blackCar_fg.png",
        "parent_product_type_id": "f1faedb7-5825-484f-b236-24e2cd95ec23",
        "product_group": "uberblack",
        "product_id": "0e9d8dd3-ffec-4c2b-9714-537e6174bb88",
        "scheduling_enabled": true,
        "shared": false,
        "short_description": "Black",
        "upfront_fare_enabled": true,
        "vehicle_view_id": 4,
        "reserve_info": {
          "enabled": true,
          "scheduled_threshold_minutes": 120,
          "free_cancellation_threshold_minutes": 60,
          "valid_until_timestamp": 1574718553
        },
        "cancellation": {
          "min_cancellation_fee": 5,
          "cancellation_grace_period_threshold_sec": 120
        }
      },
      "fulfillment_indicator": "GREEN"
    },
    {
      "estimate_info": null,
      "fare_id": "f9f5d23e-3148-4632-8f61-727f654a265e",
      "fare": {
        "fare_id": "f9f5d23e-3148-4632-8f61-727f654a265e",
        "value": 135.32,
        "currency_code": "USD",
        "display": "$135.32",
        "expires_at": 1698073761,
        "fare_breakdown": [
          {
            "type": "base_fare",
            "value": 135.32,
            "name": "Base Fare"
          }
        ],
        "hourly": {
          "tiers": [
            {
              "amount": 135.32,
              "time_in_mins": 120,
              "distance": 30,
              "distance_unit": "mile",
              "formatted_time_and_distance_package": "2 hrs/30 miles"
            },
            {
              "amount": 195.32,
              "time_in_mins": 180,
              "distance": 45,
              "distance_unit": "mile",
              "formatted_time_and_distance_package": "3 hrs/45 miles"
            },
            {
              "amount": 255.32,
              "time_in_mins": 240,
              "distance": 60,
              "distance_unit": "mile",
              "formatted_time_and_distance_package": "4 hrs/60 miles"
            }
          ],
          "overage_rates": {
            "overage_rate_per_temporal_unit": 1.4,
            "overage_rate_per_distance_unit": 3.55,
            "temporal_unit": "TEMPORAL_UNIT_MINUTE",
            "distance_unit": "mile",
            "pricing_explainer": "Extra time will be charged to you at $1.40 per minute. Extra distance will be charged to you at $3.55 per mile."
          }
        },
        "trip": {
          "distance_unit": "mile",
          "distance_estimate": 2.71,
          "duration_estimate": 0,
          "travel_distance_estimate": 2.71
        }
      },
      "product": {
        "product_id": "aad1febe-9780-4b91-a92f-8f7c58d5cf54",
        "display_name": "Black Hourly",
        "description": "Luxury rides by the hour with professional drivers",
        "short_description": "Black Hourly",
        "product_group": "",
        "image": "https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Black_v1.png",
        "upfront_fare_enabled": true,
        "shared": false,
        "capacity": 4,
        "scheduling_enabled": true,
        "background_image": "https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImageBackgrounds/imageBackground@3x_v0.png",
        "vehicle_view_id": 20035361,
        "parent_product_type_id": "5354dad7-2f82-405b-b99a-9ff8acd70223",
        "reserve_info": {
          "enabled": true,
          "scheduled_threshold_minutes": 120,
          "free_cancellation_threshold_minutes": 60,
          "add_ons": [],
          "valid_until_timestamp": 1698097557000
        },
        "advance_booking_type": "RESERVE",
        "cancellation": {
          "min_cancellation_fee": 5,
          "cancellation_grace_period_threshold_sec": 120
        }
      },
      "fulfillment_indicator": "GREEN"
    }
  ]
}
```

**400 Bad Request - Invalid Parameters**
```json
{
  "code": "invalid_request_parameters",
  "message": "Invalid organization uuid {{org_uuid}}",
  "metadata": {
    "statusCode": "400"
  }
}
```

**500 Internal Server Error**
```json
{
  "code": "internal_server_error",
  "message": "We have experienced a problem."
}
```

---

## Trips

### Create Guest Trip
Create a new trip for a guest user.

- **Category**: TRIPS
- **Method**: POST
- **Endpoint**: `guests/trips`
- **Full URL**: `https://api.uber.com/v1/guests/trips`
- **Documentation**: https://developer.uber.com/docs/guest-rides/all-spec#tag/TRIPS/operation/createGuestTrip

#### Sample Request Payload
```json
{
  "guest": {
    "first_name": "Alex",
    "last_name": "Smith",
    "phone_number": "+14155550123",
    "locale": "en"
  },
  "pickup": {
    "latitude": 37.7673292,
    "longitude": -122.3886371
  },
  "dropoff": {
    "latitude": 37.7830104,
    "longitude": -122.4335835
  },
  "product_id": "bd12e2d9-4ee5-4a61-bbd6-48a2b2aa4c4f",
  "fare_id": "f97d4081-42de-4eba-944e-7ce399785984",
  "policy_uuid": "b1aea847-64fb-4f50-b719-ad6d452f437c",
  "expense_code": "Code_1234",
  "expense_memo": "Client Trip",
  "sender_display_name": "Amazing Company",
  "note_for_driver": "The rider will be waiting on the corner",
  "call_enabled": true,
  "contacts_to_notify": [
    {
      "phone_number": "+13125550147",
      "contact_event": [
        "TRIP_BEGAN",
        "DRIVER_PICKUP_COMPLETED"
      ]
    }
  ],
  "stops": [],
  "additional_guests": [],
  "communication_channel": "WHATSAPP"
}
```

#### Sample Responses

**200 OK - Success**
```json
{
  "eta": 12,
  "request_id": "da790cea-31b4-4131-8cd9-7adb1c06db99",
  "product_id": "b8e5c464-5de2-4539-a35a-986d6e58f186",
  "status": "processing",
  "surge_multiplier": 1,
  "guest": {
    "guest_id": "d49c5b20-81ea-537e-907e-9c4b1321fc72",
    "first_name": "Alex",
    "last_name": "Smith",
    "phone_number": "+14155550123",
    "email": "alex.smith@aol.com",
    "locale": "en"
  }
}
```

**400 Bad Request - Invalid Payment Method**
```json
{
  "message": "We are unable to accept this payment method. Please contact your payment provider or try adding another payment method.",
  "metadata": {
    "statusCode": "400"
  },
  "code": "invalid_payment_method"
}
```

**500 Internal Server Error**
```json
{
  "code": "internal_server_error",
  "message": "We have experienced a problem."
}
```

### Get Trip Details
Retrieve detailed information about an existing trip.

- **Category**: TRIPS
- **Method**: GET
- **Endpoint**: `guests/trips/{request_id}`
- **Full URL**: `https://api.uber.com/v1/guests/trips/{request_id}`

#### Parameters
- `request_id` (path parameter): The unique identifier for the trip request (obtained when creating the trip)

#### Sample Request
No request payload required - this is a GET request using the request_id from trip creation.

#### Sample Responses

**200 OK - Success**
```json
{
  "request_id": "da790cea-31b4-4131-8cd9-7adb1c06db99",
  "status": "accepted",
  "requester_name": "David Example",
  "requester_uuid": "f3a604eb-8b90-4068-932c-13d6a5002f86",
  "request_time": 1564758590788,
  "surge_multiplier": 1,
  "rider_tracking_url": "https://trip.uber.com/d8lVg6Sx9H",
  "driver": {
    "id": "42d53206-d8ba-5d5e-9f9b-c9e4a33d3a4c",
    "name": "Joe",
    "phone_number": "+11234567891",
    "sms_number": "+11234567891",
    "picture_url": "https://d1w2poirtb3as9.cloudfront.net/exampleurl",
    "rating": 4.9,
    "regulatory_info": "Licensed by TfL, PHL 123456789",
    "pin_based_phone_number": {
      "phone_number": "+11234567890",
      "pin": "12345678"
    }
  },
  "vehicle": {
    "license_plate": "ABC1234",
    "make": "Oldsmobile",
    "model": "Intrigue",
    "vehicle_color_name": "white"
  },
  "product": {
    "display_name": "UberX",
    "product_id": "b8e5c464-5de2-4539-a35a-986d6e58f186"
  },
  "pickup": {
    "address": "Lincoln Square, New York, NY",
    "eta": 1,
    "latitude": 40.77417690000001,
    "longitude": -73.98491179999999,
    "title": "Lincoln Square",
    "subtitle": "New York, NY",
    "timezone": "America/New_York",
    "place": {
      "place_id": "ChIJYWvLK15YwokR9nuSX-MHTZA",
      "provider": "google_places"
    }
  },
  "destination": {
    "address": "Bryant Park, New York, NY 10018",
    "eta": 18,
    "latitude": 40.7535965,
    "longitude": -73.9832326,
    "title": "Bryant Park",
    "subtitle": "New York, NY 10018",
    "timezone": "America/New_York",
    "place": {
      "place_id": "ChIJvbGg56pZwokRp_E3JbivnLQ",
      "provider": "google_places"
    }
  },
  "location": {
    "bearing": 0,
    "latitude": 40.775573965137674,
    "longitude": -73.98604690473967
  },
  "note_for_driver": "Example note to driver",
  "expense_memo": "Memo note example",
  "location_uuid": "a18860d5-ffee-429f-acb3-2f74641a0bf9",
  "editable_fields": {
    "PICKUP": {
      "editable": false,
      "max_radius_meters": 200
    },
    "STOPS": {
      "editable": false
    },
    "DROPOFF": {
      "editable": false
    }
  },
  "communication_channel": "WHATSAPP"
}
```

**400 Bad Request - Invalid Request ID**
```json
{
  "message": "Request.RequestID is not a uuid.",
  "metadata": {
    "statusCode": "400"
  },
  "code": "validation_failed"
}
```

---

## Trip Communication

### Send Message to Driver
Send a message to the driver during an active trip.

- **Category**: TRIP-COMMUNICATION
- **Method**: POST
- **Endpoint**: `guests/trips/{request_id}/message`
- **Full URL**: `https://api.uber.com/v1/guests/trips/{request_id}/message`
- **Documentation**: https://developer.uber.com/docs/guest-rides/all-spec#tag/TRIP-COMMUNICATION/operation/sendMessageToDriver

#### Parameters
- `request_id` (path parameter): The unique identifier for the trip request

#### Sample Request Payload
```json
{
  "message": "Please pick up at the door on the right"
}
```

#### Sample Responses

**200 OK - Success**
```json
{}
```

**400 Bad Request - Communication Not Ready**
```json
{
  "message": "The ride communication is not ready to send or receive message yet, try to call it later",
  "metadata": {
    "statusCode": "400"
  },
  "code": "retry_request"
}
```

**500 Internal Server Error**
```json
{
  "code": "internal_server_error",
  "message": "We have experienced a problem."
}
```

---

## Webhooks

### Driver Location Updates
Webhook endpoint to receive real-time driver location updates during a trip. This webhook is sent continuously during the trip at 4-second intervals until the trip is complete.

- **Event Type**: `guests.trips.driver_location`
- **Method**: POST
- **Category**: WEBHOOKS
- **Documentation**: https://developer.uber.com/docs/guest-rides/all-spec#tag/WEBHOOKS/paths/guests.trips.driver_location/post

#### Description
This webhook is sent continuously during the trip at 4-second intervals until the trip is complete.


#### Sample Webhook Payload
```json
{
  "event_id": "LfN0QX+I4kQk8F/AX05+wiBw9FlydHqbxGzroE2SOKxx",
  "event_time": 1634236315,
  "event_type": "guests.trips.driver_location",
  "resource_href": "https://api.uber.com/v1/guest/trips/22642e3f-cb6c-42be-9d16-29c92ecef000",
  "meta": {
    "user_id": "b2d01098-777f-4cd6-a463-73715a69cxxx",
    "org_uuid": "4a2c7244-63ec-41a1-bb1f-9dff711dd492",
    "resource_id": "22642e3f-cb6c-42be-9d16-29c92ecefxxx",
    "status": "in_progress"
  },
  "data": {
    "location": {
      "bearing": 0.7087848763801929,
      "latitude": 48.8616,
      "longitude": 2.3520117
    }
  }
}
```

---

## API Overview

| Category | API Name | Operation ID | Method |
|----------|----------|--------------|---------|
| Estimates | Get Trip Estimate | `getTripEstimate` | POST |
| Trips | Create Guest Trip | `createGuestTrip` | POST |
| Trips | Get Trip Details | `getTripDetails` | GET |
| Trip Communication | Send Message to Driver | `sendMessageToDriver` | POST |
| Webhooks | Driver Location Updates | N/A | POST |

## Resources

- **Main Documentation**: https://developer.uber.com/docs/guest-rides/all-spec
- **Base URL**: https://api.uber.com/v1.2/
- **Authentication**: Bearer Token required for most endpoints

---
