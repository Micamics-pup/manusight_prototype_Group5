import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { FileText, Edit, User, Mail, CheckCircle, XCircle, Calendar, List, Send } from 'lucide-react';
import { ReviewInvitationPage } from '../reviewer/ReviewInvitationPage';
import { ReviewWorkspace } from '../reviewer/ReviewWorkspace';
import { ProfileSettings } from '../reviewer/ProfileSettings';
import { ManuscriptListPage } from '../ManuscriptListPage';
import { ReviewerResponsePage } from '../ReviewerResponsePage';
import { ReviewEvaluationPage, ReviewSubmissionData } from '../ReviewEvaluationPage';
import type { Manuscript, ReviewDecision } from '../../types';

type ViewMode = 'dashboard' | 'invitations' | 'invitation-detail' | 'workspace' | 'profile' | 'listview' | 'reviewer-response' | 'review-evaluation';

export function ReviewerDashboard() {
  const { currentUser } = useAuth();
  const { manuscripts, reviews, updateReview, submitReview, updateUser } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);

  const assignedManuscripts = manuscripts.filter((ms) =>
    ms.assignedReviewers.includes(currentUser?.id || '')
  );

  const myReviews = reviews.filter((r) => r.reviewerId === currentUser?.id);

  const pendingInvitations = assignedManuscripts.filter((ms) => {
    const review = myReviews.find((r) => r.manuscriptId === ms.id);
    return !review || review.status === 'pending';
  });

  const activeReviews = assignedManuscripts.filter((ms) => {
    const review = myReviews.find((r) => r.manuscriptId === ms.id);
    return review && (review.status === 'in_progress' || review.status === 'completed');
  });

  const getReviewForManuscript = (manuscriptId: string) => {
    return myReviews.find((r) => r.manuscriptId === manuscriptId);
  };

  const handleOpenInvitationDetail = (manuscript: Manuscript) => {
    setSelectedManuscript(manuscript);
    setViewMode('reviewer-response');
  };

  const handleOpenWorkspace = (manuscript: Manuscript) => {
    setSelectedManuscript(manuscript);
    setViewMode('workspace');
  };

  const handleAcceptInvitation = () => {
    setViewMode('workspace');
  };

  const handleDeclineInvitation = () => {
    setSelectedManuscript(null);
    setViewMode('invitations');
  };

  const handleSubmitReview = (
    decision: ReviewDecision,
    comments: string,
    rating: number,
    grammaticalCorrections: string,
    suggestedRevisions: string
  ) => {
    if (selectedManuscript && currentUser) {
      const existingReview = myReviews.find((r) => r.manuscriptId === selectedManuscript.id);

      if (existingReview) {
        updateReview(existingReview.id, decision, comments);
      } else {
        submitReview({
          manuscriptId: selectedManuscript.id,
          reviewerId: currentUser.id,
          reviewerName: currentUser.name,
          decision,
          comments,
          grammaticalCorrections,
          suggestedRevisions,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: 'completed',
        });
      }

      setSelectedManuscript(null);
      setViewMode('dashboard');
    }
  };

  const handleBackToDashboard = () => {
    setSelectedManuscript(null);
    setViewMode('dashboard');
  };

  const handleUpdateProfile = (updates: Partial<typeof currentUser>) => {
    if (currentUser) {
      updateUser(currentUser.id, updates);
    }
  };

  const handleOpenReviewEvaluation = (manuscript: Manuscript) => {
    setSelectedManuscript(manuscript);
    setViewMode('review-evaluation');
  };

  const handleSubmitReviewEvaluation = (reviewData: ReviewSubmissionData) => {
    if (selectedManuscript && currentUser) {
      const existingReview = myReviews.find((r) => r.manuscriptId === selectedManuscript.id);

      if (existingReview) {
        updateReview(
          existingReview.id,
          reviewData.overallRecommendation as ReviewDecision,
          reviewData.commentsToAuthor
        );
      }

      setTimeout(() => {
        setSelectedManuscript(null);
        setViewMode('dashboard');
      }, 3000);
    }
  };

  if (viewMode === 'listview') {
    return (
      <ManuscriptListPage
        onViewDetails={(manuscript) => {
          setSelectedManuscript(manuscript);
          setViewMode('dashboard');
        }}
        onBack={() => setViewMode('dashboard')}
      />
    );
  }

  if (viewMode === 'invitations') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Review Invitations</h2>
            <p className="text-gray-600 mt-1">Pending invitations awaiting your response</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Invitations ({pendingInvitations.length})
            </h3>
          </div>

          {pendingInvitations.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No pending invitations</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingInvitations.map((manuscript) => {
                const review = getReviewForManuscript(manuscript.id);
                return (
                  <div key={manuscript.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{manuscript.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          by {manuscript.authorName} • {manuscript.category}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">{manuscript.abstract}</p>
                        {review && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Deadline: {review.deadline.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenInvitationDetail(manuscript)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === 'reviewer-response' && selectedManuscript) {
    return (
      <ReviewerResponsePage
        manuscript={selectedManuscript}
        onBack={() => setViewMode('dashboard')}
        onResponseSubmitted={(decision, data) => {
          setTimeout(() => {
            setViewMode('dashboard');
          }, 3000);
        }}
      />
    );
  }

  if (viewMode === 'review-evaluation' && selectedManuscript && currentUser) {
    const review = getReviewForManuscript(selectedManuscript.id);
    if (review) {
      return (
        <ReviewEvaluationPage
          manuscript={selectedManuscript}
          review={review}
          onBack={() => setViewMode('dashboard')}
          onSubmitReview={handleSubmitReviewEvaluation}
        />
      );
    }
  }

  if (viewMode === 'invitation-detail' && selectedManuscript && currentUser) {
    const review = getReviewForManuscript(selectedManuscript.id);
    if (review) {
      return (
        <ReviewInvitationPage
          manuscript={selectedManuscript}
          review={review}
          onAccept={handleAcceptInvitation}
          onDecline={handleDeclineInvitation}
          onBack={() => setViewMode('invitations')}
        />
      );
    }
  }

  if (viewMode === 'workspace' && selectedManuscript && currentUser) {
    const review = getReviewForManuscript(selectedManuscript.id);
    if (review) {
      return (
        <ReviewWorkspace
          manuscript={selectedManuscript}
          review={review}
          onSubmitReview={handleSubmitReview}
          onBack={handleBackToDashboard}
        />
      );
    }
  }

  if (viewMode === 'profile' && currentUser) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ← Back to Dashboard
        </button>
        <ProfileSettings
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reviewer Dashboard</h2>
          <p className="text-gray-600 mt-1">Review assigned manuscripts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('listview')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <List className="w-4 h-4" />
            View All Manuscripts
          </button>
          <button
            onClick={() => setViewMode('profile')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <User className="w-4 h-4" />
            Profile Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Assigned</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{assignedManuscripts.length}</p>
        </div>
        <div
          className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => setViewMode('invitations')}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Pending Invitations</p>
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-blue-600 mt-2">{pendingInvitations.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-3xl font-semibold text-orange-600 mt-2">
            {activeReviews.filter((ms) => {
              const review = getReviewForManuscript(ms.id);
              return review && review.status !== 'completed';
            }).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-3xl font-semibold text-green-600 mt-2">
            {myReviews.filter((r) => r.status === 'completed').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Assigned Manuscripts</h3>
        </div>
        {assignedManuscripts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No manuscripts assigned for review</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title & Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Review Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedManuscripts.map((manuscript) => {
                  const review = getReviewForManuscript(manuscript.id);
                  return (
                    <tr key={manuscript.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{manuscript.title}</div>
                        <div className="text-sm text-gray-600">{manuscript.authorName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{manuscript.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {manuscript.submittedAt.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {review ? (
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              review.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {review.status === 'completed' ? `${review.decision}` : 'In Progress'}
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!review || review.status === 'pending' ? (
                          <button
                            onClick={() => handleOpenInvitationDetail(manuscript)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            <Mail className="w-4 h-4" />
                            View Invitation
                          </button>
                        ) : review.status === 'in_progress' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenWorkspace(manuscript)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              <Edit className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleOpenReviewEvaluation(manuscript)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              <Send className="w-4 h-4" />
                              Submit Review
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenWorkspace(manuscript)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            <Edit className="w-4 h-4" />
                            View Review
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
