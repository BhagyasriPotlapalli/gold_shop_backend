import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import { createProcessor, getProcessors, getProcessorById, updateProcessor, deleteProcessor } from '../controllers/processorController.js';

const router = express.Router();

router.post('/', [verifyToken], createProcessor);
router.get('/', [verifyToken], getProcessors);
router.get('/:id', [verifyToken], getProcessorById);
router.put('/:id', [verifyToken], updateProcessor);
router.delete('/:id', [verifyToken], deleteProcessor);

export default router;
