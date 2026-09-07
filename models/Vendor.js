import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyId: { type: DataTypes.INTEGER },
  branchId: { type: DataTypes.INTEGER },

  name: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  profileImage: { type: DataTypes.STRING },
  latitude: { type: DataTypes.DECIMAL(10, 8) },
  longitude: { type: DataTypes.DECIMAL(11, 8) },
  cashGiven: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  cashRemainingBalance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  cashBorrow: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  goldGiven: { type: DataTypes.DECIMAL(15, 3), defaultValue: 0 },
  goldRemainingBalance: { type: DataTypes.DECIMAL(15, 3), defaultValue: 0 },
  goldBorrow: { type: DataTypes.DECIMAL(15, 3), defaultValue: 0 }
}, {
  timestamps: true,
  tableName: 'vendors'
});

export default Vendor;
