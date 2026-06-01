import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LogOut,
  FileText,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  Target,
  Activity,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import type { Manuscript } from '../../types';
import { TWGTaskAssignmentPage, TWGAssignmentData } from '../TWGTaskAssignmentPage';
import { TWGManuscriptTaskMonitoringPage } from '../TWGManuscriptTaskMonitoringPage';
import { TWGCoordinatorReviewCopyeditedPage } from '../TWGCoordinatorReviewCopyeditedPage';

export function TWGCoordinatorDashboard() {
  const { currentUser, logout } = useAuth();
  const { manuscripts, reviews } = useData();
  const [selectedManuscriptForAssignment, setSelectedManuscriptForAssignment] = useState<Manuscript | null>(null);
  const [selectedManuscriptForMonitoring, setSelectedManuscriptForMonitoring] = useState<Manuscript | null>(null);
  const [selectedManuscriptForReview, setSelectedManuscriptForReview] = useState<Manuscript | null>(null);

  // Filter manuscripts that are endorsed to TWG (production status)
  const manuscriptsReadyForAssignment = manuscripts.filter((ms) => ms.status === 'production');
  const manuscriptsReadyForReview = manuscripts.filter((ms) => ms.id === 'ms-006'); // Mock: ms-006 is ready for coordinator review
  const assignedManuscripts = manuscripts.filter((ms) => ms.status === 'copyediting' && ms.id !== 'ms-006'); // Assuming copyediting means tasks assigned
  const completedManuscripts = manuscripts.filter((ms) => ms.status === 'rejected'); // Mock completed

  // Show Review Page if a manuscript is selected for review
  if (selectedManuscriptForReview) {
    return (
      <TWGCoordinatorReviewCopyeditedPage
        manuscript={selectedManuscriptForReview}
        onBack={() => setSelectedManuscriptForReview(null)}
      />
    );
  }

  // Show Task Monitoring Page if a manuscript is selected for monitoring
  if (selectedManuscriptForMonitoring) {
    return (
      <TWGManuscriptTaskMonitoringPage
        manuscript={selectedManuscriptForMonitoring}
        onBack={() => setSelectedManuscriptForMonitoring(null)}
      />
    );
  }

  // Show Task Assignment Page if a manuscript is selected
  if (selectedManuscriptForAssignment) {
    const manuscriptReviews = reviews.filter((r) => r.manuscriptId === selectedManuscriptForAssignment.id);

    return (
      <TWGTaskAssignmentPage
        manuscript={selectedManuscriptForAssignment}
        reviews={manuscriptReviews}
        endorsementData={{
          decision: 'Endorsed to TWG for Production',
          justification: 'Manuscript has successfully completed all peer review and editorial evaluation stages.',
          technicalConcerns: 'Minor formatting adjustments needed during copyediting phase.',
          publicationReadiness: 'All criteria met',
          revisionCompliance: 'Fully compliant',
          timestamp: new Date(),
          endorsedBy: 'Dr. Sarah Johnson',
        }}
        onBack={() => setSelectedManuscriptForAssignment(null)}
        onSubmitAssignment={(assignmentData: TWGAssignmentData) => {
          setTimeout(() => {
            setSelectedManuscriptForAssignment(null);
          }, 100);
        }}
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
              <h1 className="text-2xl font-bold text-gray-900">TWG Coordinator Dashboard</h1>
              <p className="text-sm text-gray-600">Manuscript production task assignment and monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-blue-600">TWG Coordinator</p>
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

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Awaiting Assignment</p>
            <p className="text-3xl font-bold text-gray-900">{manuscriptsReadyForAssignment.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">In Production</p>
            <p className="text-3xl font-bold text-gray-900">{assignedManuscripts.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-900">{completedManuscripts.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg. Completion</p>
            <p className="text-3xl font-bold text-gray-900">28d</p>
          </div>
        </div>

        {/* Manuscripts Ready for Coordinator Review */}
        {manuscriptsReadyForReview.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 shadow-md mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Manuscripts Ready for Coordinator Review</h2>
                <p className="text-sm text-gray-600">Copyedited manuscripts submitted for validation</p>
              </div>
            </div>

            <div className="space-y-3">
              {manuscriptsReadyForReview.map((manuscript) => (
                <div
                  key={manuscript.id}
                  className="bg-white rounded-lg p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{manuscript.title}</h3>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                          Copyediting Complete
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Manuscript ID</p>
                          <p className="text-sm font-medium text-gray-900">{manuscript.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Author</p>
                          <p className="text-sm font-medium text-gray-900">{manuscript.authorName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="text-sm font-medium text-gray-900">{manuscript.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Copyeditor</p>
                          <p className="text-sm font-medium text-gray-900">Sarah Martinez</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <AlertCircle className="w-4 h-4" />
                        <span>Submitted by copyeditor - Ready for coordinator validation</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedManuscriptForReview(manuscript)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap ml-4"
                    >
                      <FileText className="w-4 h-4" />
                      Review Manuscript
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manuscripts Ready for Task Assignment */}
        {manuscriptsReadyForAssignment.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 shadow-md mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Manuscripts Awaiting Task Assignment</h2>
                <p className="text-sm text-gray-600">Endorsed manuscripts ready for production workflow</p>
              </div>
            </div>

            <div className="space-y-3">
              {manuscriptsReadyForAssignment.map((manuscript) => {
                const manuscriptReviews = reviews.filter((r) => r.manuscriptId === manuscript.id);
                return (
                  <div
                    key={manuscript.id}
                    className="bg-white rounded-lg p-5 border border-purple-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{manuscript.title}</h3>
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
                            Ready for Assignment
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Manuscript ID</p>
                            <p className="text-sm font-medium text-gray-900">{manuscript.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Author</p>
                            <p className="text-sm font-medium text-gray-900">{manuscript.authorName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="text-sm font-medium text-gray-900">{manuscript.category}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Reviews Completed</p>
                            <p className="text-sm font-medium text-gray-900">
                              {manuscriptReviews.filter((r) => r.status === 'completed').length}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-purple-800">
                          <AlertCircle className="w-4 h-4" />
                          <span>Endorsed by Editor - Ready for production task assignment</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedManuscriptForAssignment(manuscript)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap ml-4"
                      >
                        <Users className="w-4 h-4" />
                        Assign Tasks
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* In Production Manuscripts */}
        {assignedManuscripts.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Manuscripts In Production</h2>
            </div>
            <div className="space-y-3">
              {assignedManuscripts.map((manuscript) => (
                <div
                  key={manuscript.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{manuscript.title}</p>
                      <p className="text-sm text-gray-600">ID: {manuscript.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        In Progress
                      </span>
                      <button
                        onClick={() => setSelectedManuscriptForMonitoring(manuscript)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        View Progress
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {manuscriptsReadyForAssignment.length === 0 && assignedManuscripts.length === 0 && (
          <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Manuscripts Awaiting Assignment</h3>
            <p className="text-sm text-gray-600">
              Manuscripts endorsed by editors will appear here for task assignment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
