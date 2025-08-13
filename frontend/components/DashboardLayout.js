'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context.js';
import { RequireAdmin, RequireEditor } from './RequireRole.js';
import { 
  Home, 
  Users, 
  FileText, 
  Activity, 
  LogOut, 
  Menu, 
  X,
  User,
  Settings,
  Bell
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'editor', 'viewer'] },
    { name: 'Users', href: '/dashboard/users', icon: Users, roles: ['admin'] },
    { name: 'Content', href: '/dashboard/content', icon: FileText, roles: ['admin', 'editor', 'viewer'] },
    { name: 'Logs', href: '/dashboard/logs', icon: Activity, roles: ['admin'] },
  ];

  const userNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'from-red-500 to-pink-600';
      case 'editor': return 'from-blue-500 to-indigo-600';
      case 'viewer': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden bg-black/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="relative flex h-full w-80 flex-col bg-white/90 backdrop-blur-xl shadow-2xl">
          {/* Mobile sidebar header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">RBAC Dashboard</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {userNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all duration-200"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Mobile user section */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full flex items-center justify-center`}>
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-xl border-r border-slate-200/50 shadow-xl">
          {/* Desktop sidebar header */}
          <div className="flex h-16 items-center px-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">RBAC Dashboard</h1>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {userNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all duration-200"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop user section */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full flex items-center justify-center`}>
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 lg:hidden hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>

              {/* Settings */}
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" />
              
              {/* User info */}
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full flex items-center justify-center`}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">
                    Welcome, {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
