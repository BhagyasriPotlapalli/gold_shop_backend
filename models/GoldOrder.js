import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const GoldOrder = sequelize.define('GoldOrder', {
  orderNumber: { type: DataTypes.STRING, unique: true },
  status: { type: DataTypes.STRING, defaultValue: 'PENDING' },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyId: { type: DataTypes.INTEGER },
  branchId: { type: DataTypes.INTEGER },

  
  // -- Customer Details (Stored directly in Order) --
  customerId: { type: DataTypes.STRING }, // e.g., 'CUS-001'
  customerName: { type: DataTypes.STRING },
  customerPhone: { type: DataTypes.STRING },
  customerAddress: { type: DataTypes.STRING },
  
  workerId: { type: DataTypes.INTEGER },
  vendorId: { type: DataTypes.INTEGER },
  bullionId: { type: DataTypes.INTEGER },
  processorId: { type: DataTypes.INTEGER },
  
  orderType: { type: DataTypes.STRING }, // e.g., 'New Order'
  itemType: { type: DataTypes.STRING },  // e.g., 'order' or 'sale'
  
  startDate: { type: DataTypes.DATEONLY },
  estimatedDate: { type: DataTypes.DATEONLY },
  deliveredDate: { type: DataTypes.DATEONLY },
  
  ornamentName: { type: DataTypes.STRING },
  referenceImage: { type: DataTypes.STRING },
  
  // -- Customer / Old Gold Details --
  hasOldGold: { type: DataTypes.STRING },
  beforeProcessingWeight: { type: DataTypes.DECIMAL(15, 3) },
  afterProcessingWeight: { type: DataTypes.DECIMAL(15, 3) },
  customerGoldWeight: { type: DataTypes.DECIMAL(15, 3) },
  requiredGoldWeight: { type: DataTypes.DECIMAL(15, 3) },
  goldRate: { type: DataTypes.DECIMAL(15, 2) },
  
  // -- Stone Details --
  hasStone: { type: DataTypes.STRING },
  stoneType: { type: DataTypes.STRING },
  stoneWeight: { type: DataTypes.DECIMAL(15, 3) },
  stoneCost: { type: DataTypes.DECIMAL(15, 2) },
  stoneImage: { type: DataTypes.STRING },
  
  // -- Weight Details --
  grossWeight: { type: DataTypes.DECIMAL(15, 3) },
  netWeight: { type: DataTypes.DECIMAL(15, 3) },
  
  // -- Customer Payment Details --
  ornamentAmount: { type: DataTypes.DECIMAL(15, 2) },
  advanceAmount: { type: DataTypes.DECIMAL(15, 2) },
  discount: { type: DataTypes.DECIMAL(15, 2) },
  totalAmount: { type: DataTypes.DECIMAL(15, 2) },
  paymentMode: { type: DataTypes.STRING },
  
  // -- Vendor/Worker Processing Details --
  totalGoldGivenToWorker: { type: DataTypes.DECIMAL(15, 3) },
  workerGivenAmount: { type: DataTypes.DECIMAL(15, 2) }, // Cash given to worker
  workerGoldWastage: { type: DataTypes.DECIMAL(15, 3) },
  workerRemainingBalance: { type: DataTypes.DECIMAL(15, 2) }, // Cash
  workerRemainingGold: { type: DataTypes.DECIMAL(15, 3) },
  
  // -- Bullion Details --
  assignedBullionWeight: { type: DataTypes.DECIMAL(15, 3) },
  usedBullionGold: { type: DataTypes.DECIMAL(15, 3) },
  purchaseBullionGold: { type: DataTypes.DECIMAL(15, 3) },
  bullionGivenAmount: { type: DataTypes.DECIMAL(15, 2) },
  bullionRemainingBalance: { type: DataTypes.DECIMAL(15, 2) }

}, {
  timestamps: true,
  tableName: 'gold_orders'
});

export default GoldOrder;
