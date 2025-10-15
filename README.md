# React + Vite + Express App

A full-stack application with React frontend (Vite) and Express backend.

## Project Structure

```plaintext
├── src/               # React frontend
├── server/            # Express backend
│   ├── index.js      # Server entry point
│   └── routes/       # API routes
├── public/           # Static assets
└── package.json      # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Installation

```bash
npm install
```

### Running the Application

#### Development Mode (Recommended)

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:

- **Frontend**: <http://localhost:5173>
- **Backend**: <http://localhost:3001>

#### Run Frontend Only

```bash
npm run client
```

#### Run Backend Only

```bash
npm run server
```

### API Endpoints

The backend API is available at `http://localhost:3001`

#### Health Check

- **GET** `/health` - Server health status

#### Uber Guest Trips API

- **POST** `/api/guests/trips/estimates` - Get trip fare and time estimates
  - Request body: `{ pickup: { latitude, longitude }, dropoff: { latitude, longitude } }`

- **POST** `/api/guests/trips` - Create a new guest trip
  - Request body: `{ guest: { first_name, last_name, phone_number }, pickup: { latitude, longitude }, dropoff: { latitude, longitude }, product_id, ... }`

- **GET** `/api/guests/trips/:request_id` - Get trip details by request ID
  - Path parameter: `request_id` (UUID format)

All `/api` requests from the frontend are proxied to the backend server automatically.

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Environment Variables

Create a `.env` file in the root directory:

```bash
PORT=3001
```

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Express.js, Node.js
- **Dev Tools**: ESLint, Nodemon, Concurrently
