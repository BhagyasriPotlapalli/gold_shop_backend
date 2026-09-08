import express from 'express';
import { createProfile, getProfiles, getProfileById, updateProfile, deleteProfile } from '../controllers/profileController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', [verifyToken], createProfile);
router.get('/', [verifyToken], getProfiles);
router.get('/:id', [verifyToken], getProfileById);
router.put('/:id', [verifyToken], updateProfile);
router.delete('/:id', [verifyToken], deleteProfile);

export default router;
