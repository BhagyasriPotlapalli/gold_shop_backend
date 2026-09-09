import { GoldOrder } from '../models/index.js';
import { logAudit } from '../utils/auditLogger.js';
import { Op } from 'sequelize';

const generateOrderNumber = async () => {
    const count = await GoldOrder.count();
    return "ORD-" + (1000 + count + 1);
};

// Helper function to extract file paths if uploaded
const processImageUploads = (req) => {
    if (req.files) {
        if (req.files['referenceImage']) {
            req.body.referenceImage = req.files['referenceImage'][0].path.replace(/\\/g, '/');
        }
        if (req.files['stoneImage']) {
            req.body.stoneImage = req.files['stoneImage'][0].path.replace(/\\/g, '/');
        }
    }
};

export const createGoldOrder = async (req, res) => {
  try {
    processImageUploads(req); 

    const orderNumber = await generateOrderNumber();
    const data = await GoldOrder.create({ ...req.body, orderNumber, status: 'IN_PROGRESS' });
    
    await logAudit({
      req,
      action: 'CREATE',
      module: 'ORDERS',
      description: "Created new gold order " + orderNumber,
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
    const { for: purpose, records, workerId } = req.query;
    const where = {};
    let order = [['createdAt', 'DESC']]; // default descending order

    if (purpose === 'processing') {
      where.hasOldGold = { [Op.not]: null, [Op.not]: 'No' }; // Assuming 'Yes' or presence means has old gold
      where.processorId = null; // Processor is not assigned yet
    }

    if (records === 'assigned') {
      where[Op.or] = [
        { workerId: { [Op.not]: null } },
        { vendorId: { [Op.not]: null } }
      ];
    } else if (records === 'unassigned') {
      where.workerId = null;
      where.vendorId = null;
    }

    // Filter for specific worker assignments
    if (workerId) {
      where.workerId = workerId;
    }

    const data = await GoldOrder.findAll({ where, order });
    
    res.status(200).json({
      success: true,
      message: "Gold orders fetched successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    
    processImageUploads(req); 
    
    const oldData = data.toJSON();
    await data.update(req.body);
    
    await logAudit({
      req,
      action: 'UPDATE',
      module: 'ORDERS',
      description: "Updated gold order " + data.orderNumber,
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
      description: "Deleted gold order " + data.orderNumber,
      entity: { id: data.id, type: 'GOLD_ORDER', name: data.orderNumber },
      changes: null
    });
    
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
