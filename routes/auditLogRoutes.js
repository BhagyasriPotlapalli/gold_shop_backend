import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', [verifyToken], getAuditLogs);

export default router;
