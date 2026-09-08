import sequelize from '../config/db.js';
import Company from './Company.js';
import Branch from './Branch.js';
import User from './User.js';
import AuditLog from './AuditLog.js';
import Profile from './Profile.js';
import GoldOrder from './GoldOrder.js';
import MetalRate from './MetalRate.js';

// Associations
Company.hasMany(Branch, { foreignKey: 'companyId' });
Branch.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

Branch.hasMany(User, { foreignKey: 'branchId' });
User.belongsTo(Branch, { foreignKey: 'branchId' });

// Add relationships for GoldOrders to Profile
GoldOrder.belongsTo(Profile, { as: 'Worker', foreignKey: 'workerId' });
GoldOrder.belongsTo(Profile, { as: 'Vendor', foreignKey: 'vendorId' });
GoldOrder.belongsTo(Profile, { as: 'Bullion', foreignKey: 'bullionId' });
GoldOrder.belongsTo(Profile, { as: 'Processor', foreignKey: 'processorId' });

export {
  sequelize,
  Company,
  Branch,
  User,
  AuditLog,
  Profile,
  GoldOrder,
  MetalRate
};
