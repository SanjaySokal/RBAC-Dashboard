import express from 'express';
import Content from '../models/Content.js';
import { authenticateJWT, authorizeRoles, logAction } from '../middleware/auth.js';

const router = express.Router();

// Get all content (all authenticated users)
router.get('/',
  authenticateJWT,
  logAction('content_list_viewed'),
  async (req, res) => {
    try {
      const content = await Content.find({})
        .populate('authorId', 'name email')
        .sort({ createdAt: -1 });
      
      res.json({ content });
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// Get single content item (all authenticated users)
router.get('/:id',
  authenticateJWT,
  logAction('content_viewed'),
  async (req, res) => {
    try {
      const content = await Content.findById(req.params.id)
        .populate('authorId', 'name email');
      
      if (!content) {
        return res.status(404).json({ error: 'Content not found.' });
      }
      
      res.json({ content });
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// Create new content (editor, admin)
router.post('/',
  authenticateJWT,
  authorizeRoles('editor', 'admin'),
  logAction('content_created'),
  async (req, res) => {
    try {
      const { title, body, status = 'draft' } = req.body;

      // Validate input
      if (!title || !body) {
        return res.status(400).json({ 
          error: 'Title and body are required.' 
        });
      }

      // Validate status
      if (!['draft', 'published', 'archived'].includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status. Must be draft, published, or archived.' 
        });
      }

      const content = new Content({
        title,
        body,
        authorId: req.user._id,
        status
      });

      await content.save();
      
      // Populate author info for response
      await content.populate('authorId', 'name email');

      res.status(201).json({
        message: 'Content created successfully',
        content
      });
    } catch (error) {
      console.error('Error creating content:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// Update content (editor, admin)
router.patch('/:id',
  authenticateJWT,
  authorizeRoles('editor', 'admin'),
  logAction('content_updated'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, body, status } = req.body;

      // Find content
      const content = await Content.findById(id);
      if (!content) {
        return res.status(404).json({ error: 'Content not found.' });
      }

      // Editors and admins can edit any content
      // No additional restrictions needed since we already check for editor/admin roles above

      // Validate status if provided
      if (status && !['draft', 'published', 'archived'].includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status. Must be draft, published, or archived.' 
        });
      }

      // Update content
      const updatedContent = await Content.findByIdAndUpdate(
        id,
        { title, body, status },
        { new: true, runValidators: true }
      ).populate('authorId', 'name email');

      res.json({
        message: 'Content updated successfully',
        content: updatedContent
      });
    } catch (error) {
      console.error('Error updating content:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// Delete content (editor, admin)
router.delete('/:id',
  authenticateJWT,
  authorizeRoles('editor', 'admin'),
  logAction('content_deleted'),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Find content
      const content = await Content.findById(id);
      if (!content) {
        return res.status(404).json({ error: 'Content not found.' });
      }

      // Editors and admins can delete any content
      // No additional restrictions needed since we already check for editor/admin roles above

      await Content.findByIdAndDelete(id);

      res.json({ message: 'Content deleted successfully' });
    } catch (error) {
      console.error('Error deleting content:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

export default router;
