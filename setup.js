#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 RBAC Dashboard Setup\n');

// Check if .env file exists in backend
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  console.log('📝 Creating backend .env file...');
  const envContent = `# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/rbac-dashboard

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
`;

  fs.writeFileSync(backendEnvPath, envContent);
  console.log('✅ Backend .env file created');
} else {
  console.log('✅ Backend .env file already exists');
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Seed the database: cd backend && npm run seed');
console.log('3. Start the backend: cd backend && npm run dev');
console.log('4. Start the frontend: cd frontend && npm run dev');
console.log('\n🔑 Default login credentials:');
console.log('   Admin: admin@example.com / password');
console.log('   Editor: editor@example.com / password');
console.log('   Viewer: viewer@example.com / password');
