import express from 'express';
import User from '../models/User.js';
import { authenticateJWT, authorizeRoles, logAction, createLog } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', 
  authenticateJWT, 
  authorizeRoles('admin'),
  logAction('user_list_viewed'),
  async (req, res) => {
    try {
      const users = await User.find({}).select('-passwordHash');
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// Update user role (admin only)
router.patch('/:id/role',
  authenticateJWT,
  authorizeRoles('admin'),
  logAction('role_changed'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate role
      if (!['admin', 'editor', 'viewer'].includes(role)) {
        return res.status(400).json({ 
          error: 'Invalid role. Must be admin, editor, or viewer.' 
        });
      }

      // Prevent admin from changing their own role
      if (id === req.user._id.toString()) {
        return res.status(400).json({ 
          error: 'Cannot change your own role.' 
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      ).select('-passwordHash');

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Log the action with additional details
      await createLog(req.user._id, 'role_changed', {
        targetUserId: id,
        oldRole: user.role,
        newRole: role,
        targetUserEmail: user.email
      });

      res.json({ 
        message: 'User role updated successfully',
        user 
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// Delete user (admin only)
router.delete('/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  logAction('user_deleted'),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (id === req.user._id.toString()) {
        return res.status(400).json({ 
          error: 'Cannot delete your own account.' 
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Log the action before deletion
      await createLog(req.user._id, 'user_deleted', {
        targetUserId: id,
        targetUserEmail: user.email,
        targetUserRole: user.role
      });

      await User.findByIdAndDelete(id);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

export default router;
