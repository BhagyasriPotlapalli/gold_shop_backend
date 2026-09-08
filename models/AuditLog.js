import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING, allowNull: false },
  module: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  actor: { type: DataTypes.JSON, allowNull: false },
  target: { type: DataTypes.JSON, allowNull: true },
  entity: { type: DataTypes.JSON, allowNull: true },
  metadata: { type: DataTypes.JSON, allowNull: true },
  changes: { type: DataTypes.JSON, allowNull: true },
}, {
  timestamps: true,
  tableName: 'audit_logs',
  updatedAt: false // Audit logs are immutable, so we only need createdAt
});

export default AuditLog;
