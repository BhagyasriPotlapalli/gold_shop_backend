import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import { createWorker, getWorkers, getWorkerById, updateWorker, deleteWorker } from '../controllers/workerController.js';

const router = express.Router();

router.post('/', [verifyToken], createWorker);
router.get('/', [verifyToken], getWorkers);
router.get('/:id', [verifyToken], getWorkerById);
router.put('/:id', [verifyToken], updateWorker);
router.delete('/:id', [verifyToken], deleteWorker);

export default router;
