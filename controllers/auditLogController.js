import { AuditLog } from '../models/index.js';
import { Op } from 'sequelize';

export const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    
    // Filters
    if (req.query.search) {
      where[Op.or] = [
        { action: { [Op.like]: '%' + req.query.search + '%' } },
        { module: { [Op.like]: '%' + req.query.search + '%' } },
        { description: { [Op.like]: '%' + req.query.search + '%' } }
      ];
    }
    if (req.query.userId) {
      where['actor.id'] = req.query.userId;
    }
    if (req.query.action) {
      where.action = req.query.action;
    }
    if (req.query.module) {
      where.module = req.query.module;
    }
    if (req.query.fromDate && req.query.toDate) {
      where.createdAt = {
        [Op.between]: [new Date(req.query.fromDate), new Date(req.query.toDate)]
      };
    }

    // Fetch Logs
    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const staffActions = await AuditLog.count({ where: { ...where, 'actor.role': 'STAFF' } });
    const billingActivity = await AuditLog.count({ where: { ...where, module: 'ORDERS' } });
    const inventoryActions = await AuditLog.count({ where: { ...where, module: 'INVENTORY' } });
    const securityEvents = await AuditLog.count({ where: { ...where, module: 'AUTH' } });

    res.status(200).json({
      success: true,
      message: "Audit logs fetched successfully",
      data: {
        logs: rows,
        summary: {
          totalEvents: count,
          staffActions,
          billingActivity,
          inventoryActions,
          securityEvents
        },
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
