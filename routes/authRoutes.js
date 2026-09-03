import express from 'express';
import {
  register,
  login,
  updateProfileImage,
  getProfileImage,
  editUser,
  getAllUsers,
  getUserById,
  getAuditLogs,
  setupSuperAdmin
} from '../controllers/authController.js';
import { verifyToken, isManagement } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/setup-super-admin', setupSuperAdmin); // Special endpoint to bootstrap the first super admin
router.post('/login', login);
router.get('/profile-image', getProfileImage);

// Protected routes
router.post('/register', [verifyToken, isManagement], register);
router.post('/admin', [verifyToken, isManagement], register); // Fixed from previous stray code

// Profile image route uses multer middleware for 'profileImage' field
router.put('/profile-image', [verifyToken, upload.single('profileImage')], updateProfileImage);

router.put('/:id', [verifyToken], editUser);
router.get('/', [verifyToken], getAllUsers);
router.get('/:id', [verifyToken], getUserById);
router.get('/audit/logs', [verifyToken, isManagement], getAuditLogs);

export default router;
