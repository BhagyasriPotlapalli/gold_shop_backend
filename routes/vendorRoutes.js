import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import { createVendor, getVendors, getVendorById, updateVendor, deleteVendor } from '../controllers/vendorController.js';

const router = express.Router();

router.post('/', [verifyToken], createVendor);
router.get('/', [verifyToken], getVendors);
router.get('/:id', [verifyToken], getVendorById);
router.put('/:id', [verifyToken], updateVendor);
router.delete('/:id', [verifyToken], deleteVendor);

export default router;
