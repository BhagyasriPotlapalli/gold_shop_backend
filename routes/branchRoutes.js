import express from 'express';
import { createBranch, getBranches } from '../controllers/branchController.js';
import { verifyToken, isManagement } from '../middleware/auth.js';

const router = express.Router();

// Only management (Admin/Super Admin) can create a branch
router.post('/', [verifyToken, isManagement], createBranch);

// All authenticated users can view branches
router.get('/', [verifyToken], getBranches);

export default router;
