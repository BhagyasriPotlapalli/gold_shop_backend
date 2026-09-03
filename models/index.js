import sequelize from '../config/db.js';
import Company from './Company.js';
import Branch from './Branch.js';
import User from './User.js';
import UserAuditLog from './UserAuditLog.js';

// Associations
Company.hasMany(Branch, { foreignKey: 'companyId' });
Branch.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

Branch.hasMany(User, { foreignKey: 'branchId' });
User.belongsTo(Branch, { foreignKey: 'branchId' });

// Self-referencing relationship for user creation
User.hasMany(User, { as: 'CreatedUsers', foreignKey: 'createdBy' });
User.belongsTo(User, { as: 'Creator', foreignKey: 'createdBy' });

// Audit Logs Associations
User.hasMany(UserAuditLog, { foreignKey: 'userId', as: 'Logs' });
UserAuditLog.belongsTo(User, { foreignKey: 'userId', as: 'TargetUser' });

User.hasMany(UserAuditLog, { foreignKey: 'performedBy', as: 'PerformedActions' });
UserAuditLog.belongsTo(User, { foreignKey: 'performedBy', as: 'Actor' });

export {
  sequelize,
  Company,
  Branch,
  User,
  UserAuditLog
};
