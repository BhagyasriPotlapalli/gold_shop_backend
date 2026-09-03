import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UserAuditLog = sequelize.define('UserAuditLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING, // e.g., 'Login', 'Create User', 'Update User'
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER, // The user who was created/updated/logged in
    allowNull: true
  },
  performedBy: {
    type: DataTypes.INTEGER, // The user who performed the action (can be same as userId for login)
    allowNull: true
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  updatedAt: false // Only createdAt is really needed for audit logs
});

export default UserAuditLog;
