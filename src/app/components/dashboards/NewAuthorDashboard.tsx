import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  FileText,
  Upload,
  AlertCircle,
  MessageSquare,
  Settings,
  LogOut,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar,
  Home,
} from 'lucide-react';
import type { Manuscript } from '../../types';
import { ManuscriptSubmissionPage } from '../ManuscriptSubmissionPage';
import { RevisionUploadPage, RevisionSubmissionData } from '../RevisionUploadPage';
import { AuthorCopyeditingReviewPage } from '../AuthorCopyeditingReviewPage';
import { AuthorCoverApprovalPage } from '../AuthorCoverApprovalPage';
import { AuthorTypesettingApprovalPage } from '../AuthorTypesettingApprovalPage';
import { AuthorAgreementPage } from '../AuthorAgreementPage';
import { AuthorDecisionPage } from '../AuthorDecisionPage';

export function NewAuthorDashboard() {
  const { currentUser, logout } = useAuth();
  const { manuscripts, notifications, reviews, users } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedManuscriptForRevision, setSelectedManuscriptForRevision] = useState<Manuscript | null>(null);
  const [selectedManuscriptForCopyeditingReview, setSelectedManuscriptForCopyeditingReview] = useState<Manuscript | null>(null);
  const [selectedManuscriptForCoverApproval, setSelectedManuscriptForCoverApproval] = useState<Manuscript | null>(null);
  const [selectedManuscriptForTypesettingApproval, setSelectedManuscriptForTypesettingApproval] = useState<Manuscript | null>(null);
  const [selectedManuscriptForAgreement, setSelectedManuscriptForAgreement] = useState<Manuscript | null>(null);
  const [selectedManuscriptForDecision, setSelectedManuscriptForDecision] = useState<Manuscript | null>(null);

  // Filter manuscripts for current author
  const authorManuscripts = manuscripts.filter((ms) => ms.authorId === currentUser?.id);
  const userNotifications = notifications.filter((n) => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  // Calculate metrics
  const totalManuscripts = authorManuscripts.length;
  const underReview = authorManuscripts.filter((ms) => ms.status === 'review').length;
  const awaitingRevision = authorManuscripts.filter((ms) => {
    const manuscriptReviews = reviews.filter((r) => r.manuscriptId === ms.id);
    return manuscriptReviews.some(
      (r) => r.decision === 'minor_revision' || r.decision === 'major_revision'
    );
  }).length;
  const published = authorManuscripts.filter((ms) => ms.status === 'production').length;

  // Get manuscripts requiring action
  const manuscriptsRequiringAction = authorManuscripts.filter((ms) => {
    const manuscriptReviews = reviews.filter((r) => r.manuscriptId === ms.id);
    return manuscriptReviews.some(
      (r) => r.decision === 'minor_revision' || r.decision === 'major_revision'
    );
  });

  // Get recent manuscripts (5 most recent)
  const recentManuscripts = [...authorManuscripts]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  // Get most recently active manuscript for tracker
  const mostRecentManuscript = recentManuscripts[0];

  // Get recent notifications (5 most recent)
  const recentNotifications = [...userNotifications]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Current date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
      review: 'Under Review',
      copyediting: 'Copyediting',
      production: 'Published',
      rejected: 'Rejected',
    };
    return labels[status] || status.replace(/_/g, ' ');
  };

  const manuscriptStages = [
    { id: 'submitted', label: 'Submitted', icon: Upload },
    { id: 'review', label: 'Review', icon: Eye },
    { id: 'revision', label: 'Revision', icon: AlertCircle },
    { id: 'copyediting', label: 'Copyediting', icon: FileText },
    { id: 'production', label: 'Production', icon: Settings },
    { id: 'published', label: 'Published', icon: CheckCircle },
  ];

  const getCurrentStageIndex = (manuscript: Manuscript) => {
    if (manuscript.status === 'production') return 5;
    if (manuscript.status === 'copyediting') return 3;
    if (manuscript.status === 'review') return 1;
    return 0;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'manuscripts', label: 'My Manuscripts', icon: FileText },
    { id: 'submit', label: 'Submit New Manuscript', icon: Upload },
    { id: 'revisions', label: 'Revision Requests', icon: AlertCircle },
    { id: 'feedback', label: 'Reviewer Feedback', icon: MessageSquare },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Notification Settings', icon: Settings },
  ];

  if (selectedManuscriptForAgreement) {
    return (
      <AuthorAgreementPage
        manuscript={selectedManuscriptForAgreement}
        onBack={() => setSelectedManuscriptForAgreement(null)}
        onAgree={() => {
          setSelectedManuscriptForAgreement(null);
          if (selectedManuscriptForAgreement) {
            setSelectedManuscriptForDecision(selectedManuscriptForAgreement);
          }
        }}
      />
    );
  }

  if (selectedManuscriptForDecision) {
    return (
      <AuthorDecisionPage
        manuscript={selectedManuscriptForDecision}
        onBack={() => setSelectedManuscriptForDecision(null)}
        onProceed={() => {
          setSelectedManuscriptForDecision(null);
        }}
        onWithdraw={() => {
          setSelectedManuscriptForDecision(null);
        }}
      />
    );
  }

  if (selectedManuscriptForCopyeditingReview) {
    return (
      <AuthorCopyeditingReviewPage
        manuscript={selectedManuscriptForCopyeditingReview}
        onBack={() => setSelectedManuscriptForCopyeditingReview(null)}
      />
    );
  }

  if (selectedManuscriptForCoverApproval) {
    return (
      <AuthorCoverApprovalPage
        manuscript={selectedManuscriptForCoverApproval}
        onBack={() => setSelectedManuscriptForCoverApproval(null)}
      />
    );
  }

  if (selectedManuscriptForTypesettingApproval) {
    return (
      <AuthorTypesettingApprovalPage
        manuscript={selectedManuscriptForTypesettingApproval}
        onBack={() => setSelectedManuscriptForTypesettingApproval(null)}
      />
    );
  }

  if (showSubmissionForm) {
    return (
      <ManuscriptSubmissionPage
        onBack={() => setShowSubmissionForm(false)}
        onSubmit={(data) => {
          setShowSubmissionForm(false);
        }}
      />
    );
  }

  if (selectedManuscriptForRevision) {
    return (
      <RevisionUploadPage
        manuscript={selectedManuscriptForRevision}
        onBack={() => setSelectedManuscriptForRevision(null)}
        onSubmitRevision={(revisionData: RevisionSubmissionData) => {
          setTimeout(() => {
            setSelectedManuscriptForRevision(null);
          }, 100);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo/System Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a1f2e] rounded flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="font-serif text-lg text-[#1a1f2e]">MMS</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your manuscripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    {currentUser?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Change Password
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'submit') {
                      setShowSubmissionForm(true);
                    } else {
                      setActiveNavItem(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeNavItem === item.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 max-w-7xl">
          {/* ① Welcome Banner */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-[#1a1f2e] mb-2">
              Welcome back, {currentUser?.name}.
            </h1>
            <p className="text-sm text-gray-600 mb-4">{today}</p>
            {manuscriptsRequiringAction.length > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-900">
                  You have {manuscriptsRequiringAction.length} manuscript
                  {manuscriptsRequiringAction.length !== 1 ? 's' : ''} requiring your attention.
                </p>
              </div>
            )}
          </div>

          {/* ② Summary Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <button className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left">
              <p className="text-sm text-gray-600 mb-2">Total Manuscripts Submitted</p>
              <p className="text-3xl font-semibold text-gray-900">{totalManuscripts}</p>
            </button>
            <button className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left">
              <p className="text-sm text-gray-600 mb-2">Currently Under Review</p>
              <p className="text-3xl font-semibold text-yellow-600">{underReview}</p>
            </button>
            <button className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left">
              <p className="text-sm text-gray-600 mb-2">Awaiting Revision</p>
              <p
                className={`text-3xl font-semibold ${
                  awaitingRevision > 0 ? 'text-red-600' : 'text-gray-900'
                }`}
              >
                {awaitingRevision}
              </p>
            </button>
            <button className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left">
              <p className="text-sm text-gray-600 mb-2">Published</p>
              <p className="text-3xl font-semibold text-green-600">{published}</p>
            </button>
          </div>

          {/* Agreement & Decision Required - Demo */}
          {(() => {
            const agreementManuscripts = authorManuscripts.filter(
              (ms) => ms.status === 'pending' && ms.id === 'ms-001'
            );
            if (agreementManuscripts.length === 0) return null;
            return (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Publication Agreement Review Required</h2>
                <div className="space-y-4">
                  {agreementManuscripts.map((manuscript) => (
                    <div
                      key={`agreement-${manuscript.id}`}
                      className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {manuscript.title}
                            </h3>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              Agreement Pending
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Ref: {manuscript.id} · Editorial assessment complete - Review publication agreement and timeline
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500 font-medium mr-1">Required actions:</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-blue-300 bg-blue-50 text-xs font-medium text-blue-700">
                              <FileText className="w-3 h-3" />
                              Review Agreement
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-300 bg-green-50 text-xs font-medium text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Make Final Decision
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForAgreement(manuscript)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                          Review Agreement
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ③ Manuscripts Requiring Action */}
          {manuscriptsRequiringAction.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Manuscripts Requiring Action</h2>
              <div className="space-y-4">
                {manuscriptsRequiringAction.map((manuscript) => {
                  const manuscriptReviews = reviews.filter((r) => r.manuscriptId === manuscript.id);
                  const revisionReview = manuscriptReviews.find(
                    (r) => r.decision === 'minor_revision' || r.decision === 'major_revision'
                  );

                  return (
                    <div
                      key={manuscript.id}
                      className="bg-white p-6 rounded-lg border-l-4 border-amber-500 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {manuscript.title}
                            </h3>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                manuscript.status
                              )}`}
                            >
                              {getStatusLabel(manuscript.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Ref: {manuscript.id}</p>
                          <p className="text-sm text-amber-800 font-medium">
                            Action Required: Revision requested
                            {revisionReview?.decision === 'major_revision'
                              ? ' (Major Revision)'
                              : ' (Minor Revision)'}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForRevision(manuscript)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1a1f2e] text-white rounded-lg hover:bg-[#252b3d] transition-colors"
                        >
                          Submit Revision
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Manuscripts Awaiting Copyediting Review */}
          {(() => {
            const copyeditingManuscripts = authorManuscripts.filter(
              (ms) => ms.status === 'copyediting'
            );
            if (copyeditingManuscripts.length === 0) return null;
            return (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Copyediting Review Required</h2>
                <div className="space-y-4">
                  {copyeditingManuscripts.map((manuscript) => (
                    <div
                      key={manuscript.id}
                      className="bg-white p-6 rounded-lg border-l-4 border-purple-500 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {manuscript.title}
                            </h3>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              Copyediting
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">Ref: {manuscript.id}</p>
                          {/* Decision options preview */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500 font-medium mr-1">Your response options:</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-300 bg-green-50 text-xs font-medium text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-300 bg-amber-50 text-xs font-medium text-amber-700">
                              <AlertCircle className="w-3 h-3" />
                              Need Minor Corrections
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-red-300 bg-red-50 text-xs font-medium text-red-700">
                              <Clock className="w-3 h-3" />
                              Request Additional Revisions
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForCopyeditingReview(manuscript)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                          Review &amp; Respond
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Cover Page Approval Required */}
          {(() => {
            const coverApprovalManuscripts = authorManuscripts.filter(
              (ms) => ms.status === 'copyediting'
            );
            if (coverApprovalManuscripts.length === 0) return null;
            return (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Cover Page Approval Required</h2>
                <div className="space-y-4">
                  {coverApprovalManuscripts.map((manuscript) => (
                    <div
                      key={`cover-${manuscript.id}`}
                      className="bg-white p-6 rounded-lg border-l-4 border-indigo-500 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {manuscript.title}
                            </h3>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                              Cover Design Ready
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">Ref: {manuscript.id} · Editor has approved the cover design and forwarded for your review</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500 font-medium mr-1">Your response options:</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-300 bg-green-50 text-xs font-medium text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Approve Cover
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-300 bg-amber-50 text-xs font-medium text-amber-700">
                              <AlertCircle className="w-3 h-3" />
                              Request Minor Revisions
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-red-300 bg-red-50 text-xs font-medium text-red-700">
                              <Clock className="w-3 h-3" />
                              Request Additional Revisions
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForCoverApproval(manuscript)}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                          Review Cover Design
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Typesetting Approval Required */}
          {(() => {
            const typesettingManuscripts = authorManuscripts.filter(
              (ms) => ms.status === 'copyediting'
            );
            if (typesettingManuscripts.length === 0) return null;
            return (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Typeset Layout Approval Required</h2>
                <div className="space-y-4">
                  {typesettingManuscripts.map((manuscript) => (
                    <div
                      key={`typeset-${manuscript.id}`}
                      className="bg-white p-6 rounded-lg border-l-4 border-sky-500 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{manuscript.title}</h3>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800">
                              Typeset Ready
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">Ref: {manuscript.id} · Editor has validated the typeset layout and forwarded for your final approval</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500 font-medium mr-1">Your response options:</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-300 bg-green-50 text-xs font-medium text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Approve Layout
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-300 bg-amber-50 text-xs font-medium text-amber-700">
                              <AlertCircle className="w-3 h-3" />
                              Request Minor Corrections
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-red-300 bg-red-50 text-xs font-medium text-red-700">
                              <Clock className="w-3 h-3" />
                              Request Major Revision
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForTypesettingApproval(manuscript)}
                          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                          Review Typeset Layout
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Empty State for New Authors */}
          {totalManuscripts === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                You haven't submitted any manuscripts yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start your publishing journey by submitting your first manuscript.
              </p>
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1f2e] text-white rounded-lg hover:bg-[#252b3d] transition-colors"
              >
                <Upload className="w-5 h-5" />
                Submit Your First Manuscript
              </button>
            </div>
          ) : (
            <>
              {/* ④ Recent Activity Table */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">My Manuscripts — Recent Activity</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View All Manuscripts
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Reference No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Stage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentManuscripts.map((manuscript) => (
                        <tr
                          key={manuscript.id}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                            {manuscript.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {manuscript.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {getStatusLabel(manuscript.status)}
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
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {manuscript.updatedAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ⑤ Manuscript Status Tracker Snapshot */}
              {mostRecentManuscript && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Manuscript Status Tracker</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      View Full Tracker
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">
                      Tracking: <span className="font-medium text-gray-900">{mostRecentManuscript.title}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      {manuscriptStages.map((stage, index) => {
                        const StageIcon = stage.icon;
                        const currentStageIndex = getCurrentStageIndex(mostRecentManuscript);
                        const isActive = index <= currentStageIndex;
                        const isCurrent = index === currentStageIndex;

                        return (
                          <React.Fragment key={stage.id}>
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                  isActive
                                    ? isCurrent
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-400'
                                }`}
                              >
                                <StageIcon className="w-5 h-5" />
                              </div>
                              <span
                                className={`text-xs ${
                                  isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                                }`}
                              >
                                {stage.label}
                              </span>
                            </div>
                            {index < manuscriptStages.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 mx-2 ${
                                  index < currentStageIndex ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ⑥ Recent Notifications Panel */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View All Notifications
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  {recentNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    recentNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        className="w-full px-6 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.createdAt.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
