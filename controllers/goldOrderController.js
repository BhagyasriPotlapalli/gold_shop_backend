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
            req.body.referenceImage =
                req.files['referenceImage'][0].path.replace(/\\/g, '/');
        }

        if (req.files['stoneImage']) {
            req.body.stoneImage =
                req.files['stoneImage'][0].path.replace(/\\/g, '/');
        }
    }
};

export const createGoldOrder = async (req, res) => {
  try {
    processImageUploads(req);

    const orderNumber = await generateOrderNumber();

    const payload = req.body;

    const data = await GoldOrder.create({
      orderNumber,
      status: 'IN_PROGRESS',

      // Customer
      customerName: payload.customer?.name || null,
      customerPhone: payload.customer?.phone || null,
      customerAddress: payload.customer?.address || null,

      // Order
      orderType: payload.order?.orderType || null,
      itemType: payload.order?.itemType || null,
      ornamentName: payload.order?.ornamentName || null,
      startDate: payload.order?.startDate || null,
      estimatedDate: payload.order?.endDate || null,
      referenceImage: payload.order?.referenceImage || null,

      // Gold
      requiredGoldWeight: payload.gold?.requiredWeight || 0,
      goldRate: payload.gold?.ratePerGram || 0,

      // Old Gold
      hasOldGold: payload.oldGold?.enabled ? 'Yes' : 'No',
      processorId: payload.oldGold?.enabled
        ? payload.oldGold?.processorId || null
        : null,
      beforeProcessingWeight: payload.oldGold?.enabled
        ? payload.oldGold?.beforeProcessingWeight || 0
        : 0,
      afterProcessingWeight: payload.oldGold?.enabled
        ? payload.oldGold?.afterProcessingWeight || 0
        : 0,
      customerGoldWeight: payload.oldGold?.enabled
        ? payload.oldGold?.recoveredWeight || 0
        : 0,

      // Stone
      hasStone: payload.stone?.enabled ? 'Yes' : 'No',
      stoneType: payload.stone?.enabled
        ? payload.stone?.type || null
        : null,
      stoneWeight: payload.stone?.enabled
        ? payload.stone?.weight || 0
        : 0,
      stoneCost: payload.stone?.enabled
        ? payload.stone?.cost || 0
        : 0,
      stoneImage: payload.stone?.image || null,

      // Assignment
      workerId: payload.assignment?.type === 'worker'
        ? payload.assignment?.workerId || null
        : null,

      vendorId: payload.assignment?.type === 'vendor'
        ? payload.assignment?.vendorId || null
        : null,

      // Bullion
      bullionId: payload.bullion?.bullionId || null,
      assignedBullionWeight: payload.bullion?.allocationWeight || 0,

      // Billing
      ornamentAmount: payload.billing?.goldAmount || 0,
      advanceAmount: payload.billing?.advanceAmount || 0,
      discount: payload.billing?.discount || 0,
      totalAmount: payload.billing?.finalAmount || 0,
      paymentMode: payload.billing?.paymentMode || null
    });

    await logAudit({
      req,
      action: 'CREATE',
      module: 'ORDERS',
      description: `Created new gold order ${orderNumber}`,
      target: {
        id: data.id,
        type: 'GOLD_ORDER',
        name: orderNumber
      },
      entity: {
        id: data.id,
        type: 'GOLD_ORDER',
        name: orderNumber
      },
      changes: null
    });

    res.status(201).json(data);

  } catch (error) {
    console.error('Create Gold Order Error:', error);

    res.status(500).json({
      error: error.message
    });
  }
};

export const getGoldOrders = async (req, res) => {
  try {
    const { for: purpose, records, workerId, status } = req.query;
    const where = {};
    let order = [['createdAt', 'DESC']];

    if (purpose === 'processing') {
      where.hasOldGold = {
        [Op.not]: null,
        [Op.not]: 'No'
      };
      where.processorId = null;
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

    if (workerId) {
      where.workerId = workerId;
    }

    if (status) {
      where.status = status;
    }

    const data = await GoldOrder.findAll({
      where,
      order
    });

    res.status(200).json({
      success: true,
      message: "Gold orders fetched successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getGoldOrderById = async (req, res) => {
  try {
    const data = await GoldOrder.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: 'Not found'
      });
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const updateGoldOrder = async (req, res) => {
  try {
    const data = await GoldOrder.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: 'Not found'
      });
    }

    processImageUploads(req);

    // Capture old data before update
    const oldData = data.toJSON();

    await data.update(req.body);

    const newData = data.toJSON();

    await logAudit({
      req,
      action: 'UPDATE',
      module: 'ORDERS',
      description: `Updated gold order ${data.orderNumber}`,
      target: {
        id: data.id,
        type: 'GOLD_ORDER',
        name: data.orderNumber
      },
      entity: {
        id: data.id,
        type: 'GOLD_ORDER',
        name: data.orderNumber
      },
      changes: {
        before: oldData,
        after: newData
      }
    });

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const deleteGoldOrder = async (req, res) => {
  try {
    const data = await GoldOrder.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: 'Not found'
      });
    }

    // Capture order information before deleting
    const orderId = data.id;
    const orderNumber = data.orderNumber;

    await data.destroy();

    await logAudit({
      req,
      action: 'DELETE',
      module: 'ORDERS',
      description: `Deleted gold order ${orderNumber}`,
      target: {
        id: orderId,
        type: 'GOLD_ORDER',
        name: orderNumber
      },
      entity: {
        id: orderId,
        type: 'GOLD_ORDER',
        name: orderNumber
      },
      changes: null
    });

    res.status(200).json({
      message: 'Deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};