# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or cloud instance

### 1. Clone and Setup
```bash
git clone <repository-url>
cd rbac-dashboard
node setup.js
```

### 2. Start MongoDB
Make sure MongoDB is running on your system.

### 3. Seed the Database
```bash
cd backend
npm run seed
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 6. Login Credentials
- **Admin**: admin@example.com / password
- **Editor**: editor@example.com / password
- **Viewer**: viewer@example.com / password

## 🎯 What You Can Do

### As Admin:
- Manage users (create, edit, delete, change roles)
- Manage content (full CRUD operations)
- View system logs and analytics

### As Editor:
- Create, edit, and delete content
- View all content
- Cannot manage users or access logs

### As Viewer:
- View content (read-only)
- Cannot create, edit, or delete content

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `backend/.env`
- Default: `mongodb://localhost:27017/rbac-dashboard`

### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 3000
- Change ports in respective `.env` files if needed

### Dependencies Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps
- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints
- Customize the UI and functionality
- Add your own features

## 🆘 Need Help?
- Check the [README.md](README.md) for detailed documentation
- Review the code structure and comments
- Open an issue in the repository
