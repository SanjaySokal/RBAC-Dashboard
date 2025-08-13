import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Log from '../models/Log.js';

// Middleware to authenticate JWT from HttpOnly cookie
export const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Middleware to authorize specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Helper function to create logs
export const createLog = async (actorId, action, meta = {}) => {
  try {
    await Log.create({
      actorId,
      action,
      meta
    });
  } catch (error) {
    console.error('Error creating log:', error);
  }
};

// Middleware to log actions
export const logAction = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (res.statusCode < 400) {
        createLog(req.user._id, action, {
          method: req.method,
          path: req.path,
          body: req.body,
          params: req.params,
          query: req.query
        });
      }
      originalSend.call(this, data);
    };
    
    next();
  };
};
