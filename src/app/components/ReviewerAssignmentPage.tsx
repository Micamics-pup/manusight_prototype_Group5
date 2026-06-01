import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  User,
  BarChart3,
  Activity,
} from 'lucide-react';
import type { Manuscript, Review } from '../types';
import { TimelineRecommendationPage } from './TimelineRecommendationPage';

interface ReviewerAssignmentPageProps {
  manuscript: Manuscript;
  onBack: () => void;
  onAssignmentConfirmed: () => void;
}

interface ReviewerResponseData {
  reviewerId: string;
  reviewerName: string;
  expertise: string;
  invitationStatus: 'sent' | 'viewed' | 'responded';
  response: 'accepted' | 'declined' | 'pending' | 'clarification_requested';
  availabilityStatus: string;
  responseTimestamp?: Date;
  requestedExtension?: Date;
  message?: string;
}

export function ReviewerAssignmentPage({
  manuscript,
  onBack,
  onAssignmentConfirmed,
}: ReviewerAssignmentPageProps) {
  const { users, reviews } = useData();
  const [selectedReviewers, setSelectedReviewers] = useState<Set<string>>(new Set());
  const [replacementReviewers, setReplacementReviewers] = useState<Record<string, string>>({});
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [finalDeadline, setFinalDeadline] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [timelineDecision, setTimelineDecision] = useState<'accept' | 'modify' | 'additional'>('accept');
  const [manualDeadline, setManualDeadline] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [additionalReviewerId, setAdditionalReviewerId] = useState('');
  const [timelineNotes, setTimelineNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTimelineRecommendation, setShowTimelineRecommendation] = useState(false);

  // Get reviewer responses
  const reviewerResponses: ReviewerResponseData[] = useMemo(() => {
    return manuscript.assignedReviewers.map((reviewerId) => {
      const reviewer = users.find((u) => u.id === reviewerId);
      const review = reviews.find((r) => r.manuscriptId === manuscript.id && r.reviewerId === reviewerId);

      if (!reviewer) {
        return {
          reviewerId,
          reviewerName: 'Unknown Reviewer',
          expertise: 'N/A',
          invitationStatus: 'sent' as const,
          response: 'pending' as const,
          availabilityStatus: 'Unknown',
        };
      }

      // Simulate response based on review status
      let response: 'accepted' | 'declined' | 'pending' | 'clarification_requested' = 'pending';
      let responseTimestamp: Date | undefined;

      if (review) {
        if (review.status === 'in_progress' || review.status === 'completed') {
          response = 'accepted';
          responseTimestamp = new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000);
        } else if (review.status === 'pending') {
          response = 'pending';
        }
      }

      return {
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        expertise: reviewerId === '4' ? 'Urban Planning, Sustainability' : 'Neuroscience, Education',
        invitationStatus: 'responded' as const,
        response,
        availabilityStatus: response === 'accepted' ? 'Available' : 'Pending',
        responseTimestamp,
      };
    });
  }, [manuscript, users, reviews]);

  const acceptedReviewers = reviewerResponses.filter((r) => r.response === 'accepted');
  const declinedReviewers = reviewerResponses.filter((r) => r.response === 'declined');
  const pendingReviewers = reviewerResponses.filter((r) => r.response === 'pending');

  // Timeline calculation
  const timelineAnalytics = useMemo(() => {
    const originalTimeline = 14; // days
    const acceptedCount = acceptedReviewers.length;
    const pendingCount = pendingReviewers.length;
    const declinedCount = declinedReviewers.length;

    let adjustedTimeline = originalTimeline;
    let delayRisk: 'Low' | 'Moderate' | 'High' = 'Low';

    if (declinedCount > 0) {
      adjustedTimeline += 4; // Add 4 days for replacement
      delayRisk = 'Moderate';
    }

    if (pendingCount > 0) {
      adjustedTimeline += 2; // Add 2 days for pending responses
      if (delayRisk === 'Moderate') {
        delayRisk = 'High';
      } else {
        delayRisk = 'Moderate';
      }
    }

    if (acceptedCount >= 2 && pendingCount === 0 && declinedCount === 0) {
      delayRisk = 'Low';
    }

    const completionEstimate = new Date(Date.now() + adjustedTimeline * 24 * 60 * 60 * 1000);

    return {
      originalTimeline,
      adjustedTimeline,
      delayRisk,
      completionEstimate,
    };
  }, [acceptedReviewers, pendingReviewers, declinedReviewers]);

  // Available reviewers for replacement
  const availableReviewers = users.filter(
    (u) => u.role === 'reviewer' && !manuscript.assignedReviewers.includes(u.id)
  );

  const handleReviewerToggle = (reviewerId: string) => {
    const newSelected = new Set(selectedReviewers);
    if (newSelected.has(reviewerId)) {
      newSelected.delete(reviewerId);
    } else {
      newSelected.add(reviewerId);
    }
    setSelectedReviewers(newSelected);
  };

  const handleConfirmAssignment = () => {
    setShowSuccess(true);
  };

  // Show Timeline Recommendation Page if requested
  if (showTimelineRecommendation) {
    return (
      <TimelineRecommendationPage
        manuscript={manuscript}
        onBack={() => setShowTimelineRecommendation(false)}
        onTimelineUpdated={() => {
          setShowTimelineRecommendation(false);
        }}
      />
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
        <div className="text-white py-8 px-6" style={{ backgroundColor: '#0F2D5E' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-[32px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Reviewer Assignment Confirmation</h1>
            <p className="mt-2 text-[14px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#D6E8F7' }}>Assignment successfully confirmed</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="bg-white rounded-xl p-8 mb-6" style={{ border: '0.5px solid #EAEDF2' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-sm">
                <CheckCircle className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h2 className="text-[22px] font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>
                  Reviewer Assignment Confirmed
                </h2>
                <p className="text-gray-700">
                  The review panel has been finalized and the review stage is now active.
                </p>
              </div>
            </div>

            <div className="border-t border-[#d1c7b3] pt-6 mt-6 space-y-4">
              <h3 className="text-lg font-serif text-[#1a1f2e] mb-4">System Outputs</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Reviewer Assignment Confirmation</p>
                    <p className="text-sm text-gray-600">
                      Confirmation emails sent to {selectedReviewers.size} reviewer(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Review Access Activation</p>
                    <p className="text-sm text-gray-600">
                      Reviewers can now access manuscript materials and begin review process
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Timeline Tracking Start</p>
                    <p className="text-sm text-gray-600">
                      Review deadline: {new Date(timelineDecision === 'modify' ? manualDeadline : finalDeadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Manuscript Status Update</p>
                    <p className="text-sm text-gray-600">Status: Under Peer Review</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Review Stage Activation</p>
                    <p className="text-sm text-gray-600">
                      Workflow advanced to active peer review stage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {timelineAnalytics.delayRisk !== 'Low' && (
              <div className="border-t border-[#d1c7b3] pt-6 mt-6">
                <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">Timeline Adjustment Applied</p>
                      <p className="text-sm text-amber-700">
                        Review timeline adjusted from {timelineAnalytics.originalTimeline} to{' '}
                        {timelineAnalytics.adjustedTimeline} days due to reviewer availability
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="px-6 py-3 text-white rounded-lg transition-colors font-semibold"
              style={{ backgroundColor: '#0F2D5E', fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A4A8A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F2D5E'}
            >
              Return to Dashboard
            </button>
            <button
              onClick={onAssignmentConfirmed}
              className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              style={{ border: '0.5px solid #EAEDF2', fontFamily: 'DM Sans, sans-serif' }}
            >
              View Review Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      <div className="text-white py-8 px-6" style={{ backgroundColor: '#0F2D5E' }}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 transition-colors hover:opacity-80"
            style={{ color: '#4D9DE0', fontFamily: 'DM Sans, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-[32px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Reviewer Assignment</h1>
          <p className="mt-2 text-[14px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#D6E8F7' }}>Confirm reviewer assignments and finalize review panel</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-6 space-y-6">
        {/* Manuscript Information */}
        <div className="bg-white rounded-xl" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="text-white px-6 py-4" style={{ backgroundColor: '#0F2D5E', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Manuscript Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Manuscript ID</label>
                <p className="text-gray-900">{manuscript.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Review Type</label>
                <p className="text-gray-900">Double-Blind Peer Review</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600 block mb-1">Manuscript Title</label>
                <p className="text-gray-900 font-medium">{manuscript.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Required Reviewer Count
                </label>
                <p className="text-gray-900">2 Reviewers</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Current Timeline Estimate
                </label>
                <p className="text-gray-900">{timelineAnalytics.adjustedTimeline} Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Analytics */}
        <div className="bg-white rounded-xl" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="text-white px-6 py-4 flex items-center gap-2" style={{ backgroundColor: '#0F2D5E', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Dynamic Timeline Adjustment</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                <p className="text-sm text-blue-700 font-medium mb-1">Original Timeline</p>
                <p className="text-2xl font-bold text-blue-900">
                  {timelineAnalytics.originalTimeline} Days
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
                <p className="text-sm text-purple-700 font-medium mb-1">Adjusted Timeline</p>
                <p className="text-2xl font-bold text-purple-900">
                  {timelineAnalytics.adjustedTimeline} Days
                </p>
              </div>
              <div
                className={`rounded-sm p-4 border ${
                  timelineAnalytics.delayRisk === 'Low'
                    ? 'bg-green-50 border-green-200'
                    : timelineAnalytics.delayRisk === 'Moderate'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p
                  className={`text-sm font-medium mb-1 ${
                    timelineAnalytics.delayRisk === 'Low'
                      ? 'text-green-700'
                      : timelineAnalytics.delayRisk === 'Moderate'
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }`}
                >
                  Delay Risk Level
                </p>
                <p
                  className={`text-2xl font-bold ${
                    timelineAnalytics.delayRisk === 'Low'
                      ? 'text-green-900'
                      : timelineAnalytics.delayRisk === 'Moderate'
                      ? 'text-amber-900'
                      : 'text-red-900'
                  }`}
                >
                  {timelineAnalytics.delayRisk}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                <p className="text-sm text-gray-700 font-medium mb-1">Est. Completion</p>
                <p className="text-lg font-bold text-gray-900">
                  {timelineAnalytics.completionEstimate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-[#1a1f2e] rounded-sm">
                  <Users className="w-5 h-5 text-[#f5f1e8]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Reviewer Response Summary</h3>
                  <p className="text-sm text-gray-600">
                    {acceptedReviewers.length} Accepted • {declinedReviewers.length} Declined •{' '}
                    {pendingReviewers.length} Pending
                  </p>
                </div>
              </div>

              {timelineAnalytics.delayRisk !== 'Low' && (
                <div
                  className={`border-l-4 pl-4 py-2 ${
                    timelineAnalytics.delayRisk === 'Moderate'
                      ? 'border-amber-500'
                      : 'border-red-500'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 mb-1">System Recommendation</p>
                  <p className="text-sm text-gray-700">
                    {declinedReviewers.length > 0 &&
                      `${declinedReviewers.length} reviewer(s) declined. Consider assigning replacement reviewer(s). `}
                    {pendingReviewers.length > 0 &&
                      `${pendingReviewers.length} invitation(s) still pending. Timeline may be affected.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Timeline Recommendation Preview */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-sm">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-indigo-600 rounded-sm">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#1a1f2e] mb-1">
                    AI-Powered Timeline Recommendation
                  </h3>
                  <p className="text-sm text-gray-700">
                    View comprehensive stage-by-stage analysis with delay factors and projected dates
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white border border-indigo-200 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-semibold text-gray-700 uppercase">Total Duration</p>
                </div>
                <p className="text-2xl font-bold text-indigo-900">
                  {timelineAnalytics.adjustedTimeline} Days
                </p>
                <p className="text-xs text-gray-600 mt-1">Full workflow estimate</p>
              </div>

              <div className="bg-white border border-indigo-200 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-semibold text-gray-700 uppercase">Projected Date</p>
                </div>
                <p className="text-lg font-bold text-indigo-900">
                  {timelineAnalytics.completionEstimate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-600 mt-1">Publication forecast</p>
              </div>

              <div className="bg-white border border-indigo-200 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-semibold text-gray-700 uppercase">Risk Level</p>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    timelineAnalytics.delayRisk === 'Low'
                      ? 'text-green-700'
                      : timelineAnalytics.delayRisk === 'Moderate'
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }`}
                >
                  {timelineAnalytics.delayRisk}
                </p>
                <p className="text-xs text-gray-600 mt-1">Delay probability</p>
              </div>
            </div>

            <div className="bg-white border border-indigo-200 rounded-sm p-4 mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Included in Full Analysis:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>10-Stage workflow breakdown</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Reviewer performance impact</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Detected delay factors</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Manual timeline adjustment</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTimelineRecommendation(true)}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-sm hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Full Dynamic Timeline Recommendation
            </button>
          </div>
        </div>

        {/* Reviewer Response Monitoring */}
        <div className="bg-white rounded-xl" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="text-white px-6 py-4" style={{ backgroundColor: '#0F2D5E', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Reviewer Response Monitoring</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[#d1c7b3]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Confirm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Reviewer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Expertise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Invitation Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Response
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1c7b3]">
                {reviewerResponses.map((reviewer) => (
                  <tr key={reviewer.reviewerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {reviewer.response === 'accepted' && (
                        <input
                          type="checkbox"
                          checked={selectedReviewers.has(reviewer.reviewerId)}
                          onChange={() => handleReviewerToggle(reviewer.reviewerId)}
                          className="w-4 h-4 text-[#1a1f2e] border-gray-300 rounded focus:ring-[#1a1f2e]"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 rounded-sm">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{reviewer.reviewerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{reviewer.expertise}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {reviewer.invitationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {reviewer.response === 'accepted' && (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Accepted</span>
                        </div>
                      )}
                      {reviewer.response === 'declined' && (
                        <div className="flex items-center gap-2 text-red-700">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Declined</span>
                        </div>
                      )}
                      {reviewer.response === 'pending' && (
                        <div className="flex items-center gap-2 text-amber-700">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {reviewer.availabilityStatus}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reviewer.responseTimestamp
                        ? reviewer.responseTimestamp.toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {reviewer.response === 'declined' && (
                        <select
                          value={replacementReviewers[reviewer.reviewerId] || ''}
                          onChange={(e) =>
                            setReplacementReviewers({
                              ...replacementReviewers,
                              [reviewer.reviewerId]: e.target.value,
                            })
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                        >
                          <option value="">Replace...</option>
                          {availableReviewers.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment Configuration */}
        <div className="bg-white rounded-xl" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="text-white px-6 py-4" style={{ backgroundColor: '#0F2D5E', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Assignment Configuration</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Timeline Decision */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Timeline Decision
              </label>
              <select
                value={timelineDecision}
                onChange={(e) => setTimelineDecision(e.target.value as any)}
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
              >
                <option value="accept">Accept Recommended Timeline</option>
                <option value="modify">Modify Timeline Manually</option>
                <option value="additional">Request Additional Reviewer</option>
              </select>
            </div>

            {timelineDecision === 'modify' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Manual Deadline Adjustment
                </label>
                <input
                  type="date"
                  value={manualDeadline}
                  onChange={(e) => setManualDeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                />
              </div>
            )}

            {timelineDecision === 'additional' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Reviewer Request
                </label>
                <select
                  value={additionalReviewerId}
                  onChange={(e) => setAdditionalReviewerId(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                >
                  <option value="">Select reviewer...</option>
                  {availableReviewers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Final Review Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Final Review Deadline
              </label>
              <input
                type="date"
                value={finalDeadline}
                onChange={(e) => setFinalDeadline(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
              />
            </div>

            {/* Assignment Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reviewer Assignment Notes
              </label>
              <textarea
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about the reviewer assignment, timeline adjustments, or special considerations..."
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
              />
            </div>

            {/* Timeline Notes */}
            {timelineDecision !== 'accept' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Timeline Adjustment Notes
                </label>
                <textarea
                  value={timelineNotes}
                  onChange={(e) => setTimelineNotes(e.target.value)}
                  rows={3}
                  placeholder="Example: Deadline extended due to reviewer availability conflict."
                  className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            style={{ border: '0.5px solid #EAEDF2', fontFamily: 'DM Sans, sans-serif' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAssignment}
            disabled={selectedReviewers.size === 0}
            className="px-8 py-3 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: '#0F2D5E', fontFamily: 'DM Sans, sans-serif' }}
            onMouseEnter={(e) => selectedReviewers.size === 0 ? null : e.currentTarget.style.backgroundColor = '#1A4A8A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F2D5E'}
          >
            <CheckCircle className="w-5 h-5" />
            Confirm Reviewer Assignment
          </button>
        </div>
      </div>
    </div>
  );
}
