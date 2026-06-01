import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { FileText, Plus, MessageSquare, Upload, Download, History, Eye, List } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import type { Manuscript } from '../../types';
import { ManuscriptListPage } from '../ManuscriptListPage';

export function AuthorDashboard() {
  const { currentUser } = useAuth();
  const { manuscripts, comments, reviews, uploadManuscriptFile, addManuscript, addComment } = useData();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [viewManuscript, setViewManuscript] = useState<Manuscript | null>(null);
  const [newComment, setNewComment] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [showListView, setShowListView] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    content: '',
    category: '',
  });

  const authorManuscripts = manuscripts.filter((ms) => ms.authorId === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addManuscript({
        ...formData,
        authorId: currentUser.id,
        authorName: currentUser.name,
        assignedReviewers: [],
        status: 'pending',
      });
      setFormData({ title: '', abstract: '', content: '', category: '' });
      setIsSubmitDialogOpen(false);
    }
  };

  const handleAddComment = (manuscriptId: string) => {
    if (currentUser && newComment.trim()) {
      addComment({
        manuscriptId,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        content: newComment,
      });
      setNewComment('');
    }
  };

  const handleUploadRevision = (manuscriptId: string) => {
    if (currentUser) {
      const fileName = prompt('Enter file name (e.g., manuscript-revised-v2.pdf):');
      if (fileName) {
        const manuscript = manuscripts.find(ms => ms.id === manuscriptId);
        const version = manuscript ? manuscript.files.filter(f => f.fileType === 'revision').length + 2 : 2;

        uploadManuscriptFile(manuscriptId, {
          fileName,
          fileUrl: `https://example.com/files/${fileName}`,
          uploadedBy: currentUser.id,
          uploadedByName: currentUser.name,
          version,
          fileType: 'revision',
          notes: uploadNotes || 'Revised manuscript uploaded',
        });
        setUploadNotes('');
      }
    }
  };

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
      review: 'Review',
      copyediting: 'Copyediting',
      production: 'Production',
      rejected: 'Rejected',
    };
    return labels[status] || status.replace(/_/g, ' ');
  };

  const manuscriptComments = selectedManuscript
    ? comments.filter((c) => c.manuscriptId === selectedManuscript.id)
    : [];

  if (showListView) {
    return (
      <ManuscriptListPage
        onViewDetails={(manuscript) => {
          setViewManuscript(manuscript);
          setShowListView(false);
        }}
        onBack={() => setShowListView(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Author Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your manuscript submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowListView(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <List className="w-4 h-4" />
            View All Manuscripts
          </button>
          <Dialog.Root open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Submit Manuscript
              </button>
            </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
                Submit New Manuscript
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Form to submit a new manuscript for review
              </Dialog.Description>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manuscript Content
                  </label>
                  <textarea
                    required
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-900">
                    File upload would be available with Supabase integration
                  </span>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Manuscripts</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{authorManuscripts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">In Review</p>
          <p className="text-3xl font-semibold text-yellow-600 mt-2">
            {authorManuscripts.filter((ms) => ms.status === 'review').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Production</p>
          <p className="text-3xl font-semibold text-green-600 mt-2">
            {authorManuscripts.filter((ms) => ms.status === 'production').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Manuscripts</h3>
        </div>
        {authorManuscripts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No manuscripts submitted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authorManuscripts.map((manuscript) => (
                  <tr key={manuscript.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{manuscript.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{manuscript.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          manuscript.status
                        )}`}
                      >
                        {manuscript.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {manuscript.submittedAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {manuscript.updatedAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewManuscript(manuscript)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                        <button
                          onClick={() => setSelectedManuscript(manuscript)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Comments
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedManuscript && (
        <Dialog.Root open={!!selectedManuscript} onOpenChange={() => setSelectedManuscript(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
                Comments: {selectedManuscript.title}
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                View and add comments for this manuscript
              </Dialog.Description>
              <div className="space-y-4 mb-6">
                {manuscriptComments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No comments yet</p>
                ) : (
                  manuscriptComments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.userName}</span>
                        <span className="text-xs text-gray-500">
                          ({comment.userRole.replace(/_/g, ' ')})
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {comment.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-3">
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Close
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={() => handleAddComment(selectedManuscript.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* View Manuscript Details Dialog */}
      {viewManuscript && (
        <Dialog.Root open={!!viewManuscript} onOpenChange={() => setViewManuscript(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl z-50 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
                Manuscript Details & Feedback
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                View complete manuscript details, feedback, files, and revision history
              </Dialog.Description>
              <div className="space-y-6">
                {/* Header */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{viewManuscript.title}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(viewManuscript.status)}`}>
                      {getStatusLabel(viewManuscript.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{viewManuscript.category}</p>
                </div>

                {/* Submission Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600">Submitted</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {viewManuscript.submittedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {viewManuscript.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Editor/Reviewer Feedback */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Feedback & Comments
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {comments.filter(c => c.manuscriptId === viewManuscript.id).length === 0 &&
                     reviews.filter(r => r.manuscriptId === viewManuscript.id && r.status === 'completed').length === 0 ? (
                      <p className="text-sm text-gray-500">No feedback yet</p>
                    ) : (
                      <div className="space-y-3">
                        {/* Show review feedback */}
                        {reviews
                          .filter(r => r.manuscriptId === viewManuscript.id && r.status === 'completed')
                          .map(review => (
                            <div key={review.id} className="p-4 bg-white rounded border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-900">{review.reviewerName}</span>
                                <span className={`px-2 py-0.5 text-xs rounded ${
                                  review.decision === 'accept' ? 'bg-green-100 text-green-800' :
                                  review.decision === 'minor_revision' ? 'bg-yellow-100 text-yellow-800' :
                                  review.decision === 'major_revision' ? 'bg-orange-100 text-orange-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {review.decision.replace(/_/g, ' ')}
                                </span>
                                <span className="text-xs text-gray-500 ml-auto">
                                  {review.submittedAt?.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{review.comments}</p>
                              {review.suggestedRevisions && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                  <p className="text-xs font-medium text-yellow-900">Suggested Revisions:</p>
                                  <p className="text-sm text-yellow-800 mt-1">{review.suggestedRevisions}</p>
                                </div>
                              )}
                              {review.grammaticalCorrections && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                  <p className="text-xs font-medium text-blue-900">Grammatical Notes:</p>
                                  <p className="text-sm text-blue-800 mt-1">{review.grammaticalCorrections}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        {/* Show editor comments */}
                        {comments
                          .filter(c => c.manuscriptId === viewManuscript.id)
                          .map(comment => (
                            <div key={comment.id} className="p-4 bg-white rounded border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-900">{comment.userName}</span>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                  {comment.userRole.replace(/_/g, ' ')}
                                </span>
                                <span className="text-xs text-gray-500 ml-auto">
                                  {comment.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Uploaded Files */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Files & Documents ({viewManuscript.files.length})
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {viewManuscript.files.length === 0 ? (
                      <p className="text-sm text-gray-500">No files uploaded</p>
                    ) : (
                      <div className="space-y-2">
                        {viewManuscript.files.map(file => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-900">{file.fileName}</span>
                                <span className={`px-2 py-0.5 text-xs rounded ${
                                  file.fileType === 'original' ? 'bg-blue-100 text-blue-800' :
                                  file.fileType === 'revision' ? 'bg-purple-100 text-purple-800' :
                                  file.fileType === 'reviewer_feedback' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {file.fileType.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                By {file.uploadedByName} on {file.uploadedAt.toLocaleDateString()}
                              </p>
                              {file.notes && <p className="text-xs text-gray-600 mt-1 italic">{file.notes}</p>}
                            </div>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Revised File */}
                {['pending', 'review'].includes(viewManuscript.status) && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Revised Manuscript
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                        placeholder="Add notes about this revision..."
                        value={uploadNotes}
                        onChange={(e) => setUploadNotes(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          handleUploadRevision(viewManuscript.id);
                          setViewManuscript(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Revised File
                      </button>
                      <p className="text-xs text-blue-700 mt-2">
                        Note: File upload integration with Supabase will be available soon
                      </p>
                    </div>
                  </div>
                )}

                {/* Revision History */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Status History
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {viewManuscript.revisionHistory
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map(revision => (
                          <div key={revision.id} className="flex gap-3 p-3 bg-white rounded border border-gray-200">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-blue-600"></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-xs rounded font-medium ${getStatusColor(revision.status)}`}>
                                  {getStatusLabel(revision.status)}
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

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
