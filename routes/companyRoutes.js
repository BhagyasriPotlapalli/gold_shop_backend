import express from 'express';
import { createCompany, getCompanies } from '../controllers/companyController.js';
import { verifyToken, isManagement } from '../middleware/auth.js';

const router = express.Router();

// Only management (Admin/Super Admin) can create a company
router.post('/', [verifyToken, isManagement], createCompany);

// All authenticated users can view companies
router.get('/', [verifyToken], getCompanies);

export default router;
