import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', [verifyToken], createOrder);
router.get('/', [verifyToken], getOrders);
router.get('/:id', [verifyToken], getOrderById);
router.put('/:id', [verifyToken], updateOrder);
router.delete('/:id', [verifyToken], deleteOrder);

export default router;
