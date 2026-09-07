import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BullionAudit = sequelize.define('BullionAudit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bullionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  oldData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  newData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  performedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'bullion_audits'
});

export default BullionAudit;
