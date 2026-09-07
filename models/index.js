import sequelize from '../config/db.js';
import Company from './Company.js';
import Branch from './Branch.js';
import User from './User.js';
import UserAuditLog from './UserAuditLog.js';

import Vendor from './Vendor.js';
import VendorAudit from './VendorAudit.js';
import Worker from './Worker.js';
import WorkerAudit from './WorkerAudit.js';
import Bullion from './Bullion.js';
import BullionAudit from './BullionAudit.js';
import Processor from './Processor.js';
import ProcessorAudit from './ProcessorAudit.js';
import Order from './Order.js';
import OrderAudit from './OrderAudit.js';

// Associations
Company.hasMany(Branch, { foreignKey: 'companyId' });
Branch.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

Branch.hasMany(User, { foreignKey: 'branchId' });
User.belongsTo(Branch, { foreignKey: 'branchId' });

User.hasMany(User, { as: 'CreatedUsers', foreignKey: 'createdBy' });
User.belongsTo(User, { as: 'Creator', foreignKey: 'createdBy' });

User.hasMany(UserAuditLog, { foreignKey: 'userId', as: 'Logs' });
UserAuditLog.belongsTo(User, { foreignKey: 'userId', as: 'TargetUser' });

User.hasMany(UserAuditLog, { foreignKey: 'performedBy', as: 'PerformedActions' });
UserAuditLog.belongsTo(User, { foreignKey: 'performedBy', as: 'Actor' });

// Add relationships for Orders
Order.belongsTo(Worker, { foreignKey: 'workerId' });
Order.belongsTo(Vendor, { foreignKey: 'vendorId' });
Order.belongsTo(Bullion, { foreignKey: 'bullionId' });

export {
  sequelize,
  Company,
  Branch,
  User,
  UserAuditLog,
  Vendor, VendorAudit,
  Worker, WorkerAudit,
  Bullion, BullionAudit,
  Processor, ProcessorAudit,
  Order, OrderAudit
};
