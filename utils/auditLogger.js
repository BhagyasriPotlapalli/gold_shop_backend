import { AuditLog } from '../models/index.js';

export const logAudit = async ({
  req,
  action,
  module,
  description,
  target = null,
  entity = null,
  changes = null
}) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | ACTOR
    |--------------------------------------------------------------------------
    */

    const actor = req.user
      ? {
          id: req.user.id,
          empId: req.user.empId || 'N/A',
          name: req.user.name || 'Unknown User',
          role: req.user.role || 'STAFF'
        }
      : {
          id: 0,
          empId: 'SYSTEM',
          name: 'System',
          role: 'SYSTEM'
        };

    /*
    |--------------------------------------------------------------------------
    | METADATA
    |--------------------------------------------------------------------------
    */

    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      'Unknown';

    const metadata = {
      ipAddress,
      device: req.headers['user-agent'] || 'Unknown',
      os: 'Unknown'
    };

    /*
    |--------------------------------------------------------------------------
    | CREATE AUDIT LOG
    |--------------------------------------------------------------------------
    */

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
    /*
    Audit failure should NOT break the main business operation.
    */

    console.error('Failed to create audit log:', error);
  }
};