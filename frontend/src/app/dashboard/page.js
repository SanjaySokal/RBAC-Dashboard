'use client';

import { useAuth } from '../../../lib/auth-context.js';
import DashboardLayout from '../../../components/DashboardLayout.js';
import { RequireAdmin, RequireEditor } from '../../../components/RequireRole.js';
import { Users, FileText, Activity, Shield, Edit, Eye, TrendingUp, Calendar, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const rolePermissions = {
    admin: [
      { name: 'User Management', description: 'Create, edit, and delete users', icon: Users, href: '/dashboard/users', color: 'from-red-500 to-pink-600' },
      { name: 'Content Management', description: 'Full CRUD operations on content', icon: FileText, href: '/dashboard/content', color: 'from-blue-500 to-indigo-600' },
      { name: 'System Logs', description: 'View system activity and audit logs', icon: Activity, href: '/dashboard/logs', color: 'from-purple-500 to-violet-600' },
    ],
    editor: [
      { name: 'Content Management', description: 'Create, edit, and delete content', icon: FileText, href: '/dashboard/content', color: 'from-blue-500 to-indigo-600' },
    ],
    viewer: [
      { name: 'Content Viewing', description: 'Read-only access to content', icon: Eye, href: '/dashboard/content', color: 'from-green-500 to-emerald-600' },
    ]
  };

  const userPermissions = rolePermissions[user?.role] || [];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'from-red-500 to-pink-600';
      case 'editor': return 'from-blue-500 to-indigo-600';
      case 'viewer': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-gradient-to-r from-red-500 to-pink-600',
      editor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      viewer: 'bg-gradient-to-r from-green-500 to-emerald-600'
    };
    return colors[role] || 'bg-gradient-to-r from-gray-500 to-slate-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Hero Section */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-indigo-100 text-lg">
                  You're logged in as a <span className="font-semibold capitalize">{user?.role}</span>
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className={`px-4 py-2 ${getRoleBadge(user?.role)} rounded-full text-white font-medium text-sm`}>
                {user?.role?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Your Role</p>
                <p className="text-2xl font-bold text-slate-900 capitalize">{user?.role}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-xl flex items-center justify-center`}>
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Email Address</p>
                <p className="text-lg font-semibold text-slate-900 truncate">{user?.email}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Date</p>
                <p className="text-lg font-semibold text-slate-900">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Your Permissions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your Permissions</h2>
              <p className="text-slate-600">Features you have access to</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPermissions.map((permission) => (
              <div
                key={permission.name}
                className="group bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 card-hover"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${permission.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <permission.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {permission.name}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {permission.description}
                </p>
                <a
                  href={permission.href}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium group-hover:translate-x-1 transition-transform duration-200"
                >
                  Access Feature
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Role-Specific Content */}
        <RequireAdmin>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Admin Features</h2>
                <p className="text-slate-600">Full system access and control</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                As an administrator, you have complete control over the system. You can manage users, 
                create and edit content, and monitor system activity through comprehensive logs.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/dashboard/users"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Manage Users
                </a>
                <a
                  href="/dashboard/logs"
                  className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-red-200 text-slate-700 font-medium rounded-xl hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Activity className="mr-2 h-5 w-5" />
                  View Logs
                </a>
              </div>
            </div>
          </div>
        </RequireAdmin>

        <RequireEditor>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Edit className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Editor Features</h2>
                <p className="text-slate-600">Content creation and management</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                As an editor, you can create, edit, and delete content. You have full access to content management 
                while maintaining a secure environment for content creation.
              </p>
              <a
                href="/dashboard/content"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Edit className="mr-2 h-5 w-5" />
                Manage Content
              </a>
            </div>
          </div>
        </RequireEditor>

        {user?.role === 'viewer' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Viewer Features</h2>
                <p className="text-slate-600">Read-only content access</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                As a viewer, you have read-only access to content. You can browse and view all available content 
                while maintaining a secure, read-only environment.
              </p>
              <a
                href="/dashboard/content"
                className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-green-200 text-slate-700 font-medium rounded-xl hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Content
              </a>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">System Status</h2>
              <p className="text-slate-600">Current system information</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600">Online</div>
              <div className="text-sm text-emerald-700">System Status</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-blue-700">Uptime</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">Secure</div>
              <div className="text-sm text-purple-700">Connection</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">Active</div>
              <div className="text-sm text-orange-700">Session</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
