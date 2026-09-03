import { Company, UserAuditLog } from '../models/index.js';

export const createCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Company name is required.' });
    }

    const newCompany = await Company.create({ name });

    // Optional: Log the creation
    await UserAuditLog.create({
      action: 'Create Company',
      performedBy: req.userId,
      details: `Created new company: ${name}`
    });

    res.status(201).json({ message: 'Company created successfully', company: newCompany });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
