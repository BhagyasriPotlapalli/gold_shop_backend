import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const VendorAudit = sequelize.define('VendorAudit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vendorId: {
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
  tableName: 'vendor_audits'
});

export default VendorAudit;
