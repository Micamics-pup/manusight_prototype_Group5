import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Save,
  Send,
  Upload,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import type { Manuscript, Review } from '../types';

interface RevisedManuscriptEvaluationPageProps {
  manuscript: Manuscript;
  reviews: Review[];
  onBack: () => void;
  onSubmitEvaluation: (evaluationData: EvaluationData) => void;
}

export interface EvaluationData {
  decision: 'proceed_to_rereview' | 'proceed_to_editorial' | 'request_additional_revision' | 'reject';
  revisionCompliance: {
    reviewerCommentsAddressed: string;
    revisionCompleteness: string;
    manuscriptImprovement: string;
  };
  evaluationNotes: string;
  assignedReviewers?: string[];
  rereviewInstructions?: string;
  focusAreas?: string;
  estimatedDuration?: number;
  deadline?: Date;
  attachedFiles?: File[];
}

export function RevisedManuscriptEvaluationPage({
  manuscript,
  reviews,
  onBack,
  onSubmitEvaluation,
}: RevisedManuscriptEvaluationPageProps) {
  // Mock revised manuscript data
  const revisedSubmission = {
    submissionDate: new Date('2026-05-25'),
    revisionVersion: 2,
    revisedFiles: [
      {
        id: 'revised-001',
        name: 'climate-ml-manuscript-v2-revised.pdf',
        size: 2547200,
        uploadDate: new Date('2026-05-25'),
      },
      {
        id: 'revised-002',
        name: 'supplementary-data-updated.xlsx',
        size: 458000,
        uploadDate: new Date('2026-05-25'),
      },
    ],
    responseDocument: {
      id: 'response-001',
      name: 'response-to-reviewers.pdf',
      size: 156800,
      uploadDate: new Date('2026-05-25'),
    },
    authorNotes:
      'All reviewer comments have been carefully addressed. The methodology section has been expanded with additional details about data collection procedures. Statistical significance tests have been added to Table 2, and figure captions have been improved for clarity.',
  };

  // Mock available reviewers
  const availableReviewers = [
    {
      id: '4',
      name: 'Dr. Michael Chen',
      specialization: 'Machine Learning',
      currentWorkload: 2,
      avgReviewTime: 12,
      onTimeRate: 95,
      isPreviousReviewer: true,
    },
    {
      id: '5',
      name: 'Dr. Emily Brown',
      specialization: 'Climate Science',
      currentWorkload: 1,
      avgReviewTime: 10,
      onTimeRate: 98,
      isPreviousReviewer: true,
    },
    {
      id: '6',
      name: 'Dr. Sarah Thompson',
      specialization: 'Data Science',
      currentWorkload: 3,
      avgReviewTime: 14,
      onTimeRate: 88,
      isPreviousReviewer: false,
    },
  ];

  // State
  const [decision, setDecision] = useState<string>('');
  const [complianceEval, setComplianceEval] = useState({
    reviewerCommentsAddressed: '',
    revisionCompleteness: '',
    manuscriptImprovement: '',
  });
  const [evaluationNotes, setEvaluationNotes] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [rereviewInstructions, setRereviewInstructions] = useState('');
  const [focusAreas, setFocusAreas] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(14);
  const [deadline, setDeadline] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('manuscript-info');

  // Auto-save draft
  useEffect(() => {
    const interval = setInterval(() => {
      if (decision || evaluationNotes) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [decision, evaluationNotes]);

  const saveDraft = () => {
    localStorage.setItem(
      `evaluation_draft_${manuscript.id}`,
      JSON.stringify({
        decision,
        complianceEval,
        evaluationNotes,
        selectedReviewers,
        savedAt: new Date().toISOString(),
      })
    );
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleReviewerToggle = (reviewerId: string) => {
    setSelectedReviewers((prev) =>
      prev.includes(reviewerId) ? prev.filter((id) => id !== reviewerId) : [...prev, reviewerId]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles([...attachedFiles, ...Array.from(files)]);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!decision) {
      alert('Please select an evaluation decision.');
      return;
    }

    if (
      !complianceEval.reviewerCommentsAddressed ||
      !complianceEval.revisionCompleteness ||
      !complianceEval.manuscriptImprovement
    ) {
      alert('Please complete all compliance evaluation fields.');
      return;
    }

    if (decision === 'proceed_to_rereview' && selectedReviewers.length === 0) {
      alert('Please select at least one reviewer for re-review.');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmission = () => {
    const evaluationData: EvaluationData = {
      decision: decision as any,
      revisionCompliance: complianceEval,
      evaluationNotes,
      assignedReviewers: decision === 'proceed_to_rereview' ? selectedReviewers : undefined,
      rereviewInstructions: decision === 'proceed_to_rereview' ? rereviewInstructions : undefined,
      focusAreas: decision === 'proceed_to_rereview' ? focusAreas : undefined,
      estimatedDuration: decision === 'proceed_to_rereview' ? estimatedDuration : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      attachedFiles,
    };

    setShowConfirmModal(false);
    setSubmissionComplete(true);

    setTimeout(() => {
      onSubmitEvaluation(evaluationData);
    }, 3000);
  };

  const getDecisionLabel = (dec: string) => {
    const labels: Record<string, string> = {
      proceed_to_rereview: 'Proceed to Re-review',
      proceed_to_editorial: 'Proceed to Editorial Recommendation',
      request_additional_revision: 'Request Additional Revision',
      reject: 'Reject Revised Submission',
    };
    return labels[dec] || dec;
  };

  // Success screen
  if (submissionComplete) {
    const isRereview = decision === 'proceed_to_rereview';

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f1e8' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif mb-4" style={{ color: '#1a1f2e' }}>
                Evaluation Submitted Successfully
              </h2>
              <p className="text-gray-700 mb-8">
                {isRereview
                  ? 'The revised manuscript has been assigned for re-review.'
                  : 'The evaluation has been recorded and the manuscript status has been updated.'}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Status Updated</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Manuscript status: {isRereview ? 'Awaiting Re-review' : getDecisionLabel(decision)}
                  </p>
                </div>

                {isRereview && (
                  <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Reviewers Notified</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedReviewers.length} reviewer(s) assigned
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Evaluation Locked</span>
                  </div>
                  <p className="text-sm text-gray-600">Decision recorded and finalized</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Timeline Updated</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isRereview ? 'Re-review timeline activated' : 'Workflow progression recorded'}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-6">
                <p>Submission timestamp: {new Date().toLocaleString()}</p>
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-serif text-white mb-2">
                Revised Manuscript Evaluation
              </h1>
              <p className="text-gray-300">{manuscript.title}</p>
            </div>
            <span className="px-4 py-2 rounded-sm text-sm font-medium bg-blue-100 text-blue-800">
              Revised Submission Under Evaluation
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revised Manuscript Information */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <button
                onClick={() => toggleSection('manuscript-info')}
                className="w-full px-6 py-4 border-b flex items-center justify-between hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#1a1f2e' }}
                  >
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                    Revised Manuscript Information
                  </h2>
                </div>
                {expandedSection === 'manuscript-info' ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {expandedSection === 'manuscript-info' && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Manuscript ID:</span>
                      <p className="font-medium text-gray-900">{manuscript.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Revision Version:</span>
                      <p className="font-medium text-gray-900">
                        Version {revisedSubmission.revisionVersion}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Author:</span>
                      <p className="font-medium text-gray-900">{manuscript.authorName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Revision Submitted:</span>
                      <p className="font-medium text-gray-900">
                        {revisedSubmission.submissionDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Original Submission:</span>
                      <p className="font-medium text-gray-900">
                        {manuscript.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Category:</span>
                      <p className="font-medium text-gray-900">{manuscript.category}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4" style={{ borderColor: '#d1c7b3' }}>
                    <span className="text-sm font-medium text-gray-700 block mb-2">
                      Author Revision Notes:
                    </span>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-sm">
                      {revisedSubmission.authorNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File Preview & Download */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <button
                onClick={() => toggleSection('files')}
                className="w-full px-6 py-4 border-b flex items-center justify-between hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#1a1f2e' }}
                  >
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                    Revised Files
                  </h2>
                </div>
                {expandedSection === 'files' ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {expandedSection === 'files' && (
                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Revised Manuscript Files:</h3>
                    {revisedSubmission.revisedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-sm mb-2"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <div>
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB •{' '}
                              {file.uploadDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3" style={{ borderColor: '#d1c7b3' }}>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Response to Reviewers:
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-sm border border-blue-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="text-sm text-gray-900">
                            {revisedSubmission.responseDocument.name}
                          </span>
                          <p className="text-xs text-gray-500">
                            {(revisedSubmission.responseDocument.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Previous Review Summary */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <button
                onClick={() => toggleSection('previous-reviews')}
                className="w-full px-6 py-4 border-b flex items-center justify-between hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#1a1f2e' }}
                  >
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                    Previous Review Records
                  </h2>
                </div>
                {expandedSection === 'previous-reviews' ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {expandedSection === 'previous-reviews' && (
                <div className="p-6 space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border rounded-sm p-4"
                      style={{ borderColor: '#d1c7b3' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{review.reviewerName}</h3>
                        <span
                          className={`px-3 py-1 text-xs rounded-sm ${
                            review.decision === 'minor_revision'
                              ? 'bg-blue-100 text-blue-800'
                              : review.decision === 'major_revision'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {review.decision?.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Comments:</span>
                          <p className="text-gray-600 mt-1">{review.comments}</p>
                        </div>
                        {review.suggestedRevisions && (
                          <div>
                            <span className="font-medium text-gray-700">Suggested Revisions:</span>
                            <p className="text-gray-600 mt-1">{review.suggestedRevisions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revision Compliance Evaluation */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Revision Compliance Evaluation
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reviewer Comments Addressed <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={complianceEval.reviewerCommentsAddressed}
                    onChange={(e) =>
                      setComplianceEval({
                        ...complianceEval,
                        reviewerCommentsAddressed: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <option value="">Select evaluation...</option>
                    <option value="fully_addressed">Fully Addressed</option>
                    <option value="mostly_addressed">Mostly Addressed</option>
                    <option value="partially_addressed">Partially Addressed</option>
                    <option value="inadequately_addressed">Inadequately Addressed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revision Completeness <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={complianceEval.revisionCompleteness}
                    onChange={(e) =>
                      setComplianceEval({ ...complianceEval, revisionCompleteness: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <option value="">Select evaluation...</option>
                    <option value="complete">Complete</option>
                    <option value="mostly_complete">Mostly Complete</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="requires_major_work">Requires Major Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manuscript Improvement <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={complianceEval.manuscriptImprovement}
                    onChange={(e) =>
                      setComplianceEval({
                        ...complianceEval,
                        manuscriptImprovement: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <option value="">Select evaluation...</option>
                    <option value="significant_improvement">Significant Improvement</option>
                    <option value="moderate_improvement">Moderate Improvement</option>
                    <option value="minor_improvement">Minor Improvement</option>
                    <option value="no_improvement">No Improvement</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Revision Decision */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Evaluation Decision
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <option value="">Select decision...</option>
                    <option value="proceed_to_rereview">Proceed to Re-review</option>
                    <option value="proceed_to_editorial">Proceed to Editorial Recommendation</option>
                    <option value="request_additional_revision">Request Additional Revision</option>
                    <option value="reject">Reject Revised Submission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evaluation Notes
                  </label>
                  <textarea
                    value={evaluationNotes}
                    onChange={(e) => setEvaluationNotes(e.target.value)}
                    placeholder="Provide detailed evaluation notes and reasoning for your decision..."
                    className="w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    style={{ borderColor: '#d1c7b3' }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{evaluationNotes.length} characters</span>
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

            {/* Re-review Assignment (conditional) */}
            {decision === 'proceed_to_rereview' && (
              <>
                <div
                  className="bg-white rounded-sm border shadow-sm"
                  style={{ borderColor: '#d1c7b3' }}
                >
                  <div
                    className="px-6 py-4 border-b flex items-center gap-3"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#1a1f2e' }}
                    >
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                      Re-review Assignment
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Select reviewer(s) for re-evaluation of the revised manuscript.
                    </p>
                    <div className="space-y-3">
                      {availableReviewers.map((reviewer) => (
                        <label
                          key={reviewer.id}
                          className="flex items-start gap-3 p-4 border rounded-sm cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#d1c7b3' }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedReviewers.includes(reviewer.id)}
                            onChange={() => handleReviewerToggle(reviewer.id)}
                            className="mt-1 w-5 h-5 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{reviewer.name}</span>
                              {reviewer.isPreviousReviewer && (
                                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-sm">
                                  Previous Reviewer
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{reviewer.specialization}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Workload: {reviewer.currentWorkload} active</span>
                              <span>Avg Time: {reviewer.avgReviewTime} days</span>
                              <span>On-time: {reviewer.onTimeRate}%</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Re-review Instructions */}
                <div
                  className="bg-white rounded-sm border shadow-sm"
                  style={{ borderColor: '#d1c7b3' }}
                >
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
                      Re-review Instructions
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions for Reviewers
                      </label>
                      <textarea
                        value={rereviewInstructions}
                        onChange={(e) => setRereviewInstructions(e.target.value)}
                        placeholder="Provide specific instructions for re-review..."
                        className="w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        style={{ borderColor: '#d1c7b3' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Focus Areas
                      </label>
                      <textarea
                        value={focusAreas}
                        onChange={(e) => setFocusAreas(e.target.value)}
                        placeholder="Specify areas requiring particular attention..."
                        className="w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                        style={{ borderColor: '#d1c7b3' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline Reassessment */}
                <div
                  className="bg-white rounded-sm border shadow-sm"
                  style={{ borderColor: '#d1c7b3' }}
                >
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
                    <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                      Re-review Timeline
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Duration (days)
                      </label>
                      <input
                        type="number"
                        value={estimatedDuration}
                        onChange={(e) => setEstimatedDuration(parseInt(e.target.value))}
                        min="7"
                        max="30"
                        className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ borderColor: '#d1c7b3' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Re-review Deadline
                      </label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ borderColor: '#d1c7b3' }}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                      <p className="text-sm text-blue-900">
                        <strong>Projected Completion:</strong>{' '}
                        {deadline
                          ? new Date(deadline).toLocaleDateString()
                          : new Date(Date.now() + estimatedDuration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
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
                disabled={!decision}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1a1f2e' }}
              >
                <Send className="w-4 h-4" />
                Submit Evaluation
              </button>

              <button
                onClick={onBack}
                className="w-full px-6 py-3 text-gray-700 border rounded-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3' }}
              >
                Cancel
              </button>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Evaluation Guidelines</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Review all revised files and response document</li>
                    <li>• Compare with previous review comments</li>
                    <li>• Complete compliance evaluation fields</li>
                    <li>• Select appropriate decision</li>
                    <li>• Assign reviewers if proceeding to re-review</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: '#d1c7b3' }}>
                <h3 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Attach Files
                </h3>
              </div>
              <div className="p-6">
                <label className="block">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Upload Files</span>
                  </span>
                </label>

                {attachedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-sm text-sm"
                      >
                        <span className="text-gray-900 truncate">{file.name}</span>
                        <button
                          onClick={() =>
                            setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
                          }
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
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-sm max-w-md w-full shadow-lg"
            style={{ borderColor: '#d1c7b3' }}
          >
            <div className="p-6 border-b" style={{ borderColor: '#d1c7b3' }}>
              <h3 className="text-lg font-serif" style={{ color: '#1a1f2e' }}>
                Confirm Evaluation
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                You are about to submit your evaluation. This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-4 rounded-sm space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Decision:</span>
                  <span className="font-medium">{getDecisionLabel(decision)}</span>
                </div>
                {decision === 'proceed_to_rereview' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Assigned reviewers:</span>
                    <span className="font-medium">{selectedReviewers.length}</span>
                  </div>
                )}
              </div>
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
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
