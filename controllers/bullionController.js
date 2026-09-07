import { Bullion, BullionAudit } from '../models/index.js';

export const createBullion = async (req, res) => {
  try {
    const data = await Bullion.create(req.body);
    await BullionAudit.create({ bullionId: data.id, action: 'CREATE', newData: data });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBullions = async (req, res) => {
  try {
    const data = await Bullion.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBullionById = async (req, res) => {
  try {
    const data = await Bullion.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBullion = async (req, res) => {
  try {
    const data = await Bullion.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.update(req.body);
    
    await BullionAudit.create({ bullionId: data.id, action: 'UPDATE', oldData, newData: data });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBullion = async (req, res) => {
  try {
    const data = await Bullion.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.destroy();
    
    await BullionAudit.create({ bullionId: data.id, action: 'DELETE', oldData });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
