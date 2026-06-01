import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Download,
  Eye,
  X,
  Check,
  AlertCircle,
  MessageSquare,
  Save,
  Send,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface RevisionUploadPageProps {
  manuscript: Manuscript;
  onBack: () => void;
  onSubmitRevision: (revisionData: RevisionSubmissionData) => void;
}

export interface RevisionSubmissionData {
  revisedFiles: File[];
  responseDocument: File | null;
  revisionNotes: string;
  checklistConfirmed: {
    allRevisionsAddressed: boolean;
    filesAreFinal: boolean;
    responsesComplete: boolean;
  };
}

interface ReviewerFeedback {
  reviewerName: string;
  decision: string;
  comments: string;
  suggestedRevisions: string;
}

export function RevisionUploadPage({
  manuscript,
  onBack,
  onSubmitRevision,
}: RevisionUploadPageProps) {
  // Mock revision request data
  const revisionRequest = {
    requestDate: new Date('2026-05-20'),
    deadline: new Date('2026-06-20'),
    editorialDecision: 'minor_revision',
    consolidatedFeedback:
      'The manuscript shows promise but requires minor revisions before acceptance. Please address the reviewer comments regarding methodology clarification and expand the results analysis section.',
    reviewerFeedbacks: [
      {
        reviewerName: 'Reviewer 1',
        decision: 'minor_revision',
        comments:
          'The research methodology needs clearer explanation. Please expand section 3.2 with more details about data collection procedures.',
        suggestedRevisions:
          'Add statistical significance tests in Table 2, improve figure captions for clarity.',
      },
      {
        reviewerName: 'Reviewer 2',
        decision: 'minor_revision',
        comments:
          'Results section needs more detailed analysis. The discussion could benefit from comparison with recent studies.',
        suggestedRevisions:
          'Include additional references from 2025-2026, expand discussion on limitations.',
      },
    ] as ReviewerFeedback[],
  };

  // State
  const [revisedFiles, setRevisedFiles] = useState<File[]>([]);
  const [responseDocument, setResponseDocument] = useState<File | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [checklist, setChecklist] = useState({
    allRevisionsAddressed: false,
    filesAreFinal: false,
    responsesComplete: false,
  });
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState<number | null>(null);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (revisedFiles.length > 0 || revisionNotes.trim()) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [revisedFiles, revisionNotes]);

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const today = new Date();
    const deadline = revisionRequest.deadline;
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();
  const isOverdue = daysRemaining < 0;
  const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter((file) => {
        const validTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        return validTypes.includes(file.type);
      });
      setRevisedFiles([...revisedFiles, ...newFiles]);
    }
  };

  const handleResponseUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResponseDocument(file);
    }
  };

  const removeFile = (index: number) => {
    setRevisedFiles(revisedFiles.filter((_, i) => i !== index));
  };

  const saveDraft = () => {
    localStorage.setItem(
      `revision_draft_${manuscript.id}`,
      JSON.stringify({
        revisionNotes,
        savedAt: new Date().toISOString(),
      })
    );
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  const handleSubmit = () => {
    // Validation
    if (revisedFiles.length === 0) {
      alert('Please upload at least one revised manuscript file.');
      return;
    }

    if (!checklist.allRevisionsAddressed || !checklist.filesAreFinal || !checklist.responsesComplete) {
      alert('Please confirm all checklist items before submitting.');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmission = () => {
    const revisionData: RevisionSubmissionData = {
      revisedFiles,
      responseDocument,
      revisionNotes,
      checklistConfirmed: checklist,
    };

    setShowConfirmModal(false);
    setSubmissionComplete(true);

    setTimeout(() => {
      onSubmitRevision(revisionData);
    }, 3000);
  };

  // Success screen
  if (submissionComplete) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f1e8' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif mb-4" style={{ color: '#1a1f2e' }}>
                Revised Manuscript Submitted Successfully
              </h2>
              <p className="text-gray-700 mb-8">
                Your revised manuscript has been submitted and is now awaiting editorial re-evaluation.
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Editor Notified</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Dr. Sarah Johnson has been notified of your submission
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Files Locked</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {revisedFiles.length} revised file(s) secured
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Status Updated</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Manuscript status: Re-evaluation in progress
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Timeline Activated</span>
                  </div>
                  <p className="text-sm text-gray-600">Re-review timeline assessment started</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-6">
                <p>Submission timestamp: {new Date().toLocaleString()}</p>
                <p className="mt-1">
                  You will receive notification once the editorial review is complete.
                </p>
              </div>

              <button
                onClick={onBack}
                className="px-6 py-3 text-white rounded-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1a1f2e' }}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f1e8' }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: '#1a1f2e', borderColor: '#2a2f3e' }}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-serif text-white mb-2">Upload Revised Manuscript</h1>
              <p className="text-gray-300">{manuscript.title}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-sm text-sm font-medium ${
                isOverdue
                  ? 'bg-red-100 text-red-800'
                  : isUrgent
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              Revision Required
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline Monitoring */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                    Revision Deadline
                  </h2>
                  <p className="text-sm text-gray-600">
                    {revisionRequest.deadline.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span
                    className={`text-2xl font-semibold ${
                      isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-green-600'
                    }`}
                  >
                    {isOverdue ? 'Overdue' : `${daysRemaining} days`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      isOverdue ? 'bg-red-600' : isUrgent ? 'bg-amber-600' : 'bg-green-600'
                    }`}
                    style={{
                      width: isOverdue ? '100%' : `${Math.max(0, 100 - (daysRemaining / 30) * 100)}%`,
                    }}
                  />
                </div>
                {isOverdue && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">
                      Revision deadline has passed. Please submit as soon as possible or contact the
                      editor.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Revision Request Details */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Revision Request Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Editorial Decision:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-sm">
                      {revisionRequest.editorialDecision.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700">{revisionRequest.consolidatedFeedback}</p>
                </div>

                <div className="border-t pt-4" style={{ borderColor: '#d1c7b3' }}>
                  <h3 className="font-medium text-gray-900 mb-3">Reviewer Feedback</h3>
                  <div className="space-y-3">
                    {revisionRequest.reviewerFeedbacks.map((feedback, index) => (
                      <div
                        key={index}
                        className="border rounded-sm overflow-hidden"
                        style={{ borderColor: '#d1c7b3' }}
                      >
                        <button
                          onClick={() =>
                            setExpandedFeedback(expandedFeedback === index ? null : index)
                          }
                          className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{feedback.reviewerName}</span>
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        {expandedFeedback === index && (
                          <div className="p-4 space-y-3 border-t" style={{ borderColor: '#d1c7b3' }}>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Comments:</span>
                              <p className="text-sm text-gray-600 mt-1">{feedback.comments}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Suggested Revisions:
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                {feedback.suggestedRevisions}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Submission Info */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Previous Submission
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Submission Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {manuscript.submittedAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="border-t pt-3" style={{ borderColor: '#d1c7b3' }}>
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    Original Files:
                  </span>
                  {manuscript.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{file.fileName}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Revised Manuscript */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Upload Revised Manuscript
                </h2>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed rounded-sm p-8 text-center" style={{ borderColor: '#d1c7b3' }}>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">Accepted formats: PDF, DOC, DOCX</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span
                      className="px-6 py-2 text-white rounded-sm cursor-pointer hover:opacity-90 transition-opacity inline-block"
                      style={{ backgroundColor: '#1a1f2e' }}
                    >
                      Select Files
                    </span>
                  </label>
                </div>

                {revisedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-sm font-medium text-gray-700">Uploaded Files:</span>
                    {revisedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-sm border"
                        style={{ borderColor: '#d1c7b3' }}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Response to Reviewers */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Response to Reviewers
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Upload a document explaining how you addressed each reviewer comment and revision
                  request.
                </p>
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResponseUpload}
                    className="hidden"
                  />
                  <span
                    className="px-6 py-2 text-white rounded-sm cursor-pointer hover:opacity-90 transition-opacity inline-block"
                    style={{ backgroundColor: '#1a1f2e' }}
                  >
                    Upload Response Document
                  </span>
                </label>

                {responseDocument && (
                  <div
                    className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-sm border"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-900">{responseDocument.name}</span>
                    </div>
                    <button
                      onClick={() => setResponseDocument(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Revision Notes */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Revision Notes
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-3">
                  Provide additional notes or clarifications for the editor regarding your revisions.
                </p>
                <textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Enter your revision notes and explanations here..."
                  className="w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  style={{ borderColor: '#d1c7b3' }}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{revisionNotes.length} characters</span>
                  {isDraftSaved && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Draft saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Checklist & Actions */}
          <div className="space-y-6">
            {/* Revision Checklist */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: '#d1c7b3' }}
              >
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Revision Checklist
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checklist.allRevisionsAddressed}
                    onChange={(e) =>
                      setChecklist({ ...checklist, allRevisionsAddressed: e.target.checked })
                    }
                    className="mt-1 w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    All requested revisions have been addressed
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checklist.filesAreFinal}
                    onChange={(e) =>
                      setChecklist({ ...checklist, filesAreFinal: e.target.checked })
                    }
                    className="mt-1 w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Uploaded files are the final revised versions
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checklist.responsesComplete}
                    onChange={(e) =>
                      setChecklist({ ...checklist, responsesComplete: e.target.checked })
                    }
                    className="mt-1 w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Revision responses are complete and accurate
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-sm border shadow-sm p-6 space-y-3" style={{ borderColor: '#d1c7b3' }}>
              <button
                onClick={saveDraft}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border rounded-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3', color: '#1a1f2e' }}
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>

              <button
                onClick={handleSubmit}
                disabled={revisedFiles.length === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1a1f2e' }}
              >
                <Send className="w-4 h-4" />
                Submit Revised Manuscript
              </button>

              <button
                onClick={onBack}
                className="w-full px-6 py-3 text-gray-700 border rounded-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3' }}
              >
                Cancel
              </button>
            </div>

            {/* Status Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Submission Guidelines</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Ensure all files are in final format</li>
                    <li>• Include response to all reviewer comments</li>
                    <li>• Confirm checklist before submission</li>
                    <li>• Files will be locked after submission</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm max-w-md w-full shadow-lg" style={{ borderColor: '#d1c7b3' }}>
            <div className="p-6 border-b" style={{ borderColor: '#d1c7b3' }}>
              <h3 className="text-lg font-serif" style={{ color: '#1a1f2e' }}>
                Confirm Submission
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                You are about to submit your revised manuscript. This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-4 rounded-sm space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Revised files:</span>
                  <span className="font-medium">{revisedFiles.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Response document:</span>
                  <span className="font-medium">{responseDocument ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Revision notes:</span>
                  <span className="font-medium">{revisionNotes ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                After submission, your files will be locked and forwarded to the editor for
                re-evaluation.
              </p>
            </div>
            <div className="p-6 border-t flex gap-3" style={{ borderColor: '#d1c7b3' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border rounded-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmission}
                className="flex-1 px-4 py-2 text-white rounded-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1a1f2e' }}
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
