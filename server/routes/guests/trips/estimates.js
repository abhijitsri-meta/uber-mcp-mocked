import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  const { pickup, dropoff } = req.body;

  if (!pickup || !pickup.latitude || !pickup.longitude) {
    return res.status(400).json({
      code: 'invalid_request_parameters',
      message: 'Pickup location with latitude and longitude is required',
      metadata: {
        statusCode: '400'
      }
    });
  }

  if (!dropoff || !dropoff.latitude || !dropoff.longitude) {
    return res.status(400).json({
      code: 'invalid_request_parameters',
      message: 'Dropoff location with latitude and longitude is required',
      metadata: {
        statusCode: '400'
      }
    });
  }

  const response = {
    etas_unavailable: false,
    fares_unavailable: false,
    product_estimates: [
      {
        estimate_info: {
          fare: {
            currency_code: 'USD',
            display: '$11.96',
            expires_at: Math.floor(Date.now() / 1000) + 300,
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
          background_image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/productImageBackgrounds/package_x_bg.png',
          capacity: 4,
          description: 'Affordable rides, all to yourself',
          display_name: 'UberX',
          image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/productImages/package_x_fg.png',
          parent_product_type_id: '6a8e56b8-914e-4b48-a387-e6ad21d9c00c',
          product_group: 'uberx',
          product_id: 'b8e5c464-5de2-4539-a35a-986d6e58f186',
          scheduling_enabled: true,
          shared: false,
          short_description: 'UberX',
          upfront_fare_enabled: true,
          vehicle_view_id: 39,
          cancellation: {
            min_cancellation_fee: 5,
            cancellation_grace_period_threshold_sec: 120
          }
        },
        fulfillment_indicator: 'GREEN'
      },
      {
        estimate_info: {
          fare: {
            currency_code: 'USD',
            display: '$28.00',
            expires_at: Math.floor(Date.now() / 1000) + 300,
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
          background_image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/productImageBackgrounds/package_blackCar_bg.png',
          capacity: 4,
          description: 'Premium rides in luxury cars',
          display_name: 'Black',
          image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/productImages/package_blackCar_fg.png',
          parent_product_type_id: 'f1faedb7-5825-484f-b236-24e2cd95ec23',
          product_group: 'uberblack',
          product_id: '0e9d8dd3-ffec-4c2b-9714-537e6174bb88',
          scheduling_enabled: true,
          shared: false,
          short_description: 'Black',
          upfront_fare_enabled: true,
          vehicle_view_id: 4,
          reserve_info: {
            enabled: true,
            scheduled_threshold_minutes: 120,
            free_cancellation_threshold_minutes: 60,
            valid_until_timestamp: Math.floor(Date.now() / 1000) + 300
          },
          cancellation: {
            min_cancellation_fee: 5,
            cancellation_grace_period_threshold_sec: 120
          }
        },
        fulfillment_indicator: 'GREEN'
      }
    ]
  };

  res.json(response);
});

export default router;
