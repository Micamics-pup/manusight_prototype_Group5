import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  LogOut,
  Eye,
  Shield,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  BarChart3,
} from 'lucide-react';
import type { Manuscript, Review } from '../../types';
import { EditorialAssessmentPage } from '../EditorialAssessmentPage';
import { FinalDecisionReviewPage, FinalDecisionData } from '../FinalDecisionReviewPage';

export function EditorInChiefDashboard() {
  const { currentUser, logout } = useAuth();
  const { manuscripts, notifications, reviews } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedManuscriptForAssessment, setSelectedManuscriptForAssessment] = useState<Manuscript | null>(null);
  const [selectedManuscriptForFinalDecision, setSelectedManuscriptForFinalDecision] = useState<Manuscript | null>(null);

  // Filter manuscripts
  const pendingAssessment = manuscripts.filter((ms) => ms.status === 'pending');
  const assessedManuscripts = manuscripts.filter((ms) => ms.status !== 'pending');
  const totalSubmissions = manuscripts.length;
  const awaitingDecision = pendingAssessment.length;
  const acceptedThisMonth = manuscripts.filter((ms) => ms.status !== 'pending' && ms.status !== 'rejected').length;
  const rejectedThisMonth = manuscripts.filter((ms) => ms.status === 'rejected').length;

  // Calculate average assessment time (mock)
  const avgAssessmentTime = 3; // days

  const filteredManuscripts = useMemo(() => {
    let filtered = selectedFilter === 'pending' ? pendingAssessment : manuscripts;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (ms) =>
          ms.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ms.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ms.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [manuscripts, pendingAssessment, selectedFilter, searchQuery]);

  const userNotifications = notifications.filter((n) => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  // Show Editorial Assessment Page if a manuscript is selected
  if (selectedManuscriptForAssessment) {
    return (
      <EditorialAssessmentPage
        manuscript={selectedManuscriptForAssessment}
        onBack={() => setSelectedManuscriptForAssessment(null)}
        onAssessmentComplete={(decision, data) => {
          // Don't auto-close if user is going to assign editor
          if (decision !== 'accept') {
            setTimeout(() => {
              setSelectedManuscriptForAssessment(null);
            }, 5000);
          }
        }}
      />
    );
  }

  // Show Final Decision Review Page if a manuscript is selected for final decision
  if (selectedManuscriptForFinalDecision) {
    const manuscriptReviews = reviews.filter(
      (r) => r.manuscriptId === selectedManuscriptForFinalDecision.id
    );

    return (
      <FinalDecisionReviewPage
        manuscript={selectedManuscriptForFinalDecision}
        reviews={manuscriptReviews}
        onBack={() => setSelectedManuscriptForFinalDecision(null)}
        onSubmitDecision={(decisionData: FinalDecisionData) => {
          setTimeout(() => {
            setSelectedManuscriptForFinalDecision(null);
          }, 100);
        }}
      />
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      review: 'bg-blue-100 text-blue-800',
      copyediting: 'bg-purple-100 text-purple-800',
      production: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Editor-in-Chief Portal</h1>
                <p className="text-xs text-gray-500">Initial Assessment & Editorial Screening</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search manuscripts by title, ID, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white/50 backdrop-blur"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Current Date */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500">Editor-in-Chief</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name?.split(' ')[1] || currentUser?.name}</h2>
              <p className="text-indigo-100">
                You have {awaitingDecision} manuscript{awaitingDecision !== 1 ? 's' : ''} awaiting initial assessment
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur rounded-lg">
              <Shield className="w-6 h-6" />
              <div>
                <p className="text-sm text-indigo-100">Assessment Role</p>
                <p className="font-semibold">Editor-in-Chief</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalSubmissions}</h3>
            <p className="text-sm text-gray-600">Total Submissions</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{awaitingDecision}</h3>
            <p className="text-sm text-gray-600">Awaiting Assessment</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{acceptedThisMonth}</h3>
            <p className="text-sm text-gray-600">Accepted This Month</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{avgAssessmentTime}d</h3>
            <p className="text-sm text-gray-600">Avg. Assessment Time</p>
          </div>
        </div>

        {/* Manuscripts Ready for Final Decision */}
        {(() => {
          const manuscriptsReadyForFinalDecision = manuscripts.filter((ms) => ms.status === 'copyediting');

          return manuscriptsReadyForFinalDecision.length > 0 ? (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200 shadow-md mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Manuscripts Ready for Final Decision</h3>
                  <p className="text-sm text-gray-600">Review and issue final publication decision</p>
                </div>
              </div>
              <div className="space-y-3">
                {manuscriptsReadyForFinalDecision.map((ms) => {
                  const manuscriptReviews = reviews.filter((r) => r.manuscriptId === ms.id);
                  const completedReviews = manuscriptReviews.filter((r) => r.status === 'completed');

                  return (
                    <div
                      key={ms.id}
                      className="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                            <span className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
                              Ready for Final Review
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">ID:</span> {ms.id} • <span className="font-medium">Author:</span> {ms.authorName}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              {completedReviews.length} {completedReviews.length === 1 ? 'review' : 'reviews'} completed
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-500" />
                              Submitted {ms.submittedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForFinalDecision(ms)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap"
                        >
                          <Shield className="w-4 h-4" />
                          Review & Decide
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null;
        })()}

        {/* Manuscripts Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Manuscript Submissions</h3>
            <div className="flex items-center gap-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Manuscripts</option>
                <option value="pending">Pending Assessment</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>

          {filteredManuscripts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No manuscripts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredManuscripts.map((ms) => (
                    <tr key={ms.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-mono text-gray-900">{ms.id}</td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900 max-w-md truncate">{ms.title}</p>
                        <p className="text-xs text-gray-500">{ms.category}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{ms.authorName}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {ms.submittedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ms.status)}`}>
                          {ms.status === 'pending' ? 'Awaiting Assessment' : ms.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          {ms.status === 'pending' && (
                            <button
                              onClick={() => setSelectedManuscriptForAssessment(ms)}
                              className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors"
                            >
                              <Shield className="w-4 h-4" />
                              Assess
                            </button>
                          )}
                          {ms.status === 'copyediting' && (
                            <button
                              onClick={() => setSelectedManuscriptForFinalDecision(ms)}
                              className="text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors"
                            >
                              <Shield className="w-4 h-4" />
                              Final Decision
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
