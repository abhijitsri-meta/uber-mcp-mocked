import express from 'express';
import tripsRouter from './guests/trips.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

router.use('/guests/trips', tripsRouter);

export default router;
