import React from 'react';
import { Calendar, Clock, FileText, User, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import type { Manuscript, Review } from '../../types';

interface ReviewInvitationPageProps {
  manuscript: Manuscript;
  review: Review;
  onAccept: () => void;
  onDecline: () => void;
  onBack: () => void;
}

export function ReviewInvitationPage({
  manuscript,
  review,
  onAccept,
  onDecline,
  onBack,
}: ReviewInvitationPageProps) {
  const daysUntilDeadline = Math.ceil(
    (review.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

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
          <h2 className="text-2xl font-semibold text-gray-900">Review Invitation</h2>
          <p className="text-gray-600 mt-1">You have been invited to review this manuscript</p>
        </div>
      </div>

      {/* Status Alert */}
      {review.status === 'pending' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-900">
              Awaiting your response to this review invitation
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manuscript Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manuscript Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900 font-medium">{manuscript.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <p className="text-gray-900">{manuscript.authorName}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900">{manuscript.category}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{manuscript.abstract}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submitted Files ({manuscript.files.length})
                </label>
                <div className="space-y-2">
                  {manuscript.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{file.fileName}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {file.uploadedAt.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline and Actions */}
        <div className="space-y-6">
          {/* Timeline Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Timeline</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Response Deadline</p>
                  <p className="text-sm text-gray-900">
                    {review.deadline.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Time Remaining</p>
                  <p className="text-sm text-gray-900">
                    {daysUntilDeadline > 0 ? `${daysUntilDeadline} days` : 'Overdue'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  Recommended review time: <strong>14 days</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Response</h3>

            {review.status === 'pending' ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Please accept or decline this review invitation. If you accept, you'll have access
                  to the review workspace.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={onAccept}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accept Invitation
                  </button>

                  <button
                    onClick={onDecline}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-red-700 font-medium border-2 border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Decline Invitation
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-900">
                    You have accepted this review
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Expectations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Review Expectations</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Evaluate methodology and research design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Assess clarity and organization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Check citations and references</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Provide constructive feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Make a recommendation (accept/revise/reject)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
