import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Send,
  Save,
  Users,
  ChevronDown,
  ChevronUp,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import type { Manuscript, Review, User } from '../types';

interface ReviewConsolidationPageProps {
  manuscript: Manuscript;
  reviews: Review[];
  reviewers: User[];
  onBack: () => void;
  onSendToAuthor: (consolidationData: ConsolidationData) => void;
}

export interface ConsolidationData {
  consolidatedFeedback: string;
  editorialDecision: string;
  revisionDeadline: string;
  editorNotes: string;
}

export function ReviewConsolidationPage({
  manuscript,
  reviews,
  reviewers,
  onBack,
  onSendToAuthor,
}: ReviewConsolidationPageProps) {
  const [consolidatedFeedback, setConsolidatedFeedback] = useState('');
  const [editorialDecision, setEditorialDecision] = useState('');
  const [revisionDeadline, setRevisionDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [editorNotes, setEditorNotes] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const completedReviews = reviews.filter((r) => r.status === 'completed');
  const pendingReviews = reviews.filter((r) => r.status !== 'completed');

  const toggleReview = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const getDecisionColor = (decision: string) => {
    const colors: Record<string, string> = {
      accept: 'bg-green-100 text-green-800 border-green-200',
      minor_revision: 'bg-blue-100 text-blue-800 border-blue-200',
      major_revision: 'bg-amber-100 text-amber-800 border-amber-200',
      reject: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[decision] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'accept':
        return <CheckCircle className="w-4 h-4" />;
      case 'reject':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      `consolidation-draft-${manuscript.id}`,
      JSON.stringify({
        consolidatedFeedback,
        editorialDecision,
        revisionDeadline,
        editorNotes,
      })
    );
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleSubmit = () => {
    if (!consolidatedFeedback.trim() || !editorialDecision) {
      alert('Please complete all required fields');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    const data: ConsolidationData = {
      consolidatedFeedback,
      editorialDecision,
      revisionDeadline,
      editorNotes,
    };
    onSendToAuthor(data);
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  if (showSuccessModal) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        <div className="bg-[#0F2D5E] text-[#f5f1e8] py-8 px-6 border-b-4 border-[#8b7355]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif">Review Package Sent</h1>
            <p className="mt-2 text-[#d4c5b0]">Consolidated reviews sent to author</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="bg-white border border-[#EAEDF2] rounded-sm p-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-green-100 rounded-sm mb-4">
                <CheckCircle className="w-12 h-12 text-green-700" />
              </div>
              <h2 className="text-2xl font-serif text-[#0F2D5E] mb-2">Package Delivered</h2>
              <p className="text-gray-700">
                The consolidated review has been sent to the author.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Sent to Author</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Author Notified</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Status Updated</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Revision Activated</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
              <p className="text-sm text-blue-900 font-medium mb-1">What's Next?</p>
              <p className="text-sm text-blue-700">
                The author will revise the manuscript based on your feedback. You'll be notified when they resubmit.
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 bg-[#0F2D5E] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const conflictingReviews =
    completedReviews.length >= 2 &&
    new Set(completedReviews.map((r) => r.decision)).size > 1;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="bg-[#0F2D5E] text-[#f5f1e8] py-8 px-6 border-b-4 border-[#8b7355]">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#d4c5b0] hover:text-[#f5f1e8] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-serif">Review Consolidation</h1>
              <p className="mt-2 text-[#d4c5b0]">Prepare feedback for author</p>
            </div>
            {draftSaved && (
              <div className="bg-green-600 text-white px-4 py-2 rounded-sm text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Draft Saved
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-6 space-y-6">
        {/* Manuscript Info */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{manuscript.title}</h2>
          <p className="text-sm text-gray-600">{manuscript.category}</p>
        </div>

        {/* Review Status Summary */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <h2 className="text-xl font-serif">Review Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-sm p-4">
                <p className="text-sm text-green-700 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-900">{completedReviews.length}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
                <p className="text-sm text-amber-700 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-900">{pendingReviews.length}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                <p className="text-sm text-blue-700 mb-1">Total Reviews</p>
                <p className="text-2xl font-bold text-blue-900">{reviews.length}</p>
              </div>
            </div>

            {conflictingReviews && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-sm p-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Conflicting recommendations detected - review carefully
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviewer Feedback Cards */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h2 className="text-xl font-serif">Reviewer Feedback</h2>
            </div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-3 py-1.5 bg-[#F7F8FA] text-[#0F2D5E] rounded-sm text-sm hover:bg-[#e5e1d8] transition-colors"
            >
              {showComparison ? 'Card View' : 'Compare Side-by-Side'}
            </button>
          </div>

          <div className="p-6">
            {showComparison ? (
              // Comparison View
              <div className="grid grid-cols-2 gap-4">
                {completedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-sm p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border flex items-center gap-1 ${getDecisionColor(
                          review.decision
                        )}`}
                      >
                        {getDecisionIcon(review.decision)}
                        {review.decision.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>
                        <strong>Comments:</strong>
                      </p>
                      <p className="text-xs bg-white p-2 rounded border border-gray-200">
                        {review.comments || 'No comments provided'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Card View
              <div className="space-y-3">
                {completedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleReview(review.id)}
                      className="w-full bg-gray-50 p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-sm">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                          <p className="text-xs text-gray-600">
                            Submitted {review.submittedAt?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded border flex items-center gap-1 ${getDecisionColor(
                            review.decision
                          )}`}
                        >
                          {getDecisionIcon(review.decision)}
                          {review.decision.replace('_', ' ')}
                        </span>
                        {expandedReviews.has(review.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                    </button>

                    {expandedReviews.has(review.id) && (
                      <div className="bg-white p-4 border-t border-gray-200">
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">Review Comments</p>
                          <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                            <p className="text-sm text-gray-700">
                              {review.comments || 'No comments provided'}
                            </p>
                          </div>
                        </div>

                        {review.grammaticalCorrections && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              Grammatical Corrections
                            </p>
                            <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                              <p className="text-sm text-gray-700">
                                {review.grammaticalCorrections}
                              </p>
                            </div>
                          </div>
                        )}

                        {review.suggestedRevisions && (
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              Suggested Revisions
                            </p>
                            <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                              <p className="text-sm text-gray-700">{review.suggestedRevisions}</p>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-sm text-sm hover:bg-blue-700 flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View Files
                          </button>
                          <button className="px-3 py-1.5 bg-gray-600 text-white rounded-sm text-sm hover:bg-gray-700 flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {pendingReviews.length > 0 && (
                  <div className="border border-amber-200 bg-amber-50 rounded-sm p-4">
                    <div className="flex items-center gap-2 text-amber-800">
                      <Clock className="w-5 h-5" />
                      <p className="text-sm font-medium">
                        {pendingReviews.length} review(s) still pending
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Editorial Decision */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2]">
            <h2 className="text-xl font-serif">Editorial Decision</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Decision <span className="text-red-600">*</span>
            </label>
            <select
              value={editorialDecision}
              onChange={(e) => setEditorialDecision(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
            >
              <option value="">Select decision...</option>
              <option value="accept">Accept</option>
              <option value="minor_revision">Minor Revision</option>
              <option value="major_revision">Major Revision</option>
              <option value="reject">Reject</option>
            </select>
          </div>
        </div>

        {/* Consolidated Feedback */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2]">
            <h2 className="text-xl font-serif">Consolidated Feedback for Author</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Summary <span className="text-red-600">*</span>
            </label>
            <textarea
              value={consolidatedFeedback}
              onChange={(e) => setConsolidatedFeedback(e.target.value)}
              rows={10}
              placeholder="Summarize all reviewer feedback into a clear, actionable revision plan for the author..."
              className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">{consolidatedFeedback.length} characters</p>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Additional Editor Notes (Optional)
              </label>
              <textarea
                value={editorNotes}
                onChange={(e) => setEditorNotes(e.target.value)}
                rows={4}
                placeholder="Add any additional guidance or notes for the author..."
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Revision Timeline */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <h2 className="text-xl font-serif">Revision Timeline</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Revision Deadline
                </label>
                <input
                  type="date"
                  value={revisionDeadline}
                  onChange={(e) => setRevisionDeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommended Duration
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                  <p className="text-sm text-blue-900">
                    30 days for {editorialDecision.replace('_', ' ') || 'revision'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white border border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="px-6 py-3 bg-white border border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-gray-50 font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#0F2D5E] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] font-medium flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send to Author
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6 border border-[#EAEDF2]">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-blue-100 rounded-sm mb-3">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-serif text-[#0F2D5E] mb-2">Send Review Package?</h3>
              <p className="text-sm text-gray-700">
                This will send the consolidated feedback to the author and activate the revision stage.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 mb-6 text-sm text-gray-700">
              <p>
                <strong>Decision:</strong> {editorialDecision.replace('_', ' ')}
              </p>
              <p>
                <strong>Deadline:</strong> {new Date(revisionDeadline).toLocaleDateString()}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-6 py-2 bg-[#0F2D5E] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] font-medium"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
