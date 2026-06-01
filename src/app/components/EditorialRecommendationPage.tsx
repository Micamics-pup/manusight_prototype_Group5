import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  MessageSquare,
  Save,
  Send,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
  X,
  TrendingUp,
  Award,
  History,
  Zap,
  Target,
} from 'lucide-react';
import type { Manuscript, Review } from '../types';

interface EditorialRecommendationPageProps {
  manuscript: Manuscript;
  reviews: Review[];
  onBack: () => void;
  onSubmitRecommendation: (recommendationData: RecommendationData) => void;
}

export interface RecommendationData {
  decision: 'accept' | 'accept_minor_editorial' | 'minor_revision_final' | 'major_revision' | 'reject';
  justification: string;
  strengths: string;
  weaknesses: string;
  publicationReadiness: {
    suitabilityAssessment: string;
    researchQuality: string;
    journalFit: string;
    publicationPriority: string;
    impactAssessment: string;
  };
  complianceValidation: {
    reviewerConcernsAddressed: string;
    revisionCompleteness: boolean;
    ethicalCompliance: boolean;
    citationAccuracy: boolean;
    formattingCompliance: boolean;
  };
  estimatedPublicationTimeline?: number;
}

export function EditorialRecommendationPage({
  manuscript,
  reviews,
  onBack,
  onSubmitRecommendation,
}: EditorialRecommendationPageProps) {
  // Mock data
  const revisionSummary = {
    revisionRounds: 1,
    lastRevisionDate: new Date('2026-05-25'),
    majorChanges: [
      'Expanded methodology section with detailed data collection procedures',
      'Added statistical significance tests to Table 2',
      'Improved figure captions for clarity',
      'Added 5 recent references from 2025-2026',
      'Expanded discussion on study limitations',
    ],
    authorResponse: 'All reviewer comments have been addressed. The methodology section now includes comprehensive details about our data collection procedures, and we have added the requested statistical analyses.',
    addressedComments: 8,
    totalComments: 10,
  };

  const reviewHistory = [
    {
      round: 1,
      date: new Date('2026-05-10'),
      reviewer: 'Dr. Michael Chen',
      decision: 'minor_revision',
      comments: 'Methodology needs clarification. Results analysis should be expanded.',
    },
    {
      round: 1,
      date: new Date('2026-05-12'),
      reviewer: 'Dr. Emily Brown',
      decision: 'minor_revision',
      comments: 'Good research but requires additional references and discussion expansion.',
    },
  ];

  // State
  const [decision, setDecision] = useState<string>('');
  const [justification, setJustification] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [publicationReadiness, setPublicationReadiness] = useState({
    suitabilityAssessment: '',
    researchQuality: '',
    journalFit: '',
    publicationPriority: '',
    impactAssessment: '',
  });
  const [complianceValidation, setComplianceValidation] = useState({
    reviewerConcernsAddressed: '',
    revisionCompleteness: false,
    ethicalCompliance: false,
    citationAccuracy: false,
    formattingCompliance: false,
  });
  const [estimatedPublicationTimeline, setEstimatedPublicationTimeline] = useState(45);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('manuscript-info');

  // Auto-save draft
  useEffect(() => {
    const interval = setInterval(() => {
      if (decision || justification) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [decision, justification]);

  const saveDraft = () => {
    localStorage.setItem(
      `editorial_recommendation_draft_${manuscript.id}`,
      JSON.stringify({
        decision,
        justification,
        strengths,
        weaknesses,
        publicationReadiness,
        complianceValidation,
        savedAt: new Date().toISOString(),
      })
    );
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSubmit = () => {
    // Validation
    if (!decision) {
      alert('Please select an editorial decision.');
      return;
    }

    if (!justification.trim()) {
      alert('Please provide a justification for your decision.');
      return;
    }

    if (
      !publicationReadiness.suitabilityAssessment ||
      !publicationReadiness.researchQuality ||
      !publicationReadiness.journalFit ||
      !publicationReadiness.publicationPriority
    ) {
      alert('Please complete all publication readiness fields.');
      return;
    }

    if (!complianceValidation.reviewerConcernsAddressed) {
      alert('Please evaluate if reviewer concerns were addressed.');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmission = () => {
    const recommendationData: RecommendationData = {
      decision: decision as any,
      justification,
      strengths,
      weaknesses,
      publicationReadiness,
      complianceValidation,
      estimatedPublicationTimeline: decision === 'accept' || decision === 'accept_minor_editorial' ? estimatedPublicationTimeline : undefined,
    };

    setShowConfirmModal(false);
    setSubmissionComplete(true);

    setTimeout(() => {
      onSubmitRecommendation(recommendationData);
    }, 3000);
  };

  const getDecisionLabel = (dec: string) => {
    const labels: Record<string, string> = {
      accept: 'Accept Manuscript',
      accept_minor_editorial: 'Accept with Minor Editorial Revisions',
      minor_revision_final: 'Minor Revision Required (Final Round)',
      major_revision: 'Major Revision Required',
      reject: 'Reject Manuscript',
    };
    return labels[dec] || dec;
  };

  const getDecisionColor = (dec: string) => {
    const colors: Record<string, string> = {
      accept: 'bg-green-100 text-green-800',
      accept_minor_editorial: 'bg-blue-100 text-blue-800',
      minor_revision_final: 'bg-amber-100 text-amber-800',
      major_revision: 'bg-orange-100 text-orange-800',
      reject: 'bg-red-100 text-red-800',
    };
    return colors[dec] || 'bg-gray-100 text-gray-800';
  };

  // Success screen
  if (submissionComplete) {
    const isAccepted = decision === 'accept' || decision === 'accept_minor_editorial';

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f1e8' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
            <div className="p-8 text-center">
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  isAccepted ? 'bg-green-100' : decision === 'reject' ? 'bg-red-100' : 'bg-amber-100'
                }`}
              >
                {isAccepted ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : decision === 'reject' ? (
                  <XCircle className="w-12 h-12 text-red-600" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-amber-600" />
                )}
              </div>
              <h2 className="text-2xl font-serif mb-4" style={{ color: '#1a1f2e' }}>
                Editorial Decision Submitted
              </h2>
              <p className="text-gray-700 mb-2">
                Your editorial recommendation has been recorded and the author has been notified.
              </p>
              <div className={`inline-block px-4 py-2 rounded-sm text-sm font-medium mb-8 ${getDecisionColor(decision)}`}>
                {getDecisionLabel(decision)}
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Author Notified</span>
                  </div>
                  <p className="text-sm text-gray-600">{manuscript.authorName} has been informed</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Status Updated</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isAccepted ? 'Sent to Production' : decision === 'reject' ? 'Manuscript Rejected' : 'Revision Required'}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Decision Locked</span>
                  </div>
                  <p className="text-sm text-gray-600">Editorial record finalized</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-sm border" style={{ borderColor: '#d1c7b3' }}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Workflow Updated</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isAccepted ? 'Production pipeline activated' : 'Process updated'}
                  </p>
                </div>
              </div>

              {isAccepted && (
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-6 text-left max-w-2xl mx-auto">
                  <p className="text-sm text-blue-900">
                    <strong>Estimated Publication Timeline:</strong> {estimatedPublicationTimeline} days
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    Manuscript will proceed through copyediting, layout, and final production stages.
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-600 mb-6">
                <p>Decision timestamp: {new Date().toLocaleString()}</p>
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
              <h1 className="text-2xl font-serif text-white mb-2">Editorial Recommendation</h1>
              <p className="text-gray-300">{manuscript.title}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-4 py-2 rounded-sm text-sm font-medium bg-purple-100 text-purple-800">
                Under Editorial Review
              </span>
              <span className="text-xs text-gray-300">Version {revisionSummary.revisionRounds + 1}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manuscript Information */}
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
                    Manuscript Information
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
                      <span className="text-sm text-gray-600">Author:</span>
                      <p className="font-medium text-gray-900">{manuscript.authorName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Category:</span>
                      <p className="font-medium text-gray-900">{manuscript.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Submitted:</span>
                      <p className="font-medium text-gray-900">
                        {manuscript.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4" style={{ borderColor: '#d1c7b3' }}>
                    <span className="text-sm font-medium text-gray-700 block mb-2">Abstract:</span>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-sm">
                      {manuscript.abstract}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-sm hover:bg-gray-50 transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      View Manuscript
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-sm hover:bg-gray-50 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      Download Files
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Review History */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <button
                onClick={() => toggleSection('review-history')}
                className="w-full px-6 py-4 border-b flex items-center justify-between hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#1a1f2e' }}
                  >
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                    Review History
                  </h2>
                </div>
                {expandedSection === 'review-history' ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {expandedSection === 'review-history' && (
                <div className="p-6 space-y-4">
                  {reviewHistory.map((review, index) => (
                    <div
                      key={index}
                      className="border rounded-sm p-4"
                      style={{ borderColor: '#d1c7b3' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">{review.reviewer}</span>
                          <span className="text-xs text-gray-500">Round {review.round}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 text-xs rounded-sm ${
                              review.decision === 'minor_revision'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {review.decision.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {review.date.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comments}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revision Summary */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <button
                onClick={() => toggleSection('revision-summary')}
                className="w-full px-6 py-4 border-b flex items-center justify-between hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#1a1f2e' }}
                  >
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                    Revision Summary
                  </h2>
                </div>
                {expandedSection === 'revision-summary' ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {expandedSection === 'revision-summary' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-sm">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Comments Addressed</p>
                      <p className="text-xs text-blue-700 mt-1">
                        {revisionSummary.addressedComments} of {revisionSummary.totalComments} reviewer comments
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((revisionSummary.addressedComments / revisionSummary.totalComments) * 100)}%
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Major Changes:</h3>
                    <ul className="space-y-2">
                      {revisionSummary.majorChanges.map((change, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4" style={{ borderColor: '#d1c7b3' }}>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Author Response:</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-sm">
                      {revisionSummary.authorResponse}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Publication Readiness Evaluation */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Publication Readiness
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suitability Assessment <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={publicationReadiness.suitabilityAssessment}
                    onChange={(e) =>
                      setPublicationReadiness({
                        ...publicationReadiness,
                        suitabilityAssessment: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <option value="">Select...</option>
                    <option value="highly_suitable">Highly Suitable</option>
                    <option value="suitable">Suitable</option>
                    <option value="marginally_suitable">Marginally Suitable</option>
                    <option value="not_suitable">Not Suitable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Quality <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={publicationReadiness.researchQuality}
                    onChange={(e) =>
                      setPublicationReadiness({
                        ...publicationReadiness,
                        researchQuality: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <option value="">Select...</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="acceptable">Acceptable</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Journal/Category Fit <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={publicationReadiness.journalFit}
                    onChange={(e) =>
                      setPublicationReadiness({ ...publicationReadiness, journalFit: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <option value="">Select...</option>
                    <option value="excellent_fit">Excellent Fit</option>
                    <option value="good_fit">Good Fit</option>
                    <option value="acceptable_fit">Acceptable Fit</option>
                    <option value="poor_fit">Poor Fit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publication Priority <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={publicationReadiness.publicationPriority}
                    onChange={(e) =>
                      setPublicationReadiness({
                        ...publicationReadiness,
                        publicationPriority: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <option value="">Select...</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impact Assessment Notes
                  </label>
                  <textarea
                    value={publicationReadiness.impactAssessment}
                    onChange={(e) =>
                      setPublicationReadiness({
                        ...publicationReadiness,
                        impactAssessment: e.target.value,
                      })
                    }
                    placeholder="Describe the potential impact and significance of this research..."
                    className="w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    style={{ borderColor: '#d1c7b3' }}
                  />
                </div>
              </div>
            </div>

            {/* Compliance Validation */}
            <div className="bg-white rounded-sm border shadow-sm" style={{ borderColor: '#d1c7b3' }}>
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: '#d1c7b3' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1a1f2e' }}
                >
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                  Final Compliance Validation
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reviewer Concerns Addressed <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={complianceValidation.reviewerConcernsAddressed}
                    onChange={(e) =>
                      setComplianceValidation({
                        ...complianceValidation,
                        reviewerConcernsAddressed: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#d1c7b3' }}
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes - All Concerns Addressed</option>
                    <option value="partial">Partial - Most Concerns Addressed</option>
                    <option value="no">No - Significant Concerns Remain</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={complianceValidation.revisionCompleteness}
                      onChange={(e) =>
                        setComplianceValidation({
                          ...complianceValidation,
                          revisionCompleteness: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      Revision completeness confirmed
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={complianceValidation.ethicalCompliance}
                      onChange={(e) =>
                        setComplianceValidation({
                          ...complianceValidation,
                          ethicalCompliance: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      Ethical compliance verified
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={complianceValidation.citationAccuracy}
                      onChange={(e) =>
                        setComplianceValidation({
                          ...complianceValidation,
                          citationAccuracy: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      Citation and reference accuracy checked
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={complianceValidation.formattingCompliance}
                      onChange={(e) =>
                        setComplianceValidation({
                          ...complianceValidation,
                          formattingCompliance: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      Formatting compliance confirmed
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Editorial Decision */}
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
                  Editorial Recommendation
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
                    <option value="accept">Accept Manuscript</option>
                    <option value="accept_minor_editorial">Accept with Minor Editorial Revisions</option>
                    <option value="minor_revision_final">Minor Revision Required (Final Round)</option>
                    <option value="major_revision">Major Revision Required</option>
                    <option value="reject">Reject Manuscript</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justification <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Provide detailed justification for your editorial decision..."
                    className="w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    style={{ borderColor: '#d1c7b3' }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{justification.length} characters</span>
                    {isDraftSaved && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Draft saved
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strengths
                  </label>
                  <textarea
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="Highlight the strengths of this manuscript..."
                    className="w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    style={{ borderColor: '#d1c7b3' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weaknesses
                  </label>
                  <textarea
                    value={weaknesses}
                    onChange={(e) => setWeaknesses(e.target.value)}
                    placeholder="Note any weaknesses or areas for improvement..."
                    className="w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    style={{ borderColor: '#d1c7b3' }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline (conditional for accepted manuscripts) */}
            {(decision === 'accept' || decision === 'accept_minor_editorial') && (
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
                  <h2 className="font-serif" style={{ color: '#1a1f2e' }}>
                    Publication Timeline
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Timeline (days)
                    </label>
                    <input
                      type="number"
                      value={estimatedPublicationTimeline}
                      onChange={(e) => setEstimatedPublicationTimeline(parseInt(e.target.value))}
                      min="20"
                      max="90"
                      className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: '#d1c7b3' }}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Projected Publication Date:</strong>{' '}
                      {new Date(
                        Date.now() + estimatedPublicationTimeline * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Includes copyediting, layout, typesetting, and final production stages
                    </p>
                  </div>
                </div>
              </div>
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
                disabled={!decision || !justification}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1a1f2e' }}
              >
                <Send className="w-4 h-4" />
                Submit Decision
              </button>

              <button
                onClick={onBack}
                className="w-full px-6 py-3 text-gray-700 border rounded-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#d1c7b3' }}
              >
                Cancel
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-sm border border-blue-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Manuscript Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Review Rounds:</span>
                  <span className="font-semibold text-gray-900">{revisionSummary.revisionRounds}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Comments Addressed:</span>
                  <span className="font-semibold text-gray-900">
                    {revisionSummary.addressedComments}/{revisionSummary.totalComments}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Reviewers:</span>
                  <span className="font-semibold text-gray-900">{reviews.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Time in Review:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.ceil(
                      (new Date().getTime() - manuscript.submittedAt.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </span>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900 mb-1">Decision Guidelines</p>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• Review all feedback and revisions thoroughly</li>
                    <li>• Assess manuscript against journal standards</li>
                    <li>• Complete all required evaluation fields</li>
                    <li>• Provide clear justification for decision</li>
                    <li>• Consider publication priority and impact</li>
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
          <div
            className="bg-white rounded-sm max-w-md w-full shadow-lg"
            style={{ borderColor: '#d1c7b3' }}
          >
            <div className="p-6 border-b" style={{ borderColor: '#d1c7b3' }}>
              <h3 className="text-lg font-serif" style={{ color: '#1a1f2e' }}>
                Confirm Editorial Decision
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                You are about to submit your editorial recommendation. This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-4 rounded-sm space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Decision:</span>
                  <span className={`font-medium px-3 py-1 rounded-sm text-xs ${getDecisionColor(decision)}`}>
                    {getDecisionLabel(decision)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Manuscript:</span>
                  <span className="font-medium">{manuscript.id}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                The author and relevant parties will be notified of your decision.
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
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
