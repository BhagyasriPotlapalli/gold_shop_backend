import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { logAudit } from '../utils/auditLogger.js';
import { Op } from 'sequelize';

export const register = async (req, res) => {
  try {
    const { empId, name, phoneNumber, password, role } = req.body;

    const creatorRole = req.userRole || null;
    const creatorId = req.userId || null;

    // Role-based access control for creation
    if (creatorRole === "Admin" && role !== "Staff") {
      return res.status(403).json({
        message: "Admin can only create Staff accounts."
      });
    }

    if (creatorRole === "Staff") {
      return res.status(403).json({
        message: "Staff cannot create accounts."
      });
    }

    const existingUser = await User.findOne({
      where: { empId }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this Employee ID already exists."
      });
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
      accountStatus: "Active"
    });

    // Audit: User created
    await logAudit({
      req,
      action: "CREATE",
      module: "USER_MANAGEMENT",
      description: `${req.user?.name || "System"} created user ${newUser.name}`,
      target: {
        id: newUser.id,
        type: "USER",
        name: newUser.name
      },
      entity: {
        id: newUser.id,
        type: "USER",
        name: newUser.name
      },
      changes: null
    });

    res.status(201).json({
      message: "User created successfully!",
      userId: newUser.id
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    console.error("ERROR NAME:", error.name);
    console.error("ERROR MESSAGE:", error.message);
    console.error("VALIDATION ERRORS:", error.errors);

    res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors?.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value
      })) || []
    });
  }
};


export const login = async (req, res) => {
  try {
    const { empId, name, password } = req.body;

    if (!password || (!empId && !name)) {
      return res.status(400).json({
        message: 'Please provide password and either empId or name.'
      });
    }

    const whereClause = {};

    if (empId) whereClause.empId = empId;
    if (name) whereClause.name = name;

    const user = await User.findOne({
      where: whereClause
    });

    // Failed login - user not found
    if (!user) {

      await logAudit({
        req,
        action: "LOGIN_FAILED",
        module: "AUTH",
        description: `Failed login attempt for ${empId || name}`,
        target: null,
        entity: null,
        changes: null
      });

      return res.status(404).json({
        message: 'User not found.'
      });
    }

    if (user.accountStatus !== 'Active') {
      return res.status(403).json({
        message: 'Account is deactivated.'
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    // Failed login - invalid password
    if (!isPasswordValid) {

      await logAudit({
        req,
        action: "LOGIN_FAILED",
        module: "AUTH",
        description: `Failed login attempt for ${user.name}`,
        target: {
          id: user.id,
          type: "USER",
          name: user.name
        },
        entity: {
          id: user.id,
          type: "USER",
          name: user.name
        },
        changes: null
      });

      return res.status(401).json({
        message: 'Invalid password.'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        companyId: user.companyId,
        branchId: user.branchId
      },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: 86400 } // 24 hours
    );

    /*
     * Set authenticated user here because login happens
     * before verifyToken middleware.
     *
     * This allows logAudit() to store the actual
     * logged-in user as actor.
     */
    req.user = {
      id: user.id,
      empId: user.empId,
      name: user.name,
      role: user.role
    };

    // Audit: Successful login
    await logAudit({
      req,
      action: "LOGIN",
      module: "AUTH",
      description: `${user.name} logged into the system`,
      target: null,
      entity: {
        id: user.id,
        type: "USER",
        name: user.name
      },
      changes: null
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      empId: user.empId,
      role: user.role,
      companyId: user.companyId,
      branchId: user.branchId,
      token
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};


export const updateProfileImage = async (req, res) => {
  try {
    const { empId, name } = req.body;

    // Uses multer: file information is inside req.file
    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload a profile image file.'
      });
    }

    if (!empId && !name) {
      return res.status(400).json({
        message: 'Please provide either empId or name.'
      });
    }

    const whereClause = {};

    if (empId) whereClause.empId = empId;
    if (name) whereClause.name = name;

    const user = await User.findOne({
      where: whereClause
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    // Save the relative path (standardizing slashes for web)
    const profileImagePath = req.file.path.replace(/\\/g, '/');

    user.profileImage = profileImagePath;

    await user.save();

    // Audit: Profile image updated
    await logAudit({
      req,
      action: "UPDATE",
      module: "USER_MANAGEMENT",
      description: `${req.user?.name || "System"} updated profile image for ${user.name}`,
      target: {
        id: user.id,
        type: "USER",
        name: user.name
      },
      entity: {
        id: user.id,
        type: "USER",
        name: user.name
      },
      changes: null
    });

    res.status(200).json({
      message: 'Profile image updated successfully',
      profileImage: user.profileImage
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};


export const getProfileImage = async (req, res) => {
  try {
    const { empId, name } = req.query;

    if (!empId && !name) {
      return res.status(400).json({
        message: "Please provide either empId or name as query parameter.",
      });
    }

    const whereClause = {};

    if (empId) whereClause.empId = empId;
    if (name) whereClause.name = name;

    const user = await User.findOne({
      where: whereClause,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const profileImage = user.profileImage
      ? `${req.protocol}://${req.get("host")}/${user.profileImage}`
      : null;

    res.status(200).json({
      profileImage,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


export const editUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phoneNumber,
      accountStatus,
      role,
      companyId,
      branchId
    } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    // Simple role check for edit
    if (
      req.userRole === 'Staff' &&
      req.userId !== parseInt(id, 10)
    ) {
      return res.status(403).json({
        message: 'Unauthorized to edit other users.'
      });
    }

    /*
     * Capture old values before updating.
     * This is only for audit logging.
     */
    const before = {
      name: user.name,
      phoneNumber: user.phoneNumber,
      accountStatus: user.accountStatus,
      role: user.role,
      companyId: user.companyId,
      branchId: user.branchId
    };

    if (name) user.name = name;

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    if (
      accountStatus &&
      req.userRole !== 'Staff'
    ) {
      user.accountStatus = accountStatus;
    }

    if (
      role &&
      req.userRole === 'Super Admin'
    ) {
      user.role = role;
    }

    if (companyId) {
      user.companyId = companyId;
    }

    if (branchId) {
      user.branchId = branchId;
    }

    await user.save();

    /*
     * Capture new values after updating.
     * This is only for audit logging.
     */
    const after = {
      name: user.name,
      phoneNumber: user.phoneNumber,
      accountStatus: user.accountStatus,
      role: user.role,
      companyId: user.companyId,
      branchId: user.branchId
    };

    // Audit: User updated
    await logAudit({
      req,
      action: "UPDATE",
      module: "USER_MANAGEMENT",
      description: `${req.user?.name || "System"} updated user ${user.name}`,
      target: {
        id: user.id,
        type: "USER",
        name: user.name
      },
      entity: {
        id: user.id,
        type: "USER",
        name: user.name
      },
      changes: {
        before,
        after
      }
    });

    res.status(200).json({
      message: 'User updated successfully'
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
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
      attributes: {
        exclude: ['password']
      }
    });

    res.status(200).json(users);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password']
      }
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};


export const setupSuperAdmin = async (req, res) => {
  try {
    const {
      empId,
      name,
      phoneNumber,
      password,
      companyId,
      branchId
    } = req.body;

    if (!empId || !name || !password) {
      return res.status(400).json({
        message: "empId, name, and password are required."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSuperAdmin = await User.create({
      empId,
      name,
      phoneNumber,
      password: hashedPassword,
      role: "Super Admin",
      companyId: companyId || null,
      branchId: branchId || null,
      accountStatus: "Active"
    });

    // Audit: Initial Super Admin creation
    await logAudit({
      req,
      action: "CREATE",
      module: "USER_MANAGEMENT",
      description: `Created Super Admin ${newSuperAdmin.name}`,
      target: {
        id: newSuperAdmin.id,
        type: "USER",
        name: newSuperAdmin.name
      },
      entity: {
        id: newSuperAdmin.id,
        type: "USER",
        name: newSuperAdmin.name
      },
      changes: null
    });

    return res.status(201).json({
      message: "Initial Super Admin created successfully!",
      userId: newSuperAdmin.id
    });

  } catch (error) {
    console.error("SUPER ADMIN ERROR:", error);
    console.error("ERROR NAME:", error.name);
    console.error("ERROR ERRORS:", error.errors);

    return res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors?.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value
      })) || []
    });
  }
};