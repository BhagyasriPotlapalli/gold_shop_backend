import { Profile } from '../models/index.js';
import { logAudit } from '../utils/auditLogger.js';

export const createProfile = async (req, res) => {
  try {
    const data = await Profile.create(req.body);
    
    await logAudit({
      req,
      action: 'CREATE',
      module: req.body.type ? req.body.type.toUpperCase() + 'S' : 'PROFILES',
      description: `Created new profile ${data.name}`,
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
      description: `Updated profile ${data.name}`,
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
      description: `Deleted profile ${data.name}`,
      entity: { id: data.id, type: 'PROFILE', name: data.name },
      changes: null
    });
    
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
