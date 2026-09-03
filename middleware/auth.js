import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

export const hasRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId);
      if (user && roles.includes(user.role)) {
        next();
        return;
      }
      res.status(403).send({ message: `Require one of roles: ${roles.join(', ')}!` });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
};

export const isSuperAdmin = hasRole(['Super Admin']);
export const isAdmin = hasRole(['Admin']);
export const isStaff = hasRole(['Staff']);
export const isManagement = hasRole(['Super Admin', 'Admin']);
