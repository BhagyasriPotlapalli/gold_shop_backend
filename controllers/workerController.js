import { Worker, WorkerAudit } from '../models/index.js';

export const createWorker = async (req, res) => {
  try {
    const data = await Worker.create(req.body);
    await WorkerAudit.create({ workerId: data.id, action: 'CREATE', newData: data });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const data = await Worker.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const data = await Worker.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const data = await Worker.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.update(req.body);
    
    await WorkerAudit.create({ workerId: data.id, action: 'UPDATE', oldData, newData: data });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const data = await Worker.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.destroy();
    
    await WorkerAudit.create({ workerId: data.id, action: 'DELETE', oldData });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
