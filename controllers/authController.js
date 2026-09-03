import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserAuditLog } from '../models/index.js';
import { Op } from 'sequelize';

export const register = async (req, res) => {
  try {
    const { empId, name, phoneNumber, password, role } = req.body;
    const creatorRole = req.userRole||null; // From verifyToken middleware
    const creatorId = req.userId||null;

    // Role-based access control for creation
    if (creatorRole === 'Admin' && role !== 'Staff') {
      return res.status(403).json({ message: 'Admin can only create Staff accounts.' });
    }
    if (creatorRole === 'Staff') {
      return res.status(403).json({ message: 'Staff cannot create accounts.' });
    }

    const existingUser = await User.findOne({ where: { empId } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this Employee ID already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      empId,
      name,
      phoneNumber,
      password: hashedPassword,
      role,
      companyId: req.body.companyId,
      branchId: req.body.branchId,
      createdBy: creatorId,
      accountStatus: 'Active'
    });

    const creatorUser = await User.findByPk(creatorId);
    const creatorName = creatorUser ? creatorUser.name : 'System';

    await UserAuditLog.create({
      action: 'Create User',
      userId: newUser.id,
      performedBy: creatorId,
      details: `Created new user ${name} with role ${role} by ${creatorName}`
    });

    res.status(201).json({ message: 'User created successfully!', userId: newUser.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { empId, name, password } = req.body;

    if (!password || (!empId && !name)) {
      return res.status(400).json({ message: 'Please provide password and either empId or name.' });
    }

    const whereClause = {};
    if (empId) whereClause.empId = empId;
    if (name) whereClause.name = name;

    const user = await User.findOne({ where: whereClause });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.accountStatus !== 'Active') {
      return res.status(403).json({ message: 'Account is deactivated.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, companyId: user.companyId, branchId: user.branchId },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: 86400 } // 24 hours
    );

    await UserAuditLog.create({
      action: 'Login',
      userId: user.id,
      performedBy: user.id,
      details: `User ${user.name} logged in successfully`
    });

    res.status(200).json({
      id:user.id,
      name: user.name,
      empId: user.empId,
      role: user.role,
      companyId: user.companyId,
      branchId: user.branchId,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const { empId, name } = req.body;
    
    // Uses multer: file information is inside req.file
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a profile image file.' });
    }

    if (!empId && !name) {
      return res.status(400).json({ message: 'Please provide either empId or name.' });
    }

    const whereClause = {};
    if (empId) whereClause.empId = empId;
    if (name) whereClause.name = name;

    const user = await User.findOne({ where: whereClause });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Save the relative path (standardizing slashes for web)
    const profileImagePath = req.file.path.replace(/\\/g, '/');
    user.profileImage = profileImagePath;
    await user.save();

    const actorUser = await User.findByPk(req.userId);
    const actorName = actorUser ? actorUser.name : 'Unknown';

    await UserAuditLog.create({
      action: 'Update User',
      userId: user.id,
      performedBy: req.userId,
      details: `Profile image updated for ${user.name} by ${actorName}`
    });

    res.status(200).json({ message: 'Profile image updated successfully', profileImage: user.profileImage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProfileImage = async (req, res) => {
  try {
    const { empId, name } = req.query;

    if (!empId && !name) {
      return res.status(400).json({ message: 'Please provide either empId or name as query parameter.' });
    }

    const whereClause = {};
    if (empId) whereClause.empId = empId;
    if (name) whereClause.name = name;

    const user = await User.findOne({ where: whereClause });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ profileImage: user.profileImage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber, accountStatus, role, companyId, branchId } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Simple role check for edit
    if (req.userRole === 'Staff' && req.userId !== parseInt(id, 10)) {
      return res.status(403).json({ message: 'Unauthorized to edit other users.' });
    }

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (accountStatus && req.userRole !== 'Staff') user.accountStatus = accountStatus;
    if (role && req.userRole === 'Super Admin') user.role = role;
    if (companyId) user.companyId = companyId;
    if (branchId) user.branchId = branchId;

    await user.save();

    const actorUser = await User.findByPk(req.userId);
    const actorName = actorUser ? actorUser.name : 'Unknown';

    await UserAuditLog.create({
      action: 'Update User',
      userId: user.id,
      performedBy: req.userId,
      details: `User ${user.name}'s details updated by ${actorName}`
    });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    
    const whereClause = {};
    if (role) {
      whereClause.role = role;
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { role } = req.query;
    const include = [];

    // Filter by target user role
    if (role) {
      include.push({
        model: User,
        as: 'TargetUser',
        where: { role },
        attributes: ['id', 'empId', 'name', 'role']
      });
    } else {
      include.push({
        model: User,
        as: 'TargetUser',
        attributes: ['id', 'empId', 'name', 'role']
      });
    }

    include.push({
      model: User,
      as: 'Actor',
      attributes: ['id', 'empId', 'name', 'role']
    });

    const logs = await UserAuditLog.findAll({
      include,
      order: [['createdAt', 'DESC']]
    });

    // Formatting response to explicitly include the name of the user who performed the action 
    // and the created/target user's name at the root of each log object as requested
    const formattedLogs = logs.map(log => {
      const logData = log.toJSON();
      return {
        ...logData,
        createdUserName: logData.TargetUser ? logData.TargetUser.name : null,
        performedByUserName: logData.Actor ? logData.Actor.name : null
      };
    });

    res.status(200).json(formattedLogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const setupSuperAdmin = async (req, res) => {
  try {
    // Check if any Super Admin already exists
    const superAdminExists = await User.findOne({ where: { role: 'Super Admin' } });
    if (superAdminExists) {
      return res.status(403).json({ message: 'A Super Admin already exists in the system. Setup is locked.' });
    }

    const { empId, name, phoneNumber, password, companyId, branchId } = req.body;

    if (!empId || !name || !password) {
      return res.status(400).json({ message: 'empId, name, and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSuperAdmin = await User.create({
      empId,
      name,
      phoneNumber,
      password: hashedPassword,
      role: 'Super Admin',
      companyId: companyId || null,
      branchId: branchId || null,
      accountStatus: 'Active'
    });

    await UserAuditLog.create({
      action: 'System Setup',
      userId: newSuperAdmin.id,
      details: `Initial Super Admin ${name} created via bootstrap endpoint`
    });

    res.status(201).json({ 
      message: 'Initial Super Admin created successfully!', 
      userId: newSuperAdmin.id 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
