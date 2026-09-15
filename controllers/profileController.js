import { Profile } from '../models/index.js';
import { logAudit } from '../utils/auditLogger.js';

const getAuditModule = (type) => {
  switch (type?.toLowerCase()) {
    case 'worker':
      return 'WORKERS';

    case 'vendor':
      return 'VENDORS';

    case 'bullion':
      return 'BULLION';

    case 'processor':
      return 'GOLD_PROCESSING';

    default:
      return 'PROFILES';
  }
};

export const createProfile = async (req, res) => {
  try {
    const data = await Profile.create(req.body);

    const module = getAuditModule(data.type);

    await logAudit({
      req,
      action: 'CREATE',
      module,
      description: `Created new ${data.type || 'profile'} ${data.name}`,
      target: {
        id: data.id,
        type: 'PROFILE',
        name: data.name
      },
      entity: {
        id: data.id,
        type: 'PROFILE',
        name: data.name
      },
      changes: null
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const where = req.query.type
      ? { type: req.query.type }
      : {};

    // Only fetch the exact fields requested by the user
    const data = await Profile.findAll({
      where,
      attributes: [
        'id',
        'type',
        'name',
        'phoneNumber',
        'city',
        'country',
        'profileImage',
        'createdAt',
        'updatedAt'
      ]
    });

    // Capitalize type for message, e.g. "Worker" -> "Workers"
    let message = 'Profiles fetched successfully';

    if (req.query.type) {
      const typeName =
        req.query.type.charAt(0).toUpperCase() +
        req.query.type.slice(1);

      message = `${typeName}s fetched successfully`;
    }

    res.status(200).json({
      success: true,
      message,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const data = await Profile.findByPk(req.params.id);

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

export const updateProfile = async (req, res) => {
  try {
    const data = await Profile.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: 'Not found'
      });
    }

    const oldData = data.toJSON();

    await data.update(req.body);

    const module = getAuditModule(data.type);

    await logAudit({
      req,
      action: 'UPDATE',
      module,
      description: `Updated ${data.type || 'profile'} ${data.name}`,
      target: {
        id: data.id,
        type: 'PROFILE',
        name: data.name
      },
      entity: {
        id: data.id,
        type: 'PROFILE',
        name: data.name
      },
      changes: {
        before: oldData,
        after: data.toJSON()
      }
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const data = await Profile.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: 'Not found'
      });
    }

    const module = getAuditModule(data.type);

    await data.destroy();

    await logAudit({
      req,
      action: 'DELETE',
      module,
      description: `Deleted ${data.type || 'profile'} ${data.name}`,
      target: {
        id: data.id,
        type: 'PROFILE',
        name: data.name
      },
      entity: {
        id: data.id,
        type: 'PROFILE',
        name: data.name
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