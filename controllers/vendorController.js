import { Vendor, VendorAudit } from '../models/index.js';

export const createVendor = async (req, res) => {
  try {
    const data = await Vendor.create(req.body);
    await VendorAudit.create({ vendorId: data.id, action: 'CREATE', newData: data });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const data = await Vendor.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const data = await Vendor.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const data = await Vendor.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.update(req.body);
    
    await VendorAudit.create({ vendorId: data.id, action: 'UPDATE', oldData, newData: data });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const data = await Vendor.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.destroy();
    
    await VendorAudit.create({ vendorId: data.id, action: 'DELETE', oldData });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
