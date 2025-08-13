import express from 'express';
import Log from '../models/Log.js';
import { authenticateJWT, authorizeRoles, logAction } from '../middleware/auth.js';

const router = express.Router();

// Get system logs (admin only)
router.get('/',
  authenticateJWT,
  authorizeRoles('admin'),
  logAction('logs_viewed'),
  async (req, res) => {
    try {
      const { page = 1, limit = 50, action, actorId } = req.query;
      
      // Build query
      const query = {};
      if (action) query.action = action;
      if (actorId) query.actorId = actorId;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Get logs with pagination
      const logs = await Log.find(query)
        .populate('actorId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Log.countDocuments(query);

      res.json({
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// Get log statistics (admin only)
router.get('/stats',
  authenticateJWT,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { days = 7 } = req.query;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      // Get action counts
      const actionStats = await Log.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      // Get user activity
      const userStats = await Log.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$actorId',
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            name: '$user.name',
            email: '$user.email',
            role: '$user.role',
            count: 1
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      // Get daily activity
      const dailyStats = await Log.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      res.json({
        actionStats,
        userStats,
        dailyStats,
        period: `${days} days`
      });
    } catch (error) {
      console.error('Error fetching log stats:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

export default router;
