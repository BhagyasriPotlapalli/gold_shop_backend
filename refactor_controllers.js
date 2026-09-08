import fs from 'fs';
import path from 'path';

const controllersDir = path.join(process.cwd(), 'controllers');
const routesDir = path.join(process.cwd(), 'routes');

const profileControllerContent = `import { Profile } from '../models/index.js';
import { logAudit } from '../utils/auditLogger.js';

export const createProfile = async (req, res) => {
  try {
    const data = await Profile.create(req.body);
    
    await logAudit({
      req,
      action: 'CREATE',
      module: req.body.type ? req.body.type.toUpperCase() + 'S' : 'PROFILES',
      description: \`Created new profile \${data.name}\`,
      entity: { id: data.id, type: 'PROFILE', name: data.name },
      changes: null
    });
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const where = req.query.type ? { type: req.query.type } : {};
    const data = await Profile.findAll({ where });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const data = await Profile.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const data = await Profile.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.update(req.body);
    
    await logAudit({
      req,
      action: 'UPDATE',
      module: data.type ? data.type.toUpperCase() + 'S' : 'PROFILES',
      description: \`Updated profile \${data.name}\`,
      entity: { id: data.id, type: 'PROFILE', name: data.name },
      changes: { before: oldData, after: data.toJSON() }
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const data = await Profile.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    await data.destroy();
    
    await logAudit({
      req,
      action: 'DELETE',
      module: data.type ? data.type.toUpperCase() + 'S' : 'PROFILES',
      description: \`Deleted profile \${data.name}\`,
      entity: { id: data.id, type: 'PROFILE', name: data.name },
      changes: null
    });
    
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
`;
fs.writeFileSync(path.join(controllersDir, 'profileController.js'), profileControllerContent);

const goldOrderControllerContent = `import { GoldOrder } from '../models/index.js';
import { logAudit } from '../utils/auditLogger.js';

const generateOrderNumber = async () => {
    const count = await GoldOrder.count();
    return \`ORD-\${1000 + count + 1}\`;
};

export const createGoldOrder = async (req, res) => {
  try {
    const orderNumber = await generateOrderNumber();
    const data = await GoldOrder.create({ ...req.body, orderNumber, status: 'IN_PROGRESS' });
    
    await logAudit({
      req,
      action: 'CREATE',
      module: 'ORDERS',
      description: \`Created new gold order \${orderNumber}\`,
      entity: { id: data.id, type: 'GOLD_ORDER', name: orderNumber },
      changes: null
    });
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGoldOrders = async (req, res) => {
  try {
    const data = await GoldOrder.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGoldOrderById = async (req, res) => {
  try {
    const data = await GoldOrder.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGoldOrder = async (req, res) => {
  try {
    const data = await GoldOrder.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.update(req.body);
    
    await logAudit({
      req,
      action: 'UPDATE',
      module: 'ORDERS',
      description: \`Updated gold order \${data.orderNumber}\`,
      entity: { id: data.id, type: 'GOLD_ORDER', name: data.orderNumber },
      changes: { before: oldData, after: data.toJSON() }
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGoldOrder = async (req, res) => {
  try {
    const data = await GoldOrder.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    await data.destroy();
    
    await logAudit({
      req,
      action: 'DELETE',
      module: 'ORDERS',
      description: \`Deleted gold order \${data.orderNumber}\`,
      entity: { id: data.id, type: 'GOLD_ORDER', name: data.orderNumber },
      changes: null
    });
    
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
`;
fs.writeFileSync(path.join(controllersDir, 'goldOrderController.js'), goldOrderControllerContent);

const goldOrderRoutesContent = `import express from 'express';
import { createGoldOrder, getGoldOrders, getGoldOrderById, updateGoldOrder, deleteGoldOrder } from '../controllers/goldOrderController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', [verifyToken], createGoldOrder);
router.get('/', [verifyToken], getGoldOrders);
router.get('/:id', [verifyToken], getGoldOrderById);
router.put('/:id', [verifyToken], updateGoldOrder);
router.delete('/:id', [verifyToken], deleteGoldOrder);

export default router;
`;
fs.writeFileSync(path.join(routesDir, 'goldOrderRoutes.js'), goldOrderRoutesContent);

console.log("Controllers and Routes for Profile and GoldOrder updated successfully.");
