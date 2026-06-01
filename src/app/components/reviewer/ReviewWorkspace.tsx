import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Star,
  Send,
  Save,
  Eye,
  Download,
} from 'lucide-react';
import type { Manuscript, Review, ReviewDecision } from '../../types';
import * as Tabs from '@radix-ui/react-tabs';

interface ReviewWorkspaceProps {
  manuscript: Manuscript;
  review: Review;
  onSubmitReview: (
    decision: ReviewDecision,
    comments: string,
    rating: number,
    grammaticalCorrections: string,
    suggestedRevisions: string
  ) => void;
  onBack: () => void;
}

export function ReviewWorkspace({
  manuscript,
  review,
  onSubmitReview,
  onBack,
}: ReviewWorkspaceProps) {
  const [decision, setDecision] = useState<ReviewDecision>(review.decision || 'pending');
  const [generalComments, setGeneralComments] = useState(review.comments || '');
  const [grammaticalCorrections, setGrammaticalCorrections] = useState(
    review.grammaticalCorrections || ''
  );
  const [suggestedRevisions, setSuggestedRevisions] = useState(
    review.suggestedRevisions || ''
  );
  const [rating, setRating] = useState(0);
  const [inlineComments, setInlineComments] = useState<{ lineNumber: number; comment: string }[]>(
    []
  );
  const [newInlineComment, setNewInlineComment] = useState({ lineNumber: 0, comment: '' });

  const handleAddInlineComment = () => {
    if (newInlineComment.lineNumber > 0 && newInlineComment.comment.trim()) {
      setInlineComments([...inlineComments, newInlineComment]);
      setNewInlineComment({ lineNumber: 0, comment: '' });
    }
  };

  const handleSubmit = () => {
    if (decision === 'pending') {
      alert('Please select a recommendation before submitting');
      return;
    }
    if (!generalComments.trim()) {
      alert('Please provide general comments before submitting');
      return;
    }
    if (rating === 0) {
      alert('Please provide a rating before submitting');
      return;
    }

    onSubmitReview(decision, generalComments, rating, grammaticalCorrections, suggestedRevisions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Review Workspace</h2>
            <p className="text-gray-600 mt-1">{manuscript.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
            Submit Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manuscript Viewer */}
        <div className="lg:col-span-2">
          <Tabs.Root defaultValue="viewer" className="bg-white rounded-lg border border-gray-200">
            <Tabs.List className="flex border-b border-gray-200">
              <Tabs.Trigger
                value="viewer"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <Eye className="w-4 h-4" />
                Manuscript Viewer
              </Tabs.Trigger>
              <Tabs.Trigger
                value="files"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <FileText className="w-4 h-4" />
                Files ({manuscript.files.length})
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="viewer" className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Abstract</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {manuscript.abstract}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Manuscript Content</h3>
                  <div className="p-4 bg-gray-50 rounded-lg max-h-[600px] overflow-y-auto">
                    <div className="space-y-2">
                      {manuscript.content.split('\n').map((line, index) => (
                        <div
                          key={index}
                          className="flex gap-2 group hover:bg-yellow-50 px-2 py-1 rounded"
                        >
                          <span className="text-xs text-gray-400 w-8">{index + 1}</span>
                          <p className="text-sm text-gray-700 flex-1">{line || ' '}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="files" className="p-6">
              <div className="space-y-3">
                {manuscript.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded {file.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Review Form */}
        <div className="space-y-6">
          {/* Rating */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Overall Rating</h3>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Recommendation */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommendation</h3>
            <div className="space-y-2">
              {[
                { value: 'accept', label: 'Accept', color: 'green' },
                { value: 'minor_revision', label: 'Minor Revision', color: 'yellow' },
                { value: 'major_revision', label: 'Major Revision', color: 'orange' },
                { value: 'reject', label: 'Reject', color: 'red' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    decision === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value={option.value}
                    checked={decision === option.value}
                    onChange={(e) => setDecision(e.target.value as ReviewDecision)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* General Comments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">General Comments</h3>
            <textarea
              rows={6}
              value={generalComments}
              onChange={(e) => setGeneralComments(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Provide your overall assessment of the manuscript..."
            />
          </div>

          {/* Grammatical Corrections */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Grammatical Corrections</h3>
            <textarea
              rows={4}
              value={grammaticalCorrections}
              onChange={(e) => setGrammaticalCorrections(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Note any grammatical issues or language improvements..."
            />
          </div>

          {/* Suggested Revisions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Suggested Revisions</h3>
            <textarea
              rows={5}
              value={suggestedRevisions}
              onChange={(e) => setSuggestedRevisions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Provide specific suggestions for improvement..."
            />
          </div>

          {/* Inline Comments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Inline Comments ({inlineComments.length})
            </h3>
            <div className="space-y-3">
              {inlineComments.map((comment, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs font-medium text-yellow-900">Line {comment.lineNumber}</p>
                  <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                </div>
              ))}

              <div className="pt-3 border-t border-gray-200">
                <input
                  type="number"
                  min="1"
                  placeholder="Line number"
                  value={newInlineComment.lineNumber || ''}
                  onChange={(e) =>
                    setNewInlineComment({
                      ...newInlineComment,
                      lineNumber: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                />
                <textarea
                  rows={2}
                  placeholder="Add inline comment..."
                  value={newInlineComment.comment}
                  onChange={(e) =>
                    setNewInlineComment({ ...newInlineComment, comment: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleAddInlineComment}
                  className="w-full mt-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
