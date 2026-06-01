import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  FileText,
  Search,
  Bell,
  User,
  ChevronDown,
  Home,
  List,
  TrendingUp,
  MessageSquare,
  Settings,
  LogOut,
  AlertCircle,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Manuscript, UserRole } from '../types/index';

interface ManuscriptListPageProps {
  onViewDetails?: (manuscript: Manuscript) => void;
  onBack?: () => void;
}

export function ManuscriptListPage({ onViewDetails, onBack }: ManuscriptListPageProps) {
  const { currentUser, switchRole, logout } = useAuth();
  const { manuscripts, notifications, markNotificationRead, users } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'title' | 'submittedAt' | 'status'>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showError, setShowError] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const itemsPerPage = 10;

  const userNotifications = notifications.filter((n) => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, string> = {
    author: 'Author',
    editor: 'Editor',
    reviewer: 'Reviewer',
    layout_artist: 'Layout Artist',
    admin: 'Administrator',
  };

  // Role-based manuscript filtering
  const roleFilteredManuscripts = useMemo(() => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'author':
        return manuscripts.filter((ms) => ms.authorId === currentUser.id);
      case 'editor':
        return manuscripts;
      case 'reviewer':
        return manuscripts.filter((ms) => ms.assignedReviewers.includes(currentUser.id));
      case 'admin':
        return manuscripts;
      default:
        return manuscripts;
    }
  }, [manuscripts, currentUser]);

  // Apply filters and search
  const filteredManuscripts = useMemo(() => {
    let filtered = roleFilteredManuscripts;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((ms) => ms.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ms) =>
          ms.title.toLowerCase().includes(query) ||
          ms.authorName.toLowerCase().includes(query) ||
          ms.id.toLowerCase().includes(query) ||
          ms.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [roleFilteredManuscripts, statusFilter, searchQuery]);

  // Sort manuscripts
  const sortedManuscripts = useMemo(() => {
    const sorted = [...filteredManuscripts];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'submittedAt':
          comparison = a.submittedAt.getTime() - b.submittedAt.getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredManuscripts, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedManuscripts.length / itemsPerPage);
  const paginatedManuscripts = sortedManuscripts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'title' | 'submittedAt' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
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
      review: 'In Review',
      copyediting: 'Copyediting',
      production: 'Production',
      rejected: 'Rejected',
    };
    return labels[status] || status.replace(/_/g, ' ');
  };

  const getProgressPercentage = (manuscript: Manuscript) => {
    const statusProgress: Record<string, number> = {
      pending: 20,
      review: 40,
      copyediting: 60,
      production: 80,
      rejected: 0,
    };
    return statusProgress[manuscript.status] || 0;
  };

  const getAssignedReviewerName = (manuscript: Manuscript) => {
    if (manuscript.assignedReviewers.length === 0) return 'Not assigned';
    const reviewer = users.find((u) => u.id === manuscript.assignedReviewers[0]);
    return reviewer ? reviewer.name : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">MMS Portal</h2>
          <p className="text-xs text-gray-500 mt-1">Manuscript Management System</p>
        </div>

        <nav className="px-3 space-y-1">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <List className="w-5 h-5" />
            <span>View Manuscripts</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span>Workflow Progress</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {currentUser?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.role ? roleLabels[currentUser.role] : ''}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search manuscripts..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Role Badge */}
                <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentUser?.role ? roleLabels[currentUser.role] : ''}
                </span>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                      <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
                      {userNotifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No notifications</p>
                      ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {userNotifications.slice(0, 5).map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 rounded-lg border cursor-pointer ${
                                notif.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                              }`}
                              onClick={() => markNotificationRead(notif.id)}
                            >
                              <p className="text-sm text-gray-900">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notif.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{currentUser?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-3 py-2 border-b border-gray-200 mb-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Switch Role</p>
                      </div>
                      {(['author', 'editor', 'reviewer', 'layout_artist', 'admin'] as UserRole[]).map(
                        (role) => (
                          <button
                            key={role}
                            className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              switchRole(role);
                              setIsProfileOpen(false);
                            }}
                          >
                            {roleLabels[role]}
                          </button>
                        )
                      )}
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Manuscript Records</h1>
            <p className="text-gray-600 mt-1">
              Viewing {filteredManuscripts.length} manuscript{filteredManuscripts.length !== 1 ? 's' : ''}
              {currentUser?.role === 'author' && ' (your submissions)'}
              {currentUser?.role === 'reviewer' && ' (assigned to you)'}
            </p>
          </div>

          {/* Error Alert */}
          {showError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Data Retrieval Failed</h3>
                <p className="text-sm text-red-700 mt-1">
                  Unable to load manuscript data. Please reload the page or contact support.
                </p>
              </div>
              <button
                onClick={() => setShowError(false)}
                className="text-red-600 hover:text-red-800"
              >
                <span className="sr-only">Close</span>×
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="review">In Review</option>
              <option value="copyediting">Copyediting</option>
              <option value="production">Production</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Test Error Button */}
            <button
              onClick={() => setShowError(!showError)}
              className="ml-auto text-sm text-gray-600 hover:text-gray-900"
            >
              {showError ? 'Hide' : 'Test'} Error State
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {paginatedManuscripts.length === 0 ? (
              <div className="py-16 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No manuscript records found
                </h3>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'There are no manuscripts to display'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('title')}
                      >
                        <div className="flex items-center gap-2">
                          Manuscript ID / Title
                          {sortField === 'title' && (
                            <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Author
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {sortField === 'status' && (
                            <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('submittedAt')}
                      >
                        <div className="flex items-center gap-2">
                          Submission Date
                          {sortField === 'submittedAt' && (
                            <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Assigned Reviewer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedManuscripts.map((manuscript) => {
                      const progress = getProgressPercentage(manuscript);
                      return (
                        <tr key={manuscript.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">{manuscript.id}</div>
                              <div className="text-sm font-medium text-gray-900">
                                {manuscript.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{manuscript.authorName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                manuscript.status
                              )}`}
                            >
                              {getStatusLabel(manuscript.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {manuscript.submittedAt.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {getAssignedReviewerName(manuscript)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                                <div
                                  className={`h-2 rounded-full ${
                                    manuscript.status === 'rejected'
                                      ? 'bg-red-500'
                                      : manuscript.status === 'production'
                                      ? 'bg-green-500'
                                      : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 w-8">{progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => onViewDetails?.(manuscript)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedManuscripts.length)} of{' '}
                {sortedManuscripts.length} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
