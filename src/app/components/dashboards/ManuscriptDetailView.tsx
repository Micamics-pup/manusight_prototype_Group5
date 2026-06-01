import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  FileText,
  Users,
  MessageSquare,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Download,
  Upload,
  History,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import type { Manuscript, User, Review } from '../../types';

interface ManuscriptDetailViewProps {
  manuscript: Manuscript;
  onBack: () => void;
}

export function ManuscriptDetailView({ manuscript, onBack }: ManuscriptDetailViewProps) {
  const { currentUser } = useAuth();
  const { users, reviews, updateManuscriptStatus, assignReviewer, addComment } = useData();
  const [requestChangesNote, setRequestChangesNote] = useState('');
  const [showRequestChangesDialog, setShowRequestChangesDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showInviteReviewerDialog, setShowInviteReviewerDialog] = useState(false);
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [reviewDeadline, setReviewDeadline] = useState('');
  const [feedbackToAuthor, setFeedbackToAuthor] = useState('');

  const reviewers = users.filter((u) => u.role === 'reviewer');
  const manuscriptReviews = reviews.filter((r) => r.manuscriptId === manuscript.id);
  const copyeditors = users.filter((u) => u.role === 'editor'); // For demo, using editors as copyeditors

  // Simulated reviewer suggestions based on expertise and workload
  const getReviewerSuggestions = () => {
    return reviewers
      .map((reviewer) => {
        const assignedReviews = reviews.filter((r) => r.reviewerId === reviewer.id);
        const pendingReviews = assignedReviews.filter((r) => r.status === 'pending' || r.status === 'in_progress');
        const workload = pendingReviews.length;
        const expertiseMatch = Math.floor(Math.random() * 100); // Simulated expertise match

        return {
          reviewer,
          workload,
          expertiseMatch,
          score: expertiseMatch - (workload * 10),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const reviewerSuggestions = getReviewerSuggestions();

  const handleRequestChanges = () => {
    if (currentUser && requestChangesNote.trim()) {
      updateManuscriptStatus(manuscript.id, 'pending');
      addComment({
        manuscriptId: manuscript.id,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        content: requestChangesNote,
      });
      setRequestChangesNote('');
      setShowRequestChangesDialog(false);
    }
  };

  const handleDeclineSubmission = () => {
    if (currentUser && declineReason.trim()) {
      updateManuscriptStatus(manuscript.id, 'rejected');
      addComment({
        manuscriptId: manuscript.id,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        content: `Submission declined: ${declineReason}`,
      });
      setDeclineReason('');
      setShowDeclineDialog(false);
    }
  };

  const handleInviteReviewer = () => {
    if (selectedReviewerId) {
      assignReviewer(manuscript.id, selectedReviewerId);
      updateManuscriptStatus(manuscript.id, 'review');
      setSelectedReviewerId('');
      setReviewDeadline('');
      setShowInviteReviewerDialog(false);
    }
  };

  const handleSendFeedbackToAuthor = () => {
    if (currentUser && feedbackToAuthor.trim()) {
      addComment({
        manuscriptId: manuscript.id,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        content: `Feedback to Author: ${feedbackToAuthor}`,
      });
      setFeedbackToAuthor('');
    }
  };

  // Timeline Recommender Logic
  const getTimelineRecommendations = () => {
    const submittedDate = manuscript.submittedAt;
    const currentDate = new Date();
    const daysSinceSubmission = Math.floor((currentDate.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));

    // Recommended timelines (in days)
    const timelines = {
      pending: { duration: 5, label: 'Editor Review' },
      review: { duration: 14, label: 'Peer Review' },
      copyediting: { duration: 10, label: 'Copyediting' },
      production: { duration: 21, label: 'Production' },
    };

    // Calculate expected dates for each stage
    let cumulativeDays = 0;
    const stages = [
      {
        name: 'Pending',
        status: 'pending' as const,
        duration: timelines.pending.duration,
        startDay: cumulativeDays,
        endDay: (cumulativeDays += timelines.pending.duration),
      },
      {
        name: 'Review',
        status: 'review' as const,
        duration: timelines.review.duration,
        startDay: cumulativeDays,
        endDay: (cumulativeDays += timelines.review.duration),
      },
      {
        name: 'Copyediting',
        status: 'copyediting' as const,
        duration: timelines.copyediting.duration,
        startDay: cumulativeDays,
        endDay: (cumulativeDays += timelines.copyediting.duration),
      },
      {
        name: 'Production',
        status: 'production' as const,
        duration: timelines.production.duration,
        startDay: cumulativeDays,
        endDay: (cumulativeDays += timelines.production.duration),
      },
    ];

    const totalExpectedDays = cumulativeDays;
    const expectedCompletionDate = new Date(submittedDate);
    expectedCompletionDate.setDate(expectedCompletionDate.getDate() + totalExpectedDays);

    // Find current stage index
    const currentStageIndex = stages.findIndex(s => s.status === manuscript.status);
    const currentStage = stages[currentStageIndex];

    // Calculate if current stage is overdue
    const isOverdue = currentStage && daysSinceSubmission > currentStage.endDay;
    const daysInCurrentStage = currentStage ? daysSinceSubmission - currentStage.startDay : 0;
    const daysRemainingInStage = currentStage ? currentStage.duration - daysInCurrentStage : 0;

    return {
      stages,
      totalExpectedDays,
      expectedCompletionDate,
      daysSinceSubmission,
      currentStageIndex,
      currentStage,
      isOverdue,
      daysInCurrentStage,
      daysRemainingInStage,
    };
  };

  const timeline = getTimelineRecommendations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900">{manuscript.title}</h2>
          <p className="text-gray-600 mt-1">
            By {manuscript.authorName} • {manuscript.category}
          </p>
        </div>
      </div>

      {/* Timeline Recommender - Gantt Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Timeline Gantt Chart</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                Expected: {timeline.expectedCompletionDate.toLocaleDateString()}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              timeline.isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {timeline.isOverdue ? 'Behind Schedule' : 'On Track'}
            </div>
          </div>
        </div>

        {/* Progress Alert */}
        {timeline.isOverdue && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Behind Schedule</p>
              <p className="text-sm text-red-700">
                This manuscript is {timeline.daysSinceSubmission - timeline.currentStage!.endDay} days overdue in the {timeline.currentStage!.name} stage.
              </p>
            </div>
          </div>
        )}

        {/* Gantt Chart */}
        <div className="space-y-1">
          {/* Time Axis */}
          <div className="flex items-center mb-2">
            <div className="w-32"></div>
            <div className="flex-1 flex items-center justify-between text-xs text-gray-500 px-2">
              <span>Day 0</span>
              <span>Day {Math.floor(timeline.totalExpectedDays / 4)}</span>
              <span>Day {Math.floor(timeline.totalExpectedDays / 2)}</span>
              <span>Day {Math.floor(timeline.totalExpectedDays * 3 / 4)}</span>
              <span>Day {timeline.totalExpectedDays}</span>
            </div>
          </div>

          {/* Gantt Bars */}
          {timeline.stages.map((stage, index) => {
            const isPast = index < timeline.currentStageIndex;
            const isCurrent = index === timeline.currentStageIndex;
            const barStartPercent = (stage.startDay / timeline.totalExpectedDays) * 100;
            const barWidthPercent = (stage.duration / timeline.totalExpectedDays) * 100;

            // Calculate actual progress for current stage
            const actualProgress = isCurrent
              ? Math.min(100, (timeline.daysInCurrentStage / stage.duration) * 100)
              : isPast ? 100 : 0;

            return (
              <div key={stage.name} className="flex items-center gap-3 py-2">
                {/* Stage Label */}
                <div className="w-32">
                  <div className="flex items-center gap-2">
                    {isPast && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {isCurrent && <Clock className="w-4 h-4 text-blue-600" />}
                    {!isPast && !isCurrent && <Calendar className="w-4 h-4 text-gray-400" />}
                    <span className={`text-sm font-medium ${
                      isPast ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {stage.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-6">{stage.duration} days</span>
                </div>

                {/* Gantt Bar Container */}
                <div className="flex-1 relative h-10 bg-gray-100 rounded">
                  {/* Planned Bar (Light) */}
                  <div
                    className={`absolute top-1 h-8 rounded transition-all ${
                      isPast ? 'bg-green-200' : isCurrent ? 'bg-blue-200' : 'bg-gray-200'
                    }`}
                    style={{
                      left: `${barStartPercent}%`,
                      width: `${barWidthPercent}%`,
                    }}
                  >
                    {/* Actual Progress Bar (Dark) */}
                    {(isPast || isCurrent) && (
                      <div
                        className={`h-full rounded transition-all ${
                          isPast ? 'bg-green-500' : timeline.isOverdue && isCurrent ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${actualProgress}%` }}
                      />
                    )}
                  </div>

                  {/* Stage Info Tooltip */}
                  <div
                    className="absolute top-1 h-8 flex items-center px-2 pointer-events-none"
                    style={{
                      left: `${barStartPercent}%`,
                      width: `${barWidthPercent}%`,
                    }}
                  >
                    {isCurrent && (
                      <span className="text-xs font-medium text-white drop-shadow">
                        {timeline.daysInCurrentStage} / {stage.duration} days
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="w-20 text-right">
                  {isPast && (
                    <span className="text-xs font-medium text-green-600">Done</span>
                  )}
                  {isCurrent && (
                    <span className="text-xs font-medium text-blue-600">
                      {Math.round(actualProgress)}%
                    </span>
                  )}
                  {!isPast && !isCurrent && (
                    <span className="text-xs text-gray-400">Pending</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Current Day Indicator */}
          <div className="relative h-1 mt-2">
            <div className="w-32"></div>
            <div className="flex-1 relative">
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-10"
                style={{
                  left: `${(timeline.daysSinceSubmission / timeline.totalExpectedDays) * 100}%`,
                }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-medium text-orange-600 bg-white px-2 py-1 rounded shadow-sm">
                    Today (Day {timeline.daysSinceSubmission})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-gray-600">Planned Duration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Current Day</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="submission" className="bg-white rounded-lg border border-gray-200">
        <Tabs.List className="flex border-b border-gray-200">
          <Tabs.Trigger
            value="submission"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <FileText className="w-4 h-4" />
            Submission
          </Tabs.Trigger>
          <Tabs.Trigger
            value="review"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <Users className="w-4 h-4" />
            Review
          </Tabs.Trigger>
          <Tabs.Trigger
            value="copyediting"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <MessageSquare className="w-4 h-4" />
            Copyediting
          </Tabs.Trigger>
          <Tabs.Trigger
            value="production"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <Package className="w-4 h-4" />
            Production
          </Tabs.Trigger>
        </Tabs.List>

        {/* Submission Tab */}
        <Tabs.Content value="submission" className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>

              {/* Manuscript Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Abstract</p>
                  <p className="text-sm text-gray-600 mt-1">{manuscript.abstract}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Submitted</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {manuscript.submittedAt.toLocaleDateString()} at{' '}
                      {manuscript.submittedAt.toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Updated</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {manuscript.updatedAt.toLocaleDateString()} at{' '}
                      {manuscript.updatedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Submitted Files</p>
                  <div className="space-y-2">
                    {manuscript.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-white rounded border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{file.fileName}</span>
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestChangesDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <MessageSquare className="w-4 h-4" />
                  Request Changes
                </button>
                <button
                  onClick={() => updateManuscriptStatus(manuscript.id, 'review')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Move to Review
                </button>
                <button
                  onClick={() => setShowDeclineDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4" />
                  Decline Submission
                </button>
              </div>
            </div>

            {/* Revision History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Revision History
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {manuscript.revisionHistory
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((revision) => (
                      <div key={revision.id} className="flex gap-3 p-3 bg-white rounded border border-gray-200">
                        <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-blue-600"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-xs rounded font-medium bg-blue-100 text-blue-800">
                              {revision.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {revision.date.toLocaleDateString()} at {revision.date.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-medium">{revision.changedByName}:</span> {revision.notes}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Review Tab */}
        <Tabs.Content value="review" className="p-6">
          <div className="space-y-6">
            {/* Reviewer Suggestions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Reviewers</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  Based on expertise match and current workload
                </p>
              </div>
              <div className="space-y-2">
                {reviewerSuggestions.map(({ reviewer, workload, expertiseMatch }) => (
                  <div
                    key={reviewer.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{reviewer.name}</p>
                      <p className="text-sm text-gray-600">{reviewer.email}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-600">
                          Expertise Match: <span className="font-medium text-green-600">{expertiseMatch}%</span>
                        </span>
                        <span className="text-xs text-gray-600">
                          Current Workload: <span className="font-medium">{workload} reviews</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReviewerId(reviewer.id);
                        setShowInviteReviewerDialog(true);
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                      Send Invitation
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Reviewers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Reviewers</h3>
              {manuscript.assignedReviewers.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviewers assigned yet</p>
              ) : (
                <div className="space-y-3">
                  {manuscript.assignedReviewers.map((reviewerId) => {
                    const reviewer = users.find((u) => u.id === reviewerId);
                    const review = reviews.find(
                      (r) => r.manuscriptId === manuscript.id && r.reviewerId === reviewerId
                    );
                    return (
                      <div key={reviewerId} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{reviewer?.name}</p>
                            <p className="text-sm text-gray-600">{reviewer?.email}</p>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              review?.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {review?.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        {review?.status === 'completed' && (
                          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <p className="text-sm font-medium text-gray-700">Decision: {review.decision.replace(/_/g, ' ')}</p>
                            <p className="text-sm text-gray-600 mt-1">{review.comments}</p>
                          </div>
                        )}
                        {review && review.deadline && (
                          <p className="text-xs text-gray-500 mt-2">
                            Deadline: {review.deadline.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Feedback to Author */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback to Author</h3>
              <div className="space-y-3">
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide feedback based on reviewer comments..."
                  value={feedbackToAuthor}
                  onChange={(e) => setFeedbackToAuthor(e.target.value)}
                />
                <button
                  onClick={handleSendFeedbackToAuthor}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Copyediting Tab */}
        <Tabs.Content value="copyediting" className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Copyediting Assignment</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  Assign a copyeditor to review and edit the manuscript for grammar, style, and formatting.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select copyeditor...</option>
                  {copyeditors.map((editor) => (
                    <option key={editor.id} value={editor.id}>
                      {editor.name}
                    </option>
                  ))}
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Assign
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Copyeditor Messages</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">No messages yet</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Files</h3>
              <div className="space-y-2">
                {manuscript.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded by {file.uploadedByName} on {file.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Production Tab */}
        <Tabs.Content value="production" className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Files</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  Upload and manage production-ready files including certificates, book layout, and final manuscripts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Certificate</h4>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 w-full justify-center">
                  <Upload className="w-4 h-4" />
                  Upload Certificate
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-gray-900">Book Layout</h4>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 w-full justify-center">
                  <Upload className="w-4 h-4" />
                  Upload Layout
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium text-gray-900">Final Manuscript</h4>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 w-full justify-center">
                  <Upload className="w-4 h-4" />
                  Upload Final Version
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <h4 className="font-medium text-gray-900">Other Documents</h4>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 w-full justify-center">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Production Files</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">No production files uploaded yet</p>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Request Changes Dialog */}
      <Dialog.Root open={showRequestChangesDialog} onOpenChange={setShowRequestChangesDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Request Changes
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Request changes to the manuscript submission
            </Dialog.Description>
            <div className="space-y-4">
              <textarea
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain what changes are needed..."
                value={requestChangesNote}
                onChange={(e) => setRequestChangesNote(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleRequestChanges}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Send Request
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Decline Dialog */}
      <Dialog.Root open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Decline Submission
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Decline the manuscript submission with a reason
            </Dialog.Description>
            <div className="space-y-4">
              <textarea
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain why this submission is being declined..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleDeclineSubmission}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Decline Submission
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Invite Reviewer Dialog */}
      <Dialog.Root open={showInviteReviewerDialog} onOpenChange={setShowInviteReviewerDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Send Reviewer Invitation
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Send an invitation to a reviewer with a deadline
            </Dialog.Description>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reviewer
                </label>
                <p className="text-gray-900">
                  {users.find((u) => u.id === selectedReviewerId)?.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Deadline
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewDeadline}
                  onChange={(e) => setReviewDeadline(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleInviteReviewer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
