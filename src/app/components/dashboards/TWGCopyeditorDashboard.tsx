import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LogOut,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Calendar,
  TrendingUp,
  AlertCircle,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import type { Manuscript } from '../../types';
import { TWGCopyeditorCopyeditingStagePage } from '../TWGCopyeditorCopyeditingStagePage';
import { TWGFinalCopyeditingRevisionsPage } from '../TWGFinalCopyeditingRevisionsPage';

interface AssignedManuscript {
  id: string;
  title: string;
  authors: string;
  category: string;
  dateAssigned: Date;
  deadline: Date;
  daysRemaining: number;
  copyeditingProgress: number;
  plagiarismStatus: 'pending' | 'passed' | 'failed' | 'not_started';
  fileSubmissionStatus: 'incomplete' | 'ready';
  currentStatus: 'task_pending' | 'in_progress' | 'submitted' | 'revision_required' | 'overdue';
}

export function TWGCopyeditorDashboard() {
  const { currentUser, logout } = useAuth();
  const { manuscripts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [selectedManuscriptForFinalRevisions, setSelectedManuscriptForFinalRevisions] = useState<Manuscript | null>(null);

  // Mock assigned manuscripts data
  const assignedManuscripts: AssignedManuscript[] = [
    {
      id: 'ms-005',
      title: 'Blockchain Technology in Supply Chain Management',
      authors: 'Dr. Jane Smith',
      category: 'Technology',
      dateAssigned: new Date('2026-05-27'),
      deadline: new Date('2026-06-03'),
      daysRemaining: 7,
      copyeditingProgress: 35,
      plagiarismStatus: 'not_started',
      fileSubmissionStatus: 'incomplete',
      currentStatus: 'in_progress',
    },
    {
      id: 'ms-006',
      title: 'Artificial Intelligence in Healthcare Diagnostics',
      authors: 'Prof. John Doe',
      category: 'Medical Technology',
      dateAssigned: new Date('2026-05-25'),
      deadline: new Date('2026-05-29'),
      daysRemaining: 2,
      copyeditingProgress: 80,
      plagiarismStatus: 'passed',
      fileSubmissionStatus: 'ready',
      currentStatus: 'in_progress',
    },
    {
      id: 'ms-003',
      title: 'Neuroplasticity in Adult Learning',
      authors: 'Dr. Jane Smith',
      category: 'Neuroscience',
      dateAssigned: new Date('2026-05-20'),
      deadline: new Date('2026-05-26'),
      daysRemaining: -1,
      copyeditingProgress: 60,
      plagiarismStatus: 'pending',
      fileSubmissionStatus: 'incomplete',
      currentStatus: 'overdue',
    },
  ];

  // Calculate stats
  const totalAssigned = assignedManuscripts.length;
  const inProgress = assignedManuscripts.filter(m => m.currentStatus === 'in_progress').length;
  const submitted = assignedManuscripts.filter(m => m.currentStatus === 'submitted').length;
  const overdue = assignedManuscripts.filter(m => m.currentStatus === 'overdue').length;

  // Priority alerts
  const priorityAlerts = assignedManuscripts.filter(
    m => m.daysRemaining <= 3 || m.currentStatus === 'overdue'
  );

  // Recent activity
  const recentActivity = [
    {
      id: 'act-1',
      timestamp: new Date('2026-05-27T10:30:00'),
      manuscriptTitle: 'Blockchain Technology in Supply Chain Management',
      action: 'Started copyediting task',
      status: 'in_progress',
    },
    {
      id: 'act-2',
      timestamp: new Date('2026-05-27T09:15:00'),
      manuscriptTitle: 'Artificial Intelligence in Healthcare Diagnostics',
      action: 'Plagiarism check completed',
      status: 'passed',
    },
    {
      id: 'act-3',
      timestamp: new Date('2026-05-26T16:45:00'),
      manuscriptTitle: 'Neuroplasticity in Adult Learning',
      action: 'Uploaded copyedited files',
      status: 'in_progress',
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      task_pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      submitted: 'bg-green-100 text-green-800',
      revision_required: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      task_pending: 'Task Pending',
      in_progress: 'In Progress',
      submitted: 'Submitted',
      revision_required: 'Revision Required',
      overdue: 'Overdue',
    };
    return labels[status] || status;
  };

  const getPlagiarismBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      not_started: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPlagiarismLabel = (status: string) => {
    const labels: Record<string, string> = {
      not_started: 'Not Started',
      pending: 'Check Pending',
      passed: 'Check Passed',
      failed: 'Check Failed',
    };
    return labels[status] || status;
  };

  const getFileStatusBadgeColor = (status: string) => {
    return status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  const getFileStatusLabel = (status: string) => {
    return status === 'ready' ? 'All Files Ready' : 'Files Incomplete';
  };

  if (selectedManuscriptForFinalRevisions) {
    return (
      <TWGFinalCopyeditingRevisionsPage
        manuscript={selectedManuscriptForFinalRevisions}
        onBack={() => setSelectedManuscriptForFinalRevisions(null)}
      />
    );
  }

  // Show copyediting stage page if a manuscript is selected
  if (selectedManuscript) {
    return (
      <TWGCopyeditorCopyeditingStagePage
        manuscript={selectedManuscript}
        onBack={() => setSelectedManuscript(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TWG Copyeditor Dashboard</h1>
              <p className="text-sm text-gray-600">Manuscript copyediting and plagiarism verification</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  TWG Copyeditor
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* SECTION 1 - Summary Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Assigned Manuscripts</p>
            <p className="text-3xl font-bold text-gray-900">{totalAssigned}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Copyediting In Progress</p>
            <p className="text-3xl font-bold text-gray-900">{inProgress}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Submitted to TWG Coordinator</p>
            <p className="text-3xl font-bold text-gray-900">{submitted}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Overdue Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{overdue}</p>
          </div>
        </div>

        {/* Final Copyediting Revisions — Author Feedback Received */}
        {(() => {
          const finalRevisionManuscripts = manuscripts.filter(ms => ms.status === 'copyediting');
          if (finalRevisionManuscripts.length === 0) return null;
          return (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200 shadow-md mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Apply Final Copyediting Revisions</h2>
                  <p className="text-sm text-gray-600">Author feedback has been reviewed and forwarded by editor — apply final corrections</p>
                </div>
              </div>
              <div className="space-y-3">
                {finalRevisionManuscripts.map(ms => (
                  <div key={ms.id} className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{ms.title}</h3>
                          <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full font-medium">
                            Author Feedback Forwarded
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">ID:</span> {ms.id} &bull; <span className="font-medium">Author:</span> {ms.authorName}
                        </p>
                        <p className="text-sm text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          Editor has reviewed and approved author feedback — apply final revisions and prepare for production
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedManuscriptForFinalRevisions(ms)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors font-medium whitespace-nowrap ml-4"
                      >
                        <Eye className="w-4 h-4" />
                        Apply Final Revisions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* SECTION 3 - Priority and Deadline Alerts */}
        {priorityAlerts.length > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200 shadow-md mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">Priority & Deadline Alerts</h2>
            </div>
            <div className="space-y-3">
              {priorityAlerts.map((manuscript) => (
                <div
                  key={manuscript.id}
                  className="bg-white rounded-lg p-4 border border-red-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{manuscript.title}</h3>
                        {manuscript.currentStatus === 'overdue' && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                            OVERDUE
                          </span>
                        )}
                        {manuscript.daysRemaining <= 3 && manuscript.currentStatus !== 'overdue' && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium">
                            DUE SOON
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Deadline: {manuscript.deadline.toLocaleDateString()}</span>
                        <span className={manuscript.daysRemaining < 0 ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                          {manuscript.daysRemaining < 0
                            ? `${Math.abs(manuscript.daysRemaining)} days overdue`
                            : `${manuscript.daysRemaining} days remaining`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const ms = manuscripts.find(m => m.id === manuscript.id);
                        if (ms) setSelectedManuscript(ms);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4" />
                      View Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Manuscript List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">SEARCH</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by title or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">STATUS</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="task_pending">Task Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">SORT BY</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="deadline">Deadline</option>
                    <option value="dateAssigned">Date Assigned</option>
                    <option value="progress">Progress</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2 - Manuscript List Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Assigned Manuscripts</h2>
                  <span className="text-sm text-gray-600">{assignedManuscripts.length} manuscripts</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Authors</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Deadline</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Days Left</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assignedManuscripts.map((manuscript) => (
                      <tr key={manuscript.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <span className="text-sm font-mono text-gray-900">{manuscript.id}</span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-gray-900 max-w-xs">{manuscript.title}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">{manuscript.authors}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">{manuscript.category}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">{manuscript.deadline.toLocaleDateString()}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-sm font-semibold ${
                              manuscript.daysRemaining < 0
                                ? 'text-red-600'
                                : manuscript.daysRemaining <= 3
                                ? 'text-orange-600'
                                : 'text-gray-900'
                            }`}
                          >
                            {manuscript.daysRemaining < 0
                              ? `${Math.abs(manuscript.daysRemaining)}d overdue`
                              : `${manuscript.daysRemaining}d`}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2 min-w-[120px]">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Copyedit:</span>
                              <span className="font-semibold text-gray-900">{manuscript.copyeditingProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${manuscript.copyeditingProgress}%` }}
                              ></div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getPlagiarismBadgeColor(manuscript.plagiarismStatus)}`}>
                                {getPlagiarismLabel(manuscript.plagiarismStatus)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getFileStatusBadgeColor(manuscript.fileSubmissionStatus)}`}>
                                {getFileStatusLabel(manuscript.fileSubmissionStatus)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(manuscript.currentStatus)}`}>
                            {getStatusLabel(manuscript.currentStatus)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => {
                              const ms = manuscripts.find(m => m.id === manuscript.id);
                              if (ms) setSelectedManuscript(ms);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            View Task
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            {/* SECTION 4 - Recent Activity Log */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {activity.timestamp.toLocaleString()}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {activity.manuscriptTitle}
                      </p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <span
                        className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                          activity.status === 'passed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {activity.status === 'passed' ? 'Passed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Completion Time</span>
                  <span className="text-sm font-semibold text-gray-900">4.5 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plagiarism Checks Done</span>
                  <span className="text-sm font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-semibold text-green-600">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
