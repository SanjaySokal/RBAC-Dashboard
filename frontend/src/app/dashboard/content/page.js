'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout.js';
import { RequireViewer } from '../../../../components/RequireRole.js';
import { useAuth } from '../../../../lib/auth-context.js';
import { contentAPI } from '../../../../lib/api.js';
import { FileText, Plus, Edit, Trash2, Eye, User, Calendar, Search, Filter, BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContentPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [viewingContent, setViewingContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    status: 'draft'
  });
  const { user, isEditor, isAdmin } = useAuth();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { content } = await contentAPI.getAll();
      setContent(content);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.create(formData);
      setFormData({ title: '', body: '', status: 'draft' });
      setShowCreateModal(false);
      fetchContent();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.update(editingContent._id, formData);
      setFormData({ title: '', body: '', status: 'draft' });
      setEditingContent(null);
      fetchContent();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (contentId) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      await contentAPI.delete(contentId);
      fetchContent();
    } catch (error) {
      setError(error.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'draft':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'archived':
        return <Clock className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'draft':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
      case 'archived':
        return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  const openEditModal = (item) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      body: item.body,
      status: item.status
    });
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setEditingContent(null);
    setViewingContent(null);
    setFormData({ title: '', body: '', status: 'draft' });
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading content...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <RequireViewer>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Content Management</h1>
                <p className="text-slate-600">Create, edit, and manage your content</p>
              </div>
            </div>
            {(isEditor || isAdmin) && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Content
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search content by title or body..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div
                key={item._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:bg-white/90 transition-all duration-300 card-hover"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 flex-1 mr-3">
                      {item.title}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status}</span>
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {item.body}
                  </p>

                  <div className="flex items-center text-sm text-slate-500 mb-4 space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{item.authorId?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setViewingContent(item)}
                      className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>

                    {(isEditor || isAdmin) && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit content"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete content"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No content found</h3>
              <p className="text-slate-600">
                {(isEditor || isAdmin) ? 'Get started by creating some content.' : 'No content available to view.'}
              </p>
            </div>
          )}

          {/* View Content Modal */}
          {viewingContent && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Content Details</h3>
                  <button
                    onClick={() => setViewingContent(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Title</h4>
                    <p className="text-slate-700 text-lg leading-relaxed">{viewingContent.title}</p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Status</h4>
                    <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${getStatusBadgeColor(viewingContent.status)}`}>
                      {getStatusIcon(viewingContent.status)}
                      <span className="ml-2 capitalize">{viewingContent.status}</span>
                    </span>
                  </div>

                  {/* Content Body */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Content</h4>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{viewingContent.body}</p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Author</h4>
                      <div className="flex items-center text-slate-700">
                        <User className="h-5 w-5 mr-2" />
                        <span>{viewingContent.authorId?.name || 'Unknown'}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Created</h4>
                      <div className="flex items-center text-slate-700">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{new Date(viewingContent.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    {viewingContent.updatedAt && viewingContent.updatedAt !== viewingContent.createdAt && (
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">Last Updated</h4>
                        <div className="flex items-center text-slate-700">
                          <Clock className="h-5 w-5 mr-2" />
                          <span>{new Date(viewingContent.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                                     {/* Action Buttons */}
                   <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                     {(isEditor || isAdmin) && (
                       <button
                         onClick={() => {
                           setViewingContent(null);
                           openEditModal(viewingContent);
                         }}
                         className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                       >
                         <Edit className="w-4 h-4 mr-2 inline" />
                         Edit Content
                       </button>
                     )}
                     <button
                       onClick={() => setViewingContent(null)}
                       className="px-6 py-3 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200"
                     >
                       Close
                     </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Create/Edit Modal */}
          {(showCreateModal || editingContent) && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-2xl rounded-2xl bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {editingContent ? 'Edit Content' : 'Create New Content'}
                  </h3>
                  <button
                    onClick={closeModals}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={editingContent ? handleUpdate : handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter content title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Content
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter content body..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-6 py-3 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {editingContent ? 'Update Content' : 'Create Content'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireViewer>
  );
}
