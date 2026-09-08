import fs from 'fs';
import path from 'path';

const modelsDir = path.join(process.cwd(), 'models');
const controllersDir = path.join(process.cwd(), 'controllers');
const routesDir = path.join(process.cwd(), 'routes');

// 1. Create AuditLog Model
const auditLogContent = `import { DataTypes } from 'sequelize';
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
`;
fs.writeFileSync(path.join(modelsDir, 'AuditLog.js'), auditLogContent);

// 2. Read existing Order.js and convert to GoldOrder.js with new fields
const orderPath = path.join(modelsDir, 'Order.js');
if (fs.existsSync(orderPath)) {
    let orderContent = fs.readFileSync(orderPath, 'utf8');
    orderContent = orderContent.replace(/const Order = sequelize.define\('Order', \{/, 
        "const GoldOrder = sequelize.define('GoldOrder', {\n" +
        "  orderNumber: { type: DataTypes.STRING, unique: true },\n" +
        "  status: { type: DataTypes.STRING, defaultValue: 'PENDING' },"
    );
    orderContent = orderContent.replace(/tableName: 'orders'/, "tableName: 'gold_orders'");
    orderContent = orderContent.replace(/export default Order;/, "export default GoldOrder;");
    fs.writeFileSync(path.join(modelsDir, 'GoldOrder.js'), orderContent);
}

// 3. Update models/index.js
const indexContent = `import sequelize from '../config/db.js';
import Company from './Company.js';
import Branch from './Branch.js';
import User from './User.js';
import AuditLog from './AuditLog.js';
import Profile from './Profile.js';
import GoldOrder from './GoldOrder.js';

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

export {
  sequelize,
  Company,
  Branch,
  User,
  AuditLog,
  Profile,
  GoldOrder
};
`;
fs.writeFileSync(path.join(modelsDir, 'index.js'), indexContent);

console.log("Models updated successfully!");
