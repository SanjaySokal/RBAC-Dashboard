import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateJWT, createLog } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'viewer' } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists.' 
      });
    }

    // Create new user
    const user = new User({
      email,
      password, // Will be hashed by the virtual setter
      name,
      role
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set HttpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Log the action
    await createLog(user._id, 'user_created', { email, role });

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required.' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Check password
    const isValidPassword = user.checkPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set HttpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Log the action
    await createLog(user._id, 'user_login', { email });

    res.json({
      message: 'Login successful',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Logout user
router.post('/logout', authenticateJWT, async (req, res) => {
  try {
    // Log the action
    await createLog(req.user._id, 'user_logout', { email: req.user.email });

    // Clear the cookie
    res.clearCookie('authToken');
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get current user info
router.get('/me', authenticateJWT, (req, res) => {
  res.json({ user: req.user.toJSON() });
});

export default router;
