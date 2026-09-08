import { AuditLog } from '../models/index.js';

export const logAudit = async ({ req, action, module, description, target, entity, changes }) => {
  try {
    // Assuming req.user is set by verifyToken middleware
    const actor = req.user ? {
      id: req.user.id,
      empId: req.user.empId || 'N/A', // fallback if empId is not available
      name: req.user.name || 'Unknown User',
      role: req.user.role || 'STAFF'
    } : {
      id: 0,
      empId: 'SYSTEM',
      name: 'System',
      role: 'SYSTEM'
    };

    const metadata = {
      ipAddress: req.ip || req.connection.remoteAddress,
      device: req.headers['user-agent'],
      os: 'Unknown' // Parsing User-Agent requires a library, keeping it simple
    };

    await AuditLog.create({
      action,
      module,
      description,
      actor,
      target,
      entity,
      metadata,
      changes
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};
