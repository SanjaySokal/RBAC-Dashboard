# RBAC Admin Dashboard

A full-stack Role-Based Access Control (RBAC) admin dashboard built with Node.js, Express, MongoDB, and Next.js.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HttpOnly cookies
- Role-based access control (Admin, Editor, Viewer)
- Protected API routes and frontend pages
- Secure password hashing with bcrypt

### 👥 User Management (Admin Only)
- View all users
- Change user roles
- Delete users
- Role-based permissions

### 📝 Content Management
- **Admin/Editor**: Create, edit, delete content
- **Viewer**: Read-only access to content
- Content status management (draft, published, archived)

### 📊 System Logs (Admin Only)
- Activity tracking and audit logs
- User action monitoring
- System statistics and analytics

### 🎨 Modern UI
- Responsive design with Tailwind CSS
- Role-based navigation
- Clean and intuitive interface
- Mobile-friendly layout

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Project Structure

```
rbac-dashboard/
├── backend/                 # Express API server
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Content.js
│   │   └── Log.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── content.js
│   │   └── logs.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── scripts/           # Database scripts
│   │   └── seed.js
│   ├── server.js          # Main server file
│   ├── package.json
│   └── env.example
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   │   ├── login/
│   │   │   └── dashboard/
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities and contexts
│   ├── middleware.js     # Next.js middleware
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd rbac-dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

Update the `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/rbac-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup
Make sure MongoDB is running, then seed the database:
```bash
cd ../backend
npm run seed
```

This will create three default users:
- **Admin**: admin@example.com / password
- **Editor**: editor@example.com / password  
- **Viewer**: viewer@example.com / password

## Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd backend
npm run dev
```
The API will be available at `http://localhost:5000`

2. **Start the frontend development server:**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Mode

1. **Build the frontend:**
```bash
cd frontend
npm run build
npm start
```

2. **Start the backend:**
```bash
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users (Admin Only)
- `GET /api/users` - Get all users
- `PATCH /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Content
- `GET /api/content` - Get all content (all roles)
- `GET /api/content/:id` - Get single content
- `POST /api/content` - Create content (editor, admin)
- `PATCH /api/content/:id` - Update content (editor, admin)
- `DELETE /api/content/:id` - Delete content (editor, admin)

### Logs (Admin Only)
- `GET /api/logs` - Get system logs
- `GET /api/logs/stats` - Get log statistics

## Role Permissions

### Admin
- Full access to all features
- User management (create, edit, delete users)
- Content management (full CRUD)
- System logs and analytics
- Role assignment

### Editor
- Content management (create, edit, delete content)
- View all content
- Cannot manage users or access logs

### Viewer
- Read-only access to content
- Cannot create, edit, or delete content
- Cannot access user management or logs

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **HttpOnly Cookies**: Prevents XSS attacks
- **Password Hashing**: bcrypt with salt rounds
- **CORS Protection**: Configured for frontend origin
- **Rate Limiting**: Prevents abuse
- **Role-based Authorization**: Server-side enforcement
- **Input Validation**: Request validation and sanitization

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/rbac-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend
The frontend automatically connects to `http://localhost:5000` for the API. To change this, set the `NEXT_PUBLIC_API_URL` environment variable.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
