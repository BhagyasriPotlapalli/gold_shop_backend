import express from 'express';
import { createGoldOrder, getGoldOrders, getGoldOrderById, updateGoldOrder, deleteGoldOrder } from '../controllers/goldOrderController.js';
import { verifyToken } from '../middleware/auth.js';
import { uploadOrderImages } from '../middleware/uploadOrder.js';

const router = express.Router();

// Allow uploading referenceImage and stoneImage during POST and PUT
const imageUploadFields = uploadOrderImages.fields([
  { name: 'referenceImage', maxCount: 1 },
  { name: 'stoneImage', maxCount: 1 }
]);

router.post('/', [verifyToken, imageUploadFields], createGoldOrder);
router.get('/', [verifyToken], getGoldOrders);
router.get('/:id', [verifyToken], getGoldOrderById);
router.put('/:id', [verifyToken, imageUploadFields], updateGoldOrder);
router.delete('/:id', [verifyToken], deleteGoldOrder);

export default router;
