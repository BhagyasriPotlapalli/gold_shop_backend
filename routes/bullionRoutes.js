import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import { createBullion, getBullions, getBullionById, updateBullion, deleteBullion } from '../controllers/bullionController.js';

const router = express.Router();

router.post('/', [verifyToken], createBullion);
router.get('/', [verifyToken], getBullions);
router.get('/:id', [verifyToken], getBullionById);
router.put('/:id', [verifyToken], updateBullion);
router.delete('/:id', [verifyToken], deleteBullion);

export default router;
