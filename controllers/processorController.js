import { Processor, ProcessorAudit } from '../models/index.js';

export const createProcessor = async (req, res) => {
  try {
    const data = await Processor.create(req.body);
    await ProcessorAudit.create({ processorId: data.id, action: 'CREATE', newData: data });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProcessors = async (req, res) => {
  try {
    const data = await Processor.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProcessorById = async (req, res) => {
  try {
    const data = await Processor.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProcessor = async (req, res) => {
  try {
    const data = await Processor.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.update(req.body);
    
    await ProcessorAudit.create({ processorId: data.id, action: 'UPDATE', oldData, newData: data });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProcessor = async (req, res) => {
  try {
    const data = await Processor.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const oldData = data.toJSON();
    await data.destroy();
    
    await ProcessorAudit.create({ processorId: data.id, action: 'DELETE', oldData });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
