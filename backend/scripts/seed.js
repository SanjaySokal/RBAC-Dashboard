import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Content from '../models/Content.js';
import { createLog } from '../middleware/auth.js';

// Load environment variables
dotenv.config();

const seedUsers = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'password',
    role: 'admin'
  },
  {
    email: 'editor@example.com',
    name: 'Editor User',
    password: 'password',
    role: 'editor'
  },
  {
    email: 'viewer@example.com',
    name: 'Viewer User',
    password: 'password',
    role: 'viewer'
  }
];

const seedContent = [
  {
    title: 'Welcome to RBAC Dashboard',
    body: 'This is a sample content item created by the admin user. This demonstrates the content management functionality of the RBAC dashboard.',
    status: 'published'
  },
  {
    title: 'Getting Started Guide',
    body: 'This guide will help you understand how to use the RBAC dashboard effectively. Learn about different roles and their permissions.',
    status: 'published'
  },
  {
    title: 'Draft Article',
    body: 'This is a draft article that demonstrates the draft status functionality.',
    status: 'draft'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rbac-dashboard');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Content.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.email} (${user.role})`);
    }

    // Create content
    for (let i = 0; i < seedContent.length; i++) {
      const contentData = seedContent[i];
      const content = new Content({
        ...contentData,
        authorId: createdUsers[0]._id // Admin user as author
      });
      await content.save();
      console.log(`Created content: ${content.title}`);
    }

    // Create some sample logs
    for (const user of createdUsers) {
      await createLog(user._id, 'user_created', {
        email: user.email,
        role: user.role
      });
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@example.com / password');
    console.log('Editor: editor@example.com / password');
    console.log('Viewer: viewer@example.com / password');
    console.log('\n🚀 You can now start the application!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();
