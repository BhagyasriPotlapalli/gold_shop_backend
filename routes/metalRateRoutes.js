import express from 'express';
import { fetchMetalRates, getLatestMetalRates } from '../controllers/metalRateController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/sync', [verifyToken], fetchMetalRates);
router.get('/latest', [verifyToken], getLatestMetalRates);

export default router;
