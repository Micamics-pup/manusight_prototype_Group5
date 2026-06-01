import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  FileText,
  Activity,
  Users,
  Target,
  Clock,
  AlertTriangle,
  MessageSquare,
  Settings,
  LogOut,
  BarChart3,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Eye,
  Send,
  Filter,
  Download,
  Calendar,
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Database,
  BookOpen,
} from 'lucide-react';
import type { Manuscript, Review, User as UserType } from '../../types';
import { EditorialAssessmentPage } from '../EditorialAssessmentPage';
import { ReviewerMatchmakingPage } from '../ReviewerMatchmakingPage';
import { ReviewerAssignmentPage } from '../ReviewerAssignmentPage';
import { TimelineRecommendationPage } from '../TimelineRecommendationPage';
import { ReviewConsolidationPage } from '../ReviewConsolidationPage';
import { RevisedManuscriptEvaluationPage, EvaluationData } from '../RevisedManuscriptEvaluationPage';
import { EditorialRecommendationPage, RecommendationData } from '../EditorialRecommendationPage';
import { TWGEndorsementPage, TWGEndorsementData } from '../TWGEndorsementPage';
import { EditorReviewCopyeditedPage } from '../EditorReviewCopyeditedPage';
import { EditorForwardAuthorFeedbackPage } from '../EditorForwardAuthorFeedbackPage';
import { EditorCoverPageReviewPage } from '../EditorCoverPageReviewPage';
import { EditorTypesettingReviewPage } from '../EditorTypesettingReviewPage';
import { FinalProofReviewPage } from '../FinalProofReviewPage';
import { FinalReviewRevisionsPage } from '../FinalReviewRevisionsPage';
import { FinalApprovalSignaturesPage } from '../FinalApprovalSignaturesPage';
import { PublicationPreparationPage } from '../PublicationPreparationPage';
import { FinalPublicationTimelinePage } from '../FinalPublicationTimelinePage';
import { PublishManuscriptPage } from '../PublishManuscriptPage';

export function NewEditorDashboard() {
  const { currentUser, logout } = useAuth();
  const { manuscripts, reviews, users, notifications } = useData();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedManuscriptForAssessment, setSelectedManuscriptForAssessment] = useState<Manuscript | null>(null);
  const [selectedManuscriptForReviewerMatching, setSelectedManuscriptForReviewerMatching] = useState<Manuscript | null>(null);
  const [selectedManuscriptForReviewerAssignment, setSelectedManuscriptForReviewerAssignment] = useState<Manuscript | null>(null);
  const [selectedManuscriptForTimeline, setSelectedManuscriptForTimeline] = useState<Manuscript | null>(null);
  const [selectedManuscriptForConsolidation, setSelectedManuscriptForConsolidation] = useState<Manuscript | null>(null);
  const [selectedManuscriptForRevisionEvaluation, setSelectedManuscriptForRevisionEvaluation] = useState<Manuscript | null>(null);
  const [selectedManuscriptForEditorialRecommendation, setSelectedManuscriptForEditorialRecommendation] = useState<Manuscript | null>(null);
  const [selectedManuscriptForTWGEndorsement, setSelectedManuscriptForTWGEndorsement] = useState<Manuscript | null>(null);
  const [selectedManuscriptForCopyeditingReview, setSelectedManuscriptForCopyeditingReview] = useState<Manuscript | null>(null);
  const [selectedManuscriptForAuthorFeedback, setSelectedManuscriptForAuthorFeedback] = useState<Manuscript | null>(null);
  const [selectedManuscriptForCoverReview, setSelectedManuscriptForCoverReview] = useState<Manuscript | null>(null);
  const [selectedManuscriptForTypesettingReview, setSelectedManuscriptForTypesettingReview] = useState<Manuscript | null>(null);
  const [selectedManuscriptForFinalProof, setSelectedManuscriptForFinalProof] = useState<Manuscript | null>(null);
  const [finalProofStage, setFinalProofStage] = useState<'proof_review' | 'revisions' | 'approval' | null>(null);
  const [selectedManuscriptForPublication, setSelectedManuscriptForPublication] = useState<Manuscript | null>(null);
  const [publicationStage, setPublicationStage] = useState<'preparation' | 'timeline' | 'publish' | null>(null);

  // Calculate analytics
  const totalActiveManuscripts = manuscripts.length;
  const pendingAssignments = manuscripts.filter((ms) => ms.assignedReviewers.length === 0).length;
  const underReview = manuscripts.filter((ms) => ms.status === 'review').length;
  const delayedWorkflows = manuscripts.filter((ms) => {
    const daysSinceSubmission = Math.floor(
      (new Date().getTime() - ms.submittedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceSubmission > 30 && ms.status !== 'production';
  }).length;
  const revisionRequests = reviews.filter(
    (r) => r.decision === 'minor_revision' || r.decision === 'major_revision'
  ).length;
  const acceptedManuscripts = manuscripts.filter((ms) => ms.status === 'production').length;
  const rejectedManuscripts = manuscripts.filter((ms) => ms.status === 'rejected').length;

  // Calculate average review time
  const completedReviews = reviews.filter((r) => r.status === 'completed');
  const avgReviewTime = completedReviews.length > 0 ? 14 : 0; // Mock: 14 days average

  // Workflow stages with counts
  const workflowStages = [
    { id: 'submitted', label: 'Submitted', count: manuscripts.filter((ms) => ms.status === 'pending').length },
    { id: 'screening', label: 'Initial Screening', count: 0 },
    { id: 'assignment', label: 'Reviewer Assignment', count: pendingAssignments },
    { id: 'review', label: 'Under Review', count: underReview },
    { id: 'revision', label: 'Revision', count: revisionRequests },
    { id: 'final', label: 'Final Evaluation', count: 0 },
    { id: 'accepted', label: 'Accepted', count: manuscripts.filter((ms) => ms.status === 'copyediting').length },
    { id: 'rejected', label: 'Rejected', count: rejectedManuscripts },
    { id: 'publication', label: 'Publication Queue', count: acceptedManuscripts },
  ];

  // Get reviewers with workload
  const reviewersWithWorkload = useMemo(() => {
    const reviewers = users.filter((u) => u.role === 'reviewer');
    return reviewers.map((reviewer) => {
      const assignedCount = manuscripts.filter((ms) =>
        ms.assignedReviewers.includes(reviewer.id)
      ).length;
      const completedCount = reviews.filter(
        (r) => r.reviewerId === reviewer.id && r.status === 'completed'
      ).length;
      const avgDuration = completedCount > 0 ? 12 : 0; // Mock

      return {
        ...reviewer,
        assignedCount,
        completedCount,
        avgDuration,
        workloadLevel: assignedCount === 0 ? 'low' : assignedCount <= 2 ? 'medium' : 'high',
        availability: assignedCount < 3 ? 'available' : 'busy',
        matchScore: Math.floor(Math.random() * 30) + 70, // Mock AI score
      };
    });
  }, [users, manuscripts, reviews]);

  // Recent activity feed
  const recentActivities = useMemo(() => {
    const activities: Array<{
      id: string;
      type: string;
      message: string;
      timestamp: Date;
      manuscriptId?: string;
      status: 'info' | 'success' | 'warning' | 'error';
    }> = [];

    // Generate from manuscripts and reviews
    manuscripts.slice(0, 5).forEach((ms) => {
      activities.push({
        id: `ms-${ms.id}`,
        type: 'submission',
        message: `New manuscript submitted: "${ms.title}"`,
        timestamp: ms.submittedAt,
        manuscriptId: ms.id,
        status: 'info',
      });
    });

    reviews.slice(0, 3).forEach((r) => {
      if (r.status === 'completed') {
        activities.push({
          id: `rev-${r.id}`,
          type: 'review',
          message: `Review completed for ${r.manuscriptId}`,
          timestamp: r.submittedAt || new Date(),
          manuscriptId: r.manuscriptId,
          status: 'success',
        });
      }
    });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  }, [manuscripts, reviews]);

  // System alerts
  const systemAlerts = useMemo(() => {
    const alerts: Array<{
      id: string;
      type: 'overdue' | 'overloaded' | 'pending' | 'congestion';
      message: string;
      severity: 'high' | 'medium' | 'low';
      count: number;
    }> = [];

    if (delayedWorkflows > 0) {
      alerts.push({
        id: 'alert-1',
        type: 'overdue',
        message: `${delayedWorkflows} manuscripts with delayed workflows`,
        severity: 'high',
        count: delayedWorkflows,
      });
    }

    const overloadedReviewers = reviewersWithWorkload.filter((r) => r.workloadLevel === 'high').length;
    if (overloadedReviewers > 0) {
      alerts.push({
        id: 'alert-2',
        type: 'overloaded',
        message: `${overloadedReviewers} reviewers are overloaded`,
        severity: 'medium',
        count: overloadedReviewers,
      });
    }

    if (pendingAssignments > 0) {
      alerts.push({
        id: 'alert-3',
        type: 'pending',
        message: `${pendingAssignments} manuscripts need reviewer assignment`,
        severity: 'medium',
        count: pendingAssignments,
      });
    }

    return alerts;
  }, [delayedWorkflows, reviewersWithWorkload, pendingAssignments]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manuscripts', label: 'Manuscripts', icon: FileText },
    { id: 'workflow', label: 'Workflow Progress', icon: Activity },
    { id: 'recommendations', label: 'Reviewer Recommendations', icon: Sparkles },
    { id: 'assignments', label: 'Reviewer Assignments', icon: Users },
    { id: 'timeline', label: 'Timeline Predictions', icon: Clock },
    { id: 'revisions', label: 'Revisions & Feedback', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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

  const getWorkloadColor = (level: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // Show Editorial Assessment Page if a manuscript is selected
  if (selectedManuscriptForAssessment) {
    return (
      <EditorialAssessmentPage
        manuscript={selectedManuscriptForAssessment}
        onBack={() => setSelectedManuscriptForAssessment(null)}
        onAssessmentComplete={(decision, data) => {
          // Handle assessment completion (update status, send notifications, etc.)
          setTimeout(() => {
            setSelectedManuscriptForAssessment(null);
          }, 5000);
        }}
      />
    );
  }

  // Show Reviewer Matchmaking Page if a manuscript is selected for reviewer assignment
  if (selectedManuscriptForReviewerMatching) {
    return (
      <ReviewerMatchmakingPage
        manuscript={selectedManuscriptForReviewerMatching}
        onBack={() => setSelectedManuscriptForReviewerMatching(null)}
        onInvitationSent={(data) => {
          setTimeout(() => {
            setSelectedManuscriptForReviewerMatching(null);
          }, 3000);
        }}
      />
    );
  }

  // Show Reviewer Assignment Page if a manuscript is selected for reviewer confirmation
  if (selectedManuscriptForReviewerAssignment) {
    return (
      <ReviewerAssignmentPage
        manuscript={selectedManuscriptForReviewerAssignment}
        onBack={() => setSelectedManuscriptForReviewerAssignment(null)}
        onAssignmentConfirmed={() => {
          setTimeout(() => {
            setSelectedManuscriptForReviewerAssignment(null);
          }, 3000);
        }}
      />
    );
  }

  // Show Timeline Recommendation Page if a manuscript is selected for timeline analysis
  if (selectedManuscriptForTimeline) {
    return (
      <TimelineRecommendationPage
        manuscript={selectedManuscriptForTimeline}
        onBack={() => setSelectedManuscriptForTimeline(null)}
        onTimelineUpdated={() => {
          setTimeout(() => {
            setSelectedManuscriptForTimeline(null);
          }, 3000);
        }}
      />
    );
  }

  // Show Review Consolidation Page if a manuscript is selected for consolidation
  if (selectedManuscriptForConsolidation) {
    const manuscriptReviews = reviews.filter(
      (r) => r.manuscriptId === selectedManuscriptForConsolidation.id
    );
    const manuscriptReviewers = users.filter((u) =>
      manuscriptReviews.some((r) => r.reviewerId === u.id)
    );

    return (
      <ReviewConsolidationPage
        manuscript={selectedManuscriptForConsolidation}
        reviews={manuscriptReviews}
        reviewers={manuscriptReviewers}
        onBack={() => setSelectedManuscriptForConsolidation(null)}
        onSendToAuthor={(data) => {
          setTimeout(() => {
            setSelectedManuscriptForConsolidation(null);
          }, 3000);
        }}
      />
    );
  }

  // Show Revised Manuscript Evaluation Page if a manuscript is selected for revision evaluation
  if (selectedManuscriptForRevisionEvaluation) {
    const manuscriptReviews = reviews.filter(
      (r) => r.manuscriptId === selectedManuscriptForRevisionEvaluation.id
    );

    return (
      <RevisedManuscriptEvaluationPage
        manuscript={selectedManuscriptForRevisionEvaluation}
        reviews={manuscriptReviews}
        onBack={() => setSelectedManuscriptForRevisionEvaluation(null)}
        onSubmitEvaluation={(evaluationData: EvaluationData) => {
          setTimeout(() => {
            setSelectedManuscriptForRevisionEvaluation(null);
          }, 100);
        }}
      />
    );
  }

  // Show Editorial Recommendation Page if a manuscript is selected for final editorial decision
  if (selectedManuscriptForEditorialRecommendation) {
    const manuscriptReviews = reviews.filter(
      (r) => r.manuscriptId === selectedManuscriptForEditorialRecommendation.id
    );

    return (
      <EditorialRecommendationPage
        manuscript={selectedManuscriptForEditorialRecommendation}
        reviews={manuscriptReviews}
        onBack={() => setSelectedManuscriptForEditorialRecommendation(null)}
        onSubmitRecommendation={(recommendationData: RecommendationData) => {
          setTimeout(() => {
            setSelectedManuscriptForEditorialRecommendation(null);
          }, 100);
        }}
      />
    );
  }

  if (selectedManuscriptForAuthorFeedback) {
    return (
      <EditorForwardAuthorFeedbackPage
        manuscript={selectedManuscriptForAuthorFeedback}
        onBack={() => setSelectedManuscriptForAuthorFeedback(null)}
      />
    );
  }

  if (selectedManuscriptForCoverReview) {
    return (
      <EditorCoverPageReviewPage
        manuscript={selectedManuscriptForCoverReview}
        onBack={() => setSelectedManuscriptForCoverReview(null)}
      />
    );
  }

  if (selectedManuscriptForTypesettingReview) {
    return (
      <EditorTypesettingReviewPage
        manuscript={selectedManuscriptForTypesettingReview}
        onBack={() => setSelectedManuscriptForTypesettingReview(null)}
      />
    );
  }

  if (selectedManuscriptForFinalProof && finalProofStage === 'approval') {
    return (
      <FinalApprovalSignaturesPage
        manuscript={selectedManuscriptForFinalProof}
        onRejectForRevision={() => setFinalProofStage('revisions')}
        onApproveComplete={() => {
          setSelectedManuscriptForFinalProof(null);
          setFinalProofStage(null);
        }}
      />
    );
  }

  if (selectedManuscriptForFinalProof && finalProofStage === 'revisions') {
    return (
      <FinalReviewRevisionsPage
        manuscript={selectedManuscriptForFinalProof}
        onReturnToProofReview={() => setFinalProofStage('proof_review')}
        onProceedToFinalApproval={() => setFinalProofStage('approval')}
      />
    );
  }

  if (selectedManuscriptForFinalProof && finalProofStage === 'proof_review') {
    return (
      <FinalProofReviewPage
        manuscript={selectedManuscriptForFinalProof}
        onBack={() => {
          setSelectedManuscriptForFinalProof(null);
          setFinalProofStage(null);
        }}
        onRequestRevisions={() => setFinalProofStage('revisions')}
        onSendForFinalApproval={() => setFinalProofStage('approval')}
      />
    );
  }

  if (selectedManuscriptForPublication && publicationStage === 'publish') {
    return (
      <PublishManuscriptPage
        manuscript={selectedManuscriptForPublication}
        onBack={() => setPublicationStage('timeline')}
      />
    );
  }

  if (selectedManuscriptForPublication && publicationStage === 'timeline') {
    return (
      <FinalPublicationTimelinePage
        manuscript={selectedManuscriptForPublication}
        onReturnToPreparation={() => setPublicationStage('preparation')}
        onProceedToPublish={() => setPublicationStage('publish')}
      />
    );
  }

  if (selectedManuscriptForPublication && publicationStage === 'preparation') {
    return (
      <PublicationPreparationPage
        manuscript={selectedManuscriptForPublication}
        onBack={() => {
          setSelectedManuscriptForPublication(null);
          setPublicationStage(null);
        }}
        onSendToTimeline={() => setPublicationStage('timeline')}
      />
    );
  }

  // Show TWG Endorsement Page if a manuscript is selected for technical working group review
  if (selectedManuscriptForCopyeditingReview) {
    return (
      <EditorReviewCopyeditedPage
        manuscript={selectedManuscriptForCopyeditingReview}
        onBack={() => setSelectedManuscriptForCopyeditingReview(null)}
      />
    );
  }

  if (selectedManuscriptForTWGEndorsement) {
    const manuscriptReviews = reviews.filter(
      (r) => r.manuscriptId === selectedManuscriptForTWGEndorsement.id
    );

    return (
      <TWGEndorsementPage
        manuscript={selectedManuscriptForTWGEndorsement}
        reviews={manuscriptReviews}
        onBack={() => setSelectedManuscriptForTWGEndorsement(null)}
        onSubmitEndorsement={(endorsementData: TWGEndorsementData) => {
          setTimeout(() => {
            setSelectedManuscriptForTWGEndorsement(null);
          }, 100);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">MMS Editor Portal</h1>
                <p className="text-xs text-gray-500">Workflow Command Center</p>
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/50 backdrop-blur"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Current Time */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Quick Action */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md">
                <UserPlus className="w-4 h-4" />
                <span className="text-sm font-medium">Assign Reviewer</span>
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {systemAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {systemAlerts.length}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold shadow-md">
                    {currentUser?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
                    <p className="text-xs text-blue-600 font-medium">Editor</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                      <User className="w-4 h-4" />
                      Profile Settings
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                      <Settings className="w-4 h-4" />
                      Change Password
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
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
        <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 min-h-[calc(100vh-89px)] sticky top-[89px]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeNav === item.id
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium shadow-sm'
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

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Editorial Dashboard</h2>
            <p className="text-gray-600">Centralized manuscript workflow monitoring and management</p>
          </div>

          {/* SECTION 1 — Overview Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Active Manuscripts</p>
              <p className="text-3xl font-bold text-gray-900">{totalActiveManuscripts}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs text-gray-500">75%</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <UserPlus className="w-6 h-6 text-yellow-600" />
                </div>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Pending Assignments</p>
              <p className="text-3xl font-bold text-gray-900">{pendingAssignments}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-xs text-gray-500">45%</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Under Review</p>
              <p className="text-3xl font-bold text-gray-900">{underReview}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-xs text-gray-500">60%</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Delayed Workflows</p>
              <p className="text-3xl font-bold text-gray-900">{delayedWorkflows}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-xs text-gray-500">30%</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Revision Requests</p>
              <p className="text-3xl font-bold text-gray-900">{revisionRequests}</p>
              <p className="text-xs text-gray-500 mt-2">Active revisions</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Accepted Manuscripts</p>
              <p className="text-3xl font-bold text-gray-900">{acceptedManuscripts}</p>
              <p className="text-xs text-green-600 mt-2 font-medium">+{acceptedManuscripts} this month</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Rejected Manuscripts</p>
              <p className="text-3xl font-bold text-gray-900">{rejectedManuscripts}</p>
              <p className="text-xs text-gray-500 mt-2">This month</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Avg Review Time</p>
              <p className="text-3xl font-bold text-gray-900">{avgReviewTime}d</p>
              <p className="text-xs text-indigo-600 mt-2 font-medium">-2d vs last month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* SECTION 2 — Workflow Monitoring Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Workflow Monitoring</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {workflowStages.map((stage) => (
                    <div
                      key={stage.id}
                      className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <p className="text-xs font-medium text-gray-600 mb-2">{stage.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stage.count}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${Math.min((stage.count / totalActiveManuscripts) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 8 — System Alerts */}
            <div>
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>

                <div className="space-y-3">
                  {systemAlerts.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">All systems running smoothly</p>
                    </div>
                  ) : (
                    systemAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.severity === 'high'
                            ? 'bg-red-50 border-red-500'
                            : alert.severity === 'medium'
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                              alert.severity === 'high'
                                ? 'text-red-600'
                                : alert.severity === 'medium'
                                ? 'text-yellow-600'
                                : 'text-blue-600'
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} priority
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3 — Reviewer Recommendations */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Reviewer Recommendations</h3>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">View All Reviewers</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviewersWithWorkload.slice(0, 6).map((reviewer) => (
                  <div
                    key={reviewer.id}
                    className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-lg font-semibold shadow-md">
                        {reviewer.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{reviewer.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getWorkloadColor(
                              reviewer.workloadLevel
                            )}`}
                          >
                            {reviewer.workloadLevel}
                          </span>
                          <span className="text-xs text-gray-500">{reviewer.assignedCount} active</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Match Score</span>
                        <span className="font-semibold text-purple-600">{reviewer.matchScore}%</span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${reviewer.matchScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Avg: {reviewer.avgDuration || 12} days</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>{reviewer.completedCount} reviews completed</span>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-medium">
                      Assign Reviewer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* SECTION 4 — Timeline Predictions */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Timeline Predictions</h3>
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  ML-Powered
                </span>
              </div>

              <div className="space-y-4">
                {manuscripts.slice(0, 4).map((ms) => {
                  const predictedDays = Math.floor(Math.random() * 30) + 10;
                  const riskLevel = predictedDays > 30 ? 'high' : predictedDays > 20 ? 'medium' : 'low';

                  return (
                    <div key={ms.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">{ms.title}</h4>
                          <p className="text-xs text-gray-500">ID: {ms.id}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            riskLevel === 'high'
                              ? 'bg-red-100 text-red-700'
                              : riskLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {riskLevel === 'high' ? 'High Risk' : riskLevel === 'medium' ? 'Medium Risk' : 'On Track'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Predicted Completion</span>
                          <span className="font-semibold text-gray-900">{predictedDays} days</span>
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              riskLevel === 'high'
                                ? 'bg-red-500'
                                : riskLevel === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((predictedDays / 45) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 5 — Real-Time Activity Feed */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Real-Time Activity</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Live</span>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          activity.status === 'success'
                            ? 'bg-green-100'
                            : activity.status === 'warning'
                            ? 'bg-yellow-100'
                            : activity.status === 'error'
                            ? 'bg-red-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        {activity.type === 'submission' ? (
                          <FileText className="w-4 h-4 text-blue-600" />
                        ) : activity.type === 'review' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Bell className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp.toLocaleTimeString()} - {activity.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5.5 — Revised Manuscripts Awaiting Evaluation */}
          {(() => {
            const manuscriptsAwaitingRevisionEval = manuscripts.filter((ms) => {
              const manuscriptReviews = reviews.filter((r) => r.manuscriptId === ms.id);
              const hasRevisionRequest = manuscriptReviews.some(
                (r) => r.status === 'completed' && (r.decision === 'minor_revision' || r.decision === 'major_revision')
              );
              return hasRevisionRequest && ms.status === 'review';
            });

            return manuscriptsAwaitingRevisionEval.length > 0 ? (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Revised Manuscripts Awaiting Evaluation</h3>
                    <p className="text-sm text-gray-600">Review author revisions and decide on next steps</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {manuscriptsAwaitingRevisionEval.map((ms) => {
                    const manuscriptReviews = reviews.filter((r) => r.manuscriptId === ms.id);
                    const revisionReview = manuscriptReviews.find(
                      (r) => r.decision === 'minor_revision' || r.decision === 'major_revision'
                    );
                    return (
                      <div
                        key={ms.id}
                        className="bg-white rounded-lg p-4 border border-amber-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                              <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                                {revisionReview?.decision === 'major_revision' ? 'Major Revision' : 'Minor Revision'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">ID:</span> {ms.id} • <span className="font-medium">Author:</span> {ms.authorName}
                            </p>
                            <p className="text-sm text-amber-800">
                              <AlertTriangle className="w-4 h-4 inline mr-1" />
                              Author has submitted revised manuscript - evaluation required
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedManuscriptForRevisionEvaluation(ms)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            Evaluate Revision
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null;
          })()}

          {/* SECTION 5.5b — Manuscripts Ready for Copyediting Review */}
          {(() => {
            const manuscriptsForCopyeditingReview = manuscripts.filter(
              (ms) => ms.status === 'copyediting'
            );

            return manuscriptsForCopyeditingReview.length > 0 ? (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manuscripts Ready for Copyediting Review</h3>
                    <p className="text-sm text-gray-600">Copyedited manuscripts awaiting your approval before production</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {manuscriptsForCopyeditingReview.map((ms) => (
                    <div
                      key={ms.id}
                      className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                              Copyediting Complete
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">ID:</span> {ms.id} • <span className="font-medium">Author:</span> {ms.authorName}
                          </p>
                          <p className="text-sm text-purple-800 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 inline" />
                            Validated by TWG Coordinator — ready for editor review
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForCopyeditingReview(ms)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap ml-4"
                        >
                          <Eye className="w-4 h-4" />
                          Review Copyediting
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* SECTION 5.5c — Author Feedback Awaiting Editor Review */}
          {(() => {
            const manuscriptsWithAuthorFeedback = manuscripts.filter(
              (ms) => ms.status === 'copyediting'
            );

            return manuscriptsWithAuthorFeedback.length > 0 ? (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Author Feedback Awaiting Editor Review</h3>
                    <p className="text-sm text-gray-600">Author copyediting feedback ready to review and forward to TWG</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {manuscriptsWithAuthorFeedback.map((ms) => (
                    <div key={ms.id} className="bg-white rounded-lg p-4 border border-teal-200 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                            <span className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full">
                              Author Feedback Submitted
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">ID:</span> {ms.id} • <span className="font-medium">Author:</span> {ms.authorName}
                          </p>
                          <p className="text-sm text-teal-800 flex items-center gap-1">
                            <Send className="w-4 h-4 inline" />
                            Review author feedback and forward revision requests to TWG
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForAuthorFeedback(ms)}
                          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium whitespace-nowrap ml-4"
                        >
                          <Send className="w-4 h-4" />
                          Forward to TWG
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* SECTION 5.5b — Cover Page Review */}
          {(() => {
            const coverReviewManuscripts = manuscripts.filter(ms => ms.status === 'copyediting');
            return coverReviewManuscripts.length > 0 ? (
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-700 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Cover Page Review — Send to Author</h3>
                    <p className="text-sm text-gray-600">Review submitted cover designs and forward approved designs to authors</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {coverReviewManuscripts.map((ms) => (
                    <div key={ms.id} className="bg-white rounded-lg p-4 border border-violet-200 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                            <span className="px-2 py-1 text-xs bg-violet-100 text-violet-800 rounded-full">
                              Cover Design Submitted
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">ID:</span> {ms.id} • <span className="font-medium">Author:</span> {ms.authorName}
                          </p>
                          <p className="text-sm text-violet-800 flex items-center gap-1">
                            <Eye className="w-4 h-4 inline" />
                            Review cover design quality and send approved design to author
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForCoverReview(ms)}
                          className="flex items-center gap-2 px-4 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors font-medium whitespace-nowrap ml-4"
                        >
                          <Eye className="w-4 h-4" />
                          Review Cover Design
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* SECTION 5.5c — Typesetting Review */}
          {(() => {
            const typesettingReviewManuscripts = manuscripts.filter(ms => ms.status === 'copyediting');
            return typesettingReviewManuscripts.length > 0 ? (
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-200 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-700 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Typesetting Review — Send to Author</h3>
                    <p className="text-sm text-gray-600">Validate typeset layout quality and forward for author approval</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {typesettingReviewManuscripts.map((ms) => (
                    <div key={ms.id} className="bg-white rounded-lg p-4 border border-sky-200 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                            <span className="px-2 py-1 text-xs bg-sky-100 text-sky-800 rounded-full">Typeset Submitted</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">ID:</span> {ms.id} • <span className="font-medium">Author:</span> {ms.authorName}
                          </p>
                          <p className="text-sm text-sky-800 flex items-center gap-1">
                            <Eye className="w-4 h-4 inline" />
                            Review typeset layout and send to author for final approval
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedManuscriptForTypesettingReview(ms)}
                          className="flex items-center gap-2 px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors font-medium whitespace-nowrap ml-4"
                        >
                          <Eye className="w-4 h-4" />
                          Review Typesetting
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* SECTION 5.5d — Final Proof Review */}
          {(() => {
            const finalProofManuscripts = manuscripts.filter(ms => ms.status === 'copyediting');
            return finalProofManuscripts.length > 0 ? (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-700 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Final Proof Review</h3>
                    <p className="text-sm text-gray-600">Review and validate final publication proof before approval and signatures</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {finalProofManuscripts.map((ms) => (
                    <div key={`proof-${ms.id}`} className="bg-white rounded-lg p-4 border border-indigo-200 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                            <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                              Proof Generated
                            </span>
                            <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                              Awaiting Review
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">ID:</span> {ms.id} · <span className="font-medium">Author:</span> {ms.authorName}
                          </p>
                          <p className="text-sm text-indigo-800 flex items-center gap-1">
                            <Eye className="w-4 h-4 inline" />
                            Validate proof quality, request revisions if needed, then send for final approval
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedManuscriptForFinalProof(ms);
                            setFinalProofStage('proof_review');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors font-medium whitespace-nowrap ml-4"
                        >
                          <Eye className="w-4 h-4" />
                          Review Final Proof
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* SECTION 5.5e — Publication Preparation */}
          {(() => {
            const pubPrepManuscripts = manuscripts.filter(ms => ms.status === 'copyediting');
            return pubPrepManuscripts.length > 0 ? (
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-200 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-700 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Publication Preparation</h3>
                    <p className="text-sm text-gray-600">Prepare, validate, and schedule the final publication package for release</p>
                  </div>
                  <span className="ml-auto px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">
                    Editor in Chief
                  </span>
                </div>
                <div className="space-y-3">
                  {pubPrepManuscripts.map((ms) => (
                    <div key={`pub-${ms.id}`} className="bg-white rounded-lg p-4 border border-teal-200 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                            <span className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full">
                              Approved for Publication
                            </span>
                            <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                              97% Ready
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">ID:</span> {ms.id} · <span className="font-medium">Author:</span> {ms.authorName}
                          </p>
                          <p className="text-sm text-teal-800 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 inline" />
                            All approvals and signatures collected — ready for publication pipeline
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedManuscriptForPublication(ms);
                            setPublicationStage('preparation');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium whitespace-nowrap ml-4"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Prepare for Publication
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* SECTION 5.6 — Manuscripts Ready for Editorial Recommendation */}
          {(() => {
            const manuscriptsReadyForRecommendation = manuscripts.filter((ms) => {
              // Only manuscripts in review that have all reviews completed and consolidated
              if (ms.status === 'review') {
                const manuscriptReviews = reviews.filter((r) => r.manuscriptId === ms.id);
                const allReviewsCompleted = manuscriptReviews.length > 0 &&
                  manuscriptReviews.every((r) => r.status === 'completed');
                // Check if all reviews recommend acceptance or are consolidated
                const hasAcceptanceRecommendation = manuscriptReviews.some(
                  (r) => r.decision === 'accept' || r.decision === 'accept_with_minor_changes'
                );
                return allReviewsCompleted && hasAcceptanceRecommendation;
              }
              return false;
            });

            return manuscriptsReadyForRecommendation.length > 0 ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manuscripts Ready for Editorial Recommendation</h3>
                    <p className="text-sm text-gray-600">Make final publication decision on reviewed manuscripts</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {manuscriptsReadyForRecommendation.map((ms) => {
                    const manuscriptReviews = reviews.filter((r) => r.manuscriptId === ms.id);
                    const completedReviews = manuscriptReviews.filter((r) => r.status === 'completed');
                    return (
                      <div
                        key={ms.id}
                        className="bg-white rounded-lg p-4 border border-green-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Ready for Decision
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">ID:</span> {ms.id} • <span className="font-medium">Author:</span> {ms.authorName}
                            </p>
                            <p className="text-sm text-green-800">
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                              {completedReviews.length} {completedReviews.length === 1 ? 'review' : 'reviews'} completed - ready for final editorial recommendation
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedManuscriptForEditorialRecommendation(ms)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap"
                          >
                            <Target className="w-4 h-4" />
                            Make Recommendation
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null;
          })()}

          {/* SECTION 5.7 — Manuscripts Ready for TWG Endorsement */}
          {(() => {
            const manuscriptsReadyForTWGEndorsement = manuscripts.filter((ms) => {
              // Manuscripts that have completed editorial review and are in production stage
              // These need technical working group validation before final publication
              return ms.status === 'production';
            });

            return manuscriptsReadyForTWGEndorsement.length > 0 ? (
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-6 border-2 border-indigo-200 shadow-md mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manuscripts Ready for TWG Endorsement</h3>
                    <p className="text-sm text-gray-600">Endorse manuscripts to Technical Working Group for validation</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {manuscriptsReadyForTWGEndorsement.map((ms) => {
                    const manuscriptReviews = reviews.filter((r) => r.manuscriptId === ms.id);
                    const completedReviews = manuscriptReviews.filter((r) => r.status === 'completed');
                    return (
                      <div
                        key={ms.id}
                        className="bg-white rounded-lg p-4 border border-indigo-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{ms.title}</h4>
                              <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                                Ready for TWG Review
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">ID:</span> {ms.id} • <span className="font-medium">Author:</span> {ms.authorName}
                            </p>
                            <p className="text-sm text-indigo-800">
                              <Sparkles className="w-4 h-4 inline mr-1" />
                              {completedReviews.length} peer {completedReviews.length === 1 ? 'review' : 'reviews'} completed - requires technical validation
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedManuscriptForTWGEndorsement(ms)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
                          >
                            <Users className="w-4 h-4" />
                            Endorse to TWG
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null;
          })()}

          {/* SECTION 6 — Manuscript Table */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Manuscript Management</h3>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </button>
              </div>
            </div>

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
                      Stage
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
                  {manuscripts.slice(0, 10).map((ms) => (
                    <tr key={ms.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-mono text-gray-900">{ms.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{ms.title}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{ms.authorName}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{ms.status}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ms.status)}`}>
                          {ms.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          {ms.status === 'pending' && (
                            <button
                              onClick={() => setSelectedManuscriptForAssessment(ms)}
                              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 font-medium"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Assess
                            </button>
                          )}
                          {ms.assignedReviewers.length === 0 && ms.status !== 'pending' && ms.status !== 'rejected' && (
                            <button
                              onClick={() => setSelectedManuscriptForReviewerMatching(ms)}
                              className="text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors"
                            >
                              <Users className="w-4 h-4" />
                              Assign Reviewers
                            </button>
                          )}
                          {ms.assignedReviewers.length > 0 && ms.status === 'review' && (() => {
                            const manuscriptReviews = reviews.filter((r) => r.manuscriptId === ms.id);
                            const completedReviews = manuscriptReviews.filter((r) => r.status === 'completed');

                            return completedReviews.length > 0 ? (
                              <button
                                onClick={() => setSelectedManuscriptForConsolidation(ms)}
                                className="text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                                Consolidate Reviews
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => setSelectedManuscriptForReviewerAssignment(ms)}
                                  className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Confirm Reviewers
                                </button>
                                <button
                                  onClick={() => setSelectedManuscriptForTimeline(ms)}
                                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
                                >
                                  <Clock className="w-4 h-4" />
                                  View Timeline
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 7 — Quick Actions */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all">
                <UserPlus className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-medium text-gray-900">Assign Reviewer</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-all">
                <Eye className="w-6 h-6 text-purple-600" />
                <span className="text-xs font-medium text-gray-900">View Workflow</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all">
                <Send className="w-6 h-6 text-green-600" />
                <span className="text-xs font-medium text-gray-900">Send Notification</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:shadow-md transition-all">
                <RefreshCw className="w-6 h-6 text-orange-600" />
                <span className="text-xs font-medium text-gray-900">Request Revision</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg hover:shadow-md transition-all">
                <Clock className="w-6 h-6 text-indigo-600" />
                <span className="text-xs font-medium text-gray-900">Generate Timeline</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg hover:shadow-md transition-all">
                <MessageSquare className="w-6 h-6 text-pink-600" />
                <span className="text-xs font-medium text-gray-900">View Feedback</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// LayoutDashboard icon component
function LayoutDashboard({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}
