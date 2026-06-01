import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  UserCheck,
  UserX,
  Eye,
  Download,
  Upload,
  History,
  List,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Manuscript, ManuscriptStatus, User, UserRole } from '../../types';
import { ManuscriptDetailView } from './ManuscriptDetailView';
import { ManuscriptListPage } from '../ManuscriptListPage';
import { EditorReviewCopyeditedPage } from '../EditorReviewCopyeditedPage';

type EditorView = 'dashboard' | 'manuscripts' | 'users' | 'listview';

export function EditorDashboard() {
  const { currentUser } = useAuth();
  const {
    manuscripts,
    reviews,
    users,
    updateManuscriptStatus,
    assignReviewer,
    addComment,
    updateUser,
  } = useData();
  const [currentView, setCurrentView] = useState<EditorView>('dashboard');
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [viewManuscript, setViewManuscript] = useState<Manuscript | null>(null);
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [revisionNote, setRevisionNote] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('author');
  const [detailedViewManuscript, setDetailedViewManuscript] = useState<Manuscript | null>(null);
  const [manuscriptFilter, setManuscriptFilter] = useState<'all' | 'pending' | 'review' | 'copyediting' | 'production'>('all');
  const [selectedCopyeditedManuscript, setSelectedCopyeditedManuscript] = useState<Manuscript | null>(null);

  // Show copyediting review page if selected
  if (selectedCopyeditedManuscript) {
    return (
      <EditorReviewCopyeditedPage
        manuscript={selectedCopyeditedManuscript}
        onBack={() => setSelectedCopyeditedManuscript(null)}
      />
    );
  }

  const editorManuscripts = manuscripts.filter((ms) => ms.assignedEditorId === currentUser?.id);
  const reviewers = users.filter((u) => u.role === 'reviewer');

  const handleAssignReviewer = () => {
    if (selectedManuscript && selectedReviewerId) {
      assignReviewer(selectedManuscript.id, selectedReviewerId);
      updateManuscriptStatus(selectedManuscript.id, 'under_review');
      setSelectedReviewerId('');
      setSelectedManuscript(null);
    }
  };

  const handleStatusChange = (manuscriptId: string, status: ManuscriptStatus) => {
    updateManuscriptStatus(manuscriptId, status);
    if (status === 'revision_requested' && revisionNote && currentUser) {
      addComment({
        manuscriptId,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        content: revisionNote,
      });
      setRevisionNote('');
    }
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    updateUser(userId, updates);
    setSelectedUser(null);
  };

  const getManuscriptReviews = (manuscriptId: string) => {
    return reviews.filter((r) => r.manuscriptId === manuscriptId);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-blue-100 text-blue-800',
      review: 'bg-yellow-100 text-yellow-800',
      copyediting: 'bg-purple-100 text-purple-800',
      production: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      review: 'Review',
      copyediting: 'Copyediting',
      production: 'Production',
      rejected: 'Rejected',
    };
    return labels[status] || status.replace(/_/g, ' ');
  };

  const roleLabels: Record<UserRole, string> = {
    author: 'Author',
    editor: 'Editor',
    reviewer: 'Reviewer',
    layout_artist: 'Layout Artist',
    admin: 'Administrator',
  };

  const getManuscriptsByStatus = () => {
    const statusCounts: Record<string, number> = {};
    manuscripts.forEach((ms) => {
      statusCounts[ms.status] = (statusCounts[ms.status] || 0) + 1;
    });
    return statusCounts;
  };

  const statusCounts = getManuscriptsByStatus();

  const getFilteredManuscripts = () => {
    if (manuscriptFilter === 'all') return editorManuscripts;

    return editorManuscripts.filter((ms) => ms.status === manuscriptFilter);
  };

  const filteredManuscripts = getFilteredManuscripts();

  const sidebarItems = [
    { id: 'dashboard' as EditorView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manuscripts' as EditorView, label: 'Manuscripts', icon: FileText },
    { id: 'listview' as EditorView, label: 'View All Manuscripts', icon: List },
    { id: 'users' as EditorView, label: 'Users', icon: Users },
  ];

  // If a manuscript is selected for detailed view, show that instead
  if (detailedViewManuscript) {
    return (
      <ManuscriptDetailView
        manuscript={detailedViewManuscript}
        onBack={() => setDetailedViewManuscript(null)}
      />
    );
  }

  // If list view is selected, show ManuscriptListPage
  if (currentView === 'listview') {
    return (
      <ManuscriptListPage
        onViewDetails={(manuscript) => setDetailedViewManuscript(manuscript)}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-lg border border-gray-200 p-4 h-fit sticky top-24">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {currentView === 'dashboard' && (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Total Manuscripts</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {editorManuscripts.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-semibold text-blue-600 mt-2">
                  {editorManuscripts.filter((ms) => ms.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Review</p>
                <p className="text-3xl font-semibold text-yellow-600 mt-2">
                  {editorManuscripts.filter((ms) => ms.status === 'review').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Production</p>
                <p className="text-3xl font-semibold text-green-600 mt-2">
                  {editorManuscripts.filter((ms) => ms.status === 'production').length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {editorManuscripts.slice(0, 5).map((manuscript) => (
                  <div
                    key={manuscript.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{manuscript.title}</p>
                      <p className="text-sm text-gray-600">
                        {manuscript.authorName} • {manuscript.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        manuscript.status
                      )}`}
                    >
                      {getStatusLabel(manuscript.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">{getStatusLabel(status)}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manuscripts Ready for Copyediting Review */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manuscripts Ready for Copyediting Review</h3>
                    <p className="text-sm text-gray-600">Copyedited manuscripts awaiting editor approval</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {editorManuscripts.filter(ms => ms.status === 'copyediting').length > 0 ? (
                    editorManuscripts.filter(ms => ms.status === 'copyediting').map((manuscript) => (
                      <div
                        key={manuscript.id}
                        className="bg-white rounded-lg p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{manuscript.title}</h4>
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                                Copyediting Complete
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Manuscript ID</p>
                                <p className="font-medium text-gray-900">{manuscript.id}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Author</p>
                                <p className="font-medium text-gray-900">{manuscript.authorName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Category</p>
                                <p className="font-medium text-gray-900">{manuscript.category}</p>
                              </div>
                            </div>
                            <p className="text-sm text-green-800 mt-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Validated by TWG Coordinator - Ready for editor review
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedCopyeditedManuscript(manuscript)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap ml-4"
                          >
                            <Eye className="w-4 h-4" />
                            Review Copyediting
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-600">
                      <p className="text-sm">No manuscripts ready for copyediting review at this time.</p>
                      <p className="text-xs mt-1">Total assigned manuscripts: {editorManuscripts.length}</p>
                    </div>
                  )}
                </div>
              </div>
          </>
        )}

        {currentView === 'manuscripts' && (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Manuscript Management</h2>
              <p className="text-gray-600 mt-1">View all manuscripts, assign reviewers, and manage workflow</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">All Manuscripts</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setManuscriptFilter('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      manuscriptFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setManuscriptFilter('pending')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      manuscriptFilter === 'pending'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setManuscriptFilter('review')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      manuscriptFilter === 'review'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Review
                  </button>
                  <button
                    onClick={() => setManuscriptFilter('copyediting')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      manuscriptFilter === 'copyediting'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Copyediting
                  </button>
                  <button
                    onClick={() => setManuscriptFilter('production')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      manuscriptFilter === 'production'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Production
                  </button>
                </div>
              </div>
              {filteredManuscripts.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No manuscripts assigned</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Title & Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {editorManuscripts.map((manuscript) => {
                        return (
                          <tr key={manuscript.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{manuscript.id}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{manuscript.title}</div>
                              <div className="text-sm text-gray-600">{manuscript.authorName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">{manuscript.category}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                  manuscript.status
                                )}`}
                              >
                                {getStatusLabel(manuscript.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setDetailedViewManuscript(manuscript)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {currentView === 'users' && (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
              <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
                <p className="text-3xl font-semibold text-gray-900">{users.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
                <p className="text-3xl font-semibold text-gray-900">
                  {users.filter((u) => u.active).length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-gray-600">Authors</p>
                </div>
                <p className="text-3xl font-semibold text-gray-900">
                  {users.filter((u) => u.role === 'author').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <p className="text-sm text-gray-600">Reviewers</p>
                </div>
                <p className="text-3xl font-semibold text-gray-900">
                  {users.filter((u) => u.role === 'reviewer').length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={user.id} className="p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                          {roleLabels[user.role]}
                        </span>
                        {user.active ? (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <UserCheck className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-600">
                            <UserX className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setEditRole(user.role);
                        }}
                        className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleUpdateUser(user.id, { active: !user.active })}
                        className={`px-3 py-1.5 text-sm rounded ${
                          user.active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Assign Reviewer Dialog */}
      <Dialog.Root open={!!selectedManuscript} onOpenChange={() => setSelectedManuscript(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Assign Reviewer
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Assign a reviewer to this manuscript
            </Dialog.Description>
            {selectedManuscript && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Manuscript</p>
                  <p className="text-gray-900">{selectedManuscript.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Reviewers</p>
                  {selectedManuscript.assignedReviewers.length === 0 ? (
                    <p className="text-sm text-gray-500">None assigned</p>
                  ) : (
                    <div className="space-y-1">
                      {selectedManuscript.assignedReviewers.map((rid) => {
                        const reviewer = users.find((u) => u.id === rid);
                        return (
                          <p key={rid} className="text-sm text-gray-700">
                            • {reviewer?.name}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Reviewer
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedReviewerId}
                    onChange={(e) => setSelectedReviewerId(e.target.value)}
                  >
                    <option value="">Choose a reviewer...</option>
                    {reviewers
                      .filter((r) => !selectedManuscript.assignedReviewers.includes(r.id))
                      .map((reviewer) => (
                        <option key={reviewer.id} value={reviewer.id}>
                          {reviewer.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={handleAssignReviewer}
                    disabled={!selectedReviewerId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Edit User Dialog */}
      <Dialog.Root open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Edit User
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Edit user account details and role
            </Dialog.Description>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                  >
                    {(['author', 'editor', 'reviewer', 'layout_artist', 'admin'] as UserRole[]).map(
                      (role) => (
                        <option key={role} value={role}>
                          {roleLabels[role]}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={() => handleUpdateUser(selectedUser.id, { role: editRole })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* View Manuscript Details Dialog */}
      <Dialog.Root open={!!viewManuscript} onOpenChange={() => setViewManuscript(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Manuscript Application Details
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              View complete manuscript application, files, and revision history
            </Dialog.Description>
            {viewManuscript && (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{viewManuscript.title}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        viewManuscript.status
                      )}`}
                    >
                      {getStatusLabel(viewManuscript.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{viewManuscript.category}</p>
                </div>

                {/* Author Information */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Author Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium text-gray-900">{viewManuscript.authorName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Author ID:</span>
                      <span className="text-sm font-medium text-gray-900">{viewManuscript.authorId}</span>
                    </div>
                  </div>
                </div>

                {/* Submission Dates */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Submission Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Submitted:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {viewManuscript.submittedAt.toLocaleDateString()} at{' '}
                        {viewManuscript.submittedAt.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {viewManuscript.updatedAt.toLocaleDateString()} at{' '}
                        {viewManuscript.updatedAt.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Manuscript ID:</span>
                      <span className="text-sm font-medium text-gray-900">{viewManuscript.id}</span>
                    </div>
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Abstract</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewManuscript.abstract}</p>
                  </div>
                </div>

                {/* Manuscript Content */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Manuscript Content</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewManuscript.content}</p>
                  </div>
                </div>

                {/* Review Status */}
                {viewManuscript.assignedReviewers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Assigned Reviewers</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        {viewManuscript.assignedReviewers.map((reviewerId) => {
                          const reviewer = users.find((u) => u.id === reviewerId);
                          const review = reviews.find(
                            (r) => r.manuscriptId === viewManuscript.id && r.reviewerId === reviewerId
                          );
                          return (
                            <div key={reviewerId} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{reviewer?.name}</span>
                              <span
                                className={`px-2 py-1 text-xs rounded ${
                                  review?.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {review?.status === 'completed' ? `${review.decision}` : 'In Progress'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Uploaded Files */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Uploaded Files ({viewManuscript.files.length})
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {viewManuscript.files.length === 0 ? (
                      <p className="text-sm text-gray-500">No files uploaded</p>
                    ) : (
                      <div className="space-y-3">
                        {viewManuscript.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-white rounded border border-gray-200"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  {file.fileName}
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded ${
                                    file.fileType === 'original'
                                      ? 'bg-blue-100 text-blue-800'
                                      : file.fileType === 'revision'
                                      ? 'bg-purple-100 text-purple-800'
                                      : file.fileType === 'reviewer_feedback'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {file.fileType.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Uploaded by {file.uploadedByName} on{' '}
                                {file.uploadedAt.toLocaleDateString()}
                              </p>
                              {file.notes && (
                                <p className="text-xs text-gray-600 mt-1 italic">{file.notes}</p>
                              )}
                            </div>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Revision History */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Revision History
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {viewManuscript.revisionHistory
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((revision) => (
                          <div
                            key={revision.id}
                            className="flex gap-3 p-3 bg-white rounded border border-gray-200"
                          >
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-blue-600"></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 text-xs rounded font-medium ${getStatusColor(
                                    revision.status
                                  )}`}
                                >
                                  {getStatusLabel(revision.status)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {revision.date.toLocaleDateString()} at{' '}
                                  {revision.date.toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">{revision.changedByName}:</span>{' '}
                                {revision.notes}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Close
                    </button>
                  </Dialog.Close>
                  {viewManuscript.assignedReviewers.length === 0 && (
                    <button
                      onClick={() => {
                        setSelectedManuscript(viewManuscript);
                        setViewManuscript(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Assign Reviewer
                    </button>
                  )}
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
