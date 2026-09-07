import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const WorkerAudit = sequelize.define('WorkerAudit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  workerId: {
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
  tableName: 'worker_audits'
});

export default WorkerAudit;
