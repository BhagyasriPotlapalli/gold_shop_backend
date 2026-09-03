import { Branch, Company, UserAuditLog } from '../models/index.js';

export const createBranch = async (req, res) => {
  try {
    const { name, companyId } = req.body;

    if (!name || !companyId) {
      return res.status(400).json({ message: 'Branch name and companyId are required.' });
    }

    // Verify company exists
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    const newBranch = await Branch.create({ name, companyId });

    await UserAuditLog.create({
      action: 'Create Branch',
      performedBy: req.userId,
      details: `Created new branch: ${name} for company ID: ${companyId}`
    });

    res.status(201).json({ message: 'Branch created successfully', branch: newBranch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranches = async (req, res) => {
  try {
    const { companyId } = req.query;
    const whereClause = {};

    if (companyId) {
      whereClause.companyId = companyId;
    }

    const branches = await Branch.findAll({
      where: whereClause,
      include: [{ model: Company, attributes: ['id', 'name'] }]
    });

    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
